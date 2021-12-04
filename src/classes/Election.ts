import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Parser } from 'xml2js';
import * as jsonQuery from 'json-query';

import { Contest } from '../classes/Contest';
import { HomePage } from '../app/home/home.page';

@Injectable()
export class Election {
  readonly contestQuery = 'ElectionReport.Election.ContestCollection.Contest';
  public xml = '';
  public contests: Contest[] = new Array();
  public ready = false;
  public edfFile: string;
  private jsonObj = '';
  private contestNames: string[] = new Array();
  private candidateNames: string[] = new Array();
  private parent: HomePage;
  private contestIndex = 0;

  constructor(private readonly http: HttpClient, aString: string, parent: HomePage) {
    this.parent = parent;
    if (null != aString) {
      this.edfFile = aString;
      console.log('attempting to open ' + this.edfFile);
      try {
        let xmlData;
        const myParser = new Parser({ attrkey: '@', charkey: '#', mergeAttrs: true });

        this.http
          .get(this.edfFile, {
            headers: new HttpHeaders()
              .set('Content-Type', 'text/xml')
              .append('Access-Control-Allow-Methods', 'GET')
              .append('Access-Control-Allow-Origin', '*')
              .append(
                'Access-Control-Allow-Headers',
                'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'
              ),
            responseType: 'text',
          })
          .subscribe((data) => {
            xmlData = data.toString();
            myParser.parseString(xmlData, (err, jsonData) => {
              this.jsonObj = jsonData;
              this.setContests();
              this.printContestNames();
              this.getContestNames();
              this.setReady(true);
            });
          });
      } catch (e) {
        console.log('Error:', e);
      }
    }
  }

  getContestNamesCount(): number {
    return this.contestNames.length;
  }

  isReady(): boolean {
    return this.ready;
  }

  setReady(value: boolean) {
    this.ready = value;
  }

  // todo: use a better type. alternatively, if this isn't used anywhere, maybe it should be removed?
  getParent(): any {
    return this.parent;
  }

  getContests(): Contest[] {
    return this.contests;
  }

  getAndIncrementContestIndex(): number {
    return this.contestIndex++;
  }

  getJsonObj(): string {
    return this.jsonObj;
  }

  setContests() {
    const values = jsonQuery(this.contestQuery, { data: this.jsonObj }).value;
    values.forEach((element) => {
      const aContest = new Contest(this.parent, element, this, this.getAndIncrementContestIndex());
      this.contests.push(aContest);
    });
  }

  getContestNames(): string[] {
    console.log('entering getContestName()');
    this.contests.forEach((element) => {
      this.contestNames.push(element.getContestName());
      console.log('getContestName - name is \'' + element.getContestName() + '\'');
    });
    console.log('exiting getContestName() - contestNames has ' + this.contestNames.length + ' elements');
    return this.contestNames;
  }

  printContestNames() {
    this.contests.forEach((element) => {
      //element is a Contest...
      //console.log('Contest name: ' + element.getContestName());
      //for each Contest, get the Contestants...
      element.getBallotSelections().forEach((ballotselection) => {
        const candidateName = ballotselection.getCandidatesString().trim();
        if (candidateName !== undefined && candidateName !== 'undefined') {
          this.candidateNames.push(candidateName);
        }
      });
    });
  }

  getContestByIndex(index: number): Contest {
    return this.contests[index];
  }
}

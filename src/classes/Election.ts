import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Parser } from 'xml2js';
import * as jsonQuery from 'json-query';

import { Contest } from '../classes/Contest';
import { HomePage } from '../app/home/home.page';

@Injectable()
export class Election {
  readonly contestQuery = 'ElectionReport.Election.ContestCollection.Contest';
  readonly edfFileVersionQuery = 'ElectionReport.xmlns[0]';
  public xml = '';
  public contests: Contest[] = new Array();
  public ready = false;
  public edfFile: string;
  public edfVersion: string;
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
              console.log('jsonData read is: ' + JSON.stringify(jsonData));
              this.setEDFVersion(jsonQuery(this.edfFileVersionQuery, { data: this.jsonObj }).value);
              console.log('EDF Version is: ' + this.edfVersion);
              this.setContests();
              //                  this.printContestNames();
              this.getContestNames();
              this.setReady(true);
            });
          });
      } catch (e) {
        console.log('Error:', e);
      }
    }
  }

  setEDFVersion(edfFileVersion: string) {
    if (edfFileVersion.includes('V1')) {
      this.edfVersion = 'V1';
    } else {
      this.edfVersion = 'V2';
    }
  }

  isV1(): boolean {
    return this.edfVersion === 'V1';
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
      console.log(`getContestName - name is ${element.getContestName()}`);
    });
    console.log('exiting getContestName() - contestNames has ' + this.contestNames.length + ' elements');
    return this.contestNames;
  }

  createCVR() {
    let output = '';
    output += '{ "election" : "big important election title here", "contests": [';
    this.contests.forEach((element, idx) => {
      output += '{"contest":"' + element.getContestName() + '",';
      output += '"contestId":"' + element.contestId + '",';
      output += '"contestants": [';
      //element is a Contest...
      //console.log('Contest name: ' + element.getContestName());
      //for each Contest, get the Contestants...
      const emptyWriteIns = this.getEmptyWriteIns(element.getBallotSelections());
      element.getBallotSelections().forEach((ballotselection, idx2) => {
        const candidateName = ballotselection.getCandidatesString().trim();

        if (candidateName !== undefined && candidateName !== 'undefined' && !candidateName.startsWith('Touch here')) {
          this.candidateNames.push(candidateName);
          output += '{"name":"' + candidateName + '",';
          output += '"candidateID":"' + ballotselection.getCandidateId() + '",';
          output += '"selected":"' + ballotselection.selected + '"}';
          if (idx2 < element.getBallotSelections().length - 1 - emptyWriteIns) {
            output += ',';
          }
        }
      });
      output += ']}';
      if (idx < this.contests.length - 1) {
        output += ',';
      } else {
        output += ']';
      }
    });
    output += '}';

    // console.log(JSON.stringify(JSON.parse(output), null, 2));
    return JSON.parse(output);
  }

  getContestByIndex(index: number): Contest {
    return this.contests[index];
  }

  castBallot() {
    console.log(JSON.stringify(this.createCVR(), null, 4));
    return this.createCVR();
  }
  getEmptyWriteIns(contestants): number {
    let emptyWriteIns = 0;
    contestants.forEach((contestant) => {
      const candidateName = contestant.getCandidatesString().trim();

      if (candidateName.startsWith('Touch here')) {
        emptyWriteIns++;
      }
    });
    return emptyWriteIns;
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Parser } from 'xml2js';
import { Injectable } from '@angular/core';
import * as jsonQuery from 'json-query';

import { Contest } from '../classes/Contest';
import { HomePage } from '../app/home/home.page';

@Injectable()
export class Election {
  readonly CONTESTQUERY = 'ElectionReport.Election.ContestCollection.Contest';

  public xml = '';
  public contests: Contest[] = [];
  public ready = false;
  public edfFile: string;
  public jsonObj: string = '';

  private contestNames: string[];
  private candidateNames: string[] = [];
  private parent: HomePage;
  private contestIndex = 0;

  // todo: what is "aString"? is there a more descriptive variable name which could be used here?
  constructor(private readonly http: HttpClient, aString: string, parent: HomePage) {
    this.parent = parent;
    if (null != aString) {
      this.edfFile = aString;
      console.log('attempting to open ' + this.edfFile);
      try {
        let xmlData;
        const myParser = new Parser({
          attrkey: '@',
          charkey: '#',
          mergeAttrs: true,
        });

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
            //console.log( 'data read is ' + data.toString());
            //this.xml = data.toString();

            xmlData = data.toString();

            myParser.parseString(xmlData, (err, jsonData) => {
              // todo: should we call this something more descriptive that doesn't suggest it's a JSON object?
              this.jsonObj = jsonData;
              //console.log( 'json parsed data is ' + this.jsonObj);

              this.contests = this.getContests();
              console.log('🚀 ~ file: Election.ts ~ line 62 ~ Election ~ myParser.parseString ~ this.contests', this.contests);
              this.candidateNames = this.getAllCandidateNames();
              this.ready = true;

              console.log(
                '🚀 ~ file: Election.ts ~ line 100 ~ Election ~ contest.ballotSelections.forEach ~ this.candidateNames',
                this.candidateNames
              );
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

  // todo: wouldn't this be of type HomePage? do we need this at all?
  getParent(): object {
    return this.parent;
  }

  getContests(): Contest[] {
    // todo: what kind of data is "values"? is there a better name and type here?
    const values = jsonQuery(this.CONTESTQUERY, {
      data: this.jsonObj,
    }).value;
    // todo: what kind of data is "element"? is there a better name and type here?
    return values.map((element) => new Contest(this.parent, element, this, this.contestIndex++));
  }

  getAllCandidateNames(): string[] {
    let candidateNames: string[] = [];
    this.contests.forEach((contest) => {
      contest.ballotSelections.forEach((ballotSelection) => {
        const candidateName = ballotSelection.getCandidatesString().trim();
        // under what conditions would the candidate name be the _string_ undefined?
        if (candidateName !== undefined && candidateName !== 'undefined') {
          // why are we flattening to a single array of candidate names here?
          candidateNames.push(candidateName);
        }
      });
    });
    return candidateNames;
  }

  getContestByIndex(index: number): Contest {
    return this.contests[index];
  }
}

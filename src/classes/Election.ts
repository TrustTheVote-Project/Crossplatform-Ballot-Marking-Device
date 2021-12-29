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
  // todo: what is jsonObj? can we use a beter name?
  private jsonObj = '';
  private contestNames: string[] = new Array();
  private candidateNames: string[] = new Array();
  private parent: HomePage;
  private contestIndex = 0;

  constructor(private readonly http: HttpClient, aString: string, parent: HomePage) {
    this.parent = parent;
    if (null != aString) {
      // todo: what is aString? can we use a better variable name here?
      this.edfFile = aString;
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
              this.getContestNames();
              this.ready = true;
            });
          });
      } catch (e) {
        // todo: under what circumstances would this fail? why are we ignoring any failures that would happen here?
        console.log('Error:', e);
      }
    }
  }

  getParent(): HomePage {
    return this.parent;
  }

  getAndIncrementContestIndex(): number {
    return this.contestIndex++;
  }

  // todo: the json object is... a string?
  // can either the variable name or the type (or both?) be updated so that this makes some amount of sense?
  getJsonObj(): string {
    return this.jsonObj;
  }

  // todo: this method is problematic because
  // A) is has side effects, and
  // B) if you call it multiple times, you'll end up with twice the contests in your contest array than you expected
  // a better solution would be to use map to generate and return an array of contests based on the values from the
  // json obj (whatever that is - we should use a better variable name there).
  // that array would be set to the scoped variable in the calling function
  setContests() {
    // todo: what is values? can we use a better variable name here?
    const values = jsonQuery(this.contestQuery, { data: this.jsonObj }).value;
    // todo: what is element? can we use a better variable name here?
    values.forEach((element) => {
      // todo: what is aContest? do we even need to create a variable for this?
      const aContest = new Contest(this.parent, element, this, this.getAndIncrementContestIndex());
      this.contests.push(aContest);
    });
  }

  // todo: this function is named "get" (which suggests a read operation), but is actively _modifying_ a scoped variable.
  // this is misleading and confusing, and either the name or implementation should be changed accordingly
  getContestNames(): string[] {
    // todo: can this be named contest so that we know what it is?
    this.contests.forEach((element) => {
      // todo: contestNames is just an array of each contest's name property. we don't really need a separate scoped variable for that,
      // because we can just use map to access that array anytime we need it
      this.contestNames.push(element.contestName);
    });
    // todo: why are we returning this scoped variable? it's not actually being assigned in the calling method,
    // and there's really no reason to do so anyway because it already exists on the scope
    return this.contestNames;
  }

  // todo: constructing a JSON string like this is brittle, and difficult to extend if you need to make changes or additions to it.
  // further, it's not really possible to see what the shape of the JSON looks like, which prevents us from knowing whether it
  // conforms to any specification unless you run the code and manually confirm.
  // a better implementation would:
  // 1. include an interface for what this JSON object should look like,
  // 2. create a JSON object which conforms to that interface and has all the values necessary
  // 3. use JSON.stringify(cvr) to convert the object to JSON
  createCVR() {
    let output = '';
    output += '{ "election" : "big important election title here", "contests": [';
    this.contests.forEach((element, idx) => {
      output += '{"contest":"' + element.contestName + '",';
      output += '"contestId":"' + element.contestId + '",';
      output += '"contestants": [';
      const emptyWriteIns = this.getEmptyWriteIns(element.ballotSelections);
      element.ballotSelections.forEach((ballotselection, idx2) => {
        const candidateName = ballotselection.getCandidatesString().trim();

        if (candidateName !== undefined && candidateName !== 'undefined' && !candidateName.startsWith('Touch here')) {
          this.candidateNames.push(candidateName);
          output += '{"name":"' + candidateName + '",';
          output += '"candidateID":"' + ballotselection.getCandidateId() + '",';
          output += '"selected":"' + ballotselection.selected + '"}';
          if (idx2 < element.ballotSelections.length - 1 - emptyWriteIns) {
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
    console.log(output);
  }

  getContestByIndex(index: number): Contest {
    return this.contests[index];
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

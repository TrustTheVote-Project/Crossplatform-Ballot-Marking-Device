import { Candidate } from './Candidate';
import { Contest } from './Contest';
declare var require: any;

export class BallotSelection {
  readonly CANDIDATEQUERY = '.CandidateIds[*]';
  readonly SEQUENCEORDERQUERY = '.SequenceOrder';
  public jsonObj: String = '';
  public sequenceOrder: number;
  public candidates: Candidate[] = new Array();
  private parent: Contest;
  private jsonQuery = require('json-query');
  private WRITEIN = 'writein';

  constructor(aString: string, parent: Contest) {
    this.parent = parent;
    this.jsonObj = aString;
    this.sequenceOrder = this.jsonQuery(this.SEQUENCEORDERQUERY, { data: this.jsonObj }).value;
    this.setCandidates(aString);
  }

  //return the candidate(s) that are running in a contest - i.e. Hillary Clinton and Tim Kaine
  getCandidatesString(): string {
    //let candidateString: string = new String();
    let partyString: string;
    let myCandArray: string[] = new Array();
    this.candidates.forEach((element) => {
      //maybe array join("and") instead?
      myCandArray.push(element.getCandidateName());
      //candidateString += element.getCandidateName() + " ";
      partyString = element.getPartyAbbreviation();
    });
    return myCandArray.join(' and ') + ' ' + partyString;
  }

  getCandidates(): Candidate[] {
    return this.candidates;
  }

  setCandidates(aString: string) {
    if (aString != this.WRITEIN) {
      var values = this.jsonQuery(this.CANDIDATEQUERY, { data: this.jsonObj }).value;
      values.forEach((element) => {
        var myCandidateValue: string[] = element.split(' ');
        myCandidateValue.forEach((candidateElement) => {
          var candidate = new Candidate(candidateElement, this);
          this.candidates.push(candidate);
        });
      });
    } else {
      this.addWriteInCandidate();
    }
  }

  addWriteInCandidate() {
    var candidate = new Candidate(this.WRITEIN, this);
    this.candidates.push(candidate);
  }

  getParent(): Contest {
    return this.parent;
  }
}

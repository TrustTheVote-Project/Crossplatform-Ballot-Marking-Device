import * as jsonQuery from 'json-query';

import { Candidate } from './Candidate';
import { Contest } from './Contest';

export class BallotSelection {
  readonly candidateQuery = '.CandidateIds[*]';
  readonly ballotMeasureQuery = '.BallotSelection[*].Selection[*]';
  readonly sequenceOrderQuery = '.SequenceOrder';
  public jsonObj = '';
  public sequenceOrder: number;
  public selected: boolean;
  public candidates: Candidate[] = new Array();
  private parent: Contest;
  // todo: given that this same private variable is defined in multiple places, it should be hoisted to a
  // shared scope and used everywhere it's needed. maybe an enum would be better here?
  private writeIn = 'writein';

  constructor(aString: string, parent: Contest) {
    this.parent = parent;
    this.jsonObj = aString;
    this.sequenceOrder = jsonQuery(this.sequenceOrderQuery, { data: this.jsonObj }).value;
    this.setCandidates(aString);
    this.selected = false;
  }

  /**
   * @returns candidate(s) that are running in a contest - i.e. Hillary Clinton and Tim Kaine
   */
  getCandidatesString(): string {
    let partyString: string;
    const myCandArray: string[] = new Array();
    this.candidates.forEach((element) => {
      //maybe array join("and") instead?
      myCandArray.push(element.getCandidateName());
      console.log('candidate ' + element.getCandidateName() + ' has id ' + element.candidateId + ' and personId ' + element.personId);
      partyString = element.getPartyAbbreviation();
      if (partyString === undefined) {
        partyString = 'Unknown Party';
      }
    });
    return myCandArray.join(' and ') + ' ' + partyString;
  }

  getCandidateId(): string {
    let candidateId: string;
    this.candidates.forEach((element) => {
      console.log('candidate ' + element.getCandidateName() + ' has id ' + element.candidateId + ' and personId ' + element.personId);
      candidateId = element.candidateId;
    });
    if (candidateId === '') {
      candidateId = 'writeIn';
    }
    return candidateId;
  }

  getCandidates(): Candidate[] {
    return this.candidates;
  }

  setCandidates(aString: string) {
    if (aString !== this.writeIn) {
      if (!this.getParent().isCandidateContest()) {
        console.log('BallotSelection is a BallotMeasure, jsonObj is ' + JSON.stringify(this.jsonObj));
        console.log('BallotSelection is a BallotMeasure, aString is ' + JSON.stringify(aString));
        const values = jsonQuery(this.ballotMeasureQuery, { data: aString }).value;

        console.log('values are:' + JSON.stringify(values));

        values.forEach((element) => {
          element.forEach((ballotMeasureElement) => {
            const ballotMeasure = new Candidate(ballotMeasureElement, this);
            this.candidates.push(ballotMeasure);
          });
        });
      } else {
        const values = jsonQuery(this.candidateQuery, { data: this.jsonObj }).value;
        console.log('BallotSelection - candidate contest, values are: ' + values);
        values.forEach((element) => {
          console.log('BallotSelection - candidate contest, values to split are: ' + element);
          const myCandidateValue: string[] = element.split(' ');
          myCandidateValue.forEach((candidateElement) => {
            const candidate = new Candidate(candidateElement, this);
            this.candidates.push(candidate);
          });
        });
      }
    } else {
      this.addWriteInCandidate();
    }
    console.log('candidate list in ballotselection is: ' + this.candidates);
  }

  addWriteInCandidate() {
    const candidate = new Candidate(this.writeIn, this);
    this.candidates.push(candidate);
  }

  getParent(): Contest {
    return this.parent;
  }
}

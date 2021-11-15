import * as jsonQuery from 'json-query';

import { Candidate } from './Candidate';
import { Contest } from './Contest';

export class BallotSelection {
  readonly CANDIDATEQUERY = '.CandidateIds[*]';
  readonly SEQUENCEORDERQUERY = '.SequenceOrder';

  public sequenceOrder: number;
  public candidates: Candidate[];

  // todo: what is "aString"? is there a more descriptive variable name which could be used here?
  constructor(private readonly aString: string, private readonly parent: Contest) {
    // todo: sequenceOrder (and any of the variables used to define it) doesn't appear to be used - can it be removed?
    this.sequenceOrder = jsonQuery(this.SEQUENCEORDERQUERY, {
      data: this.aString,
    }).value;
    this.candidates = this.getCandidates();
  }

  getCandidatesString(): string {
    // on app initialization, I see candidates is an array with a single element which is undefined
    // as such, we need to check to see if one or more candidates are undefined, as the below impl will throw an error
    // todo: investigate why this is happening, resolve it, and remove this checking logic
    if (this.candidates.some((candidate) => candidate === undefined)) {
      console.log(`Warning: one or more candidates in the following array was undefined:`, this.candidates);
      return '';
    }

    // the original implementation looped over the candidates and set the party to the party of the last candidate in the array
    // I've replicated that same logic here; however, I'm not sure if this is desired
    // todo: revisit this
    const lastCandidate = this.candidates[this.candidates.length - 1];
    const party = lastCandidate ? lastCandidate.partyAbbreviation : '';

    const personNames = this.candidates.map((candidate) => candidate.personName);
    return `${personNames.join(' and ')} ${party}`;
  }

  getCandidates(): Candidate[] {
    // todo: what kind of data is "values"? is there a better name and type here?
    const values = jsonQuery(this.CANDIDATEQUERY, {
      data: this.aString,
    }).value;
    // todo: what kind of data is "element"? is there a better name and type here?
    return values.map((element) => {
      // todo: what kind of data is "candidateValue"? is there a better name here?
      const candidateValue: string[] = element.split(' ');
      return candidateValue.map((candidateElement) => new Candidate(candidateElement, this));
    });
  }

  getParent(): Contest {
    return this.parent;
  }
}

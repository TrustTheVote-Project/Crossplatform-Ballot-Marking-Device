import * as jsonQuery from 'json-query';

import { BallotSelection } from './BallotSelection';

export class Candidate {
  // todo: rather than having each class manage the complexity of its own queries,
  // a better implementation would be to encapsulate all the query logic in a shared service,
  // which could be imported and used by each class as needed.
  // further, that shared service could also define strong types so that the calling methods know exactly what data they're getting
  readonly personQuery = 'ElectionReport.PersonCollection[*].Person[*]';
  readonly fullNameQuery = 'ElectionReport.PersonCollection.Person[objectId=?].FullName[0].Text[0].#';
  readonly genderQuery = 'ElectionReport.PersonCollection.Person[objectId=?].Gender[0]';
  readonly isIncumbentQuery = 'ElectionReport.Election.CandidateCollection.Candidate[objectId=?].IsIncumbent[0]';
  readonly partyIdQuery = 'ElectionReport.Election.CandidateCollection.Candidate[objectId=?].PartyId[0]';
  readonly partyAbbreviationQuery = 'ElectionReport.PartyCollection.Party[objectId=?].Abbreviation[0]';
  readonly partyNameQuery = 'ElectionReport.PartyCollection.Party[objectId=?].Name[0].Text[0].#';
  // todo: what is jsonObj? can we use a beter name?
  public jsonObj = '';
  public candidateId: string;
  public personName: string;
  public isIncumbent: boolean;
  public partyName: string;
  public partyAbbreviation: string;
  public personId: string;
  public gender: string;
  public writeInConst = `Touch here to write in a candidate's name`;
  private parent: BallotSelection;
  private writeInCandidate: boolean;
  // todo: given that this same private variable is defined in multiple places, it should be hoisted to a
  // shared scope and used everywhere it's needed. maybe an enum would be better here?
  private writeIn = 'writein';

  constructor(aString: string, parent: BallotSelection) {
    // todo: what is aString? can we use a beter name?
    if (aString !== this.writeIn) {
      this.writeInCandidate = false;
      this.parent = parent;
      //jsonObj is the string of candidiateIds, <CandidateIds>can11288a can11288b</CandidateIds>
      this.jsonObj = aString;
      this.candidateId = aString;
      // todo: reaching into the parent's parent's parent's scope to get a "json obj" (whatever that is)
      // is a huge code smell. classes should be scoped so that the things they need are passed into them,
      // rather than needing to look up the calling chain to get some scope. that leaves a huge potential for
      // scope bleed and side effects, not to mention the high cognitive load
      this.getCandidateInfo(this.getParent().getParent().getParent().getJsonObj());
    } else {
      this.writeInCandidate = true;
      this.personName = this.writeInConst;
    }
  }

  // todo: this doesn't appear to be used anywhere, can it be removed?
  getAllNames(): string[] {
    return jsonQuery(this.personQuery, { data: this.jsonObj }).value;
  }

  getParent(): BallotSelection {
    return this.parent;
  }

  getCandidateInfo(aString: string) {
    // todo: what is aString? can we use a beter name?
    if (aString !== this.writeIn) {
      //find candidate info using the candidateId - grab the party name, candidate name, etc.
      this.getPersonId(this.candidateId);
      this.personName = jsonQuery([this.fullNameQuery, this.personId], { data: aString }).value;
      this.gender = jsonQuery([this.genderQuery, this.personId], { data: aString }).value;
      this.isIncumbent = jsonQuery([this.isIncumbentQuery, this.candidateId], { data: aString }).value;
      const partyId = jsonQuery([this.partyIdQuery, this.candidateId], { data: aString }).value;
      this.partyAbbreviation = jsonQuery([this.partyAbbreviationQuery, partyId], { data: aString }).value;
      this.partyName = jsonQuery([this.partyNameQuery, partyId], { data: aString }).value;
    } else {
      this.personName = this.writeIn;
    }
  }

  getPersonId(candidateId: string) {
    this.personId = `per${candidateId.substr(3)}`;
  }

  // todo: what's the difference between "candidate name" and "person name"? can we align on one and be consistent?
  // also, this is a public variable, so it doesn't need a getter and setter
  setCandidateName(name) {
    this.personName = name;
    console.log('just set personName to ' + name);
  }

  // todo: this is a public variable, so it doesn't need a getter and setter
  getCandidateName(): string {
    return this.personName;
  }

  // todo: this is a public variable, so it doesn't need a getter and setter
  getPartyAbbreviation(): string {
    return this.partyAbbreviation;
  }

  isWriteIn(): boolean {
    return this.writeInCandidate;
  }
}

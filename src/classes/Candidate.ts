import * as jsonQuery from 'json-query';

import { BallotSelection } from './BallotSelection';

export class Candidate {
  readonly PERSONQUERY = 'ElectionReport.PersonCollection[*].Person[*]';
  readonly FULLNAMEQUERY = 'ElectionReport.PersonCollection.Person[objectId=?].FullName[0].Text[0].#';
  readonly GENDERQUERY = 'ElectionReport.PersonCollection.Person[objectId=?].Gender[0]';
  readonly ISINCUMBENTQUERY = 'ElectionReport.Election.CandidateCollection.Candidate[objectId=?].IsIncumbent[0]';
  readonly PARTYIDQUERY = 'ElectionReport.Election.CandidateCollection.Candidate[objectId=?].PartyId[0]';
  readonly PARTYABBREVIATIONQUERY = 'ElectionReport.PartyCollection.Party[objectId=?].Abbreviation[0]';
  readonly PARTYNAMEQUERY = 'ElectionReport.PartyCollection.Party[objectId=?].Name[0].Text[0].#';

  public jsonObj: string = '';
  public candidateId: string;
  public personName: string;
  public isIncumbent: boolean;
  public partyName: string;
  public partyAbbreviation: string;
  public personId: string;
  public gender: string;

  // todo: what is "aString"? is there a more descriptive variable name which could be used here?
  constructor(aString: string, private readonly parent: BallotSelection) {
    //jsonObj is the string of candidiateIds, <CandidateIds>can11288a can11288b</CandidateIds>
    // todo: should we call this something more descriptive that doesn't suggest it's a JSON object?
    this.jsonObj = aString;
    this.candidateId = aString;
    this.personId = this.getPersonId(aString);
    this.getCandidateInfo(this.parent.getParent().getParent().jsonObj);
  }

  // todo: what is "aString"? is there a more descriptive variable name which could be used here?
  // I'm very confused here. This variable is named the same as the "aString" which is used as the constructor,
  // but it's actually completely different. This param is the election's jsonObj (which is supposed to be a string);
  // however, when I console.log it out, it's an object of type ElectionReport. What happened here?
  getCandidateInfo(aString: string) {
    this.personName = jsonQuery([this.FULLNAMEQUERY, this.personId], {
      data: aString,
    }).value;
    this.gender = jsonQuery([this.GENDERQUERY, this.personId], {
      data: aString,
    }).value;
    this.isIncumbent = jsonQuery([this.ISINCUMBENTQUERY, this.candidateId], {
      data: aString,
    }).value;
    const partyId = jsonQuery([this.PARTYIDQUERY, this.candidateId], {
      data: aString,
    }).value;
    this.partyAbbreviation = jsonQuery([this.PARTYABBREVIATIONQUERY, partyId], {
      data: aString,
    }).value;
    this.partyName = jsonQuery([this.PARTYNAMEQUERY, partyId], {
      data: aString,
    }).value;
  }

  getPersonId(candidateId: string): string {
    return `per ${candidateId.substr(3)}`;
  }
}

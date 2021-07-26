import { BallotSelection } from './BallotSelection';
//import { ModalController } from '@ionic/angular';
//import { HomePage } from '../app/home/home.page';


declare var require: any;

export class Candidate {

    readonly PERSONQUERY = 'ElectionReport.PersonCollection[*].Person[*]';
    readonly FULLNAMEQUERY = "ElectionReport.PersonCollection.Person[objectId=?].FullName[0].Text[0].#";
    readonly GENDERQUERY = "ElectionReport.PersonCollection.Person[objectId=?].Gender[0]";
    readonly ISINCUMBENTQUERY = "ElectionReport.Election.CandidateCollection.Candidate[objectId=?].IsIncumbent[0]";
    readonly PARTYIDQUERY = "ElectionReport.Election.CandidateCollection.Candidate[objectId=?].PartyId[0]";
    readonly PARTYABBREVIATIONQUERY = "ElectionReport.PartyCollection.Party[objectId=?].Abbreviation[0]";
    readonly PARTYNAMEQUERY = "ElectionReport.PartyCollection.Party[objectId=?].Name[0].Text[0].#";

    public jsonObj: String = "";
    public candidateId: string;
    public personName: string;
    public isIncumbent: boolean;
    public partyName: string;
    public partyAbbreviation: string;
    public personId: string;
    public gender: string;
    private jsonQuery = require('json-query');
    private parent: BallotSelection;

    constructor( aString: string, parent: BallotSelection) {
        this.parent = parent;
        //jsonObj is the string of candidiateIds, <CandidateIds>can11288a can11288b</CandidateIds>
        this.jsonObj = aString;
        this.candidateId = aString;
        this.getCandidateInfo(this.getParent().getParent().getParent().getJsonObj());
    }

    getBallotSelection(index: number) {

    }

    getAllNames(): string[] {
        var values = this.jsonQuery(this.PERSONQUERY, { data: this.jsonObj }).value;
        return values;
    }

    getParent(): BallotSelection {
        return this.parent;
    }

    getCandidateInfo(aString: string) {

        //find candidate info using the candidateId - grab the party name, candidate name, etc.

        //jsonQuery(['people[country=?]', 'NZ'])
        this.getPersonId(this.candidateId);
        //var candidate = "ElectionReport.PersonCollection.Person[objectId=" + this.personId + "]";
        this.personName = this.jsonQuery([this.FULLNAMEQUERY, this.personId], { data: aString }).value;
        this.gender = this.jsonQuery([this.GENDERQUERY, this.personId], { data: aString }).value;
        this.isIncumbent = this.jsonQuery([this.ISINCUMBENTQUERY, this.candidateId], { data: aString }).value;
        var partyId = this.jsonQuery([this.PARTYIDQUERY, this.candidateId], { data: aString }).value;
        this.partyAbbreviation = this.jsonQuery([this.PARTYABBREVIATIONQUERY, partyId], { data: aString }).value;
        this.partyName = this.jsonQuery([this.PARTYNAMEQUERY, partyId], { data: aString }).value;
    }
    getPersonId(candidateId: string) {
        this.personId = "per" + candidateId.substr(3);
    }

    getCandidateName(): string {
        return this.personName;
    }

    getPartyAbbreviation(): string {
        return this.partyAbbreviation;
    }
}

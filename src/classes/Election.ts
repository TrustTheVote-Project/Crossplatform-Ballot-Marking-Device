import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { parseString } from 'xml2js';
import { Parser } from 'xml2js';
import { BallotSelection } from './BallotSelection';
import { Contest } from '../classes/Contest';
import { NavController, Platform } from 'ionic-angular';
import { BallotPage } from '../pages/home/BallotPage';



export class Election {
    readonly CONTESTQUERY = 'ElectionReport.Election.ContestCollection.Contest';
    public xml: string = "";
    private jsonObj: string = "";
    public Contests: Contest[] = new Array(10);
    public myhttp: Http;
    private jsonQuery = require('json-query');
    private contestNames: string[] = new Array();
    public ready: boolean = false;

    public edfFile: string;

    //take a filename, parse it to json, then build subordinate objects (Contests, ballotSelections, etc.)
    constructor(_http: Http, aString: string, navCtrl: NavController) {
        this.myhttp = _http;
        if (null != aString) {
            this.edfFile = aString;
            try {
                let jsonData;
                let xmlData;
                let myParser = new Parser({ "attrkey": "@", "charkey": "#", "mergeAttrs": true });
                this.myhttp.get(this.edfFile).map(res => res.text()).subscribe(data => {
                    this.xml = data.toString();

                    //console.log("XML is: " + this.xml);
                    xmlData = data.toString();
                    //                    console.log("in GET, json is: " + data);

                    //parseString(xmlData, (err, jsonData) => {
                    myParser.parseString(xmlData, (err, jsonData) => {

                        this.jsonObj = jsonData;
                        this.setContests();
                        this.printContestNames();
                        this.getContestNames();
                        this.ready = true;
                        //                        this.printContestants();
                    });
                });


            } catch (e) {
                console.log("Error:", e);
            }
        }



    }

    isReady(): boolean {
        return (this.ready);
    }

    setReady(value:boolean) {
        this.ready = value;
    }

    setContests() {
        //var jp = require("jsonpath");
        //var res = jp.query(this.jsonObj, '$..[objectId==per11282a]');
        //const jq = require('node-jq');
        //var values = jq.run('.[]|.PersonCollection[]|.[]|select(."-objectId"=="per11282a")', this.jsonObj);

        ///////////////////////
        console.log(JSON.stringify(this.jsonObj));
        //var values = this.jsonQuery("ElectionReport.PersonCollection.Person[objectId=per11282a]", { data: this.jsonObj }).value;
        //        var values = this.jsonQuery('ElectionReport.PersonCollection[*].Person[*][objectId=per11282a]', { data: this.jsonObj }).value;
        var aBallotSelection: BallotSelection;
        var values = this.jsonQuery(this.CONTESTQUERY, { data: this.jsonObj }).value;
        values.forEach(element => {
            var aContest = new Contest(element, this);
            this.Contests.push(aContest);
        });
        //        return this.Contests;
    }
    /*
        getballotSelections(): ballotSelection[] {
            console.log("entering getballotSelections");
        }
        */

    getBallotSelection(contest: Contest) {

    }

    getContests(): Contest[] {
        return this.Contests;
    }

    getContestNames(): String[] {
        console.log("entering getContestName()");
        this.Contests.forEach(element => {
            this.contestNames.push(element.getContestName());
        });
        console.log("exiting getContestName() - contestNames has " + this.contestNames.length + " elements");
        return this.contestNames;
    }

    printContestNames() {
        this.Contests.forEach(element => {
            //element is a Contest...
            console.log("Contest name: " + element.getContestName());
            //for each Contest, get the Contestants...
            element.getBallotSelections().forEach(ballotselection => {
                var candidateName;
                candidateName = ballotselection.getCandidatesString().trim();
                if (candidateName !== undefined && candidateName != "undefined") {
                    console.log(candidateName);
                }

            });
        });
    }

    getJsonObj(): string {
        return this.jsonObj;
    }
}
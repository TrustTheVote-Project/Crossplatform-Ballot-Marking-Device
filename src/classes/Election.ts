import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { parseString } from 'xml2js';
import { Parser } from 'xml2js';
import { BallotSelection } from './BallotSelection';
import { Contest } from '../classes/Contest';
import { NavController, Platform } from 'ionic-angular';
import { BallotPage } from '../pages/home/BallotPage';
import { promisify } from 'util';



export class Election {
    readonly CONTESTQUERY = 'ElectionReport.Election.ContestCollection.Contest';
    public xml: string = "";
    private jsonObj: string = "";
    public contests: Contest[] = new Array();
    public myhttp: Http;
    private jsonQuery = require('json-query');
    private contestNames: string[] = new Array();
    private candidateNames: string[] = new Array();
    public ready: boolean = false;

    public edfFile: string;

    constructor(_http: Http, aString: string) {
        this.myhttp = _http;
        if (null != aString) {
            this.edfFile = aString;
            try {
                let jsonData;
                let xmlData;
                let myParser = new Parser({ "attrkey": "@", "charkey": "#", "mergeAttrs": true });
                this.myhttp.get(this.edfFile).map(res => res.text()).subscribe(data => {
                    this.xml = data.toString();

                    xmlData = data.toString();

                    myParser.parseString(xmlData, (err, jsonData) => {
                        this.jsonObj = jsonData;

                        this.setContests();
                        this.printContestNames();
                        this.getContestNames();
                        this.setReady(true);

                    });
                });
            } catch (e) {
                console.log("Error:", e);
            }
        }
    }

    async foo() {
        await delay(3000);
        this.setContests();
        await delay(3000);
        this.printContestNames();
        await delay(3000);
        this.getContestNames();
        await delay(3000);
        this.setReady(true);
    }

    isReady(): boolean {
        return (this.ready);
    }

    setReady(value: boolean) {
        this.ready = value;
    }


    /*
        getballotSelections(): ballotSelection[] {
            console.log("entering getballotSelections");
        }
        */

    getBallotSelection(contest: Contest) {

    }

    getContests(): Contest[] {
        return this.contests;
    }



    getJsonObj(): string {
        return this.jsonObj;
    }

    setContests() {
        console.log(JSON.stringify(this.jsonObj));
        var aBallotSelection: BallotSelection
        var values = this.jsonQuery(this.CONTESTQUERY, { data: this.jsonObj }).value;
        values.forEach(element => {
            var aContest = new Contest(element, this);
            this.contests.push(aContest);
        });
    }

    getContestNames(): String[] {
        console.log("entering getContestName()");
        this.contests.forEach(element => {
            this.contestNames.push(element.getContestName());
        });
        console.log("exiting getContestName() - contestNames has " + this.contestNames.length + " elements");
        return this.contestNames;
    }


    printContestNames() {
        this.contests.forEach(element => {
            //element is a Contest...
            console.log("Contest name: " + element.getContestName());
            //for each Contest, get the Contestants...
            element.getBallotSelections().forEach(ballotselection => {
                var candidateName;
                candidateName = ballotselection.getCandidatesString().trim();
                if (candidateName !== undefined && candidateName != "undefined") {
                    console.log(candidateName);
                    this.candidateNames.push(candidateName);
                }

            });
        });
    }

}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
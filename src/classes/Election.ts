import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Parser } from 'xml2js';
import { Contest } from '../classes/Contest';
import { HomePage } from '../app/home/home.page';


declare const require: any;

export class Election {
    readonly CONTESTQUERY = 'ElectionReport.Election.ContestCollection.Contest';
    public xml = '';
    public contests: Contest[] = new Array();
    public myhttp: HttpClient;
    public ready = false;
    public edfFile: string;

    private jsonObj = '';
    private jsonQuery = require('json-query');
    private contestNames: string[] = new Array();
    private candidateNames: string[] = new Array();
    private parent: HomePage;
    private contestIndex = 0;


    constructor(_http: HttpClient, aString: string, parent: HomePage) {
        this.parent = parent;
        this.myhttp = _http;
        if (null != aString) {
            this.edfFile = aString;
            console.log('attempting to open ' + this.edfFile);
            try {
                //let jsonData;
                let xmlData;
                const myParser = new Parser({ attrkey: '@', charkey: '#', mergeAttrs: true });

          this.myhttp.get(this.edfFile,
          {
            headers: new HttpHeaders()
              .set('Content-Type', 'text/xml')
              .append('Access-Control-Allow-Methods', 'GET')
              .append('Access-Control-Allow-Origin', '*')
              .append('Access-Control-Allow-Headers',
                      'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
            responseType: 'text'
          })
          .subscribe((data) => {
                   console.log( 'data read is ' + data.toString());
                    //this.xml = data.toString();

                    xmlData = data.toString();

                    myParser.parseString(xmlData, (err, jsonData) => {
                        this.jsonObj = jsonData;
                   console.log( 'json parsed data is ' + this.jsonObj);

                        this.setContests();
                        this.printContestNames();
                        this.getContestNames();
                        this.setReady(true);
            });
          });

            } catch (e) {
                console.log('Error:', e);
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
    getParent(): object {
        return this.parent;

    };

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

    getAndIncrementContestIndex(): number {
        return (this.contestIndex++);

    }

    getJsonObj(): string {
        return this.jsonObj;
    }

    setContests() {
        console.log(JSON.stringify(this.jsonObj));
        //var aBallotSelection: BallotSelection
        let values = this.jsonQuery(this.CONTESTQUERY, { data: this.jsonObj }).value;
        values.forEach(element => {
            let aContest = new Contest( element, this, this.getAndIncrementContestIndex());
            //let aContest = new Contest(this.parent.getModalController(), element, this, this.getAndIncrementContestIndex());
            this.contests.push(aContest);
        });
    }

    getContestNames(): string[] {
        console.log('entering getContestName()');
        this.contests.forEach(element => {
            this.contestNames.push(element.getContestName());
        });
        console.log('exiting getContestName() - contestNames has ' + this.contestNames.length + ' elements');
        return this.contestNames;
    }


    printContestNames() {
        this.contests.forEach(element => {
            //element is a Contest...
            console.log('Contest name: ' + element.getContestName());
            //for each Contest, get the Contestants...
            element.getBallotSelections().forEach(ballotselection => {
                let candidateName;
                candidateName = ballotselection.getCandidatesString().trim();
                if (candidateName !== undefined && candidateName !== 'undefined') {
                    console.log(candidateName);
                    this.candidateNames.push(candidateName);
                }

            });
        });
    }

    printOneContest(element: Contest) {
        //    this.contests.forEach(element => {
        //element is a Contest...
        console.log('Contest name: ' + element.getContestName());
        //for each Contest, get the Contestants...
        element.getBallotSelections().forEach(ballotselection => {
            let candidateName;
            candidateName = ballotselection.getCandidatesString().trim();
            if (candidateName !== undefined && candidateName !== 'undefined') {
                console.log(candidateName);
                this.candidateNames.push(candidateName);
            }

        });
        //   });
    }

    getContestByIndex(index: number): Contest {
        return (this.contests[index]);
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

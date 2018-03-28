import 'rxjs/add/operator/map';
import { BallotSelection } from './BallotSelection';
import { Election } from './Election';

export class Contest {
    readonly BALLOTSELECTIONQUERY = '.BallotSelection[*]';
    readonly NAMEQUERY = '.Name[*]';
    public contestType: String;
    public constestId: String;
    public contestName: string;
    private jsonObj: Object;
    private parent: Election;
    private ballotSelections: BallotSelection[] = new Array();
    private jsonQuery = require('json-query');


    constructor(aString: string, parent: Election) {
        this.parent = parent;
        if (null != aString) {
            try {
                var values = this.jsonQuery(this.NAMEQUERY, { data: aString }).value;
                values.forEach(element => {
                    //e.g. "President and Vice President"
                    this.contestName = element;
                });
                this.setBallotSelections(aString);
            } catch (e) {
                console.log("Error:", e);
            }
        }
    }

    getContestName(): string {
        return this.contestName;
    }

    setBallotSelections(aString: string) {
        try {
            var values = this.jsonQuery(this.BALLOTSELECTIONQUERY, { data: aString }).value;
            values.forEach(element => {
                var aBallotSelection = new BallotSelection(element, this);
                this.ballotSelections.push(aBallotSelection);
            });
        } catch (e) {
            console.log("Error:", e);
        }



    }

    getBallotSelections(): BallotSelection[] {

        return this.ballotSelections;
    }

    getParent(): Election {
        return this.parent;

    };

}
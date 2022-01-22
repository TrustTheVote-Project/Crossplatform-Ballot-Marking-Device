import 'rxjs/add/operator/map';
import { BallotSelection } from './BallotSelection';
import { Election } from './Election';
import { Checkbox } from 'ionic-angular/components/checkbox/checkbox';
import { ModalController } from 'ionic-angular';


export class Contest {
    readonly BALLOTSELECTIONQUERY = '.BallotSelection[*]';
    readonly NAMEQUERY = '.Name[*]';
    readonly VOTESALLOWEDQUERY = '.VotesAllowed[0]';
    public contestType: String;
    public constestId: String;
    public contestName: string;
    private parent: Election;
    public ballotSelections: BallotSelection[] = new Array();
    private jsonQuery = require('json-query');
    private votesAllowed: number = 0;
    private currentlySelected: number = 0;
    public statusMessage: string = "";
    private contestIndex: number = 0;


    constructor(public modalCtrl: ModalController, aString: string, parent: Election, contestIndex: number) {
        this.parent = parent;
        this.contestIndex = contestIndex;
        if (null != aString) {
            try {
                var values = this.jsonQuery(this.NAMEQUERY, { data: aString }).value;
                values.forEach(element => {
                    //e.g. "President and Vice President"
                    this.contestName = element;
                });
                this.setBallotSelections(aString);
                this.setVotesAllowed(aString);
                this.statusMessage = "You can choose " + (this.votesAllowed - this.currentlySelected)
                    + " more."
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

    setVotesAllowed(aString: string) {
        try {
            this.votesAllowed = this.jsonQuery(this.VOTESALLOWEDQUERY, { data: aString }).value;
        } catch (e) {
            console.log("Error:", e);
        }
    }

    getVotesAllowed(): number {
        return (this.votesAllowed);
    }

    getCurrentlySelected(): number {
        return (this.currentlySelected);
    }

    getVotesLeft(): number {
        return (this.votesAllowed - this.currentlySelected);
    }

    getBallotSelections(): BallotSelection[] {

        return this.ballotSelections;
    }

    getParent(): Election {
        return this.parent;

    };

    ionChangeIgnoreCheckbox(cbox: Checkbox) {
        //always want true in the vote review page - don't allow deselection there!
        cbox.checked = true;
    }

    ionChangeUpdateCheckbox(cbox: Checkbox) {
        if (cbox.checked) {
            this.currentlySelected++;
        } else {
            this.currentlySelected--;
        }
        if (this.currentlySelected == this.votesAllowed) {
            this.statusMessage = "";
        } else if (this.votesAllowed > this.currentlySelected) {
            this.statusMessage = "You can choose " + (this.votesAllowed - this.currentlySelected)
                + " more."
        } else {
            this.statusMessage = "You have selected too many candidates - please deselect "
                + "the candidate you do not want, then select the candidate you do want."
            let popupContent = { title: 'Too many selections', content: this.statusMessage };
            //deselect what the user just did
            cbox.checked = false;
            //pop up modal dialog telling user to deselect something - they're already at max
            var modal = this.modalCtrl.create('ModalPopupPage', popupContent);

            modal.present();
        }
    }

    canSelectMoreCandidates(): boolean {
        if (this.votesAllowed == this.currentlySelected) {
            return (false);
        } else {
            return (true);
        }
    }
    oneVoteClicked(event: Event) {
        console.log("got here!");

    }
}
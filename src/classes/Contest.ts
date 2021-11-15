import { Checkbox } from '@ionic/core/dist/types/components/checkbox/checkbox';
import * as jsonQuery from 'json-query';

import { BallotSelection } from './BallotSelection';
import { Election } from './Election';
import { HomePage } from '../app/home/home.page';

export class Contest {
  readonly BALLOTSELECTIONQUERY = '.BallotSelection[*]';
  readonly NAMEQUERY = '.Name[*]';
  readonly VOTESALLOWEDQUERY = '.VotesAllowed[0]';

  public contestType: string;
  public contestName: string;
  public ballotSelections: BallotSelection[] = [];
  public popupTitle: string = '';
  public statusMessage1: string = '';
  public statusMessage2: string = '';
  public statusMessage3: string = '';

  private votesAllowed = 0;
  private currentlySelected = 0;
  private contestIndex = 0;

  // todo: what is "aString"? is there a more descriptive variable name which could be used here?
  constructor(public home: HomePage, aString: string, private readonly parent: Election, contestIndex: number) {
    this.contestIndex = contestIndex;
    if (null != aString) {
      try {
        let values = jsonQuery(this.NAMEQUERY, { data: aString }).value;
        values.forEach((element) => {
          //e.g. "President and Vice President"
          this.contestName = element;
        });
        this.setBallotSelections(aString);
        this.setVotesAllowed(aString);
        this.home
          .getTranslator()
          .get('YOU_CAN_CHOOSE')
          .subscribe((res: string) => {
            this.statusMessage1 = res;
          });

        this.statusMessage2 = '' + (this.votesAllowed - this.currentlySelected);
        this.home
          .getTranslator()
          .get('MORE')
          .subscribe((res: string) => {
            this.statusMessage3 = res;
          });
      } catch (e) {
        console.log('Error:', e);
      }
    }
  }

  setBallotSelections(aString: string) {
    // todo: I see there's a try/catch here, but not in Election where the code is doing a similar operation
    // do we need a try/catch here? what about the other classes?
    try {
      // todo: what kind of data is "values"? is there a better name and type here?
      const values = jsonQuery(this.BALLOTSELECTIONQUERY, {
        data: aString,
      }).value;
      values.forEach((element) => {
        const ballotSelection = new BallotSelection(element, this);
        this.ballotSelections.push(ballotSelection);
      });
    } catch (e) {
      console.log('Error:', e);
    }
  }

  setVotesAllowed(aString: string) {
    try {
      this.votesAllowed = jsonQuery(this.VOTESALLOWEDQUERY, {
        data: aString,
      }).value;
    } catch (e) {
      console.log('Error:', e);
    }
  }

  getVotesAllowed(): number {
    return this.votesAllowed;
  }

  getPage(): string {
    return this.contestIndex + 1 + '/' + this.parent.getContestNamesCount();
  }

  getCurrentlySelected(): number {
    return this.currentlySelected;
  }

  getVotesLeft(): number {
    return this.votesAllowed - this.currentlySelected;
  }

  getParent(): Election {
    return this.parent;
  }

  ionChangeIgnoreCheckbox(cbox: Checkbox) {
    //always want true in the vote review page - don't allow deselection there!
    console.log('Contest.ts: inside ionChangeIgnoreCheckbox, rechecking the checkbox');
    cbox.checked = true;
  }

  ionChangeUpdateCheckboxAlt(cbox) {
    console.log(
      'Contest.ts: in updatecheckbox-ALT, cbox is:' + cbox.currentTarget.checked + ' currentlySelected is ' + this.currentlySelected
    );
  }

  ionChangeUpdateCheckbox(cbox) {
    console.log('Contest.ts: in updatecheckbox, cbox is:' + cbox.currentTarget.checked + ' currentlySelected is ' + this.currentlySelected);

    if (cbox.currentTarget.checked) {
      console.log('Contest.ts: cbox checked');
      this.currentlySelected++;
    } else {
      console.log('Contest.ts: cbox was UNchecked');
      this.currentlySelected--;
    }
    console.log('Contest.ts: currently selected: ' + this.currentlySelected + ', votesAllowed: ' + this.votesAllowed);

    if (this.currentlySelected == this.votesAllowed) {
      this.statusMessage1 = '';
      this.statusMessage2 = '';
      this.statusMessage3 = '';
    } else if (this.votesAllowed > this.currentlySelected) {
      this.home
        .getTranslator()
        .get('YOU_CAN_CHOOSE')
        .subscribe((res: string) => {
          this.statusMessage1 = res;
        });
      this.statusMessage2 = '' + (this.votesAllowed - this.currentlySelected);
      this.home
        .getTranslator()
        .get('MORE')
        .subscribe((res: string) => {
          this.statusMessage3 = res;
        });
    } else {
      this.home
        .getTranslator()
        .get('SELECTED_TOO_MANY')
        .subscribe((res: string) => {
          this.statusMessage1 = res;
        });

      this.home
        .getTranslator()
        .get('TOO_MANY_TITLE')
        .subscribe((res: string) => {
          this.popupTitle = res;
        });
      let popupContent = { title: this.popupTitle, body: this.statusMessage1 };
      //deselect what the user just did
      cbox.currentTarget.checked = false;
      //pop up modal dialog telling user to deselect something - they're already at max
      this.home.openIonModal(popupContent);
    }
  }

  canSelectMoreCandidates(): boolean {
    if (this.votesAllowed === this.currentlySelected) {
      return false;
    } else {
      return true;
    }
  }

  oneVoteClicked(event: Event) {
    console.log('got here!');
  }
}

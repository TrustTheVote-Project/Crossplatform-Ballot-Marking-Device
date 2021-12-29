import { Checkbox } from '@ionic/core/dist/types/components/checkbox/checkbox';
import * as jsonQuery from 'json-query';

import { Election } from './Election';
import { BallotSelection } from './BallotSelection';
import { HomePage } from '../app/home/home.page';

export class Contest {
  readonly ballotSelectionQuery = '.BallotSelection[*]';
  readonly nameQuery = '.Name[*]';
  readonly votesAllowedQuery = '.VotesAllowed[0]';
  readonly contestIdQuery = '.objectId';
  public contestType: string;
  public contestId: string;
  public contestName: string;
  // todo: one of the reasons I'm struggling to understand the data model is that its currently intertwined with the classes
  // this implementation has one set of _nested_ classes, which contain both the state and the business logic
  // that's difficult to manage and requires a higher cognitive load. it also makes testing very difficult.

  // a better implementation would be to separate the state and the business logic.
  // in other words, you'd have one immutable model for the data (which should be set at the beginning and would map to the XML files),
  // which would be referenced in all the classes as needed
  // further, the classes would not be able to look "up" to the parent scope - that's super dangerous and opens the door for scope bleed
  // instead, shared services would provide the functionality that you need without having to worry about cross-class contamination.
  public ballotSelections: BallotSelection[] = new Array();
  public popupTitle = '';
  public statusMessage1 = '';
  public statusMessage2 = '';
  public statusMessage3 = '';
  private parent: Election;
  private votesAllowed = 0;
  private currentlySelected = 0;
  private contestIndex = 0;
  // todo: given that this same private variable is defined in multiple places, it should be hoisted to a
  // shared scope and used everywhere it's needed. maybe an enum would be better here?
  private writeIn = 'writein';

  constructor(public home: HomePage, aString: string, parent: Election, contestIndex: number) {
    this.parent = parent;
    // todo: you can to private readonly contestIndex in the function signature, which will automatically assign it to the scope
    this.contestIndex = contestIndex;
    if (null != aString) {
      try {
        // todo: what is values? can we use a better variable name here?
        const values = jsonQuery(this.nameQuery, { data: aString }).value;
        // todo: what is elements? can we use a better variable name here?
        // todo: what does this forEach do? it looks like it just assigns... the last element
        // (again, not sure what "element" is here) as the contestName. why are the others ignored?
        values.forEach((element) => {
          //e.g. "President and Vice President"
          this.contestName = element;
        });
        this.setBallotSelections(aString);
        this.setVotesAllowed(aString);
        this.setContestId(aString);
        // todo: instead of reaching up to the parent's parent for the translation method, why not use some global service instead?
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
        // todo: under what circumstances would this fail? why are we ignoring any failures that would happen here?
        console.log('Error:', e);
      }
    }
  }

  // todo: this method is problematic because
  // A) is has side effects, and
  // B) if you call it multiple times, you'll end up with twice the contests in your contest array than you expected
  // a better solution would be to use map to generate and return an array of ballotSelections based on the values from the
  // aString (whatever that is - we should use a better variable name there).
  // that array would be set to the scoped variable in the calling function
  setBallotSelections(aString: string) {
    try {
      // todo: what is aString? what is values? can we use better names here?
      const values = jsonQuery(this.ballotSelectionQuery, { data: aString }).value;
      // todo: what is element? can we use a better name here?
      values.forEach((element) => {
        this.ballotSelections.push(new BallotSelection(element, this));
      });
      const aBallotSelection = new BallotSelection(this.writeIn, this);
      this.ballotSelections.push(aBallotSelection);
    } catch (e) {
      // todo: under what circumstances would this fail? why are we ignoring any failures that would happen here?
      console.log('Error:', e);
    }
  }

  setContestId(aString: string) {
    try {
      this.contestId = jsonQuery(this.contestIdQuery, { data: aString }).value;
    } catch (e) {
      // todo: under what circumstances would this fail? why are we ignoring any failures that would happen here?
      console.log('Error:', e);
    }
  }

  setVotesAllowed(aString: string) {
    try {
      this.votesAllowed = jsonQuery(this.votesAllowedQuery, { data: aString }).value;
    } catch (e) {
      // todo: under what circumstances would this fail? why are we ignoring any failures that would happen here?
      console.log('Error:', e);
    }
  }

  getVotesAllowed(): number {
    return this.votesAllowed;
  }

  getPage(): string {
    return `${this.contestIndex + 1}/${this.parent.getContestNames.length}`;
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
    // todo: is the disallow logic mentioned above enforced anywhere?
    cbox.checked = true;
  }

  ionChangeUpdateCheckbox(cbox) {
    if (cbox.currentTarget.checked) {
      this.currentlySelected++;
    } else {
      this.currentlySelected--;
    }

    // todo: Bret mentioned this isn't working as he expects when using triple equals - should figure out why and fix it
    // eslint-disable-next-line
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
      const popupContent = { title: this.popupTitle, body: this.statusMessage1 };
      cbox.currentTarget.checked = false;
      this.home.openIonModal(popupContent);
    }
  }

  canSelectMoreCandidates(): boolean {
    return this.votesAllowed !== this.currentlySelected;
  }
}

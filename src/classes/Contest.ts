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
      console.log('aString is:' + aString);
      this.parent = parent;
      this.contestIndex = contestIndex;
      if (null != aString) {
         try {
            const values = jsonQuery(this.nameQuery, { data: aString }).value;
            values.forEach((element) => {
               //e.g. "President and Vice President"
               this.contestName = element;
            });
            this.setBallotSelections(aString);
            this.setVotesAllowed(aString);
            this.setContestId(aString);
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

   getContestName(): string {
      return this.contestName;
   }

   setBallotSelections(aString: string) {
      try {
         const values = jsonQuery(this.ballotSelectionQuery, { data: aString }).value;
         values.forEach((element) => {
            this.ballotSelections.push(new BallotSelection(element, this));
         });
         //add a writein
         const aBallotSelection = new BallotSelection(this.writeIn, this);
         this.ballotSelections.push(aBallotSelection);
      } catch (e) {
         console.log('Error:', e);
      }
   }

   setContestId(aString: string) {
      try {
         this.contestId = jsonQuery(this.contestIdQuery, { data: aString }).value;
      } catch (e) {
         console.log('Error:', e);
      }

   }

   setVotesAllowed(aString: string) {
      try {
         this.votesAllowed = jsonQuery(this.votesAllowedQuery, { data: aString }).value;
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

   getBallotSelections(): BallotSelection[] {
      return this.ballotSelections;
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
      if (cbox.currentTarget.checked) {
         console.log('Contest.ts: cbox checked');
         this.currentlySelected++;
      } else {
         console.log('Contest.ts: cbox was UNchecked');
         this.currentlySelected--;
      }

      console.log('Contest.ts: currently selected: ' + this.currentlySelected + ', votesAllowed: ' + this.votesAllowed);

      // eslint-disable-next-line
      if (this.currentlySelected == this.votesAllowed) {
         this.statusMessage1 = '';
         this.statusMessage2 = '';
         this.statusMessage3 = '';
      } else if (this.votesAllowed > this.currentlySelected) {
         console.log('Contest.ts - got here!!!!');
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
         //deselect what the user just did
         cbox.currentTarget.checked = false;
         //pop up modal dialog telling user to deselect something - they're already at max
         this.home.openIonModal(popupContent);
      }
   }

   canSelectMoreCandidates(): boolean {
      return this.votesAllowed !== this.currentlySelected;
   }

   oneVoteClicked() {
      console.log('got here!');
   }
}

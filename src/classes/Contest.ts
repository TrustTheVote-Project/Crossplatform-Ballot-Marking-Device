import { map } from 'rxjs/operators';
import { BallotSelection } from './BallotSelection';
import { Election } from './Election';
import { Component } from '@angular/core';
import { Checkbox } from '@ionic/core/dist/types/components/checkbox/checkbox';
import { ModalController } from '@ionic/angular';
import { HomePage } from '../app/home/home.page';

declare let require: any;

export class Contest {
   readonly BALLOTSELECTIONQUERY = '.BallotSelection[*]';
   readonly NAMEQUERY = '.Name[*]';
   readonly VOTESALLOWEDQUERY = '.VotesAllowed[0]';
   public contestType: string;
   public constestId: string;
   public contestName: string;
   public ballotSelections: BallotSelection[] = new Array();
   public statusMessage1: string = '';
   public statusMessage2: string = '';
   public statusMessage3: string = '';
   private parent: Election;
   private jsonQuery = require('json-query');
   private votesAllowed = 0;
   private currentlySelected = 0;
   private contestIndex = 0;


   constructor(public home: HomePage, aString: string, parent: Election, contestIndex: number) {
      //constructor( aString: string, parent: Election, contestIndex: number) {
      this.parent = parent;
      this.contestIndex = contestIndex;
      if (null != aString) {
         try {
            let values = this.jsonQuery(this.NAMEQUERY, { data: aString }).value;
            values.forEach(element => {
               //e.g. "President and Vice President"
               this.contestName = element;
            });
            this.setBallotSelections(aString);
            this.setVotesAllowed(aString);
            this.statusMessage1 = 'You can choose ';
            this.statusMessage2 = ''+(this.votesAllowed - this.currentlySelected);
            this.statusMessage3 =  ' more.';
            //this.getPage();

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
         let values = this.jsonQuery(this.BALLOTSELECTIONQUERY, { data: aString }).value;
         values.forEach(element => {
            var aBallotSelection = new BallotSelection(element, this);
            this.ballotSelections.push(aBallotSelection);
         });
      } catch (e) {
         console.log('Error:', e);
      }
   }

   setVotesAllowed(aString: string) {
      try {
         this.votesAllowed = this.jsonQuery(this.VOTESALLOWEDQUERY, { data: aString }).value;
      } catch (e) {
         console.log('Error:', e);
      }
   }

   getVotesAllowed(): number {
      return (this.votesAllowed);
   }

   getPage(): string {

      //console.log ('page number string: '+(this.contestIndex+1)+'/'+(this.parent.getContestNamesCount()+1));
      return((this.contestIndex+1)+'/'+(this.parent.getContestNamesCount()+1));
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

   ionChangeUpdateCheckbox(cbox) {
      console.log('in updatecheckbox, cbox is:'+cbox.currentTarget.checked);
      if (cbox.currentTarget.checked) {
         console.log('cbox checked');
         this.currentlySelected++;
      } else {
         console.log('cbox was UNchecked');
         this.currentlySelected--;
      }
      console.log('currently selected: ' + this.currentlySelected + ', votesAllowed: ' +
                  this.votesAllowed);

      if (this.currentlySelected == this.votesAllowed) {
         this.statusMessage1 = '';
         this.statusMessage2 = '';
         this.statusMessage3 = '';
      } else if (this.votesAllowed > this.currentlySelected) {
         this.statusMessage1 = 'You can choose ';
         this.statusMessage2 = ''+(this.votesAllowed - this.currentlySelected);
         this.statusMessage3 =  ' more.';
      } else {
         this.statusMessage1 = 'You have selected too many candidates - please deselect '
         + 'the candidate you do not want, then select the candidate you do want.'
         let popupContent = { title: 'Too many selections', body: this.statusMessage1 };
         //deselect what the user just did
         cbox.currentTarget.checked = false;
         //pop up modal dialog telling user to deselect something - they're already at max
         this.home.openIonModal(popupContent);
      }
   }

   canSelectMoreCandidates(): boolean {
      if (this.votesAllowed === this.currentlySelected) {
         return (false);
      } else {
         return (true);
      }
   }

   oneVoteClicked(event: Event) {
      console.log('got here!');

   }


}

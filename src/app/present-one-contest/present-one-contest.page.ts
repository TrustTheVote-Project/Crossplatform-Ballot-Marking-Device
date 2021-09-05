import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Contest } from '../../classes/Contest';
import { HomePage } from '../home/home.page';


@Component({
   selector: 'page-present-one-contest',
   templateUrl: 'present-one-contest.page.html',
   styleUrls: ['present-one-contest.page.scss'],
})

export class PresentOneContestPage implements OnInit{
   @Input() public contest: Contest;
   @Input() public home: HomePage;
   @Input() public contestNum: number;

   constructor(public modalController: ModalController) {
      this.modalController = modalController;
      console.log('present-one-contest:ctor - enter');

   }

   ngOnInit() {

   }

   closeModal() {
      this.modalController.dismiss();
      this.home.voteReviewSpecificContest(this.contestNum);

   }

}

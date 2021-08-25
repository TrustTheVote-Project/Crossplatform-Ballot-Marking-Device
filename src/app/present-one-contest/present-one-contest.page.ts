import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Contest } from '../../classes/Contest';


@Component({
   selector: 'page-present-one-contest',
   templateUrl: 'present-one-contest.page.html',
   styleUrls: ['present-one-contest.page.scss'],
})

export class PresentOneContestPage implements OnInit{
   @Input() public contest: Contest;

   constructor(public modalController: ModalController) {
      this.modalController = modalController;

   }

   ngOnInit() {

   }

   closeModal() {
      this.modalController.dismiss();

   }

}

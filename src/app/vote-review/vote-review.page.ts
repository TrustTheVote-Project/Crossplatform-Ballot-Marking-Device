import { Component , OnInit, Input} from '@angular/core';
import { Election } from '../../classes/Election';
import { ModalController } from '@ionic/angular';

@Component({
   selector: 'page-vote-review',
   templateUrl: 'vote-review.page.html',
   styleUrls: ['vote-review.page.scss'],
   providers: [Election]
})
export class VoteReviewPage implements OnInit{
   private election: Election;
   private modal: ModalController;

   constructor(election: Election, modalController: ModalController) {
      this.election = election;
      this.modal=modalController;
   }

   ngOnInit() {
      console.log('inside vote review modal onInit');
   }
   ionViewDidLoad() {
      console.log('ionViewDidLoad VoteReviewPage');
   }

   async closeModal(index: number) {
      const close: string = "Modal Removed";
      await this.modal.dismiss(close);
   }
   async openIonModal(data: any) {
      console.log('opening the vote review modal');
      //async openIonModal(title: string, body: string) {
      const modal = await this.modal.create({
         component: VoteReviewPage ,
         componentProps: {
            "title": data.title,
            "body" : data.body
         }
      });
      return await modal.present();
      console.log('did it show up?');
   }

   oneVoteClicked(index: number) {
      console.log("vote-review - got here! You clicked element " + index);
      //this.closeModal(index);
      console.log("vote-review - closed the vote review modal");

      console.log("vote-review - just presented the new modal dialog");
   }

}


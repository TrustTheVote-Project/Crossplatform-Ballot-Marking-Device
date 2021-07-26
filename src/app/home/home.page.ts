import { OnInit, Component } from '@angular/core';
import { Election } from '../../classes/Election';
import { HttpClient } from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';
import { ModalPopupPage } from '../modal-popup/modal-popup.page';
import { VoteReviewPage } from '../vote-review/vote-review.page';
import { ModalController } from '@ionic/angular';

imports: [
   HttpClient,
   HttpClientModule
];

declare const require;
const xml2js = require('xml2js');

@Component({
   selector: 'app-home',
   templateUrl: 'home.page.html',
   styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
   public xml = '';
   myhttp: HttpClient;
   public electionContestNames: string[];
   private election: Election;
   private modal: ModalController;
   private voteReviewPage: VoteReviewPage;

   constructor(public modalController: ModalController, private http: HttpClient) {
      this.myhttp = http;
      this.modal = modalController;
   }

   ngOnInit() {

      this.initializeApp();

   }

   initializeApp() {
      this.openXML();
   }

   openXML() {
      //console.log('inside openXML');
      this.election = new Election( this.myhttp, '/assets/data/results-06037-2017-03-07.xml', this);
      console.log('just set the election variable');
      //alternate data files... need to be able to select which to use
      //from the device... TO-DO...later
      //this.election = new Election(this.myhttp, '/assets/data/results-06037-2016-11-08.xml');
   }

   getJSONFromXML() {
      console.log('inside getJSONFromXML');
   }

   getContentFromJSON() {
      console.log('inside getContentFromJSON');
   }

   getModal() {
      return this.modal;

   }

   async openIonModal(data: any) {
      console.log('opening the modal');
      //async openIonModal(title: string, body: string) {
      const modal = await this.modalController.create({
         component: ModalPopupPage,
         componentProps: {
            "title": data.title,
            "body" : data.body
         }
      });
      return await modal.present();
      console.log('did it show up?');
   }

   voteReview() {
      console.log('made it to voteReview');
      console.log('about to print contest names');
      this.election.printContestNames();
      console.log('just printed contest names');
      this.voteReviewPage = new VoteReviewPage(this.election, this.modal);
      let voteReviewPopupContent = { title: 'Vote Reiew', body: 'election review goes here' };
      let voteReviewModal = this.voteReviewPage.openIonModal({title: 'vote review modal', body:'vote review body'});
      //            let voteReviewModal = this.modalCtrl.create('VoteReviewPage', voteReviewPopupContent);
      /*
         voteReviewModal.onDidDismiss().then((data) => {

         console.log('data in votereview was ' + data);

         });
         let oneContestPopupContent = { 'contest": this.election.getContestByIndex(data.index) };
         console.log("vote-review: popupContent is " + this.election.getContestByIndex(data.index));
         var oneContestModal = this.modalCtrl.create('PresentOneContestPage', oneContestPopupContent);
         console.log("vote-review - just created PresentOneContest modal");
         oneContestModal.present();
         });
         voteReviewModal.present();
         let data = {
         "title": 'Vote Review',
         "body": 'the body'};
         this.openIonModal(data);
         */

   }
}

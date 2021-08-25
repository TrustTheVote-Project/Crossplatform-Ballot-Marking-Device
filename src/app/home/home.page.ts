import { OnInit, Component, ViewChild } from '@angular/core';
import { Election } from '../../classes/Election';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalPopupPage } from '../modal-popup/modal-popup.page';
import { VoteReviewPage } from '../vote-review/vote-review.page';
import { ModalController } from '@ionic/angular';
import { IonSlides} from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';



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
   public currentContest: number;
   private election: Election;
   private modal: ModalController;
   private voteReviewPage: VoteReviewPage;


   @ViewChild('mySlider')  slides: IonSlides;

   sliderConfig = {
      effect: 'cube',
      autoHeight: true
   };


   constructor( public modalController: ModalController, private http: HttpClient) {
      SplashScreen.show({
         showDuration: 2000,
         autoHide: true
      });
      this.myhttp = http;
      this.modal = modalController;
   }

   ngOnInit() {

      this.initializeApp();

      this.currentContest = 1;
   }

   initializeApp() {
      this.openXML();
   }

   openXML() {
      this.election = new Election( this.myhttp, '/assets/data/results-06037-2017-03-07.xml', this);
      //alternate data files... need to be able to select which to use
      //from the device... TO-DO...later
      //this.election = new Election(this.myhttp, '/assets/data/results-06037-2016-11-08.xml');
   }

   getJSONFromXML() {
   }

   getContentFromJSON() {
   }

   getModal() {
      return this.modal;

   }

   async openIonModal(data: any) {
      const modal = await this.modalController.create({
         component: ModalPopupPage,
         componentProps: {
            title: data.title,
            body : data.body
         }
      });
      return await modal.present();
   }

   async   voteReview(): Promise<void> {
      let voteReviewPopupContent = { election: this.election, title: 'Vote Review', body: 'election review goes here' };

      const voteReviewModal = await this.modal.create({
         component: VoteReviewPage,
         componentProps: voteReviewPopupContent
      });
      //return await voteReviewModal.present();
      await voteReviewModal.present();

      voteReviewModal.onDidDismiss().then((data) => {

   //      this.oneVoteReview(data);

      });
   }



   oneVoteClicked(contestNum: number) {
      console.log('contest ' + contestNum + ' selected in oneVoteClicked');
   }

   slideNext() {
      this.slides.slideNext();
      this.currentContest = (this.currentContest++ >= this.election.contests.length+1 ?
                             this.election.contests.length+1 : this.currentContest);
   }
   slidePrevious() {
      this.slides.slidePrev();
      this.currentContest--;
      this.currentContest = (this.currentContest <= 0? 1 : this.currentContest);
   }
}

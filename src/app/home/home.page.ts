import { OnInit, Component, ViewChild } from '@angular/core';
import { Election } from '../../classes/Election';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalPopupPage } from '../modal-popup/modal-popup.page';
import { VoteReviewPage } from '../vote-review/vote-review.page';
import { ModalController } from '@ionic/angular';
import { IonSlides} from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
//import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';



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
   public title: string;
   public title_2: string;
   public description: string;
   public name: string;
   public language: string;
   private election: Election;
   private modal: ModalController;
   private voteReviewPage: VoteReviewPage;


   @ViewChild('mySlider')  slides: IonSlides;

   sliderConfig = {
      effect: 'cube',
      autoHeight: true
   };


   constructor( public modalController: ModalController, 
               private http: HttpClient,
               //               private globalization: Globalization,
               private _translate: TranslateService) {
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
                  this.getDeviceLanguage();
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
                  let voteReviewPopupContent = { scrollToContest: 0, home: this, election: this.election, title: 'Vote Review', body: 'election review goes here' };

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

               public async voteReviewSpecificContest(contestNum: number): Promise<void> {
                  console.log('home.page::voteReviewSpecificContest - should center on contest ' + contestNum);
                  let voteReviewPopupContent = { scrollToContest: contestNum, home: this, election: this.election, title: 'Vote Review', body: 'election review goes here' };

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

               _initialiseTranslation(): void {
                  this._translate.get('TITLE').subscribe((res: string) => {
                     this.title = res;
                  });
                  this._translate.get('description').subscribe((res: string) => {
                     this.description = res;
                  });
                  this._translate.get('TITLE_2', { value: 'John' }).subscribe((res: string) => {
                     this.title_2 = res;
                  });
                  this._translate.get('data.name', { name_value: 'Marissa Mayer' }).subscribe((res: string) => {
                     this.name = res;
                  });

               }

               public changeLanguage(): void {
                  this._translateLanguage();
               }

               _translateLanguage(): void {
                  this._translate.use(this.language);
                  this._initialiseTranslation();
               }

               _initTranslate(language) {
                  console.log("language is " + language);
                  // Set the default language for translation strings, and the current language.
                  this._translate.setDefaultLang('en');
                  if (language) {
                     this.language = language;
                  }
                  else {
                     // Set your language here
                     this.language = 'en';
                  }
                  this._translateLanguage();
               }

               getDeviceLanguage() {
                  if (window.Intl && typeof window.Intl === 'object') {
                     this._initTranslate(navigator.language)
                  }
                  else {
                     /*
                        this.globalization.getPreferredLanguage()
                        .then(res => {
                        this._initTranslate(res.value)
                        })
                        .catch(e => {console.log(e);});
                        */
                  }
               }
               getTranslator() {
                  return this._translate}
}

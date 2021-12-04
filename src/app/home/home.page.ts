import { OnInit, Component, ViewChild } from '@angular/core';
import { Election } from '../../classes/Election';
//import { HttpClient } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalPopupPage } from '../modal-popup/modal-popup.page';
import { VoteReviewPage } from '../vote-review/vote-review.page';
import { SettingsPage } from '../settings/settings.page';
import { ModalController } from '@ionic/angular';
import { IonSlides} from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
//import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
//import {listFiles} from 'list-files-in-dir';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Candidate } from '../../classes/Candidate';

import { WriteinPopupPage } from '../writein-popup/writein-popup.page';


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
   public xmlFile = '/assets/data/64K_1Contest.xml';
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
   private settingsPage: SettingsPage;
   private EDFiles: string[];
   private jsonQuery = require('json-query');


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
                  this.getEDFiles();
                  console.log('EDFiles is :'+this.EDFiles);
                  this.openXML();
               }

               openXML() {
                  //alternate data files... need to be able to select which to use
                  this.election = new Election( this.myhttp, this.xmlFile, this);
                  //from the device... TO-DO...later
                  //this.election = new Election( this.myhttp, '/assets/data/64K_1Contest.xml', this);
                  //                  this.election = new Election( this.myhttp, '/assets/data/results-06037-2017-03-07.xml', this);
                  //this.election = new Election( this.myhttp, '/assets/data/LA_County_Reference.xml', this);
                  ////this.election = new Election(this.myhttp, '/assets/data/results-06037-2016-11-08.xml');
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
                  this.currentContest++;;
                  this.currentContest = (this.currentContest >= this.election.contests.length ?
                                         this.election.contests.length : this.currentContest);
               }

               slidePrevious() {
                  this.slides.slidePrev();
                  this.currentContest--;
                  this.currentContest = (this.currentContest <= 0? 1 : this.currentContest);
               }

               async   settings(): Promise<void> {
                  let settingsPopupContent = {EDFiles: this.EDFiles, home: this };

                  const settingsModal = await this.modal.create({
                     component: SettingsPage,
                     componentProps: settingsPopupContent
                  });
                  await settingsModal.present();

                  settingsModal.onDidDismiss().then((data) => {

                     //      this.oneVoteReview(data);

                  });
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

                  logScrollStart() {

                     console.log("home.page.ts:logScrollStart - in logScrollStart");

                  }

                  logScrolling(event:Event) {
                     console.log("home.page.ts:logScrolling - in logScrolling");


                  }

                  logScrollEnd() {
                     console.log("home.page.ts:logScrollEnd - in logScrollEnd");


                  }


                  getEDFiles() {

                     try {
                        //let jsonData;
                        let xmlFiles = '/assets/data/index.txt';

                        this.myhttp.get(xmlFiles,
                                        {
                                           headers: new HttpHeaders()
                                           .set('Content-Type', 'application/json ')
                                           .append('Access-Control-Allow-Methods', 'GET')
                                           .append('Access-Control-Allow-Origin', '*')
                                           .append('Access-Control-Allow-Headers',
                                                   'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
                                                   responseType: 'text'
                                        })
                                        .subscribe((jsonData) => {
                                           console.log( 'data read is ' + jsonData);
                                           this.EDFiles = jsonData.split("\n");
                                           return;
                                           //                                           const values = this.jsonQuery('filenames[*]', { data: jsonData}).value;
                                           //                                           values.forEach(element => {
                                           //                                             this.EDFiles.push(element);
                                           //                                           });
                                        });
                     } catch (e) {
                        console.log('Error:', e);
                     }

                  }

                  getEDF() {

                     return (this.xmlFile);


                  }

                  setEDF(xmlFile: string) {
                     this.xmlFile = xmlFile;
                     this.openXML();

                  }

                  itemClicked(event: Event, candidate: Candidate) {

                     console.log('got to itemClicked... checking whether ' + candidate.getCandidateName() + ' is a writein');
                     if (candidate.isWriteIn()) {
                        console.log('you clicked a write in');

                        this.writeInPopup(candidate);
                     }
                  }

                  async   writeInPopup(candidate: Candidate): Promise<void> {
                     let name = candidate.getCandidateName() ==  candidate.WRITE_IN_CONST ? '' : candidate.getCandidateName(); 
                     let writeinPopupContent = { title: 'Write-In Candidate', body: 'election review goes here', writeinName: candidate.getCandidateName() };

                     const writeinPopupModal= await this.modal.create({
                        component: WriteinPopupPage,
                        componentProps: writeinPopupContent
                     });

                     await writeinPopupModal.present();

                     writeinPopupModal.onDidDismiss().then((data) => {

                        console.log('got this data '+data);
                        if ((data.data).trim().length > 0) {
                        candidate.setCandidateName(data.data);
                        } else {
                           candidate.setCandidateName(candidate.WRITE_IN_CONST);

                           //deselect it
                     }

                     });
                  }

}

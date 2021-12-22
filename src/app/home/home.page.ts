import { OnInit, Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { ModalPopupPage } from '../modal-popup/modal-popup.page';
import { VoteReviewPage } from '../vote-review/vote-review.page';
import { SettingsPage } from '../settings/settings.page';
import { Candidate } from '../../classes/Candidate';
import { Election } from '../../classes/Election';
import { WriteinPopupPage } from '../writein-popup/writein-popup.page';

@Component({
   selector: 'app-home',
   templateUrl: 'home.page.html',
   styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
   @ViewChild('mySlider') slides: IonSlides;

   sliderConfig = {
      effect: 'cube',
      autoHeight: true,
   };

   public xml = '';
   public xmlFile = '/assets/data/64K_1Contest.xml';
   public electionContestNames: string[];
   public currentContest: number;
   public title: string;
   public titleTwo: string;
   public description: string;
   public name: string;
   public language: string;
   private election: Election;
   private modal: ModalController;
   private edFiles: string[];

   constructor(public modalController: ModalController, private readonly http: HttpClient, private translate: TranslateService) {
      SplashScreen.show({
         showDuration: 2000,
         autoHide: true,
      });
      this.modal = modalController;
   }

   ngOnInit() {
      this.initializeApp();
      this.currentContest = 1;
   }

   initializeApp() {
      this.getDeviceLanguage();
      this.getEDFiles();
      console.log('EDFiles is :' + this.edFiles);
      this.openXML();
   }

   openXML() {
      //alternate data files... need to be able to select which to use
      this.election = new Election(this.http, this.xmlFile, this);
      //from the device... TO-DO...later
      //this.election = new Election( this.http, '/assets/data/64K_1Contest.xml', this);
      //                  this.election = new Election( this.http, '/assets/data/results-06037-2017-03-07.xml', this);
      //this.election = new Election( this.http, '/assets/data/LA_County_Reference.xml', this);
      ////this.election = new Election(this.http, '/assets/data/results-06037-2016-11-08.xml');
   }

   async openIonModal(data: any) {
      const modal = await this.modalController.create({
         component: ModalPopupPage,
         componentProps: {
            title: data.title,
            body: data.body,
         },
      });
      return await modal.present();
   }

   async voteReview(): Promise<void> {
      const voteReviewPopupContent = {
         scrollToContest: 0,
         home: this,
         election: this.election,
         title: 'Vote Review',
         body: 'election review goes here',
      };

      const voteReviewModal = await this.modal.create({
         component: VoteReviewPage,
         componentProps: voteReviewPopupContent,
      });
      await voteReviewModal.present();
      voteReviewModal.onDidDismiss();
   }

   public async voteReviewSpecificContest(contestNum: number): Promise<void> {
      console.log('home.page::voteReviewSpecificContest - should center on contest ' + contestNum);
      const voteReviewPopupContent = {
         scrollToContest: contestNum,
         home: this,
         election: this.election,
         title: 'Vote Review',
         body: 'election review goes here',
      };

      const voteReviewModal = await this.modal.create({
         component: VoteReviewPage,
         componentProps: voteReviewPopupContent,
      });
      await voteReviewModal.present();

      voteReviewModal.onDidDismiss();
   }

   // todo: this doesn't actually do anything - can it be removed?
   oneVoteClicked(contestNum: number) {
      console.log('contest ' + contestNum + ' selected in oneVoteClicked');
   }

   slideNext() {
      this.slides.slideNext();
      this.currentContest++;
      this.currentContest = this.currentContest >= this.election.contests.length ? this.election.contests.length : this.currentContest;
   }

   slidePrevious() {
      this.slides.slidePrev();
      this.currentContest--;
      this.currentContest = this.currentContest <= 0 ? 1 : this.currentContest;
   }

   async settings(): Promise<void> {
      const settingsPopupContent = { edFiles: this.edFiles, home: this };
      const settingsModal = await this.modal.create({
         component: SettingsPage,
         componentProps: settingsPopupContent,
      });
      await settingsModal.present();
      settingsModal.onDidDismiss();
   }

   public changeLanguage(): void {
      this.translateLanguage();
   }

   translateLanguage(): void {
      this.translate.use(this.language);
   }

   initTranslate(language) {
      console.log('language is ' + language);
      // Set the default language for translation strings, and the current language.
      this.translate.setDefaultLang('en');
      if (language) {
         this.language = language;
      } else {
         // Set your language here
         this.language = 'en';
      }
      this.translateLanguage();
   }

   getDeviceLanguage() {
      if (window.Intl && typeof window.Intl === 'object') {
         this.initTranslate(navigator.language);
      }
   }
   getTranslator() {
      return this.translate;
   }

   // todo: this doesn't actually do anything - can it be removed?
   logScrollStart() {
      console.log('home.page.ts:logScrollStart - in logScrollStart');
   }

   // todo: this doesn't actually do anything - can it be removed?
   logScrolling() {
      console.log('home.page.ts:logScrolling - in logScrolling');
   }

   // todo: this doesn't actually do anything - can it be removed?
   logScrollEnd() {
      console.log('home.page.ts:logScrollEnd - in logScrollEnd');
   }

   getEDFiles() {
      try {
         const xmlFiles = '/assets/data/index.txt';

         this.http
         .get(xmlFiles, {
            headers: new HttpHeaders()
            .set('Content-Type', 'application/json ')
            .append('Access-Control-Allow-Methods', 'GET')
            .append('Access-Control-Allow-Origin', '*')
            .append(
               'Access-Control-Allow-Headers',
               'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'
            ),
            responseType: 'text',
         })
         .subscribe((jsonData) => {
            console.log('data read is ' + jsonData);
            this.edFiles = jsonData.split('\n');
         });
      } catch (e) {
         console.log('Error:', e);
      }
   }

   getEDF() {
      return this.xmlFile;
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

   async writeInPopup(candidate: Candidate): Promise<void> {
      const writeinPopupContent = {
         title: 'Write-In Candidate',
         body: 'write-in election review goes here',
         writeinName: candidate.getCandidateName(),
      };

      const writeinPopupModal = await this.modal.create({
         component: WriteinPopupPage,
         componentProps: writeinPopupContent,
      });

      await writeinPopupModal.present();

      writeinPopupModal.onDidDismiss().then((data) => {
         console.log('got this data ' + data);
         if (data.data.trim().length > 0) {
            candidate.setCandidateName(data.data);
         } else {
            candidate.setCandidateName(candidate.writeInConst);
         }
      });
   }
}

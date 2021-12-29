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
  public xmlFile = '/assets/data/results-06037-2017-03-07.xml';
  public electionContestNames: string[];
  public currentContest: number;
  public title: string;
  public titleTwo: string;
  public description: string;
  public name: string;
  public language: string;
  private election: Election;
  private edFiles: string[];

  constructor(public modalController: ModalController, private readonly http: HttpClient, private translate: TranslateService) {
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }

  ngOnInit() {
    this.initializeApp();
    this.currentContest = 1;
  }

  initializeApp() {
    // todo: the next two methods are "getters" but... don't seem to return anything?
    // it's difficult to understand what's going on here
    this.getDeviceLanguage();
    this.getEDFiles();
    this.openXML();
  }

  // todo: the implementation of this function doesn't match its name
  // furthermore, it's setting a scoped variable, which means it has a side effect.
  // a better implmentation would be for it to return a new election, while the calling function
  // can be responsible for setting it on the scope... but at that point,
  // there's really no reason for a separate function for this anyway, right?
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

    const voteReviewModal = await this.modalController.create({
      component: VoteReviewPage,
      componentProps: voteReviewPopupContent,
    });
    await voteReviewModal.present();
    voteReviewModal.onDidDismiss();
  }

  public async voteReviewSpecificContest(contestNum: number): Promise<void> {
    const voteReviewPopupContent = {
      scrollToContest: contestNum,
      home: this,
      election: this.election,
      title: 'Vote Review',
      body: 'election review goes here',
    };

    const voteReviewModal = await this.modalController.create({
      component: VoteReviewPage,
      componentProps: voteReviewPopupContent,
    });
    await voteReviewModal.present();

    voteReviewModal.onDidDismiss();
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

  // todo: can this method name be updated to use an action verb? i'm not sure what "settings" means here
  async settings(): Promise<void> {
    const settingsPopupContent = { edFiles: this.edFiles, home: this };
    const settingsModal = await this.modalController.create({
      component: SettingsPage,
      componentProps: settingsPopupContent,
    });
    await settingsModal.present();
    settingsModal.onDidDismiss();
  }

  initTranslate(language) {
    this.translate.setDefaultLang('en');
    if (language) {
      this.language = language;
    } else {
      this.language = 'en';
    }
    this.translate.use(this.language);
  }

  getDeviceLanguage() {
    if (window.Intl && typeof window.Intl === 'object') {
      this.initTranslate(navigator.language);
    }
  }

  getTranslator() {
    return this.translate;
  }

  getEDFiles() {
    try {
      const xmlFiles = '/assets/data/index.txt';

      // todo: this operation is repeated in multiple classes. instead of implementing it several times,
      // a better implementation would be to have a service which handles this operation for you
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
          this.edFiles = jsonData.split('\n');
        });
    } catch (e) {
      // todo: under what circumstances would this fail? why are we ignoring any failures that would happen here?
      console.log('Error:', e);
    }
  }

  // todo: this isn't actually setting an EDF is it? it's opening some XML?
  setEDF(xmlFile: string) {
    this.xmlFile = xmlFile;
    this.openXML();
  }

  itemClicked(event: Event, candidate: Candidate) {
    if (candidate.isWriteIn()) {
      this.writeInPopup(candidate);
    }
  }

  async writeInPopup(candidate: Candidate): Promise<void> {
    const writeinPopupContent = {
      title: 'Write-In Candidate',
      body: 'write-in election review goes here',
      writeinName: candidate.personName,
    };

    const writeinPopupModal = await this.modalController.create({
      component: WriteinPopupPage,
      componentProps: writeinPopupContent,
    });

    await writeinPopupModal.present();

    writeinPopupModal.onDidDismiss().then((data) => {
      // todo: what is data? what is.... data.data? can we use better variable names here?
      if (data.data.trim().length > 0) {
        candidate.personName = data.data;
      } else {
        candidate.personName = candidate.writeInConst;
      }
    });
  }
}

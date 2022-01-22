import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { Contest } from '../../classes/Contest';

/**
 * Generated class for the PresentOneContestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-present-one-contest',
  templateUrl: 'present-one-contest.html',
})
export class PresentOneContestPage {
  public contest: Contest = this.navParams.get('contest');

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
    console.log("presentOneContest::constructor - contest is " + this.contest.getContestName());
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PresentOneContestPage');
  }

}

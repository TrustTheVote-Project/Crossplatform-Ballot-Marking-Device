import { Component } from '@angular/core';
import { ModalController, IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { Election } from '../../classes/Election';


@IonicPage()
@Component({
  selector: 'page-vote-review',
  templateUrl: 'vote-review.html',
})
export class VoteReviewPage {
  election: Election = this.navParams.get('election');


  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VoteReviewPage');
  }

  public closeModal(index: number) {
    this.viewCtrl.dismiss({ "index": index });
  }

  oneVoteClicked(index: number) {
    console.log("vote-review - got here! You clicked element " + index);
    this.closeModal(index);
    console.log("vote-review - closed the vote review modal");

    console.log("vote-review - just presented the new modal dialog");
  }

}

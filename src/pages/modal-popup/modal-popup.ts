import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-popup',
  templateUrl: 'modal-popup.html',
})
export class ModalPopupPage {

  content: string = this.navParams.get('content');
  title: string = this.navParams.get('title');

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPopupPage');
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

}

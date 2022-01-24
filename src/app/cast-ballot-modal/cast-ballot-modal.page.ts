import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cast-ballot-modal',
  templateUrl: './cast-ballot-modal.page.html',
  styleUrls: ['./cast-ballot-modal.page.scss'],
})
export class CastBallotModalPage implements OnInit {
  public modal: ModalController;

  constructor(public modalController: ModalController) {
    this.modal = modalController;
  }

  ngOnInit() {
    console.log('inside castBallotModal.page.ts onInit');
  }

  async closeModal() {
    const close = 'Cast Ballot Modal Removed';
    await this.modal.dismiss(close);
  }
}

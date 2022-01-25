import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Election } from '../../classes/Election';

@Component({
  selector: 'app-cast-ballot-modal',
  templateUrl: './cast-ballot-modal.page.html',
  styleUrls: ['./cast-ballot-modal.page.scss'],
  providers: [Election],
})
export class CastBallotModalPage implements OnInit {
  @Input() public election: Election;
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

  async closeModalCastBallotReset() {
    //cause a reread of existing edf - basically resets the UI.
    this.election.reset();
    await this.modal.dismiss(close);
  }
}

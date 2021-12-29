import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Contest } from '../../classes/Contest';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.page.html',
  styleUrls: ['./modal-popup.page.scss'],
})
export class ModalPopupPage {
  @Input() contest: Contest;

  constructor(public modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss();
  }
}

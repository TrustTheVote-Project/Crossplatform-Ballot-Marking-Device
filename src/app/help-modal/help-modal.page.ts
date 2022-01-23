import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.page.html',
  styleUrls: ['./help-modal.page.scss'],
})
export class HelpModalPage implements OnInit {
  public modal: ModalController;

  constructor(public modalController: ModalController) {
    this.modal = modalController;
  }

  ngOnInit() {
    console.log('inside help-modal.page.ts onInit');
  }

  async closeModal() {
    const close = 'Help Modal Removed';
    await this.modal.dismiss(close);
  }
}

import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-writein-popup',
  templateUrl: './writein-popup.page.html',
  styleUrls: ['./writein-popup.page.scss'],
})
export class WriteinPopupPage implements OnInit {
  public modal: ModalController;
  private writeinName: string;

  constructor() {}

  ngOnInit() {}

  async closeModal() {
    await this.modal.dismiss(this.writeinName);
  }
}

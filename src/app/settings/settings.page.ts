import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  @Input() public home: HomePage;

  public edFiles: string[];
  public selectEDF: string;

  constructor(public readonly modalController: ModalController) {}

  ngOnInit() {
    this.selectEDF = this.home.xmlFile;
  }

  async closeModal() {
    await this.modalController.dismiss();

    const filePath = `/assets/data/${this.selectEDF}`;
    if (filePath !== this.home.xmlFile) {
      this.home.setEDF(filePath);
    }
  }

  // todo: what is "myChange"? can this be updated to use a more descriptive, action-based method name?
  myChange() {
    if (this.selectEDF !== this.home.xmlFile) {
    }
  }
}

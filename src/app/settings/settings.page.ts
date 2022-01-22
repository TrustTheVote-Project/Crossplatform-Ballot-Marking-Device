import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HomePage } from '../home/home.page';

const EDF_LOC_CONST = '/assets/data/';

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
    this.selectEDF = this.home.getEDF();
  }

  async closeModal() {
    const close = 'Modal Removed';
    await this.modalController.dismiss(close);

    if (`${this.selectEDF}` !== this.home.getEDF()) {
      this.home.setEDF(`${this.selectEDF}`);
    }
  }

  edfSelectionChange() {
    if (!this.selectEDF.startsWith(EDF_LOC_CONST)) {
      this.selectEDF = EDF_LOC_CONST + this.selectEDF;
    }
  }
}

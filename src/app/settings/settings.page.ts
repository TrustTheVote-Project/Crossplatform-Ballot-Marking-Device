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
    this.selectEDF = this.home.getEDF();
  }

  async closeModal() {
    const close = 'Modal Removed';
    await this.modalController.dismiss(close);

    const filePath = `/assets/data/${this.selectEDF}`;
    if (filePath !== this.home.getEDF()) {
      console.log(this.home.getEDF() + ' does not equal ' + filePath);
      this.home.setEDF(filePath);
    }
  }

  // todo: this doesn't actually do anything - can it be removed?
  myChange() {
    console.log('got to myChange');
    console.log('selected EDF is ' + this.selectEDF);
    if (this.selectEDF !== this.home.getEDF()) {
      //         console.log(this.home.getEDF() + ' does not equal ' + this.selectEDF);
    }
  }
}

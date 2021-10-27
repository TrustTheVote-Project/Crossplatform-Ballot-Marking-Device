import { Component, OnInit, Input } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { HomePage } from '../home/home.page';

@Component({
   selector: 'app-settings',
   templateUrl: './settings.page.html',
   styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
   @Input() public home: HomePage;

   public EDFiles: string[];
   public modal: ModalController;
   public selectEDF: string;

   constructor(public modalController: ModalController) { 

      this.modal = modalController;
   }
   ngOnInit() {
      this.selectEDF = this.home.getEDF();
   }
   async closeModal(index: number) {
      const close: string = "Modal Removed";
      await this.modal.dismiss(close);

      if ('/assets/data/'+this.selectEDF != this.home.getEDF()) {
         console.log(this.home.getEDF() + ' does not equal ' + '/assets/data/'+this.selectEDF);
         this.home.setEDF('/assets/data/'+this.selectEDF);
      }
   }

   /*
   compareWith(curVal: any, newVal: any) {
      console.log('current value is ' + curVal);
      console.log('new value is ' + newVal);


   }
   */

   myChange(evt) {
      console.log('got to myChange');
      console.log('selected EDF is ' + this.selectEDF);
      if (this.selectEDF != this.home.getEDF()) {
//         console.log(this.home.getEDF() + ' does not equal ' + this.selectEDF);

      }

   }
}

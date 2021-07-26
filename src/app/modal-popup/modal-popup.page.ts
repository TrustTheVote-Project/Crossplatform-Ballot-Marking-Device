import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
   selector: 'app-modal-popup',
   templateUrl: './modal-popup.page.html',
   styleUrls: ['./modal-popup.page.scss'],
})

export class ModalPopupPage implements OnInit {

   @Input() title: string;
   @Input() body: string;

   constructor(
      private modalController: ModalController,
   ) { }

   ngOnInit() {
      console.log('inside modal onInit');
   }

   async closeModal() {
      const close: string = "Modal Removed";
      await this.modalController.dismiss(close);
   }

}

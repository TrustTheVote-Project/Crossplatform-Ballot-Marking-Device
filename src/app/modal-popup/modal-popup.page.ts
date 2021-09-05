import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Contest } from '../../classes/Contest';

@Component({
   selector: 'app-modal-popup',
   templateUrl: './modal-popup.page.html',
   styleUrls: ['./modal-popup.page.scss'],
})

export class ModalPopupPage implements OnInit {

   @Input() contest: Contest;

   public modal: ModalController;

   constructor(public modalController: ModalController) {
      this.modal = modalController;
   }

   ngOnInit() {
      console.log('inside modal-popup.page.ts onInit');
   }

   async closeModal() {
      const close = 'one contest Modal Removed';
      await this.modal.dismiss(close);
   }

}

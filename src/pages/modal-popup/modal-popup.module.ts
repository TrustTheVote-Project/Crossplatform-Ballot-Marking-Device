import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPopupPage } from './modal-popup';

@NgModule({
  declarations: [
    ModalPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPopupPage),
  ],
})
export class ModalPopupPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WriteinPopupPageRoutingModule } from './writein-popup-routing.module';

import { WriteinPopupPage } from './writein-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WriteinPopupPageRoutingModule
  ],
  declarations: [WriteinPopupPage]
})
export class WriteinPopupPageModule {}

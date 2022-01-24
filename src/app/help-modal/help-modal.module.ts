import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpModalPageRoutingModule } from './help-modal-routing.module';

import { HelpModalPage } from './help-modal.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HelpModalPageRoutingModule],
  declarations: [HelpModalPage],
})
export class HelpModalPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CastBallotModalPageRoutingModule } from './cast-ballot-modal-routing.module';

import { CastBallotModalPage } from './cast-ballot-modal.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CastBallotModalPageRoutingModule],
  declarations: [CastBallotModalPage],
})
export class CastBallotModalPageModule {}

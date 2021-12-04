import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PresentOneContestPageRoutingModule } from './present-one-contest-routing.module';
import { PresentOneContestPage } from './present-one-contest.page';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'page-present-one-contest',
  templateUrl: 'present-one-contest.page.html',
})
@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, PresentOneContestPageRoutingModule],
  declarations: [PresentOneContestPage],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class PresentOneContestPageModule {}

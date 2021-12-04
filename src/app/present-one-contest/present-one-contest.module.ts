import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Election } from '../../classes/Election';
import { PresentOneContestPageRoutingModule } from './present-one-contest-routing.module';
import { PresentOneContestPage } from './present-one-contest.page';

@Component({
  selector: 'page-present-one-contest',
  templateUrl: 'present-one-contest.page.html',
})
@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, PresentOneContestPageRoutingModule],
  declarations: [PresentOneContestPage],
})
export class PresentOneContestPageModule {}

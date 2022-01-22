import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PresentOneContestPage } from './present-one-contest';

@NgModule({
  declarations: [
    PresentOneContestPage,
  ],
  imports: [
    IonicPageModule.forChild(PresentOneContestPage),
  ],
})
export class PresentOneContestPageModule {}

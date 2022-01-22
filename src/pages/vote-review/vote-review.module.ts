import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoteReviewPage } from './vote-review';

@NgModule({
  declarations: [
    VoteReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(VoteReviewPage),
  ],
})
export class VoteReviewPageModule {}

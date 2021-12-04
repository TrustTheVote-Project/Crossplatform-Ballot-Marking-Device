import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoteReviewPage } from './vote-review.page';

const routes: Routes = [
  {
    path: '',
    component: VoteReviewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoteReviewPageRoutingModule {}

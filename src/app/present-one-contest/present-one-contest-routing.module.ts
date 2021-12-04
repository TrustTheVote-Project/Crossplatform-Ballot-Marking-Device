import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PresentOneContestPage } from './present-one-contest.page';

const routes: Routes = [
  {
    path: '',
    component: PresentOneContestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresentOneContestPageRoutingModule {}

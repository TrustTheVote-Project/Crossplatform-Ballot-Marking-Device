import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CastBallotModalPage } from './cast-ballot-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CastBallotModalPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CastBallotModalPageRoutingModule {}

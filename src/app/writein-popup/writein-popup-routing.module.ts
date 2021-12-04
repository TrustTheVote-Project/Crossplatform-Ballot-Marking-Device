import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WriteinPopupPage } from './writein-popup.page';

const routes: Routes = [
  {
    path: '',
    component: WriteinPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriteinPopupPageRoutingModule {}

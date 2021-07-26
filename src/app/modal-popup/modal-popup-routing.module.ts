import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalPopupPage } from './modal-popup.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalPopupPageRoutingModule {}

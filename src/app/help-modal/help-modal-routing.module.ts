import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpModalPage } from './help-modal.page';

const routes: Routes = [
  {
    path: '',
    component: HelpModalPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpModalPageRoutingModule {}

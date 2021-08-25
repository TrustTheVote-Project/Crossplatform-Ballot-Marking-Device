import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'modal-popup',
    loadChildren: () => import('./modal-popup/modal-popup.module').then( m => m.ModalPopupPageModule)
  },
  {
    path: 'vote-review',
    loadChildren: () => import('./vote-review/vote-review.module').then( m => m.VoteReviewPageModule)
  },
  {
    path: 'present-one-contest',
    loadChildren: () => import('./present-one-contest/present-one-contest.module').then( m => m.PresentOneContestPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

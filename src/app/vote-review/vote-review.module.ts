import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Election } from '../../classes/Election';
import { VoteReviewPageRoutingModule } from './vote-review-routing.module';
import { VoteReviewPage } from './vote-review.page';


@Component({
   selector: 'page-vote-review',
   templateUrl: 'vote-review.page.html',
})


@NgModule({
   imports: [
      CommonModule,
      IonicModule ,
      VoteReviewPageRoutingModule  
   ],
     declarations: [VoteReviewPage]
})

export class VoteReviewPageModule {}

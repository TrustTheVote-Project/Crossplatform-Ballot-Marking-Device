import { Component } from '@angular/core';
import { Election } from '../../classes/Election';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
/*
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
*/
import { VoteReviewPageRoutingModule } from './vote-review-routing.module';
//import { VoteReviewPage } from './vote-review.page';

@NgModule({
  imports: [
    CommonModule,
   // FormsModule,
    IonicModule,
    VoteReviewPageRoutingModule
  ]
  //declarations: [VoteReviewPage]
})
export class VoteReviewPageModule {}





@Component({
  selector: 'page-vote-review',
  templateUrl: 'vote-review.page.html',
})
export class VoteReviewPage {
  election: Election;


  constructor(election: Election) {
     this.election = election ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VoteReviewPage');
  }

  public closeModal(index: number) {
 //   this.viewCtrl.dismiss({ "index": index });
  }

  oneVoteClicked(index: number) {
    console.log("vote-review - got here! You clicked element " + index);
//    this.closeModal(index);
    console.log("vote-review - closed the vote review modal");

    console.log("vote-review - just presented the new modal dialog");
  }

}


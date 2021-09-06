import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Election } from '../../classes/Election';
import { VoteReviewPageRoutingModule } from './vote-review-routing.module';
import { VoteReviewPage } from './vote-review.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@Component({
   selector: 'page-vote-review',
   templateUrl: 'vote-review.page.html',
})

@NgModule({
   imports: [
      CommonModule,
      IonicModule ,
      VoteReviewPageRoutingModule,
      TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
   ],
     declarations: [VoteReviewPage]
})

export class VoteReviewPageModule {}

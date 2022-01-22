import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { VoteReviewPageRoutingModule } from './vote-review-routing.module';
import { VoteReviewPage } from './vote-review.page';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'page-vote-review',
  templateUrl: 'vote-review.page.html',
})
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    VoteReviewPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [VoteReviewPage],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class VoteReviewPageModule {}

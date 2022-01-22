import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Contest } from '../../classes/Contest';
import { HomePage } from '../home/home.page';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'page-present-one-contest',
  templateUrl: 'present-one-contest.page.html',
  styleUrls: ['present-one-contest.page.scss'],
})
export class PresentOneContestPage {
  @Input() public contest: Contest;
  @Input() public home: HomePage;
  @Input() public contestNum: number;

  constructor(public readonly modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
    this.home.voteReviewSpecificContest(this.contestNum);
  }
}

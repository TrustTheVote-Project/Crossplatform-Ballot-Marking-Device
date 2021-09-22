import { ViewChild, Component , OnInit, Input} from '@angular/core';
import { Election } from '../../classes/Election';
import { ModalController, IonContent } from '@ionic/angular';
import { ModalPopupPage } from '../modal-popup/modal-popup.page';
import { PresentOneContestPage } from '../present-one-contest/present-one-contest.page';
import { HomePage } from '../home/home.page';

@Component({
   selector: 'page-vote-review',
   templateUrl: 'vote-review.page.html',
   styleUrls: ['vote-review.page.scss'],
   providers: [Election]
})

export class VoteReviewPage implements OnInit{
   @ViewChild(IonContent, { static: false }) content: IonContent;

   @Input() public election: Election;
   @Input() public home: HomePage;
   @Input() public scrollToContest: number;

   public modal: ModalController;
   public oneVoteModal: ModalController;

   constructor( public modalController: ModalController) {
      this.modal = modalController;
      this.oneVoteModal  = modalController;
      console.log('vote-review.page::ctor - should focus on contest ' + this.scrollToContest);
   }

   ngOnInit() {
      console.log('vote-review::ngOnInit - inside vote review modal onInit');
   }
   ionViewDidEnter() {
      console.log('vote-review.page::ionViewDidEnter - entered');
      if (this.scrollToContest > 0) {
         console.log('vote-review.page::ngAfterViewInit - scrolltocontest is ' + this.scrollToContest);

         this.scrollToContestID(this.scrollToContest);

      }
   }
   ngAfterViewInit() {
      console.log('vote-review.page::ngAfterViewInit - entered');
      if (this.scrollToContest > 0) {
         console.log('vote-review.page::ngAfterViewInit - scrolltocontest is ' + this.scrollToContest);

         this.scrollToContestID(this.scrollToContest);

      }
   }

   ionViewDidLoad() {
      console.log('ionViewDidLoad VoteReviewPage');
   }

   setElection(election: Election) {
      this.election = election;
      console.log('just set the election in vote-review.page.ts');
   }

   async closeModal(index: number) {
      const close: string = "Modal Removed";
      await this.modal.dismiss(close);
   }

   async openIonModal(data: any) {
      console.log('opening the vote review modal');
      const modal = await this.modal.create({
         component: VoteReviewPage ,
         componentProps: {
            election: data.election,
            title: data.title,
            body : data.body
         }
      });
      //console.log('there are ' + data.election.getContestNamesCount() + ' contests');
      console.log('data.title is ' + data.title);
      console.log('did it show up?');
      return await modal.present();
   }

   async oneVoteReview(contestNum: number): Promise<void> {
      console.log('vote-review::oneVoteReview - enter');
      this.closeModal(contestNum);
      let oneContestPopupContent = { contest: this.election.getContestByIndex(contestNum), contestNum,
         home: this.home};

      const oneContestModal = await this.oneVoteModal.create({
         component: PresentOneContestPage,
         componentProps:  oneContestPopupContent
      });

      await oneContestModal.present();
   }

   oneVoteClicked(index: number) {
      console.log("vote-review - got here! You clicked element " + index);
      //      this.closeModal(index);
      console.log("vote-review - closed the vote review modal");

      console.log("vote-review - just presented the new modal dialog");
   }

   scrollToContestID(num) {
      var titleELe = document.getElementById('voteReviewContest#'+num);
      var contestTop = titleELe.getBoundingClientRect().top; 
      console.log('contestTop is ' + contestTop );
      this.content.scrollToPoint(0,contestTop-150, 300);
   }
}
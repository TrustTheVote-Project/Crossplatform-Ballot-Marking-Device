import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PresentOneContestPage } from './present-one-contest.page';

describe('PresentOneContestPage', () => {
  let component: PresentOneContestPage;
  let fixture: ComponentFixture<PresentOneContestPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PresentOneContestPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(PresentOneContestPage);
      component = fixture.componentInstance;
      component.contest = {
        getVotesAllowed: () => {},
      } as any;
      component.home = {} as any;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

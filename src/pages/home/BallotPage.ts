import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Slides } from 'ionic-angular';

import 'rxjs/add/operator/map';

@Component({
    selector: 'page-ballot',
    templateUrl: 'BallotPage.html'
})
export class BallotPage implements OnInit {
    @ViewChild(Slides) slides: Slides;

    private ready: boolean = true;

    constructor(public platform: Platform, public navCtrl: NavController) {
    }

    ngOnInit() {

        this.initializeApp();

    }

    initializeApp() {
        this.ready = true;
    }
}

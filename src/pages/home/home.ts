import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Slides } from 'ionic-angular';
import { Content } from 'ionic-angular';


import 'rxjs/add/operator/map';

import { Election } from "../../classes/Election";
import { BallotPage } from './BallotPage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;

  public xml: string = "";
  public myhttp: Http;
  public electionContestNames: String[];
  private election: Election;
  private ready: boolean = false;

  constructor(public platform: Platform, public navCtrl: NavController,
    public _http: Http) {
    this.myhttp = _http;
  }

  ngOnInit() {

    this.initializeApp();

  }

  initializeApp() {
    this.openXML();
  }

  openXML() {
    console.log("inside openXML");
    this.election = new Election(this.myhttp, '/assets/data/results-06037-2017-03-07.xml');
    //this.election = new Election(this.myhttp, '/assets/data/results-06037-2016-11-08.xml');

    //this.election = new Election(this.myhttp, '/assets/data/LA_County_Reference.xml');

    //    this.election.setReady(true);
  }

  /*
    setElectionNames() {
      //this.electionContestNames = this.election.getContestNames();
      this.electionContestNames = getContestNames();
      this.electionContestNames.forEach(element => {
        console.log("electionContestName: " + element);
      });
    }
    */

  getJSONFromXML() {
    console.log("inside getJSONFromXML");
  }

  getContentFromJSON() {
    console.log("inside getContentFromJSON");
  }
}

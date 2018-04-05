import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Slides } from 'ionic-angular';
import { Content } from 'ionic-angular';


import 'rxjs/add/operator/map';

import { Election } from "../../classes/Election";

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

  constructor(public platform: Platform, public modalCtrl: ModalController, public navCtrl: NavController,
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
    this.election = new Election(this.myhttp, '/assets/data/results-06037-2017-03-07.xml', this);
    //alternate data files... need to be able to select which to use
    //from the device... TO-DO...later
    //this.election = new Election(this.myhttp, '/assets/data/results-06037-2016-11-08.xml');
    //this.election = new Election(this.myhttp, '/assets/data/LA_County_Reference.xml');
  }

  getJSONFromXML() {
    console.log("inside getJSONFromXML");
  }

  getContentFromJSON() {
    console.log("inside getContentFromJSON");
  }

  public getModalController(): ModalController {
    return (this.modalCtrl);
  }
}

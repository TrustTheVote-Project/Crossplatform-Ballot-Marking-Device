import { OnInit, Component } from '@angular/core';
import { Election } from '../../classes/Election';
import { HttpClient } from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';

imports: [
  HttpClient,
  HttpClientModule
];

declare const require;
const xml2js = require('xml2js');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public xml = '';
  myhttp: HttpClient;
  public electionContestNames: string[];
  private election: Election;

  constructor(private http: HttpClient) {
      this.myhttp = http;
  }

 ngOnInit() {

    this.initializeApp();

  }

  initializeApp() {
    this.openXML();
  }

  openXML() {
    console.log('inside openXML');
    this.election = new Election(this.myhttp, '/assets/data/results-06037-2017-03-07.xml', this);
    //this.election = new Election(this.myhttp, '/assets/data/LA_County_Reference.xml',this);
    //alternate data files... need to be able to select which to use
    //from the device... TO-DO...later
    //this.election = new Election(this.myhttp, '/assets/data/results-06037-2016-11-08.xml');
  }

  getJSONFromXML() {
    console.log('inside getJSONFromXML');
  }

  getContentFromJSON() {
    console.log('inside getContentFromJSON');
  }
}

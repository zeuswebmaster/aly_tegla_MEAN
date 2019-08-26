import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

import * as config from '../../assets/config';

declare var $:any;

@Component({
  selector: 'app-authpages',
  templateUrl: './authpages.component.html',
  styleUrls: ['./authpages.component.css'],
  providers: [AuthenticationService]
})
export class AuthpagesComponent implements OnInit, OnDestroy {

  constructor(public auth: AuthenticationService,private renderer: Renderer2) {

  }
  ngOnInit() {


  }

  ngOnDestroy() {

  }

}


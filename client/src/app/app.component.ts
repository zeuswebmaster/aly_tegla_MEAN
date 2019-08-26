import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthenticationService]
})
export class AppComponent {
	public href: string = "";
  constructor(public auth: AuthenticationService, public router: Router) {

  }

  ngOnInit() {
        console.log("Inside app component ts");
		this.href = this.router.url;
        console.log(this.router.url);
    }
}

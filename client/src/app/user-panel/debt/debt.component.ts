import { Component, OnInit,HostBinding,HostListener,ChangeDetectorRef } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import * as Highcharts from 'highcharts';
import { DebtsService } from '../../services/debts.service';

var url = '';
declare var $: any;
declare var noUiSlider: any;
declare var jQuery: any;
declare var swal: any;
declare var Plaid: any;

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.css'],
  providers: [DebtsService]
})


export class DebtComponent implements OnInit {

	fetchAccounts;
	creditData;
	studentData;
	mortgageData;
	autoData;
	otherData;
	creditSum = 0;
	studentSum = 0;
	mortgageSum = 0;
	autoSum =0;
	otherSum = 0;
	totalDebtSum = 0;
	addCommasFormat;
	scrollView;
	questionView;
	suggestionView;

  constructor(private sanitizer: DomSanitizer, private debtService : DebtsService, private changeDetector: ChangeDetectorRef,platformLocation: PlatformLocation) {
	url = (platformLocation as any).location.href;
  }

  ngOnInit() {

	var selfObj = this;

	//Loader html
	// var html = '<div id="load" style="display:none;"><img width="64" height="64" src="assets/images/loaders/loader.gif"/></div>';

    //Loading the base js file for spending
    $(document).ready(function () {
      var custId = localStorage.getItem('customerId');
      (function($) {
          var handler = Plaid.create({
          clientName: 'Plaid Integration',
          env: 'development',
          //env: 'sandbox',
          key: '2e793d8d52d0d0013c12edf1b94dec',
          product: ['transactions','assets'],
          // Optional – use webhooks to get transaction and error updates
          webhook: 'https://requestb.in',
          onLoad: function() {
            // Optional, called when Link loads
          },
          onSuccess: function(public_token, metadata) {
            // Send the public_token to your app server.
            // The metadata object contains info about the institution the
            // user selected and the account ID or IDs, if the
            // Select Account view is enabled.
            /* $.post('http://localhost:3000/get_access_token', { */
          /*  $.post('http://chunkmoney:3000/get_access_token', { */
            /* public_token: public_token, */
            /* }); */

            //$.get("http://localhost:7000/get_access_token?public_token="+public_token+"&customer_id="+customer_id, function(data, status){
            $.get("https://chunkmoney.com:3000/get_access_token?public_token="+public_token+"&customer_id="+custId, function(data, status){
              alert("Account Added successfully..");
              window.location.href="";
            });
          },
          onExit: function(err, metadata) {
            // The user exited the Link flow.
            if (err != null) {
            // The user encountered a Plaid API error prior to exiting.
            }
            // metadata contains information about the institution
            // that the user selected and the most recent API request IDs.
            // Storing this information can be helpful for support.
          },
          onEvent: function(eventName, metadata) {
            // Optionally capture Link flow events, streamed through
          }
          });

          $('.link-button').on('click', function(e) {
          handler.open();
          });
      })(jQuery);

      $('.router-container').show();
      $.getScript(url+"/../assets/js/debt.js", function (w) { });

		selfObj.fetchAccounts();
    });


	/** Fetching accounts **/
	this.fetchAccounts = function(){

		//Service call
		 this.debtService.getAccounts(localStorage.getItem('customerId'))
		  .subscribe( data =>{

			  // console.log("[debt.component.ts:343] Account data: "+JSON.stringify(data));

			  var accData = data;
			  this.creditData = [];
			  this.studentData = [];
			  this.mortgageData = [];
			  this.autoData = [];
			  this.otherData = [];
			  this.creditSum = 0;
			  this.studentSum = 0;
			  this.mortgageSum = 0;
			  this.autoSum = 0;
			  this.otherSum = 0;
			  this.totalDebtSum = 0;

			  for(var a=0; a< accData.length; a++){
				  accData[a].balance = parseFloat(accData[a].balance);
				  if(accData[a].ac_type == 'credit'){
					  accData[a].bank_logo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ accData[a].bank_logo);
					  this.creditData.push(accData[a]);
					  this.creditSum += (accData[a].balance);
				  }
				  else if(accData[a].ac_type == 'loan' && (accData[a].ac_sub_type == 'student')){
					  accData[a].bank_logo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ accData[a].bank_logo);
					  this.studentData.push(accData[a]);
					  this.studentSum += (accData[a].balance);
				  }
				  else if(accData[a].ac_type == 'loan' && (accData[a].ac_sub_type == 'mortgage' || accData[a].ac_sub_type == 'home' || accData[a].ac_sub_type == 'home equity')){
					  accData[a].bank_logo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ accData[a].bank_logo);
					  this.mortgageData.push(accData[a]);
					  this.mortgageSum += (accData[a].balance);
				  }
				  else if(accData[a].ac_type == 'loan' && (accData[a].ac_sub_type == 'auto' )){
					  accData[a].bank_logo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ accData[a].bank_logo);
					  this.autoData.push(accData[a]);
					  this.autoSum += (accData[a].balance);
				  }
				  else if(accData[a].ac_type == 'loan' && (accData[a].ac_sub_type == 'commercial' || accData[a].ac_sub_type == 'construction' || accData[a].ac_sub_type == 'consumer' || accData[a].ac_sub_type == 'loan' || accData[a].ac_sub_type == 'overdraft' || accData[a].ac_sub_type == 'line of credit')){
					  accData[a].bank_logo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ accData[a].bank_logo);
					  this.otherData.push(accData[a]);
					  this.otherSum += (accData[a].balance);
				  }
			  }

			  this.totalDebtSum = this.creditSum+this.studentSum+this.mortgageSum+this.autoSum+this.otherSum;
			  this.changeDetector.detectChanges();


		  });

	}


	this.addCommasFormat = function(nStr){
		  nStr += '';
		  var x = nStr.split('.');

		  var x1 = x[0];
		  var x2 = x.length > 1 ? '.' + x[1] : '';
		  var rgx = /(\d+)(\d{3})/;
		  while (rgx.test(x1)) {
			  x1 = x1.replace(rgx, '$1' + ',' + '$2');
		  }
		  return x1 + "<sup>"+x2+"</sup>";
	}

  }



}



//Function to add commas
function addCommas1(nStr) {
  nStr += '';
  var x = nStr.split('.');

  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}


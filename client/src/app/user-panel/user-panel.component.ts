import { Component, OnInit, OnDestroy, Renderer2,ChangeDetectorRef } from '@angular/core';
import { TransactionsService } from '../services/transactions.service';
import { AuthenticationService } from '../services/authentication.service';
import { Injectable } from '@angular/core';
import { DebtsService } from '../services/debts.service';


import * as config from '../../assets/config';

declare var $:any;
declare var swal: any;
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'],
  providers: [TransactionsService,AuthenticationService,DebtsService]
})

@Injectable({
  providedIn: 'root'
})
export class UserPanelComponent implements OnInit, OnDestroy {

	rootUrl = "#";
	//addBanksUrl;
	//syncTransactions;
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
	totalDebtSum1 = 0;
	addCommasFormat;
  ddltransCategory;
  closeSecondPopUp;
  constructor(public auth: AuthenticationService,private renderer: Renderer2, private transactionsService : TransactionsService, private debtService : DebtsService, private changeDetector: ChangeDetectorRef) {

   }
  ngOnInit() {
	// console.log("User Panel: Logged in User Id="+JSON.stringify(this.auth.getUserDetails()));

	var selfObj = this;
    //Get user id here or by login page
  localStorage.setItem('customerId', this.auth.getUserDetails()._id);

this.closeSecondPopUp = function(){
  //   var scrollPosition = $('#single_transaction_pop').attr('scrollPosition');
  //   setTimeout(function(){
  //       $("html").scrollTop(scrollPosition);
  //   },300);
  $('#modal_single_transaction').modal('hide');
  $('.modal-backdrop.show:eq(1)').remove();
  $('body').removeClass('dimmable');
  $('body').removeClass('scrolling');
}
	/** Fetching accounts **/

  this.ddltransCategory = function(category){
			$('#transactionCat.droptext').text(category);
      var transId = $('#modal_single_transaction #poptransactionId').val();
      var newCat = encodeURIComponent(category);
      this.transactionsService.changeTransactionCategory(localStorage.getItem('customerId'),transId,newCat)
		  .subscribe( data =>{
         swal({
            title: 'Success!',
            text: 'Category has been changed successfully.',
            icon: 'success',
            button: {
              text: "OK",
              value: true,
              visible: true,
              className: "btn btn-primary"
            }
            }).then(okay => {
				if (okay) {
					window.location.reload();
				}

			}
          );
      });
  }
	this.fetchAccounts = function(){

		//Service call
		 this.debtService.getAccounts(localStorage.getItem('customerId'))
		  .subscribe( data =>{

			  // console.log("[user-panel.component.ts:84] Account data: "+JSON.stringify(data));

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
					  this.creditSum += (accData[a].balance);
				  }
				  else if(accData[a].ac_type == 'loan' && (accData[a].ac_sub_type == 'student')){
					 this.studentSum += (accData[a].balance);
				  }
				  else if(accData[a].ac_type == 'loan' && (accData[a].ac_sub_type == 'mortgage' || accData[a].ac_sub_type == 'home' || accData[a].ac_sub_type == 'home equity')){
					  this.mortgageSum += (accData[a].balance);
				  }
				  else if(accData[a].ac_type == 'loan' && (accData[a].ac_sub_type == 'auto' )){
					  this.autoSum += (accData[a].balance);
				  }
				  else if(accData[a].ac_type == 'loan' && (accData[a].ac_sub_type == 'commercial' || accData[a].ac_sub_type == 'construction' || accData[a].ac_sub_type == 'consumer' || accData[a].ac_sub_type == 'loan' || accData[a].ac_sub_type == 'overdraft' || accData[a].ac_sub_type == 'line of credit')){
					   this.otherSum += (accData[a].balance);
				  }
			  }
				//debugger;
			  this.totalDebtSum1 = addCommas1((this.creditSum+this.studentSum+this.mortgageSum+this.autoSum+this.otherSum).toFixed(2));

			 this.changeDetector.detectChanges();


		  });

	}
	this.fetchAccounts();

  }
  ngOnDestroy() {
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

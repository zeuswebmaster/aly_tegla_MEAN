import { Component, OnInit, ChangeDetectorRef,ElementRef } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../schema/transaction';
import { AccountsService } from '../../services/accounts.service';
import { Account } from '../../schema/account';
import * as moment from 'moment';

var url = '';
declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var Plaid: any;

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  providers: [TransactionsService,AccountsService]
})
export class AccountsComponent implements OnInit {

accountsData;
collapseDiv;
deleteAccountProcess;

  constructor(platformLocation: PlatformLocation, private transactionsService : TransactionsService, private accountsService : AccountsService, private changeDetector: ChangeDetectorRef,private elRef:ElementRef) {
	  url = (platformLocation as any).location.href;
	 }

  ngOnInit() {
	let selfObj = this;
	var custId = localStorage.getItem('customerId');
	  //JS part
	$(document).ready(function () {
		debugger;
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
					alert("Account Added successfully. Please sync to see updated data.");
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
		 debugger;

		$.getScript(url+"/../assets/js/accounts.js", function (w) { });
		$('#ccTbl, #caTbl, #loanTbl, #invTbl, #othTbl').dataTable({
			destroy: true,
			paging: false,
			"ordering": false,
			"language": {
					  "emptyTable": "Loading...",
					  "infoEmpty": "No  items to show",
					  "search": "",
					  "searchPlaceholder": "Find a Transaction"
					},
			"dom": 't'
		});
		 $(document).on('click', '.deleteAccBtn', function(e) {
			  debugger;
			var dataId = $(this).data('id');
			selfObj.deleteAccountProcess(dataId);

		  });

	});//Document ready JS ends here

	//Collpaseing div code
	this.collapseDiv = function(elemId,currElem){
		debugger;
		if($('#'+elemId).hasClass('hidden')){
			$('#'+elemId).removeClass("hidden");
			$('#'+elemId).slideDown();
			$('.'+currElem).removeClass('fa-chevron-circle-right');
			$('.'+currElem).addClass('fa-chevron-circle-down');
		}else{
			$('#'+elemId).addClass("hidden");
			$('#'+elemId).slideUp();
			$('.'+currElem).removeClass('fa-chevron-circle-down');
			$('.'+currElem).addClass('fa-chevron-circle-right');
		}
	}


	//Fetching Categorized accounts
	this.accountsService.getAccounts(localStorage.getItem('customerId'))
	.subscribe( (data: any[]) =>{

		var ccData = [];
		var caData = [];
		var loanData = [];
		var invData = [];
		var othData = [];

		for(var i=0; i<data.length; i++){
			if(data[i].ac_sub_type == "credit card"){
				ccData.push(data[i]);
			}
			else if(data[i].ac_sub_type == "checking"){
				caData.push(data[i]);
			}
			else if(data[i].ac_sub_type == "loan"){
				loanData.push(data[i]);
			}
			else if(data[i].ac_sub_type == "investment"){
				invData.push(data[i]);
			}
			else {
				othData.push(data[i]);
			}
		}
		// debugger;

		$('#ccTbl').dataTable({
			data: ccData,
			destroy: true,
		   "columns": [
						{  "data"   :  function (data, type, dataToSet) {
							return  '<img src="data:image/jpg;base64,'+data.bank_logo+'" class="mr-3" /><span>'+data.institution_id+'</span>';
						}  },
						{  "data"   :  function (data, type, dataToSet) {
							return data.official_name + " - " + data.ac_number;
						}},
						{  "data"   :  function (data, type, dataToSet) {
							// debugger;
							return "$"+addCommasFormat(parseFloat(data.balance).toFixed(2));
						}},
						{  "data"   :  function (data, type, dataToSet) {
							// debugger;
							return "<i class='fa fa-trash cursor-pointer deleteAccBtn' data-id='"+data.ac_id+"'></i>";
						}}
					],
			paging: false,
			"ordering": false,
			"language": {
					  "emptyTable": "No credit card accounts added yet",
					  "infoEmpty": "No  items to show",
					  "search": "",
					  "searchPlaceholder": "Find an account"
					},
			"dom": 't',
			 fnInitComplete : function(e) {
				debugger;
				  if ($(this).find('tbody tr td').length<=1) {
					// debugger;
					$(this).find('thead').hide();
          $(this).parent().parent().css('overflow-x','hidden');
				  }


			   }
		});
		$('#caTbl').dataTable({
			data: caData,
			destroy: true,
		   "columns": [
						{  "data"   :  function (data, type, dataToSet) {
							return  '<img src="data:image/jpg;base64,'+data.bank_logo+'" class="mr-3" /><span>'+data.institution_id+'</span>';
						}  },
						{  "data"   :  function (data, type, dataToSet) {
							return data.official_name + " - " + data.ac_number;
						}},
						{  "data"   :  function (data, type, dataToSet) {
							return "$"+addCommasFormat(parseFloat(data.balance).toFixed(2));
						}},
						{  "data"   :  function (data, type, dataToSet) {
							// debugger;
							return "<i class='fa fa-trash cursor-pointer deleteAccBtn' data-id='"+data.ac_id+"'></i>";
						}}
					],
			paging: false,
			"ordering": false,
			"language": {
					  "emptyTable": "No checking accounts added yet",
					  "infoEmpty": "No  items to show",
					  "search": "",
					  "searchPlaceholder": "Find an account"
					},
			"dom": 't',
			 fnInitComplete : function() {
				  if ($(this).find('tbody tr td').length<=1) {
            // debugger;
            $(this).find('thead').hide();
            $(this).parent().parent().css('overflow-x','hidden');
				  }
			   }
		});
		$('#loanTbl').dataTable({
			data: loanData,
			destroy: true,
		   "columns": [
						{  "data"   :  function (data, type, dataToSet) {
							return  '<img src="data:image/jpg;base64,'+data.bank_logo+'" class="mr-3" /><span>'+data.institution_id+'</span>';
						}  },
						{  "data"   :  function (data, type, dataToSet) {
							return data.official_name + " - " + data.ac_number;
						}},
						{  "data"   :  function (data, type, dataToSet) {
							return "$"+addCommasFormat(parseFloat(data.balance).toFixed(2));
						}},
						{  "data"   :  function (data, type, dataToSet) {
							// debugger;
							return "<i class='fa fa-trash cursor-pointer deleteAccBtn' data-id='"+data.ac_id+"'></i>";
						}}
					],
			paging: false,
			"ordering": false,
			"language": {
					  "emptyTable": "No loan accounts added yet",
					  "infoEmpty": "No  items to show",
					  "search": "",
					  "searchPlaceholder": "Find an account"
					},
			"dom": 't',
			 fnInitComplete : function() {
				  if ($(this).find('tbody tr td').length<=1) {
					// debugger;
					$(this).find('thead').hide();
          $(this).parent().parent().css('overflow-x','hidden');
				  }
			   }
		});
		$('#invTbl').dataTable({
			data: invData,
			destroy: true,
		   "columns": [
						{  "data"   :  function (data, type, dataToSet) {
							return  '<img src="data:image/jpg;base64,'+data.bank_logo+'" class="mr-3" /><span>'+data.institution_id+'</span>';
						}  },
						{  "data"   :  function (data, type, dataToSet) {
							return data.official_name + " - " + data.ac_number;
						}},
						{  "data"   :  function (data, type, dataToSet) {
							return "$"+addCommasFormat(parseFloat(data.balance).toFixed(2));
						}},
						{  "data"   :  function (data, type, dataToSet) {
							// debugger;
							return "<i class='fa fa-trash cursor-pointer deleteAccBtn' data-id='"+data.ac_id+"'></i>";
						}}
					],
			paging: false,
			"ordering": false,
			"language": {
					  "emptyTable": "No investment accounts added yet",
					  "infoEmpty": "No  items to show",
					  "search": "",
					  "searchPlaceholder": "Find an account"
					},
			"dom": 't',
			 fnInitComplete : function() {
				  if ($(this).find('tbody tr td').length<=1) {
					// debugger;
					$(this).find('thead').hide();
          $(this).parent().parent().css('overflow-x','hidden');
				  }
			   }
		});
		$('#othTbl').dataTable({
			data: othData,
			destroy: true,
		   "columns":[
						{  "data"   :  function (data, type, dataToSet) {
							return  '<img src="data:image/jpg;base64,'+data.bank_logo+'" class="mr-3" /><span>'+data.institution_id+'</span>';
						}  },
						{  "data"   :  function (data, type, dataToSet) {
							return data.official_name + " - " + data.ac_number;
						}},
						{  "data"   :  function (data, type, dataToSet) {
							return "$"+addCommasFormat(parseFloat(data.balance).toFixed(2));
						}},
						{  "data"   :  function (data, type, dataToSet) {
							// debugger;
							return "<i class='fa fa-trash cursor-pointer deleteAccBtn' data-id='"+data.ac_id+"'></i>";
						}}
					],
			paging: false,
			"ordering": false,
			"language": {
					  "emptyTable": "No other accounts",
					  "infoEmpty": "No  items to show",
					  "search": "",
					  "searchPlaceholder": "Find an account"
					},
			"dom": 't',
			 fnInitComplete : function() {
				  if ($(this).find('tbody tr td').length<=1) {
					// debugger;
					$(this).find('thead').hide();
          $(this).parent().parent().css('overflow-x','hidden');
				  }
			   }
		});
	// this.changeDetector.detectChanges();
	});
	this.deleteAccountProcess = function(id){
		 swal({
			title: 'Are you sure you want to delete this account?',
			text: "All associated data will be removed from your dashboard.",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3f51b5',
			cancelButtonColor: '#ff4081',
			confirmButtonText: 'Great ',
			buttons: {
			  cancel: {
				text: "Cancel",
				value: null,
				visible: true,
				className: "btn btn-danger",
				closeModal: true,
			  },
			  confirm: {
				text: "OK",
				value: true,
				visible: true,
				className: "btn btn-primary",
				closeModal: true
			  }
			}
		  }).then(okay => {
			  if (okay) {
				selfObj.accountsService.deleteAccount(localStorage.getItem('customerId'),id)
				.subscribe( data =>{
          data = JSON.parse(JSON.stringify(data));

					 if(data['success']){
						 swal({
							title: 'Success!',
							text: 'Account has been deleted',
							icon: 'success',
							button: {
							  text: "OK",
							  value: true,
							  visible: true,
							  className: "btn btn-primary"
							}
						  }).then(
						  function(){
							  window.location.reload();
						  }
						  );

					 }else{
						 swal({
							title: 'Error!',
							text: 'Some error occured. Please try again.',
							icon: 'error',
							button: {
							  text: "OK",
							  value: true,
							  visible: true,
							  className: "btn btn-primary"
							}
						  }).then(
						  function(){
							  window.location.reload();
						  }
						  );
					 }
				});
		  }});
	}



  }


}






	function addCommasFormat(nStr) {
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






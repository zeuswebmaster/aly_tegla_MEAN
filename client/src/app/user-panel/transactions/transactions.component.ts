// <reference path="../../../../node_modules/ng2-nouislider/src/ng2-nouislider.d.ts" />

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../schema/transaction';
import { AccountsService } from '../../services/accounts.service';
import { Account } from '../../schema/account';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';

var url = '';

declare var $: any;
declare var noUiSlider: any;


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  providers: [TransactionsService,AccountsService]
})


export class TransactionsComponent implements OnInit {

fetchTransactions;
accountsData;
merchantData;
categoryData;
singleTransactionLoad;

	constructor(platformLocation: PlatformLocation, private transactionsService : TransactionsService, private accountsService : AccountsService, private changeDetector: ChangeDetectorRef) { url = (platformLocation as any).location.href;   }

	ngOnInit() {

		//Loader html
		var html = '<div id="load"><img width="64" height="64" src="assets/images/loaders/loader.gif"/></div>';

    let selfObj = this;
		$(document).ready(function () {
			$('.router-container').show();
			$.getScript(url+"/../assets/js/transactions.js", function (w) { });


			if($('#search_checkin, #search_checkout').length){
				// check if element is available to bind ITS ONLY ON HOMEPAGE
				var currentDate = moment().format("DD-MM-YYYY");

				$('#search_checkin, #search_checkout').daterangepicker({
					singleMonth: true,
					locale: {
						  format: 'MM-DD-YYYY'
					},
					// "alwaysShowCalendars": true,
					autoApply: true,
					autoUpdateInput: false
					,
					linkedCalendars: false
				}, function(start, end, label) {
				  // console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
				  // Lets update the fields manually this event fires on selection of range

				  var selectedStartDate = start.format('MM-DD-YYYY'); // selected start
				  var selectedEndDate = end.format('MM-DD-YYYY'); // selected end

				  var checkinInput = $('#search_checkin');
				  var checkoutInput = $('#search_checkout');

				  // Updating Fields with selected dates
				  checkinInput.val(selectedStartDate);
				  checkoutInput.val(selectedEndDate);

				  // Setting the Selection of dates on calender on CHECKOUT FIELD (To get this it must be binded by Ids not Calss)
				  var checkOutPicker = checkoutInput.data('daterangepicker');
				  checkOutPicker.setStartDate(selectedStartDate);
				  checkOutPicker.setEndDate(selectedEndDate);

				  // Setting the Selection of dates on calender on CHECKIN FIELD (To get this it must be binded by Ids not Calss)
				  var checkInPicker = checkinInput.data('daterangepicker');
				  checkInPicker.setStartDate(selectedStartDate);
				  checkInPicker.setEndDate(selectedEndDate);

				  $('#search_checkin').parent().find('.active').removeClass('selected');
				  $('#search_checkin').parent().find('.active').removeClass('active');

				  var searchFromDate = $('#search_checkin').val();
				  var searchToDate = $('#search_checkout').val();

					searchFromDate = new Date(searchFromDate+" 00:00:00").getTime();
					searchToDate = new Date(searchToDate+" 23:59:00").getTime();

					$('#fromDateTS').val(searchFromDate);
					$('#toDateTS').val(searchToDate);

					var transactionMainTbl = $('#transactionMainTbl').DataTable();
					transactionMainTbl.draw();

				});

			} // End Daterange Picker

			var singleTransMarginTop = (($(window).height()-485)/2)+'px !important';
			$('#modal_single_transaction .modal-dialog').attr('style','margin-top:'+singleTransMarginTop);

		});


    		//Function to load single transaction details pop up
		this.singleTransactionLoad = function(transId){
			this.transactionsService.getSingleTransaction(localStorage.getItem('customerId'), transId)
				.subscribe( transData =>{
			if(transData){
				transData = transData[0];
				var amount = "$"+ addCommasFormat(parseFloat(transData.amount).toFixed(2));
				var merchant = transData.normalized_payee_name;
				var institution_id = transData.accounts[0]['institution_id'];
				var bank_name = (transData.accounts[0]['official_name']) + " ("+transData.accounts[0]['ac_number']+")";
				var posted_date = moment(parseInt(transData.posted_date)).format("MM/DD/YYYY");
				var poptransactionId = transData.trans_id;
				$('#modal_single_transaction .right .amount').html(amount);
				$('#modal_single_transaction .right .merchant').html(merchant);
				$('#modal_single_transaction .right .institution_id').html(institution_id);
				$('#modal_single_transaction .right .bank_name').html(bank_name);
				$('#modal_single_transaction .right .posted_date').html(posted_date);
				$('#modal_single_transaction #poptransactionId').val(poptransactionId);
				$('#transactionCat').text(transData.categories[0].our_category);
				//   $('#single_transaction_pop').trigger('click');
				var scrollPosition = $(window).scrollTop();
				$('#single_transaction_pop').attr('scrollPosition',scrollPosition);
				//   $($('.modal-backdrop.show')[$('.modal-backdrop.show').length-1]).show();
				//   $($('.modal-backdrop.show')[$('.modal-backdrop.show').length-1]).css('z-index',1050);
				$('#modal_single_transaction').css('z-index',1052);
				$('#modal_single_transaction').modal('setting', 'closable', false).modal('show');
			}
			});
		}
		//Fetching Merchants to add in Filter
		this.transactionsService.getAllMerchants(localStorage.getItem('customerId'))
		.subscribe( (data: any[]) =>{

			this.accountsData = data;
			var html = "";

			for(var i=0; i<data.length;i++){
				html += '<div class="item" id="filter2'+i+'">'+data[i]+'</div>';
			}

			$('#merchantList').append(html);


			$('#filter2 .item').on('click',function(){
				event.stopPropagation();
				var filterElems = $('#filter2').find('a');
				var itemText = $(this).text();
				var itemId = $(this).attr('id');

				$('.mulFilters2').append('<a class="ui label transition visible not-upper mb-1" data-value="'+itemId+'"style="display: block !important; text-transform: capitalize;float: left;font-size:11px;color: #777;;">'+itemText+'<i class="delete icon"></i></a>');


				$('#filter2 .icon.filter').attr('style','color: #63c0fd');
				// $('#filter2 .notify-icon').addClass('notify-badge');

				$('#filter2 .delete.icon').unbind().bind('click',function(){


					var activeMerchants = $('#activeMerchants').val().split(",");
					activeMerchants.splice( $.inArray($(this).parent().text().trim(), activeMerchants), 1 );
					$('#activeMerchants').val(activeMerchants.join(','));
					if(!activeMerchants.length){
						$('#filter2 .icon.filter').attr('style','');
					}

					var item = $(this).parent().data('value');
					$(this).parent().parent().parent().find('#'+item).removeClass('filtered');
					$(this).parent().parent().parent().find('#'+item).removeClass('active');
					// $(this).parent().parent().parent().parent().find('input[name="filters"]').val("");
					// $(this).parent().parent().parent().find('.item.filtered');
					var values = $(this).parent().parent().parent().parent().find('input[name="filters"]').val().split(',');
					var index = values.indexOf(item);
					if(index >= 0) {
						values.splice(index, 1);
					}
					$(this).parent().parent().parent().parent().find('input[name="filters"]').val(values.join(','));
					$(this).parent().remove();

					var transTbl = $('#transactionMainTbl').DataTable();
					transTbl.draw();

				});

			});

			$('#filter2 i').on('click',function(event){
				// event.stopPropagation();
				if($('#filter2').hasClass('opened')){
					$('#filter2').removeClass('opened');
					$('#filter2').removeClass('active');
					$('#filter2 .menu').attr('style','display: none !important');
					event.stopPropagation();
				}else{
					$('#filter2').addClass('opened');
					$('#filter2 .menu').attr('style','display: block !important');
				}
			});
			$('.transactionHtml:not(#filter2)').on('click',function(){


				$('#filter2').removeClass('opened');
				$('#filter2').removeClass('active');
				$('#filter2 .menu').attr('style','display: none !important');
				event.stopPropagation();
			});

			//Filter event merchant
			$('#filter2 .item').on('click', function(e){

				if($('#activeMerchants').val()!=""){
					$('#activeMerchants').val($('#activeMerchants').val().trim()+','+$(this).text().trim());
				}else{
					$('#activeMerchants').val($(this).text().trim());
				}
				var transTbl = $('#transactionMainTbl').DataTable();
				transTbl.draw();
			});



			this.changeDetector.detectChanges();
		})


		//Fetching Accounts list to add in Filter
		this.accountsService.getAccounts(localStorage.getItem('customerId'))
		.subscribe( (data: any[]) =>{

			this.merchantData = data;
			var html = "";

			var tempAccArr = [];
			for(var j=0; j<data.length; j++){
				if(tempAccArr.indexOf(data[j].institution_id)==-1){
					html += '<div class="item" id="'+data[j].ac_id+'">'+data[j].institution_id+'</div>';
					tempAccArr.push(data[j].institution_id);
				}
			}

			$('#accountsList').append(html);

			$('#filter3 .item').on('click',function(){

				var filterElems = $('#filter3').find('a');
				var itemText = $(this).text();
				var itemId = $(this).attr('id');

				$('.mulFilters3').append('<a class="ui label transition visible not-upper mb-1" data-value="'+itemId+'"style="display: block !important; text-transform: capitalize;float: left; font-size: 11px;color: #777;">'+itemText+'<i class="delete icon"></i></a>');
				$('#filter3 .icon.filter').attr('style',"color: #63c0fd");

				$('#filter3 .delete.icon').unbind().bind('click',function(){



					var activeAccounts = $('#activeAccounts').val().split(",");
					activeAccounts.splice( $.inArray($(this).parent().text().trim(), activeAccounts), 1 );
					$('#activeAccounts').val(activeAccounts.join(','));

					if(!activeAccounts.length){
						$('#filter3 .icon.filter').attr('style','');
					}

					var item = $(this).parent().data('value');
					$(this).parent().parent().parent().find('#'+item).removeClass('filtered');
					$(this).parent().parent().parent().find('#'+item).removeClass('active');
					var values = $(this).parent().parent().parent().parent().find('input[name="filters"]').val().split(',');
					var index = values.indexOf(item);
					if(index >= 0) {
						values.splice(index, 1);
					}
					$(this).parent().parent().parent().parent().find('input[name="filters"]').val(values.join(','));
					$(this).parent().remove();

					var transTbl = $('#transactionMainTbl').DataTable();
					transTbl.draw();

				});

			});

			$('#filter3 i').on('click',function(event){
				if($('#filter3').hasClass('opened')){
					$('#filter3').removeClass('opened');
					$('#filter3').removeClass('active');
					$('#filter3 .menu').attr('style','display: none !important');
					event.stopPropagation();
				}else{
					$('#filter3').addClass('opened');
					$('#filter3 .menu').attr('style','display: block !important');
				}
			});
			$('.transactionHtml:not(#filter3)').on('click',function(){


				$('#filter3').removeClass('opened');
				$('#filter3').removeClass('active');
				$('#filter3 .menu').attr('style','display: none !important');
				// event.stopPropagation();
			});

			//Filter event account
			$('#filter3 .item').on('click', function(e){



				if($('#activeAccounts').val()!=""){
					$('#activeAccounts').val($('#activeAccounts').val().trim()+','+$(this).text().trim());
				}else{
					$('#activeAccounts').val($(this).text().trim());
				}
				var transTbl = $('#transactionMainTbl').DataTable();
				transTbl.draw();
			});

			this.changeDetector.detectChanges();
		});

		//Fetching Accounts list to add in Filter
		this.accountsService.getAccounts(localStorage.getItem('customerId'))
		.subscribe( (data: any[]) =>{

			data.sort();

			var html = "";
			var tempAccArr = [];
			for(var j=0; j<data.length; j++){
				if(tempAccArr.indexOf(data[j].ac_name)==-1){
					html += '<div class="item" data-value="'+data[j].ac_name+'" id="'+data[j].ac_id+'">'+data[j].ac_name+'</div>';
					tempAccArr.push(data[j].ac_name);
				}
			}

			$('#categoryList').append(html);

			$('#filter5 .item').on('click',function(){

				var filterElems = $('#filter5').find('a');
				var itemText = $(this).data('value');

				$('.mulFilters5').append('<a class="ui label transition visible not-upper mb-1" data-value="'+itemText+'"style="display: block !important; text-transform: capitalize;float: left; font-size: 11px;color: #777;">'+itemText+'<i class="delete icon"></i></a>');
				$('#filter5 .icon.filter').attr('style','color:#63c0fd');


				$('#filter5 .delete.icon').unbind().bind('click',function(){


							var activeCategories = $('#activeCategories').val().split(",");
							activeCategories.splice( $.inArray($(this).parent().text().trim(), activeCategories), 1 );
							$('#activeCategories').val(activeCategories.join(','));

							if(!activeCategories.length){
								$('#filter5 .icon.filter').attr('style','');
							}

							var item = $(this).parent().data('value');
							$(this).parent().parent().parent().find('.item[data-value="'+item+'"]').removeClass('filtered');
							$(this).parent().parent().parent().find('.item[data-value="'+item+'"]').removeClass('active');
							// $(this).parent().parent().parent().parent().find('input[name="filters"]').val("");
							// $(this).parent().parent().parent().find('.item.filtered');
							var values = $(this).parent().parent().parent().parent().find('input[name="filters"]').val().split(',');
							var index = values.indexOf(item);
							if(index >= 0) {
								values.splice(index, 1);
							}
							$(this).parent().parent().parent().parent().find('input[name="filters"]').val(values.join(','));
							$(this).parent().remove();

							var transTbl = $('#transactionMainTbl').DataTable();
							transTbl.draw();

						});

					});

					$('#filter5 i').on('click',function(event){
						if($('#filter5').hasClass('opened')){
							$('#filter5').removeClass('opened');
							$('#filter5').removeClass('active');
							$('#filter5 .menu').attr('style','display: none !important');
							event.stopPropagation();
						}else{
							$('#filter5').addClass('opened');
							$('#filter5 .menu').attr('style','display: block !important');
						}
					});
					$('.transactionHtml:not(#filter5)').on('click',function(){


						$('#filter5').removeClass('opened');
						$('#filter5').removeClass('active');
						$('#filter5 .menu').attr('style','display: none !important');
						// event.stopPropagation();
					});

				//Filter event categories
				$('#filter5 .item').on('click', function(e){

					if($('#activeCategories').val()!=""){
						$('#activeCategories').val($('#activeCategories').val().trim()+','+$(this).text().trim());
					}else{
						$('#activeCategories').val($(this).text().trim());
					}
					var transTbl = $('#transactionMainTbl').DataTable();
					transTbl.draw();
				});

		});

		//Fetch transactions
		this.fetchTransactions = function(){

			var minAmt = 0.01;
			var maxAmt = 99999999;
			var transType = "";
			var transCat = "";
			var accName = "";
			var dateRange = 1;


			minAmt = $('.noUi-handle-lower').attr('aria-valuenow')*10;
			maxAmt = $('.noUi-handle-upper').attr('aria-valuenow')*10;

			if(isNaN(minAmt)){
				minAmt = 0.01;
				maxAmt = 99999999;
			}

			if($('#transType').val()!=undefined){
				transType = $('#transType').val();
			}

			if($('#transCat').val()!=undefined){
				transCat = $('#transCat').val();
			}

			if($('#accName').val()!=undefined){
				accName = $('#accName').val();
			}

			if($('#dateRange').val()!=undefined){
				dateRange = $('#dateRange').val();
			}

			// $('#transactionMainTbl').append(html);



			this.transactionsService.getFilteredTransactions(localStorage.getItem('customerId'), minAmt, maxAmt, transType, transCat, accName, dateRange)
			.subscribe( data =>{

				// var tableData = data;

				// $.fn.dataTable.moment( 'MMM DD, YYYY' );
				// var t = $('#transactionMainTbl').DataTable();

				// t.clear().draw(true);
				// console.log(JSON.stringify(tableData));

				// t.fnDestroy();


				// $('#transactionMainTbl').DataTable().fnClearTable();
				$('#transactionMainTblFake').hide();
				$('#transactionMainTbl').show();

				var transTbl = $('#transactionMainTbl').DataTable( {
									"destroy": true,
									"data": data,
								// 	"search": {
								// 			"regex": true,
								// },
								"pageLength": 100,
								"paging": true,
									"columns": [
										// {  "data"   :  moment(parseInt(posted_date)).format("MMM DD, YYYY")},
										{  "data"   :  'posted_date' },
										{  "data"   :  'normalized_payee_name' },
										{  "data"   :  'accounts[0].institution_id' },
										// {  "data"   :  '$'+addCommasFormat(parseFloat('amount').toFixed(2)) },
                    {  "data"   :  'status' },
										{  "data"   :  'accounts[0].ac_name' },
										{  "data"   :  'amount' },
										{  "data"   :  'top_level_category' },
										{  "data"   :  'category' },
										{  "data"   :  'account_id' }
									],
							"order": [[ 0, "desc" ]],
							"createdRow": function ( row, data, index ) {

								$('td', row).eq(0).html(moment(parseInt(data.posted_date)).local().format("MMM D, YYYY"));

								//Dot draw in front of amount
								// if ( data.type == 'credit' ) {
								// 	$('td', row).eq(5).html("<span class='red-dot'></span>$"+addCommasFormat(parseFloat(data.amount).toFixed(2)));
								// }else{

								// }

								//Circular icon based on name
								var initials = data.normalized_payee_name.match(/\b\w/g) || [];
								initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

								if(data.accounts[0]!=undefined){
									$('td', row).eq(1).html("<div style='height: 40px;padding-top: 5px;float: left;'><img class='mr-2' style='border-radius: 0 !important; width: 22px; height:unset;' src='assets/images/"+getCatImg(data.category)+"' width='28' /></div><div >"+data.normalized_payee_name+"<br/><small>"+data.accounts[0].ac_name+" ("+data.accounts[0].ac_number+")</small></div>");
									$('td', row).eq(2).html(data.accounts[0].institution_id);

									$('td', row).eq(4).html(data.accounts[0].ac_name+" ("+data.accounts[0].ac_number+")");
								}else{
									$('td', row).eq(1).html("<div style='height: 40px;padding-top: 5px;float: left;'><img class='mr-2' style='border-radius: 0 !important; width: 22px; height:unset;' src='assets/images/"+getCatImg(data.category)+"' width='28' /></div><div >"+data.normalized_payee_name+"<br/><small>-- Account details not found --</small></div>");

									$('td', row).eq(2).html("-");
									$('td', row).eq(4).html("-");
								}
								/*
								if(data.status.toUpperCase()=="PENDING"){
									$('td', row).eq(4).html("$"+addCommasFormat(parseFloat(data.amount).toFixed(2))+"<i class='fas fa-sync sync-icon'></i>");
								}else{
									$('td', row).eq(4).html("$"+addCommasFormat(parseFloat(data.amount).toFixed(2)));
								}*/
								$('td', row).eq(5).html("$"+addCommasFormat(parseFloat(data.amount).toFixed(2)));
								//Dot colored label in front fo category
								// $('td', row).eq(4).html("<div style='height: 20px;float: left;'> <span style='background:"+intToRGB(hashCode(data.category))+"' class='colored-label'></span> </div><div>"+data.category+"</div>");


								//Circular icon based on type
								// var iconColor = "green";
								// var iconInitial = "D";
								// if(data.type=='CREDIT'){
									// iconColor = 'red';
									// iconInitial = "C";
								// }
								// $('td', row).eq(4).html("<span class='name-icon' style='background:"+iconColor+"'>"+iconInitial+"</span>"+data.type);
							},
							"columnDefs": [
								{ "width": "200px", "targets": 0 },
								{ "width": "30%", "targets": 1 },
								{ "width": "140px", "targets": 2 },
                { "width": "90px", "targets": 3 },
								{ "width": "138px", "targets": 4 },
								{ "width": "160px", "targets": 5 },
								{ "width": "0px", "targets": 6, "visible": false },
								{ "width": "0px", "targets": 7, "visible": false },
								{ "width": "0px", "targets": 8, "visible": false }
							],
							"language": {
							"emptyTable": "No data available",
							"infoEmpty": "No  items to show",
							"search": "",
							"searchPlaceholder": "Find a Transaction"
							},
							"dom": 'rtip'
				} );
        $('#transactionMainTbl tbody').unbind().on('click','tr',function(){
          var data  = transTbl.row(this).data();
          selfObj.singleTransactionLoad(data['trans_id']);

        });
				var tblHeaderHtml = '<div class="mb-5 d-md-flex align-items-start justify-content-between">'+
										// '<div id="amtRange" class="ul-slider slider-primary col-md-12 p-0"></div>'+
									'</div>'+

									// '<div class="pt-4 d-md-flex align-items-start justify-content-between">'+
										// '<div class="col-md-2 pt-2 pl-0">Time Range:</div>'+
										// '<div class="col-md-10 d-md-flex align-items-start justify-content-between pl-0">'+
											// '<button type="button" class="btn btn-light btn-rounded btn-fw active trBtn" data-duration="1">Last Week</button>'+
											// '<button type="button" class="btn btn-light btn-rounded btn-fw ml-1 trBtn" data-duration="2">Last Month</button>'+
											// '<button type="button" class="btn btn-light btn-rounded btn-fw ml-1 trBtn" data-duration="3">Last 6 Months</button>'+
											// '<input type="hidden" id="fromDateTS" /><input type="hidden" id="toDateTS" />'+
											// '<div class="pt-2 px-2">OR</div>'+
											// '<div id="fromDate" class="input-group date datepicker ml-1 rounded">'+
												// '<input type="text" class="form-control px-2 rounded" readonly>'+
												// '<span class="input-group-addon input-group-append border-left rounded ml-1">'+
												  // '<span class="mdi mdi-calendar input-group-text rounded text-dark"></span>'+
												// '</span>'+
											// '</div>'+
											// '<div id="toDate" class="input-group date datepicker ml-1 rounded">'+
												// '<input type="text" class="form-control px-2 rounded" readonly>'+
												// '<span class="input-group-addon input-group-append border-left rounded ml-1">'+
												  // '<span class="mdi mdi-calendar input-group-text rounded text-dark"></span>'+
												// '</span>'+
											// '</div>'+
										// '</div>'+
									// '</div>'+
									// '<div class="pt-4 d-md-flex align-items-start justify-content-between">'+
										// '<div class="col-md-2 pt-2 pl-0">Category:</div>'+
										// '<div class="col-md-10 d-md-flex align-items-start justify-content-between pl-0">'+
											// '<select class="ui fluid search selection dropdown" id="category" multiple="">'+
												// '<option value="">All</option>'+
												// '<option value="0">Housing</option>'+
												// '<option value="1">Food</option>'+
												// '<option value="2">Shopping</option>'+
												// '<option value="3">Entertainment</option>'+
												// '<option value="4">Travel</option>'+
												// '<option value="5">Insurance</option>'+
												// '<option value="6">Checks</option>'+
												// '<option value="7">School</option>'+
												// '<option value="8">Personal Care</option>'+
												// '<option value="9">Taxes</option>'+
												// '<option value="10">Loan and Bank Fees</option>'+
												// '<option value="11">Healthcare</option>'+
												// '<option value="12">Childcare</option>'+
												// '<option value="13">Home</option>'+
												// '<option value="14">TV, Phone & Internet</option>'+
												// '<option value="15">Pet Care</option>'+
												// '<option value="16">Income</option>'+
												// '<option value="17">Transfers</option>'+
												// '<option value="18">Others</option>'+
											// '</select>'+
										// '</div>'+
									// '</div>'+
									'<div class="pt-4 pb-5 d-md-flex align-items-start justify-content-between" style="display:none !important;">'+
										'<div class="col-md-2 pt-2 pl-0">Accounts:</div>'+
										'<div class="col-md-10 d-md-flex align-items-start justify-content-between pl-0">'+
											'<div class="ui fluid multiple search selection dropdown" id="accounts">'+
												'<input type="hidden" name="">'+
												'<i class="dropdown icon"></i>'+
												'<div class="default text">Select Account</div>'+
												'<div class="menu">';
						//Fetching Account to add in Filter
						this.accountsService.getAccounts(localStorage.getItem('customerId'))
						.subscribe( data =>{


							for(var acc=0;acc<data.length;acc++){
								tblHeaderHtml += '<div class="item" style="text-transform: capitalize;" data-value="'+data[acc].ac_id+'"><img class="ui medium circular image" src="assets/images/visa.png">'+data[acc].institution_id+' ('+data[acc].ac_name.toLowerCase()+')</div>';
							}

							tblHeaderHtml += '</div>'+
											'</div>'+
										'</div>'+
									'</div>';



							 // $("div.toolbar").html(tblHeaderHtml);

							// if ($("#amtRange").length) {
								// var softSlider = document.getElementById('amtRange');

									// noUiSlider.create(softSlider, {
										// start: [0, 1000],
										// tooltips: true,
										// connect: true,
										// range: {
										// min: 0,
										// max: 1000,
									// },
									// pips: {
										// mode: 'values',
										// values: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
										// density: 100,
										// format: {to: function( value, type ){
											// switch(true)   {
												// case (value > 999):
													// value = "1000+"
													// break;
											// }
											// return value;
										// }}
									// },
									// format: {
										// from: function(value) {
												// return parseInt(value);
											// },
										// to: function(value) {
												// if(parseFloat(value)>999){
													// return parseInt(value)+"+";
												// }else{
													// return parseInt(value);
												// }

											// }
										// }
								// }).on('change', function (ev, val) {

									// var transTbl = $('#transactionMainTbl').DataTable();
									// transTbl.draw();
								// });
							// }




							$('#accounts').dropdown();

							// for(var i=0; i<tableData.length; i++){

								// Date formatting
								// var posted_date = moment(parseInt(tableData[i].posted_date)).format("MMM DD, YYYY");

								// t.row.add( [posted_date, tableData[i].normalized_payee_name,'$'+addCommasFormat(parseFloat(tableData[i].amount).toFixed(2)),tableData[i].category,tableData[i].type] ).draw( false );
							// }
							// $('#transactionMainTbl #load').remove();





						})






			});
		}

		this.fetchTransactions();


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

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return hexToRgbA("#"+("00000".substring(0, 6 - c.length) + c));
}
function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

function getCatImg(cat){

	let plaidAllCategories = ["Bank Fees","Overdraft","ATM","Late Payment","Fraud Dispute","Foreign Transaction","Wire Transfer","Insufficient Funds","Cash Advance","Excess Activity","Cash Advance","Community","Animal Shelter","Assisted Living Services","Facilities and Nursing Homes","Caretakers","Cemetery","Courts","Day Care and Preschools","Disabled Persons Services","Drug and Alcohol Services","Education","Vocational Schools","Tutoring and Educational Services","Primary and Secondary Schools","Fraternities and Sororities","Driving Schools","Dance Schools","Culinary Lessons and Schools","Computer Training","Colleges and Universities","Art School","Adult Education","Government Departments and Agencies","Government Lobbyists","Housing Assistance and Shelters","Law Enforcement","Police Stations","Fire Stations","Correctional Institutions","Libraries","Military","Organizations and Associations","Youth Organizations","Environmental","Charities and Non-Profits","Post Offices","Public and Social Services","Religious","Temple","Synagogues","Mosques","Churches","Senior Citizen Services","Retirement","Food and Drink","Bar","Wine Bar","Sports Bar","Hotel Lounge","Breweries","Internet Cafes","Nightlife","Strip Club","Night Clubs","Karaoke","Jazz and Blues Cafe","Hookah Lounges","Adult Entertainment","Restaurants","Winery","Vegan and Vegetarian","Turkish","Thai","Swiss","Sushi","Steakhouses","Spanish","Seafood","Scandinavian","Portuguese","Pizza","Moroccan","Middle Eastern","Mexican","Mediterranean","Latin American","Korean","Juice Bar","Japanese","Italian","Indonesian","Indian","Ice Cream","Greek","German","Gastropub","French","Food Truck","Fish and Chips","Filipino","Fast Food","Falafel","Ethiopian","Eastern European","Donuts","Distillery","Diners","Dessert","Delis","Cupcake Shop","Cuban","Coffee Shop","Chinese","Caribbean","Cajun","Cafe","Burrito","Burgers","Breakfast Spot","Brazilian","Barbecue","Bakery","Bagel Shop","Australian","Asian","American","African","Afghan","Healthcare","Healthcare Services","Psychologists","Pregnancy and Sexual Health","Podiatrists","Physical Therapy","Optometrists","Nutritionists","Nurses","Mental Health","Medical Supplies and Labs","Hospitals, Clinics and Medical Centers","Emergency Services","Dentists","Counseling and Therapy","Chiropractors","Blood Banks and Centers","Alternative Medicine","Acupuncture","Physicians","Urologists","Respiratory","Radiologists","Psychiatrists","Plastic Surgeons","Pediatricians","Pathologists","Orthopedic Surgeons","Ophthalmologists","Oncologists","Obstetricians and Gynecologists","Neurologists","Internal Medicine","General Surgery","Gastroenterologists","Family Medicine","Ear, Nose and Throat","Dermatologists","Cardiologists","Anesthesiologists","Interest","Interest Earned","Interest Charged","Payment","Credit Card","Rent","Loan","Recreation","Arts and Entertainment","Theatrical Productions","Symphony and Opera","Sports Venues","Social Clubs","Psychics and Astrologers","Party Centers","Music and Show Venues","Museums","Movie Theatres","Fairgrounds and Rodeos","Entertainment","Dance Halls and Saloons","Circuses and Carnivals","Casinos and Gaming","Bowling","Billiards and Pool","Art Dealers and Galleries","Arcades and Amusement Parks","Aquarium","Athletic Fields","Baseball","Basketball","Batting Cages","Boating","Campgrounds and RV Parks","Canoes and Kayaks","Combat Sports","Cycling","Dance","Equestrian","Football","Go Carts","Golf","Gun Ranges","Gymnastics","Gyms and Fitness Centers","Hiking","Hockey","Hot Air Balloons","Hunting and Fishing","Landmarks","Monuments and Memorials","Historic Sites","Gardens","Buildings and Structures","Miniature Golf","Outdoors","Rivers","Mountains","Lakes","Forests","Beaches","Paintball","Parks","Playgrounds","Picnic Areas","Natural Parks","Personal Trainers","Race Tracks","Racquet Sports","Racquetball","Rafting","Recreation Centers","Rock Climbing","Running","Scuba Diving","Skating","Skydiving","Snow Sports","Soccer","Sports and Recreation Camps","Sports Clubs","Stadiums and Arenas","Swimming","Tennis","Water Sports","Yoga and Pilates","Service","Zoo","Advertising and Marketing","Writing, Copywriting and Technical Writing","Search Engine Marketing and Optimization","Public Relations","Promotional Items","Print, TV, Radio and Outdoor Advertising","Online Advertising","Market Research and Consulting","Direct Mail and Email Marketing Services","Creative Services","Advertising Agencies and Media Buyers","Art Restoration","Audiovisual","Automation and Control Systems","Automotive","Towing","Motorcycle, Moped and Scooter Repair","Maintenance and Repair","Car Wash and Detail","Car Appraisers","Auto Transmission","Auto Tires","Auto Smog Check","Auto Oil and Lube","Business and Strategy Consulting","Business Services","Printing and Publishing","Cable","Chemicals and Gasses","Cleaning","Computers","Maintenance and Repair","Software Development","Construction","Specialty","Roofers","Painting","Masonry","Infrastructure","Heating, Ventilating and Air Conditioning","Electricians","Contractors","Carpet and Flooring","Carpenters","Credit Counseling and Bankruptcy Services","Dating and Escort","Employment Agencies","Engineering","Entertainment","Media","Events and Event Planning","Financial","Taxes","Student Aid and Grants","Stock Brokers","Loans and Mortgages","Holding and Investment Offices","Fund Raising","Financial Planning and Investments","Credit Reporting","Collections","Check Cashing","Business Brokers and Franchises","Banking and Finance","ATMs","Accounting and Bookkeeping","Food and Beverage","Distribution","Catering","Funeral Services","Geological","Home Improvement","Upholstery","Tree Service","Swimming Pool Maintenance and Services","Storage","Roofers","Pools and Spas","Plumbing","Pest Control","Painting","Movers","Mobile Homes","Lighting Fixtures","Landscaping and Gardeners","Kitchens","Interior Design","Housewares","Home Inspection Services","Home Appliances","Heating, Ventilation and Air Conditioning","Hardware and Services","Fences, Fireplaces and Garage Doors","Electricians","Doors and Windows","Contractors","Carpet and Flooring","Carpenters","Architects","Household","Human Resources","Immigration","Import and Export","Industrial Machinery and Vehicles","Insurance","Internet Services","Leather","Legal","Logging and Sawmills","Machine Shops","Management","Manufacturing","Apparel and Fabric Products","Chemicals and Gasses","Computers and Office Machines","Electrical Equipment and Components","Food and Beverage","Furniture and Fixtures","Glass Products","Industrial Machinery and Equipment","Leather Goods","Metal Products","Nonmetallic Mineral Products","Paper Products","Petroleum","Plastic Products","Rubber Products","Service Instruments","Textiles","Tobacco","Transportation Equipment","Wood Products","Media Production","Metals","Mining","Coal","Metal","Non-Metallic Minerals","News Reporting","Oil and Gas","Packaging","Paper","Personal Care","Tattooing","Tanning Salons","Spas","Skin Care","Piercing","Massage Clinics and Therapists","Manicures and Pedicures","Laundry and Garment Services","Hair Salons and Barbers","Hair Removal","Petroleum","Photography","Plastics","Rail","Real Estate","Real Estate Development and Title Companies","Real Estate Appraiser","Real Estate Agents","Property Management","Corporate Housing","Commercial Real Estate","Building and Land Surveyors","Boarding Houses","Apartments, Condos and Houses","Rent","Refrigeration and Ice","Renewable Energy","Repair Services","Research","Rubber","Scientific","Security and Safety","Shipping and Freight","Software Development","Storage","Subscription","Tailors","Telecommunication Services","Textiles","Tourist Information and Services","Transportation","Travel Agents and Tour Operators","Utilities","Water","Sanitary and Waste Management","Heating, Ventilating, and Air Conditioning","Gas","Electric","Veterinarians","Water and Waste Management","Web Design and Development","Welding","Agriculture and Forestry","Crop Production","Forestry","Livestock and Animals","Services","Art and Graphic Design","Shops","Adult","Antiques","Arts and Crafts","Auctions","Automotive","Used Car Dealers","Salvage Yards","RVs and Motor Homes","Motorcycles, Mopeds and Scooters","Classic and Antique Car","Car Parts and Accessories","Car Dealers and Leasing","Beauty Products","Bicycles","Boat Dealers","Bookstores","Cards and Stationery","Children","Clothing and Accessories","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","Computers and Electronics","Video Games","Mobile Phones","Cameras","Construction Supplies","Convenience Stores","Costumes","Dance and Music","Department Stores","Digital Purchase","Discount Stores","Electrical Equipment","Equipment Rental","Flea Markets","Florists","Food and Beverage Store","Specialty","Health Food","Farmers Markets","Beer, Wine and Spirits","Fuel Dealer","Furniture and Home Decor","Gift and Novelty","Glasses and Optometrist","Hardware Store","Hobby and Collectibles","Industrial Supplies","Jewelry and Watches","Luggage","Marine Supplies","Music, Video and DVD","Musical Instruments","Newsstands","Office Supplies","Outlet","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","Pawn Shops","Pets","Pharmacies","Photos and Frames","Shopping Centers and Malls","Sporting Goods","Supermarkets and Groceries","Tobacco","Toys","Vintage and Thrift","Warehouses and Wholesale Stores","Wedding and Bridal","Wholesale","Lawn and Garden","Tax","Refund","Payment","Transfer","Internal Account Transfer","ACH","Billpay","Check","Credit","Debit","Deposit","Check","ATM","Keep the Change Savings Program","Payroll","Benefits","Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid","Wire","Withdrawal","Check","ATM","Save As You Go","Travel","Airlines and Aviation Services","Airports","Boat","Bus Stations","Car and Truck Rentals","Car Service","Ride Share","Charter Buses","Cruises","Gas Stations","Heliports","Limos and Chauffeurs","Lodging","Resorts","Lodges and Vacation Rentals","Hotels and Motels","Hostels","Cottages and Cabins","Bed and Breakfasts","Parking","Public Transportation Services","Rail","Taxi","Tolls and Fees","Transportation Centers"];

	let plaidSpendingCategories = ["Overdraft","ATM","Late Payment","Fraud Dispute","Foreign Transaction","Wire Transfer","Insufficient Funds","Cash Advance","Excess Activity","Animal Shelter","Assisted Living Services","Cemetery","Courts","Day Care and Preschools","Disabled Persons Services","Drug and Alcohol Services","Education","Government Departments and Agencies","Government Lobbyists","Housing Assistance and Shelters","Law Enforcement","Libraries","Military","Organizations and Associations","Post Offices","Public and Social Services","Religious","Senior Citizen Services","Bar","Breweries","Internet Cafes","Nightlife","Restaurants","Healthcare Services","Physicians","Interest Earned","Interest Charged","Credit Card","Rent","Loan","Arts and Entertainment","Athletic Fields","Baseball","Basketball","Batting Cages","Boating","Campgrounds and RV Parks","Canoes and Kayaks","Combat Sports","Cycling","Dance","Equestrian","Football","Go Carts","Golf","Gun Ranges","Gymnastics","Gyms and Fitness Centers","Hiking","Hockey","Hot Air Balloons","Hunting and Fishing","Landmarks","Miniature Golf","Outdoors","Paintball","Parks","Personal Trainers","Race Tracks","Racquet Sports","Racquetball","Rafting","Recreation Centers","Rock Climbing","Running","Scuba Diving","Skating","Skydiving","Snow Sports","Soccer","Sports and Recreation Camps","Sports Clubs","Stadiums and Arenas","Swimming","Tennis","Water Sports","Yoga and Pilates","Zoo","Advertising and Marketing","Art Restoration","Audiovisual","Automation and Control Systems","Automotive","Business and Strategy Consulting","Business Services","Cable","Chemicals and Gasses","Cleaning","Computers","Construction","Credit Counseling and Bankruptcy Services","Dating and Escort","Employment Agencies","Engineering","Entertainment","Events and Event Planning","Financial","Food and Beverage","Funeral Services","Geological","Home Improvement","Household","Human Resources","Immigration","Import and Export","Industrial Machinery and Vehicles","Insurance","Internet Services","Leather","Legal","Logging and Sawmills","Machine Shops","Management","Manufacturing","Media Production","Metals","Mining","News Reporting","Oil and Gas","Packaging","Paper","Personal Care","Petroleum","Photography","Plastics","Rail","Real Estate","Refrigeration and Ice","Renewable Energy","Repair Services","Research","Rubber","Scientific","Security and Safety","Shipping and Freight","Software Development","Storage","Subscription","Tailors","Telecommunication Services","Textiles","Tourist Information and Services","Transportation","Travel Agents and Tour Operators","Utilities","Veterinarians","Water and Waste Management","Web Design and Development","Welding","Agriculture and Forestry","Art and Graphic Design","Adult","Antiques","Arts and Crafts","Auctions","Beauty Products","Bicycles","Boat Dealers","Bookstores","Cards and Stationery","Children","Clothing and Accessories","Computers and Electronics","Construction Supplies","Convenience Stores","Costumes","Dance and Music","Department Stores","Digital Purchase","Discount Stores","Electrical Equipment","Equipment Rental","Flea Markets","Florists","Food and Beverage Store","Fuel Dealer","Furniture and Home Decor","Gift and Novelty","Glasses and Optometrist","Hardware Store","Hobby and Collectibles","Industrial Supplies","Jewelry and Watches","Luggage","Marine Supplies","Music, Video and DVD","Musical Instruments","Newsstands","Office Supplies","Outlet","Pawn Shops","Pets","Pharmacies","Photos and Frames","Shopping Centers and Malls","Sporting Goods","Supermarkets and Groceries","Tobacco","Toys","Vintage and Thrift","Warehouses and Wholesale Stores","Wedding and Bridal","Wholesale","Lawn and Garden","Refund","Payment","Internal Account Transfer","Facilities and Nursing Homes","Caretakers","Vocational Schools","Tutoring and Educational Services","Primary and Secondary Schools","Fraternities and Sororities","Driving Schools","Dance Schools","Culinary Lessons and Schools","Computer Training","Colleges and Universities","Art School","Adult Education","Police Stations","Fire Stations","Correctional Institutions","Youth Organizations","Environmental","Charities and Non-Profits","Temple","Synagogues","Mosques","Churches","Retirement","Wine Bar","Sports Bar","Hotel Lounge","Strip Club","Night Clubs","Karaoke","Jazz and Blues Cafe","Hookah Lounges","Adult Entertainment","Winery","Vegan and Vegetarian","Turkish","Thai","Swiss","Sushi","Steakhouses","Spanish","Seafood","Scandinavian","Portuguese","Pizza","Moroccan","Middle Eastern","Mexican","Mediterranean","Latin American","Korean","Juice Bar","Japanese","Italian","Indonesian","Indian","Ice Cream","Greek","German","Gastropub","French","Food Truck","Fish and Chips","Filipino","Fast Food","Falafel","Ethiopian","Eastern European","Donuts","Distillery","Diners","Dessert","Delis","Cupcake Shop","Cuban","Coffee Shop","Chinese","Caribbean","Cajun","Cafe","Burrito","Burgers","Breakfast Spot","Brazilian","Barbecue","Bakery","Bagel Shop","Australian","Asian","American","African","Afghan","Psychologists","Pregnancy and Sexual Health","Podiatrists","Physical Therapy","Optometrists","Nutritionists","Nurses","Mental Health","Medical Supplies and Labs","Hospitals, Clinics and Medical Centers","Emergency Services","Dentists","Counseling and Therapy","Chiropractors","Blood Banks and Centers","Alternative Medicine","Acupuncture","Urologists","Respiratory","Radiologists","Psychiatrists","Plastic Surgeons","Pediatricians","Pathologists","Orthopedic Surgeons","Ophthalmologists","Oncologists","Obstetricians and Gynecologists","Neurologists","Internal Medicine","General Surgery","Gastroenterologists","Family Medicine","Ear, Nose and Throat","Dermatologists","Cardiologists","Anesthesiologists","Theatrical Productions","Symphony and Opera","Sports Venues","Social Clubs","Psychics and Astrologers","Party Centers","Music and Show Venues","Museums","Movie Theatres","Fairgrounds and Rodeos","Entertainment","Dance Halls and Saloons","Circuses and Carnivals","Casinos and Gaming","Bowling","Billiards and Pool","Art Dealers and Galleries","Arcades and Amusement Parks","Aquarium","Monuments and Memorials","Historic Sites","Gardens","Buildings and Structures","Rivers","Mountains","Lakes","Forests","Beaches","Playgrounds","Picnic Areas","Natural Parks","Writing, Copywriting and Technical Writing","Search Engine Marketing and Optimization","Public Relations","Promotional Items","Print, TV, Radio and Outdoor Advertising","Online Advertising","Market Research and Consulting","Direct Mail and Email Marketing Services","Creative Services","Advertising Agencies and Media Buyers","Towing","Motorcycle, Moped and Scooter Repair","Maintenance and Repair","Car Wash and Detail","Car Appraisers","Auto Transmission","Auto Tires","Auto Smog Check","Auto Oil and Lube","Printing and Publishing","Software Development","Specialty","Roofers","Painting","Masonry","Infrastructure","Heating, Ventilating and Air Conditioning","Electricians","Contractors","Carpet and Flooring","Carpenters","Media","Taxes","Student Aid and Grants","Stock Brokers","Loans and Mortgages","Holding and Investment Offices","Fund Raising","Financial Planning and Investments","Credit Reporting","Collections","Check Cashing","Business Brokers and Franchises","Banking and Finance","ATMs","Accounting and Bookkeeping","Distribution","Catering","Upholstery","Tree Service","Swimming Pool Maintenance and Services","Storage","Pools and Spas","Plumbing","Pest Control","Movers","Mobile Homes","Lighting Fixtures","Landscaping and Gardeners","Kitchens","Interior Design","Housewares","Home Inspection Services","Home Appliances","Heating, Ventilation and Air Conditioning","Hardware and Services","Fences, Fireplaces and Garage Doors","Doors and Windows","Architects","Apparel and Fabric Products","Chemicals and Gasses","Computers and Office Machines","Electrical Equipment and Components","Food and Beverage","Furniture and Fixtures","Glass Products","Industrial Machinery and Equipment","Leather Goods","Metal Products","Nonmetallic Mineral Products","Paper Products","Petroleum","Plastic Products","Rubber Products","Service Instruments","Textiles","Tobacco","Transportation Equipment","Wood Products","Coal","Metal","Non-Metallic Minerals","Tattooing","Tanning Salons","Spas","Skin Care","Piercing","Massage Clinics and Therapists","Manicures and Pedicures","Laundry and Garment Services","Hair Salons and Barbers","Hair Removal","Real Estate Development and Title Companies","Real Estate Appraiser","Real Estate Agents","Property Management","Corporate Housing","Commercial Real Estate","Building and Land Surveyors","Boarding Houses","Apartments, Condos and Houses","Rent","Water","Sanitary and Waste Management","Heating, Ventilating, and Air Conditioning","Gas","Electric","Crop Production","Forestry","Livestock and Animals","Services","Used Car Dealers","Salvage Yards","RVs and Motor Homes","Motorcycles, Mopeds and Scooters","Classic and Antique Car","Car Parts and Accessories","Car Dealers and Leasing","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","Video Games","Mobile Phones","Cameras","Health Food","Farmers Markets","Beer, Wine and Spirits"];
	let plaidInvestingCategories = [];

	let barsCategory = ["Wine Bar","Sports Bar","Hotel Lounge","Bar","Breweries"]; // Bars
	let restaurantsCategory = ["Bar","Wine Bar","Sports Bar","Hotel Lounge","Internet Cafes","Restaurants","Winery","Vegan and Vegetarian","Turkish","Thai","Swiss","Sushi","Steakhouses","Spanish","Seafood","Scandinavian","Portuguese","Pizza","Moroccan","Middle Eastern","Mexican","Mediterranean","Latin American","Korean","Juice Bar","Japanese","Italian","Indonesian","Indian","Ice Cream","Greek","German","Gastropub","French","Food Truck","Fish and Chips","Filipino","Fast Food","Falafel","Ethiopian","Eastern European","Donuts","Distillery","Diners","Dessert","Delis","Cupcake Shop","Cuban","Coffee Shop","Chinese","Caribbean","Cajun","Cafe","Burrito","Burgers","Breakfast Spot","Brazilian","Barbecue","Bakery","Bagel Shop","Australian","Asian","American","African","Afghan"]; // Restaurants
	let shoppingCategory = ["Adult","Antiques","Arts and Crafts","Auctions","Beauty Products","Bicycles","Boat Dealers","Bookstores","Cards and Stationery","Children","Clothing and Accessories","Computers and Electronics","Construction Supplies","Convenience Stores","Costumes","Dance and Music","Department Stores","Digital Purchase","Discount Stores","Electrical Equipment","Equipment Rental","Flea Markets","Florists","Food and Beverage Store","Fuel Dealer","Furniture and Home Decor","Gift and Novelty","Glasses and Optometrist","Hardware Store","Hobby and Collectibles","Industrial Supplies","Jewelry and Watches","Luggage","Marine Supplies","Music, Video and DVD","Musical Instruments","Newsstands","Office Supplies","Outlet","Pawn Shops","Pets","Pharmacies","Photos and Frames","Shopping Centers and Malls","Sporting Goods","Supermarkets and Groceries","Tobacco","Toys","Vintage and Thrift","Warehouses and Wholesale Stores","Wedding and Bridal","Wholesale","Lawn and Garden","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","","Video Games","Mobile Phones","Cameras","Specialty","Health Food","Farmers Markets","Beer, Wine and Spirits"]; // Shopping
	let entertainmentCategory = ["Entertainment","Media", "Arts and Entertainment",  "Athletic Fields",  "Baseball",  "Basketball",  "Batting Cages",  "Boating",  "Campgrounds and RV Parks",  "Canoes and Kayaks",  "Combat Sports",  "Cycling",  "Dance",  "Equestrian",  "Football",  "Go Carts",  "Golf",  "Gun Ranges",  "Gymnastics",  "Gyms and Fitness Centers",  "Hiking",  "Hockey",  "Hot Air Balloons",  "Hunting and Fishing",  "Landmarks",  "Miniature Golf",  "Outdoors",  "Paintball",  "Parks",  "Personal Trainers",  "Race Tracks",  "Racquet Sports",  "Racquetball",  "Rafting",  "Recreation Centers",  "Rock Climbing",  "Running",  "Scuba Diving",  "Skating",  "Skydiving",  "Snow Sports",  "Soccer",  "Sports and Recreation Camps",  "Sports Clubs",  "Stadiums and Arenas",  "Swimming",  "Tennis",  "Water Sports",  "Yoga and Pilates",  "Zoo","Theatrical Productions",  "Symphony and Opera",  "Sports Venues",  "Social Clubs",  "Psychics and Astrologers",  "Party Centers",  "Music and Show Venues",  "Museums",  "Movie Theatres",  "Fairgrounds and Rodeos",  "Entertainment",  "Dance Halls and Saloons",  "Circuses and Carnivals",  "Casinos and Gaming",  "Bowling",  "Billiards and Pool",  "Art Dealers and Galleries",  "Arcades and Amusement Parks",  "Aquarium",  "Monuments and Memorials",  "Historic Sites",  "Gardens",  "Buildings and Structures",  "Rivers",  "Mountains",  "Lakes",  "Forests",  "Beaches",  "Playgrounds",  "Picnic Areas",  "Natural Parks" , "Recreation","Strip Club","Night Clubs","Karaoke","Jazz and Blues Cafe","Hookah Lounges","Adult Entertainment"];  // Entertainment
	let transportCategory = ["Airlines and Aviation Services","Airports","Boat","Bus Stations","Car and Truck Rentals","Car Service","Charter Buses","Cruises","Heliports","Limos and Chauffeurs","Parking","Public Transportation Services","Rail","Taxi","Tolls and Fees","Transportation Centers","Ride Share",]; // Transportation
	let insuranceCategory = ["Insurance"]; // Insurance
	let checksCategory = ["Withdrawal Check","Check"]; // Checks
	let schoolCategory = ["Vocational Schools","Tutoring and Educational Services","Primary and Secondary Schools","Fraternities and Sororities","Driving Schools","Dance Schools","Culinary Lessons and Schools","Computer Training","Colleges and Universities","Art School","Adult Education","Education"]; // School
	let personalCategory = ["Tattooing","Tanning Salons","Spas","Skin Care","Piercing","Massage Clinics and Therapists","Manicures and Pedicures","Laundry and Garment Services","Hair Salons and Barbers","Hair Removal","Personal Care"]; // Personal Care
	let lodgingCategory = ["Resorts","Lodges and Vacation Rentals","Hotels and Motels","Hostels","Cottages and Cabins","Bed and Breakfasts","Lodging"]; // Hotels and Lodging
	let loanCategory = ["Loan","Overdraft","ATM","Late Payment","Fraud Dispute","Foreign Transaction","Wire Transfer","Insufficient Funds","Cash Advance","Excess Activity","Bank Fees","Interest Charged","Interest"]; // Loan and Bank Fees
	let healthCategory = ["Healthcare Services","Physicians","Healthcare","Psychologists","Pregnancy and Sexual Health","Podiatrists","Physical Therapy","Optometrists","Nutritionists","Nurses","Mental Health","Medical Supplies and Labs","Hospitals, Clinics and Medical Centers","Emergency Services","Dentists","Counseling and Therapy","Chiropractors","Blood Banks and Centers","Alternative Medicine","Acupuncture","","Urologists","Respiratory","Radiologists","Psychiatrists","Plastic Surgeons","Pediatricians","Pathologists","Orthopedic Surgeons","Ophthalmologists","Oncologists","Obstetricians and Gynecologists","Neurologists","Internal Medicine","General Surgery","Gastroenterologists","Family Medicine","Ear, Nose and Throat","Dermatologists","Cardiologists","Anesthesiologists"]; // Healthcare
	let gasCategory = ["Gas Stations"]; // Gas Stations
	let homeCategory = ["Home Improvement","Automotive","Household","Rent"]; // Home and Auto
	let tvCategory = ["Internet Services","Cable","Telecommunication Services"]; // TV, Phone, and Internet
	let petCategory = ["Pets"]; // Petcare
	let incomeCategory = ["ACH","Billpay","Keep the Change Savings Program","Payroll","Benefits","Check","Credit","Debit","Deposit","Save As You Go","ATM","Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid"];
	let transferCategory = ["Transfer","Internal Account Transfer","ACH","Billpay","Check","Credit","Debit","Deposit","Check","ATM","Keep the Change Savings Program","Payroll","Benefits","Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid","Wire","Withdrawal","Check","ATM","Save As You Go"];
	let othersCategory = ["Animal Shelter","Assisted Living Services","Cemetery","Courts","Day Care and Preschools","Disabled Persons Services","Drug and Alcohol Services","Government Departments and Agencies","Government Lobbyists","Housing Assistance and Shelters","Law Enforcement","Libraries","Military","Organizations and Associations","Post Offices","Public and Social Services","Religious","Senior Citizen Services","Nightlife","Interest Earned","Credit Card","Advertising and Marketing","Art Restoration","Audiovisual","Automation and Control Systems","Business and Strategy Consulting","Business Services","Chemicals and Gasses","Cleaning","Computers","Construction","Credit Counseling and Bankruptcy Services","Dating and Escort","Employment Agencies","Engineering","Events and Event Planning","Financial","Food and Beverage","Funeral Services","Geological","Human Resources","Immigration","Import and Export","Industrial Machinery and Vehicles","Leather","Legal","Logging and Sawmills","Machine Shops","Management","Manufacturing","Media Production","Metals","Mining","News Reporting","Oil and Gas","Packaging","Paper","Petroleum","Photography","Plastics","Real Estate","Refrigeration and Ice","Renewable Energy","Repair Services","Research","Rubber","Scientific","Security and Safety","Shipping and Freight","Software Development","Storage","Subscription","Tailors","Textiles","Tourist Information and Services","Transportation","Travel Agents and Tour Operators","Utilities","Veterinarians","Water and Waste Management","Web Design and Development","Welding","Agriculture and Forestry","Art and Graphic Design","Refund","Payment","Internal Account Transfer","Facilities and Nursing Homes","Caretakers","Police Stations","Fire Stations","Correctional Institutions","Youth Organizations","Environmental","Charities and Non-Profits","Temple","Synagogues","Mosques","Churches","Retirement","Writing, Copywriting and Technical Writing","Search Engine Marketing and Optimization","Public Relations","Promotional Items","Print, TV, Radio and Outdoor Advertising","Online Advertising","Market Research and Consulting","Direct Mail and Email Marketing Services","Creative Services","Advertising Agencies and Media Buyers","Towing","Motorcycle, Moped and Scooter Repair","Maintenance and Repair","Car Wash and Detail","Car Appraisers","Auto Transmission","Auto Tires","Auto Smog Check","Auto Oil and Lube","Printing and Publishing","Software Development","Roofers","Painting","Masonry","Infrastructure","Heating, Ventilating and Air Conditioning","Electricians","Contractors","Carpet and Flooring","Carpenters","Taxes","Student Aid and Grants","Stock Brokers","Loans and Mortgages","Holding and Investment Offices","Fund Raising","Financial Planning and Investments","Credit Reporting","Collections","Check Cashing","Business Brokers and Franchises","Banking and Finance","ATMs","Accounting and Bookkeeping","Distribution","Catering","Upholstery","Tree Service","Swimming Pool Maintenance and Services","Storage","Pools and Spas","Plumbing","Pest Control","Movers","Mobile Homes","Lighting Fixtures","Landscaping and Gardeners","Kitchens","Interior Design","Housewares","Home Inspection Services","Home Appliances","Heating, Ventilation and Air Conditioning","Hardware and Services","Fences, Fireplaces and Garage Doors","Doors and Windows","Architects","Apparel and Fabric Products","Chemicals and Gasses","Computers and Office Machines","Electrical Equipment and Components","Food and Beverage","Furniture and Fixtures","Glass Products","Industrial Machinery and Equipment","Leather Goods","Metal Products","Nonmetallic Mineral Products","Paper Products","Petroleum","Plastic Products","Rubber Products","Service Instruments","Textiles","Transportation Equipment","Wood Products","Coal","Metal","Non-Metallic Minerals","Real Estate Development and Title Companies","Real Estate Appraiser","Real Estate Agents","Property Management","Corporate Housing","Commercial Real Estate","Building and Land Surveyors","Boarding Houses","Apartments, Condos and Houses","Water","Sanitary and Waste Management","Heating, Ventilating, and Air Conditioning","Gas","Electric","Crop Production","Forestry","Livestock and Animals","Services","Used Car Dealers","Salvage Yards","RVs and Motor Homes","Motorcycles, Mopeds and Scooters","Classic and Antique Car","Car Parts and Accessories","Car Dealers and Leasing"];
	let categoryArr = [barsCategory,restaurantsCategory,shoppingCategory,entertainmentCategory,transportCategory,insuranceCategory,checksCategory,schoolCategory,personalCategory,lodgingCategory,loanCategory,healthCategory,gasCategory,homeCategory,tvCategory,petCategory,incomeCategory,transferCategory,othersCategory];

	let investingCategory = ['Holding and Investment Offices','Financial Planning and Investments'];

	var catImg = "Others";
	// console.log('Cat:'+cat);
	if(barsCategory.indexOf(cat) > -1 ){
		catImg = "other.png";
	}
	// Filter Food Categories
	else if(restaurantsCategory.indexOf(cat) > -1 ){
		catImg = "restaurants.png";
	}
	// Filter Shopping Categories
	else if(shoppingCategory.indexOf(cat) > -1 ){
		catImg = "shopping.png";
	}
	// Filter Entertainment Categories
	else if(entertainmentCategory.indexOf(cat) > -1 ){
		catImg = "movie-tickets.png";
	}
	// Filter Travel Categories
	else if(transportCategory.indexOf(cat) > -1 ){
		catImg = "transport.png";
	}
	// Filter Insurance Categories
	else if(insuranceCategory.indexOf(cat) > -1 ){
		catImg = "umbrella.png";
	}
	// Filter Checks Categories
	else if(checksCategory.indexOf(cat) > -1 ){
		catImg = "other.png";
	}
	// Filter School Categories
	else if(schoolCategory.indexOf(cat) > -1 ){
		catImg = "students-cap.png";
	}
	// Filter Personal Care Categories
	else if(personalCategory.indexOf(cat) > -1 ){
		catImg = "barbershop.png";
	}
	// Filter Taxes Categories
	else if(lodgingCategory.indexOf(cat) > -1 ){
		catImg = "other.png";
	}
	// Filter Loan and Bank Fees Categories
	else if(loanCategory.indexOf(cat) > -1 ){
		catImg = "other.png";
	}
	// Filter Healthcare Categories
	else if(healthCategory.indexOf(cat) > -1 ){
		catImg = "plus-black-symbol.png";
	}
	// Filter Childcare Categories
	else if(gasCategory.indexOf(cat) > -1 ){
		catImg = "other.png";
	}
	// Filter Home Categories
	else if(homeCategory.indexOf(cat) > -1 ){
		catImg = "other.png";
	}
	// Filter TV, Phone & Internet Categories
	else if(tvCategory.indexOf(cat) > -1 ){
		catImg = "tvwifi.png";
	}
	// Filter Petcare Categories
	else if(petCategory.indexOf(cat) > -1 ){
		catImg = "other.png";
	}else{
		catImg = "other.png";
	}

	return catImg;

}

// function filterColumn ( strToSearch, col,is_regex,is_smart ) {
    // $('#transactionMainTbl').DataTable().column( col ).search(
        // strToSearch,
        // is_regex,
        // is_smart
    // ).draw();
// }


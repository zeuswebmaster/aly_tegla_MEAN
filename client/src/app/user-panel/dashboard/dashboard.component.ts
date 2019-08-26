import { GoogleChartsModule } from 'angular-google-charts';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Transaction } from '../../schema/transaction';
import { AccountsService } from '../../services/accounts.service';
import { Account } from '../../schema/account';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';
import * as Highcharts from 'highcharts';
declare var require: any;
// require('highcharts/highcharts-more')(Highcharts);
// require('highcharts/modules/heatmap')(Highcharts);
// require('highcharts/modules/treemap')(Highcharts);
// require('highcharts/modules/funnel')(Highcharts);


var url = '';

let chartHolder;

var html = '<div id="load" style="display:none;"><img width="64" height="64" src="assets/images/loaders/loader.gif"/></div>';//Loader html

declare var $: any;
declare let google: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [TransactionsService,AccountsService,AuthenticationService]
})

export class DashboardComponent implements OnInit {

  chart = []; //This will hold charts data
  spendingDateRange = '';


  savingDateRange = '';
  // savingMonthDateRange = '';
  // savingYearDateRange = '';

  investingDateRange = '';

  recentTransactions = "";
  dashboardMoneyInflow:any = [];
  creditCardsData =[];

  atmFee = 0;
  bankFee = 0;
  financeCharge = 0;
  lateFee = 0;
  serviceFee = 0;
  tradeCommisions = 0;
  cashAcctWeek;
  cashAcctMonth;
  cashAcct6Month;
  loadGoogleChart;
  welcomeData;
  incomeData;
  projectedIncomeData;

  getWelcomeData;
  getIncomeData;
  getIncomeTrans;
  getProjectedIncomeData;
  getSpendingData;

  getSpendingDataWeekly;
  getSpendingDataMonthly;
  getSpendingDataSixMonthly;

  getSavingsData;

  getInvestingDataWeekly;
  getInvestingDataMonthly;
  getInvestingDataSixMonthly;

  merchantsList =  "";
  getMerchant;
  inflowData;
  drawChart;
  googleChart;
  goldenNuggetAmount = "0.<sup>00</sup>";

  options_donut = {};
  data = {};
  charts = [];
  incomeStreamData;
  currentDateTime = "";
  renderPopUp;
  dPopup;
  moneyPopup;
  savingsDataTemp;
  savingsDataWeeklyTemp;
  savingsDataMonthlyTemp;
  savingsData6MonthlyTemp;
  getIncomeStreamData;
  oneMonthTransactions;
  sixMonthTransactions;
  nuggetTransactions = [];
  financeTrans = [];
  bankTrans = [];
  dTransArr =[];
  incomeTrans = [];
  singleTransactionLoad;
  constructor(public auth: AuthenticationService, platformLocation: PlatformLocation, private transactionsService : TransactionsService, private accountsService : AccountsService, private changeDetector: ChangeDetectorRef) {
    url = (platformLocation as any).location.href;
  }

   //On initialization this will run
ngOnInit() {

	let selfObj = this;

	$.getScript("https://www.gstatic.com/charts/loader.js", function (w) { });
    $(document).ready(function () {
        $('.router-container').show();
        $.getScript(url+"/../assets/js/dashboard.js", function (w) {
      });
	  selfObj.inflowData();
	  selfObj.getSpendingDataWeekly();
	  selfObj.getSavingsData(1);
	  selfObj.getInvestingDataWeekly();
	  selfObj.cashAcct6Month();
	  selfObj.getMerchant('year');
	  selfObj.getWelcomeData();
	  selfObj.getIncomeData();
	  selfObj.getProjectedIncomeData();

	  var marginTop = (($(window).height()-600)/2)+'px !important';
	  $('.modal-dialog').attr('style','margin-top:'+marginTop);

	  var savingsMarginTop = (($(window).height()-650)/2)+'px !important';
    var singleTransMarginTop = (($(window).height()-650)/2)+'px !important';
	  $('#savingDetailModal .modal-dialog').attr('style','margin-top:'+savingsMarginTop);
	  debugger;
	  var singleTransMarginTop = '50px !important';
	  if($(window).height() < 1400){
		singleTransMarginTop = (($(window).height()-485)/2)+'px !important';
	  }

    $('#modal_single_transaction .modal-dialog').attr('style','margin-top:'+singleTransMarginTop);
  });

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

          //   $($('.modal-backdrop.show')[$('.modal-backdrop.show').length-1]).show();
          //   $($('.modal-backdrop.show')[$('.modal-backdrop.show').length-1]).css('z-index',1050);
          $('#modal_single_transaction').css('z-index',1052);
		//   $('#modal_single_transaction').modal('setting', 'closable', false).modal('show');
		  $('#modal_single_transaction').modal('show');

      }
    });
  }
	//Function to get New Spending chart data weekly
	this.getSpendingDataWeekly = function(){
		this.transactionsService.getSpendingChartDataWeekly(localStorage.getItem('customerId'))
		.subscribe( spendingData =>{

			//Setting Date Range
			this.spendingDateRange = spendingData.date_range;

			//Chart draw
			chartHolder = $('#spendingChart').highcharts({
					credits: {
						  enabled: false
					  },
					chart: {
						type: 'areaspline',
						renderTo: 'spendingChart',
						plotBorderWidth: 0,
						backgroundColor:'rgba(255, 255, 255, 0.0)',
						zoomType: 'xy',
						height:265,
						events: {
							load: function (event) {
								var extremes = this.yAxis[0].getExtremes();
								if (extremes.dataMax == 0) {
									extremes.max = 1;
									this.yAxis[0].setExtremes(0, 1);
								}
							}
						}

					},
					title: {
						text: ''
					},
					xAxis: {
						tickColor: '#3E4873',
						tickWidth: 2,
						tickLength: 15,
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						tickInterval: 1,
						minPadding: 0,
						maxPadding: 0,
						// offset: -4,
						// tickPositions: spendingData.index,
						labels: {
							enabled: true,
							useHTML: true,
							formatter: function () {
								return spendingData.labels[this.value];
							},
							style: {
								paddingTop: '17px',
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							}
						}
						// categories: spendingData.labels
					},
					yAxis: {
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						startOnTick: false,
						endOnTick: false,
						title: null,
						// offset: -5,
						labels: {
							enabled: false,
							style: {

							}
						}
					},
					legend: {
						enabled: false
					},
					tooltip: {
						 // borderColor: 'transparent',
						 backgroundColor: '#98DAFF99',
						 borderWidth: 1,
						 borderRadius: 6,
						 shadow: false,
						 style:{
							padding: 0,
							margin: 0
						 },
						useHTML: true,
						// headerFormat: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
						formatter: function(){
							 // debugger;
							 return '$'+ addCommasFormat(this.point.y.toFixed(2));
						 },

					},
					 plotOptions: {
						area: {
							marker: {
								enabled: false,
								symbol: 'circle',
								radius: 2,
								states: {
									hover: {
										enabled: true
									}
								}
							}
						},
						 series: {
							 fillColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
								stops: [
									[0, '#98DAFFff'],
									[1, '#98DAFF33']
								]
							},
							 states: {
								hover: {
									enabled: false,
									lineWidth: 0
								}
							},
							marker: {
								enabled: false
							},
							lineWidth: 0
						}
					},
					series: [{data: spendingData.data}]

					}
					, function(chart) {

					  }
					);
		});
	}


	//Function to get New Spending chart data monthly
	this.getSpendingDataMonthly = function(){
		this.transactionsService.getSpendingChartDataMonthly(localStorage.getItem('customerId'))
		.subscribe( spendingData =>{

			//Setting Date Range
			this.spendingDateRange = spendingData.date_range;

			//Chart draw
			chartHolder = $('#spendingChart').highcharts({
					credits: {
						  enabled: false
					  },
					chart: {
						type: 'areaspline',
						renderTo: 'spendingChart',
						plotBorderWidth: 0,
						backgroundColor:'rgba(255, 255, 255, 0.0)',
						zoomType: 'xy',
						height:265,
						events: {
							load: function (event) {
								var extremes = this.yAxis[0].getExtremes();
								if (extremes.dataMax == 0) {
									extremes.max = 1;
									this.yAxis[0].setExtremes(0, 1);
								}
							}
						}

					},
					title: {
						text: ''
					},
					xAxis: {
						tickColor: '#3E4873',
						tickWidth: 2,
						tickLength: 15,
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						tickInterval: 1,
						minPadding: 0,
						maxPadding: 0,
						// offset: -4,
						// tickPositions: spendingData.index,
						labels: {
							enabled: true,
							useHTML: true,
							formatter: function () {
								return spendingData.labels[this.value];
							},
							style: {
								paddingTop: '17px',
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							}
						}
						// categories: spendingData.labels
					},
					yAxis: {
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						startOnTick: false,
						endOnTick: false,
						title: null,
						// offset: -5,
						labels: {
							enabled: false,
							style: {

							}
						}
					},
					legend: {
						enabled: false
					},
					tooltip: {
						 // borderColor: 'transparent',
						 backgroundColor: '#98DAFF99',
						 borderWidth: 1,
						 borderRadius: 6,
						 shadow: false,
						 style:{
							padding: 0,
							margin: 0
						 },
						useHTML: true,
						// headerFormat: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
						formatter: function(){
							 // debugger;
							 return '$'+ addCommasFormat(this.point.y.toFixed(2));
						 }
					},
					 plotOptions: {
						area: {
							marker: {
								enabled: false,
								symbol: 'circle',
								radius: 2,
								states: {
									hover: {
										enabled: true
									}
								}
							}
						},
						 series: {
							 fillColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
								stops: [
									[0, '#98DAFFff'],
									[1, '#98DAFF33']
								]
							},
							 states: {
								hover: {
									enabled: false,
									lineWidth: 0
								}
							},
							marker: {
								enabled: false
							},
							lineWidth: 0
						}
					},
					series: [{data: spendingData.data}]

					}
					, function(chart) {

					  }
					);
		});
	}

	//Function to get New Spending chart data six monthly
	this.getSpendingDataSixMonthly = function(){
		this.transactionsService.getSpendingChartDataSixMonthly(localStorage.getItem('customerId'))
		.subscribe( spendingData =>{

			//Setting Date Range
			this.spendingDateRange = spendingData.date_range;

			//Chart draw
			chartHolder = $('#spendingChart').highcharts({
					credits: {
						  enabled: false
					  },
					chart: {
						type: 'areaspline',
						renderTo: 'spendingChart',
						plotBorderWidth: 0,
						backgroundColor:'rgba(255, 255, 255, 0.0)',
						zoomType: 'xy',
						height:265,
						events: {
							load: function (event) {
								var extremes = this.yAxis[0].getExtremes();
								if (extremes.dataMax == 0) {
									extremes.max = 1;
									this.yAxis[0].setExtremes(0, 1);
								}
							}
						}

					},
					title: {
						text: ''
					},
					xAxis: {
						tickColor: '#3E4873',
						tickWidth: 2,
						tickLength: 15,
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						tickInterval: 1,
						minPadding: 0,
						maxPadding: 0,
						// offset: -4,
						// tickPositions: spendingData.index,
						labels: {
							enabled: true,
							useHTML: true,
							formatter: function () {
								return spendingData.labels[this.value];
							},
							style: {
								paddingTop: '17px',
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							}
						}
						// categories: spendingData.labels
					},
					yAxis: {
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						startOnTick: false,
						endOnTick: false,
						title: null,
						// offset: -5,
						labels: {
							enabled: false,
							style: {

							}
						}
					},
					legend: {
						enabled: false
					},
					tooltip: {
						 // borderColor: 'transparent',
						 backgroundColor: '#98DAFF99',
						 borderWidth: 1,
						 borderRadius: 6,
						 shadow: false,
						 style:{
							padding: 0,
							margin: 0
						 },
						useHTML: true,
						// headerFormat: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
						formatter: function(){
							 // debugger;
							 return '$'+ addCommasFormat(this.point.y.toFixed(2));
						 }
					},
					 plotOptions: {
						area: {
							marker: {
								enabled: false,
								symbol: 'circle',
								radius: 2,
								states: {
									hover: {
										enabled: true
									}
								}
							}
						},
						 series: {
							 fillColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
								stops: [
									[0, '#98DAFFff'],
									[1, '#98DAFF33']
								]
							},
							 states: {
								hover: {
									enabled: false,
									lineWidth: 0
								}
							},
							marker: {
								enabled: false
							},
							lineWidth: 0
						}
					},
					series: [{data: spendingData.data}]

					}
					, function(chart) {

					  }
					);
		});
	}


	//Function to get New Savings chart data
	this.getSavingsData = function(dur){
		let duration = dur;
		this.transactionsService.getSavingsChartData(localStorage.getItem('customerId'),duration)
		.subscribe( savingsData =>{

			this.savingsDataTemp = savingsData;

			//Setting Date Range
			this.savingDateRange = savingsData.date_range;
      this.changeDetector.detectChanges();
			//Chart draw
			chartHolder = $('#savingsChart').highcharts({
					credits: {
						  enabled: false
					  },
					chart: {
						type: 'areaspline',
						renderTo: 'savingsChart',
						plotBorderWidth: 0,
						backgroundColor:'rgba(255, 255, 255, 0.0)',
						zoomType: 'xy',
						height:265,
						events: {
							load: function (event) {
								var extremes = this.yAxis[0].getExtremes();
								if (extremes.dataMax == 0) {
									extremes.max = 1;
									this.yAxis[0].setExtremes(0, 1);
								}
							}
						}

					},
					title: {
						text: ''
					},
					xAxis: {
						tickColor: '#3E4873',
						tickWidth: 2,
						tickLength: 15,
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						tickInterval: 1,
						minPadding: 0,
						maxPadding: 0,
						// offset: -4,
						// tickPositions: spendingData.index,
						labels: {
							enabled: true,
							useHTML: true,
							formatter: function () {
								return savingsData.labels[this.value];
							},
							style: {
								paddingTop: '17px',
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							}
						}
						// categories: spendingData.labels
					},
					yAxis: {
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: '#3E4873',
						gridLineWidth: 0,
						plotLines: [{
							color: '#3E4873',
							width: 2,
							value: 0
						}],
						startOnTick: false,
						endOnTick: false,
						title: null,
						// offset: -5,
						labels: {
							enabled: false,
							style: {

							}
						}
					},
					legend: {
						enabled: false
					},
					tooltip: {
						 // borderColor: 'transparent',
						 backgroundColor: '#28CA6D99',
						 borderWidth: 1,
						 borderRadius: 6,
						 borderColor: '#28CA6D',
						 shadow: false,
						 style:{
							padding: 0,
							pointerEvents: 'auto'
						 },
						useHTML: true,
						// headerFormat: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
						formatter: function(){
							 return '<a class="render-pop" data-duration="'+duration+'" data-index="'+this.point.x+'" data-amount="'+this.point.y+'" data-toggle="modal" data-target="#savingDetailModal" style="text-decoration: none; color:#000;cursor:pointer !important;">$'+addCommasFormat(this.point.y.toFixed(2))+'</a>'
						 }
					},
					 plotOptions: {
						area: {
							marker: {
								enabled: false,
								symbol: 'circle',
								radius: 2,
								states: {
									hover: {
										enabled: true
									}
								}
							}
						},
						 series: {
							 fillColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
								stops: [
									[0, '#28CA6Dff'],
									[1, '#28CA6D33']
								]
							},
							 states: {
								hover: {
									enabled: false,
									lineWidth: 0
								}
							},
							marker: {
								enabled: false
							},
							lineWidth: 0
						}
					},
					series: [{data: savingsData.data}]

					}
					, function(chart) {

					  }
					);
		});
	}


	//Function to get New Investing chart data weekly
	this.getInvestingDataWeekly = function(){
		this.transactionsService.getInvestingChartDataWeekly(localStorage.getItem('customerId'))
		.subscribe( investingData =>{

			//Setting Date Range
			this.investingDateRange = investingData.date_range;

			//Chart draw
			chartHolder = $('#investingChart').highcharts({
					credits: {
						  enabled: false
					  },
					chart: {
						type: 'areaspline',
						renderTo: 'investingChart',
						plotBorderWidth: 0,
						backgroundColor:'rgba(255, 255, 255, 0.0)',
						zoomType: 'xy',
						height:265,
						events: {
							load: function (event) {
								var extremes = this.yAxis[0].getExtremes();
								if (extremes.dataMax == 0) {
									extremes.max = 1;
									this.yAxis[0].setExtremes(0, 1);
								}
							}
						}

					},
					title: {
						text: ''
					},
					xAxis: {
						tickColor: '#3E4873',
						tickWidth: 2,
						tickLength: 15,
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						tickInterval: 1,
						minPadding: 0,
						maxPadding: 0,
						// offset: -4,
						// tickPositions: investingData.index,
						labels: {
							enabled: true,
							useHTML: true,
							formatter: function () {
								return investingData.labels[this.value];
							},
							style: {
								paddingTop: '17px',
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							}
						}
						// categories: investingData.labels
					},
					yAxis: {
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						startOnTick: false,
						endOnTick: false,
						title: null,
						// offset: -5,
						labels: {
							enabled: false,
							style: {

							}
						}
					},
					legend: {
						enabled: false
					},
					tooltip: {
						 // borderColor: 'transparent',
						 backgroundColor: '#D7C6FB99',
						 borderWidth: 1,
						 borderRadius: 6,
						 borderColor: '#D7C6FB',
						 shadow: false,
						 style:{
							padding: 0,
							margin: 0
						 },
						useHTML: true,
						// headerFormat: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
						formatter: function(){
							 // debugger;
							 return '$'+ addCommasFormat(this.point.y.toFixed(2));
						 }
					},
					 plotOptions: {
						area: {
							marker: {
								enabled: false,
								symbol: 'circle',
								radius: 2,
								states: {
									hover: {
										enabled: true
									}
								}
							}
						},
						 series: {
							 fillColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
								stops: [
									[0, '#D7C6FBff'],
									[1, '#D7C6FB33']
								]
							},
							 states: {
								hover: {
									enabled: false,
									lineWidth: 0
								}
							},
							marker: {
								enabled: false
							},
							lineWidth: 0
						}
					},
					series: [{data: investingData.data}]

					}
					, function(chart) {

					  }
					);
		});
	}


	//Function to get New Investing chart data monthly
	this.getInvestingDataMonthly = function(){
		this.transactionsService.getInvestingChartDataMonthly(localStorage.getItem('customerId'))
		.subscribe( investingData =>{

			//Setting Date Range
			this.investingDateRange = investingData.date_range;

			//Chart draw
			chartHolder = $('#investingChart').highcharts({
					credits: {
						  enabled: false
					  },
					chart: {
						type: 'areaspline',
						renderTo: 'investingChart',
						plotBorderWidth: 0,
						backgroundColor:'rgba(255, 255, 255, 0.0)',
						zoomType: 'xy',
						height:265,
						events: {
							load: function (event) {
								var extremes = this.yAxis[0].getExtremes();
								if (extremes.dataMax == 0) {
									extremes.max = 1;
									this.yAxis[0].setExtremes(0, 1);
								}
							}
						}

					},
					title: {
						text: ''
					},
					xAxis: {
						tickColor: '#3E4873',
						tickWidth: 2,
						tickLength: 15,
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						tickInterval: 1,
						minPadding: 0,
						maxPadding: 0,
						// offset: -4,
						// tickPositions: investingData.index,
						labels: {
							enabled: true,
							useHTML: true,
							formatter: function () {
								return investingData.labels[this.value];
							},
							style: {
								paddingTop: '17px',
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							}
						}
						// categories: investingData.labels
					},
					yAxis: {
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						startOnTick: false,
						endOnTick: false,
						title: null,
						// offset: -5,
						labels: {
							enabled: false,
							style: {

							}
						}
					},
					legend: {
						enabled: false
					},
					tooltip: {
						 // borderColor: 'transparent',
						 backgroundColor: '#D7C6FB99',
						 borderWidth: 1,
						 borderRadius: 6,
						 borderColor: '#D7C6FB',
						 shadow: false,
						 style:{
							padding: 0,
							margin: 0
						 },
						useHTML: true,
						// headerFormat: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
						formatter: function(){
							 // debugger;
							 return '$'+ addCommasFormat(this.point.y.toFixed(2));
						 }
					},
					 plotOptions: {
						area: {
							marker: {
								enabled: false,
								symbol: 'circle',
								radius: 2,
								states: {
									hover: {
										enabled: true
									}
								}
							}
						},
						 series: {
							 fillColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
								stops: [
									[0, '#D7C6FBff'],
									[1, '#D7C6FB33']
								]
							},
							 states: {
								hover: {
									enabled: false,
									lineWidth: 0
								}
							},
							marker: {
								enabled: false
							},
							lineWidth: 0
						}
					},
					series: [{data: investingData.data}]

					}
					, function(chart) {

					  }
					);
		});
	}

	//Function to get New Investing chart data six monthly
	this.getInvestingDataSixMonthly = function(){
		this.transactionsService.getInvestingChartDataSixMonthly(localStorage.getItem('customerId'))
		.subscribe( investingData =>{

			//Setting Date Range
			this.investingDateRange = investingData.date_range;

			//Chart draw
			chartHolder = $('#investingChart').highcharts({
					credits: {
						  enabled: false
					  },
					chart: {
						type: 'areaspline',
						renderTo: 'investingChart',
						plotBorderWidth: 0,
						backgroundColor:'rgba(255, 255, 255, 0.0)',
						zoomType: 'xy',
						height:265,
						events: {
							load: function (event) {
								var extremes = this.yAxis[0].getExtremes();
								if (extremes.dataMax == 0) {
									extremes.max = 1;
									this.yAxis[0].setExtremes(0, 1);
								}
							}
						}

					},
					title: {
						text: ''
					},
					xAxis: {
						tickColor: '#3E4873',
						tickWidth: 2,
						tickLength: 15,
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						tickInterval: 1,
						minPadding: 0,
						maxPadding: 0,
						// offset: -4,
						// tickPositions: investingData.index,
						labels: {
							enabled: true,
							useHTML: true,
							formatter: function () {
								return investingData.labels[this.value];
							},
							style: {
								paddingTop: '17px',
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							}
						}
						// categories: investingData.labels
					},
					yAxis: {
						lineColor: '#3E4873',
						lineWidth: 2,
						gridLineColor: 'transparent',
						startOnTick: false,
						endOnTick: false,
						title: null,
						// offset: -5,
						labels: {
							enabled: false,
							style: {

							}
						}
					},
					legend: {
						enabled: false
					},
					tooltip: {
						 // borderColor: 'transparent',
						 backgroundColor: '#D7C6FB99',
						 borderWidth: 1,
						 borderRadius: 6,
						 borderColor: '#D7C6FB',
						 shadow: false,
						 style:{
							padding: 0,
							margin: 0
						 },
						useHTML: true,
						// headerFormat: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
						formatter: function(){
							 // debugger;
							 return '$'+ addCommasFormat(this.point.y.toFixed(2));
						 }
					},
					 plotOptions: {
						area: {
							marker: {
								enabled: false,
								symbol: 'circle',
								radius: 2,
								states: {
									hover: {
										enabled: true
									}
								}
							}
						},
						 series: {
							 fillColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
								stops: [
									[0, '#D7C6FBff'],
									[1, '#D7C6FB33']
								]
							},
							 states: {
								hover: {
									enabled: false,
									lineWidth: 0
								}
							},
							marker: {
								enabled: false
							},
							lineWidth: 0
						}
					},
					series: [{data: investingData.data}]

					}
					, function(chart) {

					  }
					);
		});
	}



  //Fetch Welcome Section data
	this.getWelcomeData = function(){
      /** Getting cash activity 6 monthly **/
      var wdata = [];
      this.transactionsService.getWelcomeData(localStorage.getItem('customerId'))
		  .subscribe( data  =>{
			  wdata = data;
        this.welcomeData = wdata;
		this.welcomeData.credit_available = addCommasFormat(parseFloat(this.welcomeData.credit_available).toFixed(2));
		$('#ccUtilModal .progress-bar').attr('style','width:'+this.welcomeData.credit_utilization+'%');
		$('#ccUtilModal .progress-bar').attr('aria-valuenow',this.welcomeData.credit_utilization);
		$('#ccUtilModal .progress-bar').text(this.welcomeData.credit_utilization+'%');
		var bgClass = "";
		var status = 'Not Known';
		if(this.welcomeData.credit_utilization<=15){
			bgClass = "green-fill";
			status = "Good";
		}else if(this.welcomeData.credit_utilization>15 && this.welcomeData.credit_utilization<51){
			bgClass = "yellow-fill";
			status = "OK";
		}else if(this.welcomeData.credit_utilization>50){
			bgClass = "red-fill";
			status = "High";
		}
		$('#ccuStatus').text(status);
		$('#ccuStatus').addClass(bgClass);
		$('#ccUtilModal .progress-bar').addClass(bgClass);
        this.sixMonthTransactions = wdata['sixMonthTransactions'];
        this.oneMonthTransactions = wdata['oneMonthTransactions'];
        this.changeDetector.detectChanges();
        setTimeout(function(){
          $('[data-toggle="tooltip"]').tooltip({
            html:true});
        },500);
		  });
	}



	//Fetch Income 6 month avg data
	this.getIncomeData = function(){
		// debugger;
		/** Getting cash activity 6 monthly **/
		this.transactionsService.getIncomeData(localStorage.getItem('customerId'))
		  .subscribe( data  =>{
			  this.incomeData = data;

        this.incomeTrans = data.sixMonthIncomeTransactions;
		  });
	}


	//Fetch Projected yearly income data
	this.getProjectedIncomeData = function(){
		// debugger;
		this.transactionsService.getProjectedIncomeData(localStorage.getItem('customerId'))
		  .subscribe( data  =>{
			  this.projectedIncomeData = data;
		  });
	}


  //Fetch Income Stream data directly from plaid
	this.getIncomeStreamData = function(){
		/** Income Stream data  **/
		this.transactionsService.getIncomeStreamData(localStorage.getItem('customerId'))
		  .subscribe( data  =>{

			  this.incomeStreamData = data;
        // console.log(this.incomeStreamData);
		  });
	}
	this.getIncomeStreamData();
	/** Getting recent transactions from all account **/
	$('.recent-tran-tile').append(html);
	this.transactionsService.getDashboardRecentTransactions(localStorage.getItem('customerId'))
    .subscribe( recTransactions =>{
		this.recentTransactions =JSON.parse(JSON.stringify(Object.values(recTransactions)));
		//console.log(this.recentTransactions);
		$('.recent-tran-tile #load').remove();
	});


	/** Getting money inflow data for 2 years **/

	function afterDraw(){
			$('.money_inflow_tile #load').remove();
			// debugger;
  }

  let googleChart;
	this.inflowData = function(){

	$('.money_inflow_tile').append(html);
	this.transactionsService.getDashboardMoneyInflow(localStorage.getItem('customerId'))
    .subscribe( moneyInflow  =>{
		this.dashboardMoneyInflow = moneyInflow;
		$('#timeRangeInflow').text(moneyInflow[0].firstTime + " - "+moneyInflow[0].lastTime);
		// debugger;
		var totalAmount = 0;
		var divider = 0;
		var firstTime = '',lastTime = '';
		for(var i =0;i<moneyInflow.length;i++){
		  if(parseFloat(moneyInflow[i].totalAmount) > 0 && i!=5){
			if(firstTime != ''){
			  lastTime = moneyInflow[i].label;
			}else{
			  firstTime = moneyInflow[i].label;
			}

			totalAmount += moneyInflow[i].totalAmount;
			divider++;
		  }
		}
		var rangeTimeAvg = moment().month(firstTime).format("MMMM") +  "-" + moment().month(lastTime).format("MMMM");
		// debugger;
		$('.money_inflow .fa-info-circle').attr('data-original-title', "Average was calculated for the " +rangeTimeAvg +" timeframe");
		if(totalAmount >= 0 && divider > 0){
			totalAmount = totalAmount/divider;
			$('#inflowAverage').html('$'+addCommasFormat(totalAmount.toFixed(2)));
		}

		var index= 5;
		$($('.inflow_btns .btn')[index]).addClass('active');

		this.loadGoogleChart(index);

		//this.changeDetector.detectChanges();
		});
	}


  this.loadGoogleChart = function(index){

      $('.inflow_btns .btn.active').removeClass('active');
      $($('.inflow_btns .btn')[index]).addClass('active');
      google.charts.load('current', {'packages': ['corechart']});

      if(index >= 0){
        var amtHolder = this.dashboardMoneyInflow[index];

        var directAmt = amtHolder.directAmount;
        var cashAmt = amtHolder.cashAmount;
        var extAmt = amtHolder.extAmount;
        var othersAmt = amtHolder.othersAmount;
        var checkAmt = amtHolder.checkAmount;
        var totalAmt = directAmt+cashAmt+extAmt+checkAmt+othersAmt;

        var directPerc = (directAmt/totalAmt)*100;
        var cashPerc = (cashAmt/totalAmt)*100;
        var extPerc = (extAmt/totalAmt)*100;
        var othersPerc = (othersAmt/totalAmt)*100;

        $('#directAmount').html('$'+addCommasFormat(directAmt.toFixed(2)));
        $('#cashAmount').html('$'+addCommasFormat(cashAmt.toFixed(2)));
        $('#extAmount').html('$'+addCommasFormat(extAmt.toFixed(2)));
        $('#checkAmount').html('$'+addCommasFormat(checkAmt.toFixed(2)));
        $('#othersAmount').html('$'+addCommasFormat(othersAmt.toFixed(2)));

        // let data = google.visualization.arrayToDataTable([
          // ['Inflows', '$'],
          // ['Direct Deposits $', directAmt],
          // ['Cash Deposits $', cashAmt],
          // ['External Transfers $', extAmt],
          // ['Others $',othersAmt]
        // ]);


		chartHolder = $('#inflow_chart').highcharts({
			credits: {
						  enabled: false
					  },
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: 0,
				plotShadow: false,
        spacingBottom: 0,
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 70,

        // Explicitly tell the width and height of a chart
        width: 500,
        height: 500

			},
			title: {
				text: '<span style="font-size: 24px;font-weight:400; color: #3E4873;">$'+addCommasFormat(totalAmt.toFixed(2))+'<br><br><small style=" color: #3E4873;font-weight:400;font-size: 18px;font-family:NunitoSans">Total</small></span>',
				align: 'center',
				verticalAlign: 'middle',
				y: 0,
				style: {
						fontFamily: 'NunitoSans'
					}
			},
			tooltip: {
				// pointFormat: '<b align="center">${point.y:.2f}</b>'
				borderRadius: 9,
				followPointer: false,
				useHTML: true,
				backgroundColor: '#505e77',
				 style: {
					color: '#fff',
					fontWeight: 'bold'
				},
				formatter: function () {
					// debugger;
					return '<p align="center" style="line-height:1;" class="pl-2 pr-2 pt-2"><span style="text-align: center;font-family:NunitoSans; font-size: 12px;">'+this.point.name+'</span></p>';
				}
			},
			plotOptions: {
				pie: {
					dataLabels: {
						enabled: true,
						// distance: 0,
						style: {
							fontWeight: 'normal',
							textOutline: '0px',
							color: '#3c4876',
							fontSize: '16px',
							fontFamily: 'NunitoSans'
						}
					},
					startAngle: 0,
					endAngle: 360,
					center: ['50%', '50%']
					,
					size: '70%'
				}
				,
				series: {
					dataLabels: {
						enabled: true,
						formatter: function() {
							return Math.round(this.percentage) + '%';
						},
						distance: 10,
						color:'#3c4876'

					},
          cursor:'pointer',
          point:{

            events:{

              click:function(event){
                debugger;
                selfObj.moneyPopup(this.options.index);
                $('#hiddenBtnForPopup').trigger('click');
              }
            }
          }
				}
			},
			series: [{
				type: 'pie',
				name: '',
				innerSize: '60%',
				data: [
				{
					name: 'Direct Deposits',
					y: directAmt,
					color:'#98DAFF',
          index:1
				},
				{
					name: 'Cash Deposits',
					y: cashAmt,
					color:'#2FD7B4',
          index:2
				},
				{
					name: 'External Transfers',
					y: extAmt,
					color:'#D7C6FB',
          index:3
				},
				{
					name: 'Checks',
					y: checkAmt,
					color:'#D990FB',
          index:4
				},
				{
					name: 'Others',
					y: othersAmt,
					color:'#D58FA6',
          index:5
				}
				].filter(function(d) {
					// debugger;
					return Math.round((d.y/totalAmt)*100) > 0;
				}


        )
			}]
		});

      }

  }



  /** Fee Analyzer 6 months **/
  this.cashAcct6Month = function(){

	$('.cash_activity').append(html);

	/** Getting cash activity 6 monthly **/
    this.transactionsService.getDashboardCashActivity6Monthly(localStorage.getItem('customerId'))
      .subscribe( data  =>{
      var parsedData = JSON.parse(JSON.stringify(data));
      // this.atmFee = addCommasFormat(parseFloat(parsedData.atmFee).toFixed(2));
      this.bankFee = addCommasFormat(parseFloat(parsedData.bankFee).toFixed(2));
      this.financeCharge = addCommasFormat(parseFloat(parsedData.financeCharge).toFixed(2));
      this.bankTrans = parsedData.bankTrans;
      this.financeTrans = parsedData.financeTrans;

      // this.lateFee = addCommasFormat(parseFloat(parsedData.lateFee).toFixed(2));
      // this.serviceFee = addCommasFormat(parseFloat(parsedData.serviceFee).toFixed(2));
      // this.tradeCommisions = addCommasFormat(parseFloat(parsedData.tradeCommisions).toFixed(2));
	  // $('.cash_activity #load').remove();
        this.changeDetector.detectChanges();
    });
  }



    /** Getting current ratio / credit utilization **/
	$('.current-ratio-tile').append(html);
    this.transactionsService.getDashboardCreditUtilization(localStorage.getItem('customerId'))
    .subscribe( data  =>{
      let creditUtilData = JSON.parse(JSON.stringify(data));

      var percent = Math.floor(((creditUtilData.used_credit/creditUtilData.available_credit)));
      $('#Credit_available').html('$'+ addCommasFormat(creditUtilData.available_credit.toFixed(2)));
      $('#Credit_used').html('$'+addCommasFormat(creditUtilData.used_credit.toFixed(2)));
      $('#credit_percent').html(percent.toFixed(1)+'x');
      $('#credit_utilization_percent').addClass('p'+percent.toFixed(0));
      $('.current-ratio-tile #load').remove();
    });

    /** Getting credit cards **/
	$('.credit_balances').append(html);
    this.transactionsService.getDashboardCreditCards(localStorage.getItem('customerId'))
    .subscribe( data  =>{
          let totalCreditBalances = 0;
          //this.creditCardsData = JSON.parse(JSON.stringify(Object.values(data)));
          let creditCardsDatas = Object.values(data);
          creditCardsDatas.forEach(function(v,i){
              totalCreditBalances += +v.balance;
              creditCardsDatas[i]['balance'] = addCommasFormat(v.balance);
              creditCardsDatas[i]['bank_logo_img'] = 'data:image/jpg;base64,'+v.bank_logo;
          });

          this.creditCardsData = creditCardsDatas;
          // console.log(this.creditCardsData);
          $('#accountsTotal').html('$' + addCommasFormat(totalCreditBalances.toFixed(2)));
          this.currentDateTime = moment().format('M/D/YYYY, hh:mm A')+" "+momenttz.tz(momenttz.tz.guess()).format("z");
          $('.credit_balances #load').remove();
    });


	/** Getting top merchants **/
  this.getMerchant = function(duration){
    this.transactionsService.getDashboardTopMerchants(localStorage.getItem('customerId'),duration)
      .subscribe( data  =>{

      this.merchantsList = JSON.parse(JSON.stringify(Object.values(data)));
      this.goldenNuggetAmount = addCommasFormat("0.00");
      $('#golden_merchant').html("--Select Vendor--");
      // console.log(this.merchantsList);
      });
  }
  this.moneyPopup = function(dataIndex){
    debugger;
    var listArray = $('.inflow_btns .btn');
    var selectedIndex = listArray.index(listArray.parent().find('.active'));
    var dataText = '';
    if(dataIndex == 1){
      this.dTransArr = this.dashboardMoneyInflow[selectedIndex].directTransactions;
      dataText = 'Direct Deposits';
    }
    if(dataIndex == 2){
      this.dTransArr = this.dashboardMoneyInflow[selectedIndex].cashTransactions;
      dataText = 'Cash Deposits';
    }
    if(dataIndex == 3){
      this.dTransArr = this.dashboardMoneyInflow[selectedIndex].extTransactions;
      dataText = 'External Transfers';
    }
    if(dataIndex == 4){
      this.dTransArr = this.dashboardMoneyInflow[selectedIndex].checkTransactions;
      dataText = 'Checks';
    }
    if(dataIndex == 5){
      this.dTransArr = this.dashboardMoneyInflow[selectedIndex].othersTransactions;
      dataText = 'Others';
    }
    this.dPopup(dataText, 0 , 0);
    //$('#transModal').modal('show');
  }

  this.dPopup = function(category,type=0,index=0){
          //$('#spendingModal .modal-title').text(category+' Transactions');
          //$('#spendingModal').append(html);
		  $.fn.dataTable.moment( 'MMM D, YYYY' );
		  if(category=="Spending Transactions for Last Six Months"){
			$('#transModal .modal-title').text('Spending Transactions for Last Six Months');
		  }else{
			  $('#transModal .modal-title').text(category+' Transactions');
		  }
     var s = $('#dTPopTable').DataTable( {
       fixedHeader:true,
            "destroy": true,
			"pageLength": 100,
            "data": this.dTransArr,
            "paging": true,
                "order": [[ 0, "desc" ]],
                "language": {
					"searchPlaceholder": "Search",
					"search": "",
					 "paginate": {
						  "next": '>',
						  "previous": '<'
						},
					"info": "_TOTAL_ entries found",
					"emptyTable": "No data available",
					"infoEmpty": "No  items to show"
				},
			"columns": [
				{  "data"   :  'posted_date' },
				{  "data"   :  'normalized_payee_name'},
				 {  "data"   :  'category' },
				  {  "data"   :  'amount' }
			  ],
			"createdRow": function ( row, data, index ) {
				//Dot draw in front of amount
          if(data != undefined){
              var posted_date = moment(parseInt(data.posted_date)).format("MMM D, YYYY");
              var payee_name = '';
              if(data.official_name != undefined){
                 payee_name =  "<br/><span class='subsection'>" + (data.institution_id)+ " - " +(data.official_name[0]) + " ("+data.ac_number[0]+")</span>";
              }else if((data.accounts!= undefined) && data.accounts.length){
                  payee_name = "<br/><span class='subsection'>"+ (data.accounts[0]['institution_id'])+ " - " +(data.accounts[0]['official_name']) + " ("+data.accounts[0]['ac_number']+")</span>";
              }else{
                  payee_name = "";
              }
              $('td', row).eq(0).html(posted_date);
              $('td', row).eq(1).html(data.normalized_payee_name+payee_name.toLowerCase());
              if ( data.amount < 0) {
                 $('td', row).eq(3).html("$"+addCommasFormat(parseFloat(data.amount).toFixed(2)));
              }else{
                 $('td', row).eq(3).html("$"+addCommasFormat(parseFloat(data.amount).toFixed(2)));
              }
          }

			},
			"dom": "i<'row w-100 pt-4'f>rtp",
       "drawCallback": function( settings ) {

       },
      "initComplete": function( settings ) {
            $('#transModal .dataTable').wrap('<div class="dataTables_scroll" />');
        }
      });
      $('#dTPopTable tbody').unbind().on('click','tr',function(){
        var data  = s.row(this).data();
        selfObj.singleTransactionLoad(data['trans_id']);

      });
  }

  this.renderPopUp = function(index=0){
      if(index == 1){
          // debugger;
		   $('#overviewModal .modal-title').text('Accounts List');
          var t = $('#transactionsPopTable').DataTable( {
            "destroy": true,
			"pageLength": 100,
            "data": this.creditCardsData,
            "paging": true,
			// "order": [[ 0, "desc" ]],
			"language": {
				"searchPlaceholder": "Search",
				"search": "",
				 "paginate": {
					  "next": '>',
					  "previous": '<'
					},
				"info": "_TOTAL_ entries found",
				"emptyTable": "No data available",
				"infoEmpty": "No  items to show"
			},
			"columnDefs": [
				{ "width": "35%", "targets": 0 },
				{ "width": "50%", "targets": 1 },
				{ "width": "15%", "targets": 2 }
			],
			"columns": [
				{  "data"   :  function (data, type, dataToSet) {
							return  '<img src="data:image/jpg;base64,'+data.bank_logo+'" class="mr-3" /><span>'+data.institution_id+'</span>';
				}   },
				{  "data"   :  function (data, type, dataToSet) {
							return  data.official_name + " ("+ data.mask + ')';
				}    },
				{  "data"   :  function (data, type, dataToSet) {
							return  "$"+data.balance;
				}     }
			  ],
			"dom": "i<'row w-100 pt-4'f>rtp",
			 "initComplete": function( settings ) {
                $('#overviewModal .dataTable').wrap('<div class="dataTables_scroll" />');
            }
       });

      }else if(index == 2){
                // debugger;
              $('#ccDetailModal .modal-title').text('Credit Cards Info');
                  var t = $('#ccPopTable').DataTable( {
                    "destroy": true,
              "pageLength": 100,
                    "data": this.creditCardsData,
                    "paging": true,
              // "order": [[ 0, "desc" ]],
              "language": {
                "searchPlaceholder": "Search",
                "search": "",
                "paginate": {
                    "next": '>',
                    "previous": '<'
                  },
                "info": "_TOTAL_ entries found",
                "emptyTable": "No data available",
                "infoEmpty": "No  items to show"
              },
              "columnDefs": [
                { "width": "15%", "targets": 0 },
                { "width": "40%", "targets": 1 },
                { "width": "15%", "targets": 2 },
                { "width": "15%", "targets": 3 },
                { "width": "15%", "targets": 4 },
              ],
              "columns": [
                {  "data"   :  function (data, type, dataToSet) {
                      return  '<img src="data:image/jpg;base64,'+data.bank_logo+'" class="mr-3" /><span>'+data.institution_id+'</span>';
                }   },
                {  "data"   :  function (data, type, dataToSet) {
                      return  data.official_name + " ("+ data.mask + ')';
                }    },
                {  "data"   :  function (data, type, dataToSet) {
                      return  "$"+data.balance;
                }     },
                {  "data"   :  function (data, type, dataToSet) {
                      return  "$"+data.credit_limit;
                }    },
                {  "data"   :  function (data, type, dataToSet) {

                      return  "$"+data.available_credit;
                }    }
                ],
              "dom": "i<'row w-100 pt-4'f>rtp",
              "initComplete": function( settings ) {
                        $('#ccDetailModal .dataTable').wrap('<div class="dataTables_scroll" />');
                    }
              });


      }else if(index == 3){
                // debugger;
          $('#incomeStreamDetailModal .modal-title').text('Income Streams');
                  var t = $('#incomeStreamPopTable').DataTable( {
                    "destroy": true,
              "pageLength": 100,
                    "data": this.incomeStreamData.streams,
                    "paging": true,
              // "order": [[ 0, "desc" ]],
              "language": {
                "searchPlaceholder": "Search",
                "search": "",
                "paginate": {
                    "next": '>',
                    "previous": '<'
                  },
                "info": "_TOTAL_ entries found",
                "emptyTable": "No data available",
                "infoEmpty": "No  items to show"
              },
              "columnDefs": [
                { "width": "70%", "targets": 0 },
                { "width": "30%", "targets": 1 }
              ],
              "columns": [
                {  "data"   :  function (data, type, dataToSet) {
                      return  data._id;
                }   },
                {  "data"   :  function (data, type, dataToSet) {
                      return  '$'+addCommasFormat(parseFloat(data.amountOfstream));
                }    }
                ],
              "dom": "i<'row w-100 pt-4'f>rtp",
              "initComplete": function( settings ) {
                        $('#incomeStreamDetailModal .dataTable').wrap('<div class="dataTables_scroll" />');
                    }
              });


      }
  }


  $(document).on('click','.render-pop',function(){
		var data;

		var filteredData = [];
		var lblIndex = $(this).data('index');
		var label = ['<p>Su<br/>&nbsp;</p>','<p>M<br/>&nbsp;</p>','<p>T<br/>&nbsp;</p>','<p>W<br/>&nbsp;</p>','<p>Th<br/>&nbsp;</p>','<p>F<br/>&nbsp;</p>','<p>Sa<br/>&nbsp;</p>'];
		var duration = $(this).data('duration');


		var dateRangeStr = '';
		var amtStr = $(this).data('amount');

		data = selfObj.savingsDataTemp.rawdata;


		// debugger;

		if(duration==1){		//weekly savings
			// data = selfObj.savingsDataWeeklyTemp.rawdata;
			// var lblIndex = getItemIndexInArray(selfObj.savingsDataWeeklyTemp.labels,["",dataIndex,""]);
			var dateRangeTS = selfObj.savingsDataTemp.monthly_labels[lblIndex];
      //filteredData.push(data[lblIndex]);

			for(var i=0; i<data.length;i++){
				if(lblIndex == data[i].dayIndex){
					filteredData.push(data[i]);
				}
			}
			dateRangeStr = moment.unix(parseInt(dateRangeTS)).format('M/D/YYYY');
		}else if(duration==2){		//monthly savings
			// data = selfObj.savingsDataMonthlyTemp.rawdata;
			// dataIndex = dataIndex.split(',');
			// var lblIndex = getItemIndexInArray(selfObj.savingsDataMonthlyTemp.labels,dataIndex);
			var dateRangeTS = selfObj.savingsDataTemp.monthly_labels[lblIndex].split("-");
			var account_name = "";

			for(var i=0; i<data.length;i++){
				if(lblIndex == data[i].dayIndex){
					filteredData.push(data[i]);
				}
			}
			dateRangeStr = moment.unix(parseInt(dateRangeTS[0])).format('M/D/YYYY')+"-"+moment.unix(parseInt(dateRangeTS[1])).format('M/D/YYYY');
		}else if(duration==3){		//6 monthly savings
			// data = selfObj.savingsData6MonthlyTemp.rawdata;
			// var lblIndex = getItemIndexInArray(selfObj.savingsData6MonthlyTemp.labels,["",dataIndex,""]);
			var dateRangeTS = selfObj.savingsDataTemp.monthly_labels[lblIndex].split("-");
			var account_name = "";
			var sum = 0;
			var sumCount = 0;
			var loopIndex = -1;

			for(var i=0; i<data.length;i++){
				if(lblIndex == data[i].dayIndex){
					filteredData.push(data[i]);
				}
			}
			dateRangeStr = moment.unix(parseInt(dateRangeTS[0])).format('M/D/YYYY')+"-"+moment.unix(parseInt(dateRangeTS[1])).format('M/D/YYYY');
		}else{
			data = {};
		}

		$('#dateRangeTxtC').text(dateRangeStr);
		$('#amountAsOfC').html("$"+addCommasFormat(amtStr));


		// var t = $('#transactionsPopTable').DataTable();
		// t.clear().draw(true);
		// t.fnDestroy();
    $('#savingDetailModal .modal-title').text('Saving Balance');
		var t = $('#savingPopTable').DataTable( {
			"destroy": true,
			"pageLength": 100,
			"data": filteredData,
			"paging": true,
				"order": [[ 0, "desc" ]],
				"language": {
				"searchPlaceholder": "Search",
				"search": "",
				 "paginate": {
					  "next": '>',
					  "previous": '<'
					},
				"info": "_TOTAL_ entries found",
				"emptyTable": "No data available",
				"infoEmpty": "No  items to show"
			},
			"columnDefs": [
				{ "width": "30%", "targets": 0 },
				{ "width": "50%", "targets": 1 },
				{ "width": "20%", "targets": 2 }
			],
      "columns": [
				{  "data"   :  function (data, type, dataToSet) {
							return  '<img src="data:image/jpg;base64,'+data.accounts[0].bank_logo+'" class="mr-3" /><span>'+data.accounts[0].institution_id+'</span>';
				}   },
				{  "data"   :  function (data, type, dataToSet) {
							return  data.accounts[0].official_name + " ("+ data.accounts[0].ac_number + ')';
				}    },
				{  "data"   :  function (data, type, dataToSet) {
							return  "$"+data.savingBalance;
				}     }
      ],
			"createdRow": function ( row, data, index ) {
					//Dot draw in front of amount
					if ( data.savingBalance < 0) {
						$('td', row).eq(2).html("$"+addCommasFormat(parseFloat(data.savingBalance).toFixed(2)));
					}else{
						$('td', row).eq(2).html("$"+addCommasFormat(parseFloat(data.savingBalance).toFixed(2)));
					}
			},
			"dom": "i<'row w-100 pt-4'f>rtp",
      "initComplete": function( settings ) {
                $('#savingDetailModal .dataTable').wrap('<div class="dataTables_scroll" />');
            }
		});

	});


}//end of ngInit()


/** Get Golden Nuggets data **/
fetchNugget(e,v="",elem){
	// debugger;

	var dataName = "Last Week";
	// this.goldenNuggetAmount = addCommasFormat('0.00');

	  $('.golden_nuggets').append(html);

	  if(elem !=null){
		$('.golden-nugget .active').removeClass('active');

		if(elem == "month"){
			$('.golden-nugget .month').addClass('active');
		}else if(elem == "6month"){
			$('.golden-nugget .6month').addClass('active');
		}else if(elem == "year"){
			$('.golden-nugget .year').addClass('active');
		}
	  }
	  dataName = $('.golden-nugget p .active').data('name');

	  var fromDate = 0;
	  var toDate = moment().unix()*1000;
	  var selectedMerchant = '';

		// $('#golden_interval').attr('data-name',);

		if(e==0){
			// $('#golden_interval').html('Last Week');
			$('#golden_interval').attr('data-name','Last Month');

			fromDate = moment().subtract(1, 'month').unix()*1000;
			// this.getMerchant('week');
		}else if(e==1){
			// $('#golden_interval').html('Last Month');
			$('#golden_interval').attr('data-name','Last Six Month');
			fromDate = moment().subtract(6, 'months').unix()*1000;
			// this.getMerchant('month');
		}else if(e==2){
			// $('#golden_interval').html('Last Six Months');
			$('#golden_interval').attr('data-name','Last Twelve Months');
			fromDate = moment().subtract(12, 'months').unix()*1000;
			// this.getMerchant('6months');
		}else if(e==3){
			$('#golden_merchant').html('<span style="vertical-align: middle;"><img src="assets/images/monthly-spending.png" border="0" width="14" style="width:14px;min-width:14px;" title="" />&nbsp;&nbsp;'+v+'</span>');
			$('#golden_merchant').attr('data-name',v);
			if(dataName=='Last Month'){
				fromDate = moment().subtract(1, 'month').unix()*1000;
			}
			else if(dataName=='Last Six Month'){
				fromDate = moment().subtract(6, 'months').unix()*1000;
			}else if(dataName=='Last Twelve Months'){
				fromDate = moment().subtract(12, 'months').unix()*1000;
			}
		}

		selectedMerchant = $('#golden_merchant').attr('data-name');

		// console.log("From Date: "+fromDate+" Merchant: "+selectedMerchant);

		if(selectedMerchant!=""){
			let data:any[] = [];

			this.transactionsService.getTransactionsForNuggets(fromDate, toDate, localStorage.getItem('customerId'),"",selectedMerchant)
			.subscribe( transactions  =>{
				var amount = 0;

				data = JSON.parse(JSON.stringify(transactions));
        this.nuggetTransactions = data;
				// console.log(data);
				if(data.length){

					data.forEach( function(v,i){
						amount += +v.amount;
					});
				}
				this.goldenNuggetAmount = addCommasFormat(amount.toFixed(2));

        this.changeDetector.detectChanges();
				// $('.golden_nuggets #load').remove();
			});
		}else{
			// $('.golden_nuggets #load').remove();
			this.goldenNuggetAmount = addCommasFormat('0.00');

      this.changeDetector.detectChanges();
		}


	}





}//end of class





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

function getItemIndexInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return i;   // Found it
        }
    }
    return -1;   // Not found
}

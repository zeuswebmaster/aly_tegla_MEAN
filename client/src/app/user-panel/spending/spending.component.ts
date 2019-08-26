import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Transaction } from '../../schema/transaction';
import { TransactionsService } from '../../services/transactions.service';
import { SpendingService } from '../../services/spending.service';
import { Account } from '../../schema/account';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import * as ProgressBar from 'progressbar.js';
import * as Highcharts from 'highcharts';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);

let chartHolder;
let spendingRatioGlobal;
let url = '';
declare var $: any;

@Component({
  selector: 'app-spending',
  templateUrl: './spending.component.html',
  styleUrls: ['./spending.component.css'],
  providers: [SpendingService, TransactionsService]
})
export class SpendingComponent implements OnInit {

  chart = []; // This will hold charts data

  // Variables Declaration
  categorizedSpending;
  threeMonthlySpending;
  sixMonthlySpending;
  sectionFirst;
  merchantData;
  topMerchants;
  sixMonthsSpendingBreakout;
  sixMonthsSpendingBreakout2;
  monthlyTopTransactions;
  topTransactions;
  transactionsMonths;
  ddlCategory;
  ddlbCategory;
  spendingRatio;
  ratioData;
  spendingSections;
  spendingTransArr;
  spendingGlobalData;
  renderPopUp;
  currentPoint = [];
  loading;
  lastsixmonths = [];
	singleTransactionLoad;

	height: string;
	spendingChart: AmChart;

	constructor(
		platformLocation: PlatformLocation,
		private spendingService: SpendingService,
		private transactionsService: TransactionsService,
		private changeDetector: ChangeDetectorRef,
		private amChart: AmChartsService
	) {
		url = (platformLocation as any).location.href;

  }

	ngOnInit() {

	this.loading = true;
    $('.sidebar .nav:not(.sub-menu) > .nav-item').removeClass('active');
    $('.sidebar .nav:not(.sub-menu) > .nav-item.menu-spending').addClass('active');
		const selfObj = this;

		// Loader html
		const html = '<div id="load" style="display:none;"><img width="64" height="64" src="assets/images/loaders/loader.gif"/></div>';

		let minAmt = [0];
		let maxAmt = [50];


    for (let i = 3; i >= 0; i--) {
      const curMonth = moment().subtract(i, 'months').format('MMM');
      const firstTimestamp = moment().subtract(i, 'months').startOf('month').unix() * 1000;
      const lastTimestamp = moment().subtract(i, 'months').endOf('month').unix() * 1000;
      this.lastsixmonths.push({'index': i, 'curMonth': curMonth, 'firstTimestamp': firstTimestamp, 'lastTimestamp': lastTimestamp});
    }
		// Loading the base js file for spending
		$(document).ready(function () {
			$('.router-container').show();
			$('.sidebar .nav:not(.sub-menu) > .nav-item').removeClass('active');
			$('.sidebar .nav:not(.sub-menu) > .nav-item.menu-spending').addClass('active');
			$.getScript(url + '/../assets/js/spending.js', function (w) { });
			selfObj.topMerchants(1); // Call it for first time load
			selfObj.categorizedSpending(1); // Call it for first time load
			selfObj.sixMonthsSpendingBreakout();
			selfObj.sixMonthsSpendingBreakout2();
			selfObj.monthlyTopTransactions(6, '');
			selfObj.spendingRatio(0);

		  // Spending breakout tooltip transaction click event
		  $(document).on('click', '.comments_bubble', function(e) {
			  // debugger;
			const dataName = $(this).data('name');
			const index = $(this).data('index');
			// alert(dataName+index);
			// console.log("Global Data:"+selfObj.spendingGlobalData);


			// console.log(selfObj.spendingTransArr);

			selfObj.renderPopUp(dataName, 1, index);
			$('#spendingModal #load').remove();

		  });

		  const marginTop = (($(window).height() - 600) / 2) + 'px !important';
		  $('.modal-dialog').attr('style', 'margin-top:' + marginTop);
		  var singleTransMarginTop = (($(window).height()-485)/2)+'px !important';
		  $('#modal_single_transaction .modal-dialog').attr('style','margin-top:'+singleTransMarginTop);
		});

		$('.amtRange .btn-xs').on('click', function() {
			// alert($(this).data('min'));
			// debugger;
			$(this).parent().find('.active').removeClass('active');
			if ($(this).attr('id') != 'bCategories') {
				$(this).parent().find('[value=All]').removeClass('active');

				if ($(this).val() == 'All') {
					$(this).parent().find('.active').removeClass('active');
				}

				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
				} else {
					$(this).addClass('active');
				}

				let btnElems = $(this).parent().find('.btn-xs.active');

				if (btnElems.length == 0) {
          $(this).addClass('active');
					// $(this).parent().find("[value=All]").addClass('active');
					btnElems = $(this).parent().find('.btn-xs.active');
				}

				// debugger;

				let duration = 1;
				const section = $(this).parent().data('section');
				duration =  $(this).parent().parent().find('.duration .active').data('duration');

				if (section == '1') {// Spending First tile
					selfObj.categorizedSpending(duration);
				} else if (section == '2') {// Spending Details Second Tile
					selfObj.topMerchants(duration);
				} else if (section == '3') {// Spending Breakout
					selfObj.sixMonthsSpendingBreakout();
				} else if (section == '4') {// Recent Transactions
					selfObj.monthlyTopTransactions(duration);
				} else if (section == '5') {// Spending Breakout2
					selfObj.sixMonthsSpendingBreakout2();
				}
			}



		});



		/** Category wise Spending  **/
		this.categorizedSpending = function(duration) {

			$('.spending-section').append(html); // Loader init

		  // debugger;

			minAmt = [];
			maxAmt = [];

			const btnElems = $('.spending-section .amtRange .active');
			$.each(btnElems, function(i, v) {
				minAmt.push($(v).data('min'));
				maxAmt.push($(v).data('max'));
			});


		  // Service call
		  this.spendingService.getCategorizedSpending(localStorage.getItem('customerId'), duration, minAmt, maxAmt)
		  .subscribe( data => {
        this.sectionFirst = data.total;
        this.spendingSections = data.section;

        this.changeDetector.detectChanges();
        // console.log(this.spendingSections);
        $('.spending-section #load').remove();
		  });
		};


		/** Get spending details and render bubble chart **/
		this.topMerchants = function(months, category= '') {

		  $('#merchant-duration').html(months + ' Months');
		  $('.spending-detail-section').append(html);

		  // debugger;

			minAmt = [];
			maxAmt = [];
			const btnElems = $('.spending-detail-section .amtRange .active');
			$.each(btnElems, function(i, v) {
				minAmt.push($(v).data('min'));
				maxAmt.push($(v).data('max'));
			});
			// debugger;
			category = $('#bCategories').text();
		    if (months == undefined) {
			  months =  $('.spending-detail-section .duration .active').data('duration');
		    }

		  this.spendingService.getSpendingDetail(localStorage.getItem('customerId'), months, category, minAmt, maxAmt)
		  .subscribe( data => {

			  let merchantData: any = {};
			  merchantData = JSON.parse(JSON.stringify(data));
			  // console.log(JSON.stringify(merchantData.data));
			  const seriesData = merchantData.labels;
			  const indexData = merchantData.indexes;

			  let legendHtml = '';
			  const catArr = [];

			  for (let i = 0; i < merchantData.data.length; i++) {
				  if (merchantData.data[i].cat != 'fake') {
					  if (i) {
						  if (!(catArr.indexOf(merchantData.data[i].cat) > -1)) {
							 legendHtml += '<button class="sdbtn legend-btn text-white p-2 m-1" style="opacity: 1; background:#fff;"><span class="cicon" style="background:' + merchantData.data[i].color + '"></span><span>' + merchantData.data[i].cat + '</span></button>';
							 catArr.push(merchantData.data[i].cat);
						  }
					  } else {
						  catArr.push(merchantData.data[i].cat);
						  legendHtml += '<button class="sdbtn legend-btn text-white p-2 m-1" style="background:#fff;"><span class="cicon" style="background:' + merchantData.data[i].color + '"></span><span>' + merchantData.data[i].cat + '</span></button>';
					  }
				  }
			  }

				$('#spending-detail-legends').html(legendHtml);


				chartHolder = $('#spendingDetailContainer').highcharts({
					credits: {
						  enabled: false
					  },
					chart: {
						type: 'bubble',
						renderTo: 'spendingDetailContainer',
						plotBorderWidth: 0,
						zoomType: 'xy',
						events: {
							load: function(event) {
								setTimeout(function() {
								  $('[data-toggle="tooltip"]').tooltip();
								}, 1000);
							}
						}
					},

					// width: $("#spendingDetailContainer").width(),
					// height:  $("#spendingDetailContainer").height(),
					height: 1000,

					title: {
						text: ''
					},
					tooltip: {
						useHTML: true,
						formatter: function() {
							return '<p style="text-align:center;font-size: 16px;color:' + this.series.color + '">' + this.series.name + '<br/>' +
								'<span style="font-size: 16px;font-weight:600;color:' + this.series.color + '">$' + addCommasFormat(this.point.z.toFixed(2)) + '</span></p>';
						}
					},
					xAxis: {
						tickInterval: 1,
						tickPositions: indexData,
						tickColor: '#DFE7FF',
						tickWidth: 2,
						lineColor: '#DFE7FF',
						lineWidth: 2,
						// min:Date.UTC(2015, 5, 1),,
						// max: 185,
						scrollbar: {
							enabled: true
						},
						labels: {
							enabled: true,
							useHTML: true,
							formatter: function() {
													// debugger;
													if (this.value != -1 && this.value != 0) {
													  // debugger;
													  if (seriesData[this.value] != undefined) {
														  // console.log(seriesData[this.value][0]);
														  let dataValue = seriesData[this.value][0];
														  if (dataValue != undefined) {

															  if (dataValue.indexOf('st') !== -1) {
																  dataValue = dataValue.replace('st', '<sup>st</sup>');
															  } else if (dataValue.indexOf('nd') !== -1) {
																  dataValue = dataValue.replace('nd', '<sup>nd</sup>');
															  } else if (dataValue.indexOf('rd') !== -1) {
																  dataValue = dataValue.replace('rd', '<sup>rd</sup>');
															  } else if (dataValue.indexOf('th') !== -1) {
																  dataValue = dataValue.replace('th', '<sup>th</sup>');
															  }
														  }
														return '<div style=\'line-height: 30px; padding-top: 10px;\'>' + dataValue + '</div>';
														// return dataValue;
													  } else {
														return null;
													  }
													} else {
														return null;
													}
												},
							style: {
								fontSize: '13px',
								fontWeight: '600',
								fontFamily: 'NunitoSans',
								color: '#3e4873'
							}
						}
					},

					yAxis: {
						tickInterval: 1,
						minRange: 1,
						min: 0,
						showFirstLabel: true,
						lineColor: '#DFE7FF',
						gridLineColor: '#DFE7FF',
						lineWidth: 2,
						minPadding: 0.2,
						maxPadding: 0.2,
						// reversed: true,
						title: {
							enabled: true,
							useHTML: true,
							text: '<p align="left" ><b>Merchant Impact<br/>on Overall Spend&nbsp;&nbsp;</b><i style="color: #63c0fd;position: absolute; bottom: 40%; font-size: 18px; right:-15px;" class="fa fa-info-circle font-weight-medium" data-toggle="tooltip" data-placement="top" title="" data-original-title="Merchant Impact on Overall Spend"></i></p>',
							style: {
								fontSize: '16px',
								fontWeight: '500',
								fontFamily: 'NunitoSans'
							},
							rotation: 0,
							 offset: 10,
							 x: -45,
							 y: -240
						},

						startOnTick: false,
						endOnTick: false,
						gridLineWidth: 2,
						minorGridLineWidth: 0,
						labels: {
							enabled: true,
							rotation: 0,
							x: -40,
							style: {
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							},
							useHTML: true,
							formatter: function() {
								if (this.value == 2) {
									return '<p style=\'text-align:center\'>Low Impact</p>';
								}
								if (this.value == 11) {
									return '<p style=\'text-align:center\'>Medium Impact</p>';
								}
								if (this.value == 20) {
									return '<p style=\'text-align:center\'>High Impact</p>';
								} else {
								  // $('#spendingDetailContainer').Highcharts().yAxis[this.value].ticks.gridLine.destroy();
								  return '';
								}
							}
						}
					},
					plotOptions: {
						bubble: {

							marker: {
								// fillColor: ,
								lineWidth: 0,
								fillOpacity: 0.7
							}
						}
					},

					series: merchantData.data

				}
				, function(chart) {

						$.each(chart.yAxis[0].ticks, function(i, line) {
							// if(line.pos!=2 && line.pos!=11 && line.pos!=20) {
								// line.gridLine.hide();
							// }
							line.gridLine.hide();
						});

						  if (chart.series.length < 1) { // check series is empty
						  $('#spendingDetailContainer').addClass('border');

						  const posx =  $('#spendingDetailContainer').width() / 2 - 60;
						  const posy =  $('#spendingDetailContainer').height() / 2 - 30;



							chart.renderer.text('No Data Available', posx, posy)
							  .css({
								color: '#4572A7',
								fontSize: '16px'
							  })
							  .add();
						  } else {
							  $('#spendingDetailContainer').removeClass('border');
						  }



					  // var legend = chart.legend;

					  // if (legend.display) {
						// legend.group.hide();
						// legend.box.hide();
						// legend.display = false;
					  // } else {

						// legend.group.show();
						// legend.box.show();
						// legend.display = true;
					  // }
				  }
				  );


			 // console.log(this.merchantData);
			this.changeDetector.detectChanges();
		  });
		};




		this.ddlbCategory = function(category) {
			const month = 1;
			if (category == '') {
			  $('#bCategories.droptext').text('All');
			} else {
			  $('#bCategories.droptext').text(category);
			}
			this.topMerchants(month, category);
		};

		// chartHolder.reflow();




		/** My Spending Breakout **/

		this.sixMonthsSpendingBreakout = function() {

      $('.spending-breakout-section').append(html);

			minAmt = [];
			maxAmt = [];
			const btnElems = $('.spending-breakout-section .amtRange .active');
			$.each(btnElems, function(i, v) {
				minAmt.push($(v).data('min'));
				maxAmt.push($(v).data('max'));
			});
      /*
      for(var i = 0; i < p.length ; i++){
        //console.log(p);
        selfObj.currentPoint[i] = {color:p[i].color,img:p[i].series.options.img,amount: addCommasFormat(parseFloat(p[i].y).toFixed(2))};
      }*/

      selfObj.changeDetector.detectChanges();
		 this.spendingService.getSixMonthsSpendingBreakout(localStorage.getItem('customerId'), minAmt, maxAmt)
		  .subscribe( data => {

			 let spendingData: any = {};
			  spendingData = (data);
			  this.spendingGlobalData = (data);
      // selfObj.currentPoint = [];
      /*

      for(var i = spendingData[2].length-1; i >=0 ; i--){
        //console.log(p);
        selfObj.currentPoint[i] = {color:spendingData[2][i].color,name:spendingData[2][i].name,img:spendingData[2][i].img,amount: "$"+addCommasFormat(parseFloat(spendingData[2][i].value).toFixed(2)),dataindex:-1};
      }
      //console.log(selfObj.currentPoint);
      selfObj.changeDetector.detectChanges();
      */
			const firstDataArr = [
			parseFloat(spendingData[2][0].data[spendingData[0][0]].toFixed(2)),
			parseFloat(spendingData[2][0].data[spendingData[0][1]].toFixed(2)),
			parseFloat(spendingData[2][0].data[spendingData[0][2]].toFixed(2)),
			parseFloat(spendingData[2][0].data[spendingData[0][3]].toFixed(2)),
			parseFloat(spendingData[2][0].data[spendingData[0][4]].toFixed(2)),
			parseFloat(spendingData[2][0].data[spendingData[0][5]].toFixed(2))
			];

			const firstDataTotal = firstDataArr.reduce((a, b) => a + b, 0);

			const secondDataArr = [
			parseFloat(spendingData[2][1].data[spendingData[0][0]].toFixed(2)),
			parseFloat(spendingData[2][1].data[spendingData[0][1]].toFixed(2)),
			parseFloat(spendingData[2][1].data[spendingData[0][2]].toFixed(2)),
			parseFloat(spendingData[2][1].data[spendingData[0][3]].toFixed(2)),
			parseFloat(spendingData[2][1].data[spendingData[0][4]].toFixed(2)),
			parseFloat(spendingData[2][1].data[spendingData[0][5]].toFixed(2))
			];
			const secondDataTotal = secondDataArr.reduce((a, b) => a + b, 0);

			const thirdDataArr = [
			parseFloat(spendingData[2][2].data[spendingData[0][0]].toFixed(2)),
			parseFloat(spendingData[2][2].data[spendingData[0][1]].toFixed(2)),
			parseFloat(spendingData[2][2].data[spendingData[0][2]].toFixed(2)),
			parseFloat(spendingData[2][2].data[spendingData[0][3]].toFixed(2)),
			parseFloat(spendingData[2][2].data[spendingData[0][4]].toFixed(2)),
			parseFloat(spendingData[2][2].data[spendingData[0][5]].toFixed(2))
			];
			const thirdDataTotal = thirdDataArr.reduce((a, b) => a + b, 0);

			const fourthDataArr = [
			parseFloat(spendingData[2][3].data[spendingData[0][0]].toFixed(2)),
			parseFloat(spendingData[2][3].data[spendingData[0][1]].toFixed(2)),
			parseFloat(spendingData[2][3].data[spendingData[0][2]].toFixed(2)),
			parseFloat(spendingData[2][3].data[spendingData[0][3]].toFixed(2)),
			parseFloat(spendingData[2][3].data[spendingData[0][4]].toFixed(2)),
			parseFloat(spendingData[2][3].data[spendingData[0][5]].toFixed(2))
			];
			const fourthDataTotal = fourthDataArr.reduce((a, b) => a + b, 0);

			const fifthDataArr = [
			parseFloat(spendingData[2][4].data[spendingData[0][0]].toFixed(2)),
			parseFloat(spendingData[2][4].data[spendingData[0][1]].toFixed(2)),
			parseFloat(spendingData[2][4].data[spendingData[0][2]].toFixed(2)),
			parseFloat(spendingData[2][4].data[spendingData[0][3]].toFixed(2)),
			parseFloat(spendingData[2][4].data[spendingData[0][4]].toFixed(2)),
			parseFloat(spendingData[2][4].data[spendingData[0][5]].toFixed(2))
			];
			const fifthDataTotal = fifthDataArr.reduce((a, b) => a + b, 0);

			const sixthDataArr = [
			parseFloat(spendingData[2][5].data[spendingData[0][0]].toFixed(2)),
			parseFloat(spendingData[2][5].data[spendingData[0][1]].toFixed(2)),
			parseFloat(spendingData[2][5].data[spendingData[0][2]].toFixed(2)),
			parseFloat(spendingData[2][5].data[spendingData[0][3]].toFixed(2)),
			parseFloat(spendingData[2][5].data[spendingData[0][4]].toFixed(2)),
			parseFloat(spendingData[2][5].data[spendingData[0][5]].toFixed(2))
			];
			const sixthDataTotal = sixthDataArr.reduce((a, b) => a + b, 0);

			const otherDataArr = [
			parseFloat(spendingData[2][6].data[spendingData[0][0]].toFixed(2)),
			parseFloat(spendingData[2][6].data[spendingData[0][1]].toFixed(2)),
			parseFloat(spendingData[2][6].data[spendingData[0][2]].toFixed(2)),
			parseFloat(spendingData[2][6].data[spendingData[0][3]].toFixed(2)),
			parseFloat(spendingData[2][6].data[spendingData[0][4]].toFixed(2)),
			parseFloat(spendingData[2][6].data[spendingData[0][5]].toFixed(2))
			];
			const otherDataTotal = otherDataArr.reduce((a, b) => a + b, 0);

			const allDataArr = [firstDataArr, secondDataArr, thirdDataArr, fourthDataArr, fifthDataArr, sixthDataArr, otherDataArr];

			const totalDataArr = [firstDataTotal, secondDataTotal, thirdDataTotal, fourthDataTotal, fifthDataTotal, sixthDataTotal, otherDataTotal];

			const sortTotalDataArr = [firstDataTotal, secondDataTotal, thirdDataTotal, fourthDataTotal, fifthDataTotal, sixthDataTotal, otherDataTotal];
			sortTotalDataArr.sort(function(a, b) { return a - b; });

			const firstIndex = totalDataArr.indexOf(sortTotalDataArr[0]);
			const secondIndex = totalDataArr.indexOf(sortTotalDataArr[1]);
			const thirdIndex = totalDataArr.indexOf(sortTotalDataArr[2]);
			const fourthIndex = totalDataArr.indexOf(sortTotalDataArr[3]);
			const fifthIndex = totalDataArr.indexOf(sortTotalDataArr[4]);
			const sixthIndex = totalDataArr.indexOf(sortTotalDataArr[5]);
			const otherIndex = totalDataArr.indexOf(sortTotalDataArr[6]);

			// console.log("All data:"+allDataArr);

			const seriesData = spendingData[1];

			if (!selfObj.spendingChart) {
				this.createChart();
			}

			selfObj.spendingChart.dataProvider = seriesData.map((element, idx) => {
				// console.log(seriesData[1],idx);

				const ret = spendingData[2].map(
					element => ({
							[element.name]: element.data[spendingData[0][idx]].toFixed(2)
					})
				);

				const data: any = {};
				ret.forEach(l => {
					Object.assign(data, l);
				});

				return {
					month: element,
					...data
				};
			});

			selfObj.spendingChart.graphs = seriesData.map((element, idx) => ({
				balloonText: '[[category]]: <b>[[value.fixed(2)]]</b>',
				fillAlphas: 0.9,
				lineAlpha: 0.2,
				title: spendingData[2][idx].name,
				type: 'column',
				valueField: spendingData[2][idx].name
			}));

			selfObj.spendingChart.validateData();

			// this.height = 40 * seriesData.length * spendingData[2].length + 'px';
			this.height = '500px';

			Highcharts.setOptions({
				lang: {
					numericSymbols: ['K', 'M', 'G', 'T', 'P', 'E'],
					noData: 'No Data'
				}
			});

				chartHolder = $('#breakOutContainer').highcharts({
					credits: {
						  enabled: false
					  },
					chart: {
						type: 'areaspline',
						renderTo: 'breakOutContainer',
						plotBorderWidth: 0,
						zoomType: 'xy',
						plotBorderDasharray: [0, 450, 450]

					},
					// width: $("#breakOutContainer").width(),
					// height:  $("#breakOutContainer").height(),
					height: 800,

					title: {
						text: ''
					},
					tooltip: {
						 // borderColor: 'transparent',
						 // backgroundColor: 'transparent',
						 // borderWidth: '1px 0px 0px 0px',
						 // shadow: false,
						 style: {
							padding: 30
						 },
						useHTML: true,
						headerFormat: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
						// pointFormat:'<a title="Click to see more details." class="breakoutTrans comments_bubble" data-name="{series.name}" data-index="{point.x}" data-toggle="modal" data-target="#spendingModal"><div style="min-width: 180px;text-align: center;"><span style="font-size: 13px;color:{series.color}"><b>{series.name}: ${point.y}</b></span></div></a>',
						 // formatter: function(){
							 // debugger;
							 // return '<div style="min-width: 150px;"><p style="text-align:center;font-size: 13px;color:#000"><b>Name: $56.00</b></div>'
						 // },
						 // padding: 10,
						// split: true,
            shared: true,
            formatter: function() {

                if (this.points && this.points.length == 1) {
                    return false;
                } else {
					// debugger;
                    const p = this.points;
                    selfObj.currentPoint = [];
                    for (let i = p.length - 1; i >= 0 ; i--) {
                      selfObj.currentPoint[i] = {color: p[i].color.stops[0][1], name: p[i].series.options.name, img: p[i].series.options.img, amount: '$' + addCommasFormat(parseFloat(p[i].y).toFixed(2)), dataindex : p[i].x};
                      // selfObj.currentPoint[i] = {color:p[i].color,name:p[i].series.options.name,img:p[i].series.options.img,amount: "$"+addCommasFormat(parseFloat(p[i].y).toFixed(2)),dataindex : p[i].x};
                    }

                    $('#spending-breakout-month').text(moment(seriesData[p[0].x], 'MMM').format('MMMM'));

                    selfObj.changeDetector.detectChanges();
                    return false;
                }
            },
            snap: 500
					},
					xAxis: {
						tickColor: '#DFE7FF',
						tickWidth: 2,
						lineColor: '#DFE7FF',
						lineWidth: 2,
						gridLineColor: 'transparent',
						tickInterval: 1,
						minPadding: 0,
						maxPadding: 0,
						labels: {
							enabled: true,
							formatter: function() { return seriesData[this.value][0]; },
							style: {
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							}
						},
						 crosshair: {
							width: 1,
							color: '#3e4873',
							// dashStyle: 'shortdot',
							zIndex: 5
						}
						// categories: spendingData[1]

					},
					yAxis: {
						lineColor: '#DFE7FF',
						lineWidth: 2,
						gridLineColor: 'transparent',
						title: {
							enabled: true,
							text: 'Amount ($)',
							style: {
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							}
						},
						 // crosshair: {
							// width: 1,
							// color: '#3e4873',
							// dashStyle: 'shortdot',
							// zIndex: 6
						// },
						startOnTick: false,
						endOnTick: false,
						labels: {
							enabled: true,
							style: {
								fontSize: '14px',
								fontWeight: '600',
								fontFamily: 'NunitoSans'
							}
						}
					},

				plotOptions: {
					series: {
						stickyTracking: false
					},
					areaspline: {
					  fillOpacity: 1,
					  lineWidth: 0,
					  stacking: 'normal'
					}
				},
				series: [{
					name: spendingData[2][firstIndex].name,
					data: allDataArr[firstIndex],
					 marker: {
					   enabled: false,
					   fillColor: '#3e4873',
					   lineColor: '#fff',
					   lineWidth: 1,
					   shadow: false,
					   size: 0,
					   states: {
						  hover: {
							  enabled: true
						  }
						}
					},
					showInLegend: false,
					// color: spendingData[2][firstIndex].color,
					color: {
					  linearGradient: {
						x1: 0,
						x2: 0,
						y1: 0,
						y2: 1
					  },
					  stops: [
						[0, spendingData[2][firstIndex].color],
						[1, spendingData[2][firstIndex].color + '77']
					  ]
					},
					img: spendingData[2][firstIndex].img
				}, {
						name: spendingData[2][secondIndex].name,
						data: allDataArr[secondIndex],
						 marker: {
						   enabled: false,
						   states: {
							  hover: {
								  enabled: false
							  }
						  }
						},
						showInLegend: false,
						// color: spendingData[2][secondIndex].color,
						color: {
						  linearGradient: {
							x1: 0,
							x2: 0,
							y1: 0,
							y2: 1
						  },
						  stops: [
							[0, spendingData[2][secondIndex].color],
							[1, spendingData[2][secondIndex].color + '77']
						  ]
						},
						img: spendingData[2][secondIndex].img
					}, {
						name: spendingData[2][thirdIndex].name,
						data: allDataArr[thirdIndex],
						 marker: {
						   enabled: false,
						   states: {
							  hover: {
								  enabled: false
							  }
						  }
						},
						showInLegend: false,
						// color: spendingData[2][thirdIndex].color,
						color: {
						  linearGradient: {
							x1: 0,
							x2: 0,
							y1: 0,
							y2: 1
						  },
						  stops: [
							[0, spendingData[2][thirdIndex].color],
							[1, spendingData[2][thirdIndex].color + '77']
						  ]
						},
						img: spendingData[2][thirdIndex].img
					}, {
						name: spendingData[2][fourthIndex].name,
						data: allDataArr[fourthIndex],
						 marker: {
						   enabled: false,
						   states: {
							  hover: {
								  enabled: false
							  }
						  }
						},
						showInLegend: false,
						// color: spendingData[2][fourthIndex].color,
						color: {
						  linearGradient: {
							x1: 0,
							x2: 0,
							y1: 0,
							y2: 1
						  },
						  stops: [
							[0, spendingData[2][fourthIndex].color],
							[1, spendingData[2][fourthIndex].color + '77']
						  ]
						},
						img: spendingData[2][fourthIndex].img
					}, {
						name: spendingData[2][fifthIndex].name,
						data: allDataArr[fifthIndex],
						 marker: {
						   enabled: false,
						   states: {
							  hover: {
								  enabled: false
							  }
						  }
						},
						showInLegend: false,
						// color: spendingData[2][fifthIndex].color,
						color: {
						  linearGradient: {
							x1: 0,
							x2: 0,
							y1: 0,
							y2: 1
						  },
						  stops: [
							[0, spendingData[2][fifthIndex].color],
							[1, spendingData[2][fifthIndex].color + '77']
						  ]
						},
						img: spendingData[2][fifthIndex].img
					}, {
						name: spendingData[2][sixthIndex].name,
						data: allDataArr[sixthIndex],
						 marker: {
						   enabled: false,
						   states: {
							  hover: {
								  enabled: false
							  }
						  }
						},
						showInLegend: false,
						// color: spendingData[2][sixthIndex].color,
						color: {
						  linearGradient: {
							x1: 0,
							x2: 0,
							y1: 0,
							y2: 1
						  },
						  stops: [
							[0, spendingData[2][sixthIndex].color],
							[1, spendingData[2][sixthIndex].color + '77']
						  ]
						},
						img: spendingData[2][sixthIndex].img
					}, {
						name: spendingData[2][otherIndex].name,
						data: allDataArr[otherIndex],
						 marker: {
						   enabled: false,
						   states: {
							  hover: {
								  enabled: false
							  }
						  }
						},
						showInLegend: false,
						// color: spendingData[2][otherIndex].color,
						color: {
						  linearGradient: {
							x1: 0,
							x2: 0,
							y1: 0,
							y2: 1
						  },
						  stops: [
							[0, spendingData[2][otherIndex].color],
							[1, spendingData[2][otherIndex].color + '77']
						  ]
						},
						img: spendingData[2][otherIndex].img
					}]

				}
				, function(chart) {

					  // var legend = chart.legend;

					  // if (legend.display) {
						// legend.group.hide();
						// legend.box.hide();
						// legend.display = false;
					  // } else {

						// legend.group.show();
						// legend.box.show();
						// legend.display = true;
					  // }
				  }
				  );



				  $('.spending-breakout-section #load').remove();
			});

		};




		/** My Spending Breakout 2 **/

		this.sixMonthsSpendingBreakout2 = () => {

			$('.spending-breakout-section2').append(html);

				  minAmt = [];
				  maxAmt = [];
				  const btnElems = $('.spending-breakout-section2 .amtRange .active');
				  $.each(btnElems, function(i, v) {
					  minAmt.push($(v).data('min'));
					  maxAmt.push($(v).data('max'));
				  });
			/*
			for(var i = 0; i < p.length ; i++){
			  //console.log(p);
			  selfObj.currentPoint[i] = {color:p[i].color,img:p[i].series.options.img,amount: addCommasFormat(parseFloat(p[i].y).toFixed(2))};
			}*/

			selfObj.changeDetector.detectChanges();
			   this.spendingService.getSixMonthsSpendingBreakout(localStorage.getItem('customerId'), minAmt, maxAmt)
				.subscribe( data => {

				   let spendingData: any = {};
					spendingData = (data);
					this.spendingGlobalData = (data);
			// selfObj.currentPoint = [];
			/*

			for(var i = spendingData[2].length-1; i >=0 ; i--){
			  //console.log(p);
			  selfObj.currentPoint[i] = {color:spendingData[2][i].color,name:spendingData[2][i].name,img:spendingData[2][i].img,amount: "$"+addCommasFormat(parseFloat(spendingData[2][i].value).toFixed(2)),dataindex:-1};
			}
			//console.log(selfObj.currentPoint);
			selfObj.changeDetector.detectChanges();
			*/
				  const firstDataArr = [
				  parseFloat(spendingData[2][0].data[spendingData[0][0]].toFixed(2)),
				  parseFloat(spendingData[2][0].data[spendingData[0][1]].toFixed(2)),
				  parseFloat(spendingData[2][0].data[spendingData[0][2]].toFixed(2)),
				  parseFloat(spendingData[2][0].data[spendingData[0][3]].toFixed(2)),
				  parseFloat(spendingData[2][0].data[spendingData[0][4]].toFixed(2)),
				  parseFloat(spendingData[2][0].data[spendingData[0][5]].toFixed(2))
				  ];

				  const firstDataTotal = firstDataArr.reduce((a, b) => a + b, 0);

				  const secondDataArr = [
				  parseFloat(spendingData[2][1].data[spendingData[0][0]].toFixed(2)),
				  parseFloat(spendingData[2][1].data[spendingData[0][1]].toFixed(2)),
				  parseFloat(spendingData[2][1].data[spendingData[0][2]].toFixed(2)),
				  parseFloat(spendingData[2][1].data[spendingData[0][3]].toFixed(2)),
				  parseFloat(spendingData[2][1].data[spendingData[0][4]].toFixed(2)),
				  parseFloat(spendingData[2][1].data[spendingData[0][5]].toFixed(2))
				  ];
				  const secondDataTotal = secondDataArr.reduce((a, b) => a + b, 0);

				  const thirdDataArr = [
				  parseFloat(spendingData[2][2].data[spendingData[0][0]].toFixed(2)),
				  parseFloat(spendingData[2][2].data[spendingData[0][1]].toFixed(2)),
				  parseFloat(spendingData[2][2].data[spendingData[0][2]].toFixed(2)),
				  parseFloat(spendingData[2][2].data[spendingData[0][3]].toFixed(2)),
				  parseFloat(spendingData[2][2].data[spendingData[0][4]].toFixed(2)),
				  parseFloat(spendingData[2][2].data[spendingData[0][5]].toFixed(2))
				  ];
				  const thirdDataTotal = thirdDataArr.reduce((a, b) => a + b, 0);

				  const fourthDataArr = [
				  parseFloat(spendingData[2][3].data[spendingData[0][0]].toFixed(2)),
				  parseFloat(spendingData[2][3].data[spendingData[0][1]].toFixed(2)),
				  parseFloat(spendingData[2][3].data[spendingData[0][2]].toFixed(2)),
				  parseFloat(spendingData[2][3].data[spendingData[0][3]].toFixed(2)),
				  parseFloat(spendingData[2][3].data[spendingData[0][4]].toFixed(2)),
				  parseFloat(spendingData[2][3].data[spendingData[0][5]].toFixed(2))
				  ];
				  const fourthDataTotal = fourthDataArr.reduce((a, b) => a + b, 0);

				  const fifthDataArr = [
				  parseFloat(spendingData[2][4].data[spendingData[0][0]].toFixed(2)),
				  parseFloat(spendingData[2][4].data[spendingData[0][1]].toFixed(2)),
				  parseFloat(spendingData[2][4].data[spendingData[0][2]].toFixed(2)),
				  parseFloat(spendingData[2][4].data[spendingData[0][3]].toFixed(2)),
				  parseFloat(spendingData[2][4].data[spendingData[0][4]].toFixed(2)),
				  parseFloat(spendingData[2][4].data[spendingData[0][5]].toFixed(2))
				  ];
				  const fifthDataTotal = fifthDataArr.reduce((a, b) => a + b, 0);

				  const sixthDataArr = [
				  parseFloat(spendingData[2][5].data[spendingData[0][0]].toFixed(2)),
				  parseFloat(spendingData[2][5].data[spendingData[0][1]].toFixed(2)),
				  parseFloat(spendingData[2][5].data[spendingData[0][2]].toFixed(2)),
				  parseFloat(spendingData[2][5].data[spendingData[0][3]].toFixed(2)),
				  parseFloat(spendingData[2][5].data[spendingData[0][4]].toFixed(2)),
				  parseFloat(spendingData[2][5].data[spendingData[0][5]].toFixed(2))
				  ];
				  const sixthDataTotal = sixthDataArr.reduce((a, b) => a + b, 0);

				  const otherDataArr = [
				  parseFloat(spendingData[2][6].data[spendingData[0][0]].toFixed(2)),
				  parseFloat(spendingData[2][6].data[spendingData[0][1]].toFixed(2)),
				  parseFloat(spendingData[2][6].data[spendingData[0][2]].toFixed(2)),
				  parseFloat(spendingData[2][6].data[spendingData[0][3]].toFixed(2)),
				  parseFloat(spendingData[2][6].data[spendingData[0][4]].toFixed(2)),
				  parseFloat(spendingData[2][6].data[spendingData[0][5]].toFixed(2))
				  ];
				  const otherDataTotal = otherDataArr.reduce((a, b) => a + b, 0);

				  const allDataArr = [firstDataArr, secondDataArr, thirdDataArr, fourthDataArr, fifthDataArr, sixthDataArr, otherDataArr];

				  const totalDataArr = [firstDataTotal, secondDataTotal, thirdDataTotal, fourthDataTotal, fifthDataTotal, sixthDataTotal, otherDataTotal];

				  const sortTotalDataArr = [firstDataTotal, secondDataTotal, thirdDataTotal, fourthDataTotal, fifthDataTotal, sixthDataTotal, otherDataTotal];
				  sortTotalDataArr.sort(function(a, b) { return a - b; });

				  const firstIndex = totalDataArr.indexOf(sortTotalDataArr[6]);
				  const secondIndex = totalDataArr.indexOf(sortTotalDataArr[5]);
				  const thirdIndex = totalDataArr.indexOf(sortTotalDataArr[4]);
				  const fourthIndex = totalDataArr.indexOf(sortTotalDataArr[3]);
				  const fifthIndex = totalDataArr.indexOf(sortTotalDataArr[2]);
				  const sixthIndex = totalDataArr.indexOf(sortTotalDataArr[1]);
				  const otherIndex = totalDataArr.indexOf(sortTotalDataArr[0]);

				  // console.log("All data:"+allDataArr);

					const seriesData = spendingData[1];

					if (!selfObj.spendingChart) {
						this.createChart();
					}

					selfObj.spendingChart.dataProvider = seriesData.map((element, idx) => {
						// console.log(seriesData[1],idx);

						const ret = spendingData[2].map(
							element => ({
									[element.name]: element.data[spendingData[0][idx]].toFixed(2)
							})
						);

						const data: any = {};
						ret.forEach(l => {
							Object.assign(data, l);
						});

						return {
							month: element,
							...data
						};
					});

					selfObj.spendingChart.graphs = seriesData.map((element, idx) => {
						return {
							balloonText: '[[category]]: <b>[[value]]</b>',
							fillAlphas: 0.9,
							lineAlpha: 0.2,
							title: spendingData[2][idx].name,
							type: 'column',
							valueField: spendingData[2][idx].name
						}
					});

					selfObj.spendingChart.validateData();

				  // Highcharts.setOptions({
					//   lang: {
					// 	  numericSymbols: ["K", "M", "G", "T", "P", "E"],
					// 	  noData: "No Data"
					//   }
				  // });

					// 	chartHolder = $('#breakOutContainer2').highcharts({
					// 	  credits: {
					// 			enabled: false
					// 		},
					// 	  chart: {
					// 		  type: 'column',
					// 		  renderTo: 'breakOutContainer',
					// 		  plotBorderWidth: 0,
					// 		  zoomType: 'xy',
					// 		  plotBorderDasharray: [0,450,450]

					// 	  },
					// 	  // width: $("#breakOutContainer").width(),
					// 	  // height:  $("#breakOutContainer").height(),
					// 	  height: 800,

					// 	  title: {
					// 		  text: ''
					// 	  },
					// 	  tooltip: {
					// 		   // borderColor: 'transparent',
					// 		   // backgroundColor: 'transparent',
					// 		   // borderWidth: '1px 0px 0px 0px',
					// 		   // shadow: false,
					// 		   style:{
					// 			  padding: 30
					// 		   },
					// 		  useHTML: true,
					// 		  headerFormat: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
					// 		  // pointFormat:'<a title="Click to see more details." class="breakoutTrans comments_bubble" data-name="{series.name}" data-index="{point.x}" data-toggle="modal" data-target="#spendingModal"><div style="min-width: 180px;text-align: center;"><span style="font-size: 13px;color:{series.color}"><b>{series.name}: ${point.y}</b></span></div></a>',
					// 		   // formatter: function(){
					// 			   // debugger;
					// 			   // return '<div style="min-width: 150px;"><p style="text-align:center;font-size: 13px;color:#000"><b>Name: $56.00</b></div>'
					// 		   // },
					// 		   // padding: 10,
					// 		  //split: true,
				  // shared: true,
				  // formatter: function() {

					//   if(this.points && this.points.length == 1) {
					// 	  return false;
					//   } else {
					// 	  // debugger;
					// 	  var p = this.points;
					// 	  selfObj.currentPoint = [];
					// 	  for(var i = p.length-1; i >=0 ; i--){
					// 		selfObj.currentPoint[i] = {color:p[i].color.stops[0][1],name:p[i].series.options.name,img:p[i].series.options.img,amount: "$"+addCommasFormat(parseFloat(p[i].y).toFixed(2)),dataindex : p[i].x};
					// 		// selfObj.currentPoint[i] = {color:p[i].color,name:p[i].series.options.name,img:p[i].series.options.img,amount: "$"+addCommasFormat(parseFloat(p[i].y).toFixed(2)),dataindex : p[i].x};
					// 	  }

					// 	  $('#spending-breakout-month').text(moment(seriesData[p[0].x], 'MMM').format('MMMM'));

					// 	  selfObj.changeDetector.detectChanges();
					// 	  return false;
					//   }
				  // },
				  // snap:500
					// 	  },
					// 	  xAxis: {
					// 		  tickColor: '#DFE7FF',
					// 		  tickWidth: 2,
					// 		  lineColor: '#DFE7FF',
					// 		  lineWidth: 2,
					// 		  gridLineColor: 'transparent',
					// 		  tickInterval: 1,
					// 		  minPadding: 0,
					// 		  maxPadding: 0,
					// 		  labels: {
					// 			  enabled: true,
					// 			  formatter: function() { return seriesData[this.value][0];},
					// 			  style: {
					// 				  fontSize: '14px',
					// 				  fontWeight: '600',
					// 				  fontFamily: 'NunitoSans'
					// 			  }
					// 		  }
					// 		//   ,
					// 		//    crosshair: {
					// 			//   width: 1,
					// 			//   color: '#3e4873',
					// 			  // dashStyle: 'shortdot',
					// 			//   zIndex: 5
					// 		//   }
					// 		  // categories: spendingData[1]

					// 	  },
					// 	  yAxis: {
					// 			// type: 'logarithmic',
					// 		  lineColor: '#DFE7FF',
					// 		  lineWidth: 2,
					// 		//   minPointLength: 100,
					// 		  gridLineColor: 'transparent',
					// 		  title: {
					// 			  enabled: true,
					// 			  text: 'Amount ($)',
					// 			  style: {
					// 				  fontSize: '14px',
					// 				  fontWeight: '600',
					// 				  fontFamily: 'NunitoSans'
					// 			  }
					// 		  },
					// 		   // crosshair: {
					// 			  // width: 1,
					// 			  // color: '#3e4873',
					// 			  // dashStyle: 'shortdot',
					// 			  // zIndex: 6
					// 		  // },
					// 		  startOnTick: false,
					// 		  endOnTick: false,
					// 		  labels: {
					// 			  enabled: true,
					// 			  style: {
					// 				  fontSize: '14px',
					// 				  fontWeight: '600',
					// 				  fontFamily: 'NunitoSans'
					// 			  }
					// 		  }
					// 	  },

					//   plotOptions: {
					// 	  series: {
					// 		minPointLength: 10
					// 	  },
					// 	  column: {
					// 		  stacking: 'normal',
					// 		  dataLabels: {
					// 			  enabled: true,/*
					// 			  color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
					// 			  formatter: function(){
					// 					console.log(this);
					// 					var val = this.y;
					// 					if (val < 1) {
					// 						return '';
					// 					}
					// 					return val;
					// 				}*/
					// 		  }
					// 	  }
					//   },
					//   series: [{
					// 	  name: spendingData[2][firstIndex].name,
					// 	  data: allDataArr[firstIndex],
					// 	   marker: {
					// 		 enabled: false,
					// 		 fillColor: '#3e4873',
					// 		 lineColor: '#fff',
					// 		 lineWidth: 1,
					// 		 shadow: false,
					// 		 size: 0,
					// 		 states: {
					// 			hover: {
					// 				enabled: true
					// 			}
					// 		  }
					// 	  },
					// 	  showInLegend: false,
					// 	  // color: spendingData[2][firstIndex].color,
					// 	  color: {
					// 		linearGradient: {
					// 		  x1: 0,
					// 		  x2: 0,
					// 		  y1: 0,
					// 		  y2: 1
					// 		},
					// 		stops: [
					// 		  [0, spendingData[2][firstIndex].color],
					// 		  [1, spendingData[2][firstIndex].color+"77"]
					// 		]
					// 	  },
					// 	  img: spendingData[2][firstIndex].img
					//   }, {
					// 		  name: spendingData[2][secondIndex].name,
					// 		  data: allDataArr[secondIndex],
					// 		   marker: {
					// 			 enabled: false,
					// 			 states: {
					// 				hover: {
					// 					enabled: false
					// 				}
					// 			}
					// 		  },
					// 		  showInLegend: false,
					// 		  // color: spendingData[2][secondIndex].color,
					// 		  color: {
					// 			linearGradient: {
					// 			  x1: 0,
					// 			  x2: 0,
					// 			  y1: 0,
					// 			  y2: 1
					// 			},
					// 			stops: [
					// 			  [0, spendingData[2][secondIndex].color],
					// 			  [1, spendingData[2][secondIndex].color+"77"]
					// 			]
					// 		  },
					// 		  img: spendingData[2][secondIndex].img
					// 	  }, {
					// 		  name: spendingData[2][thirdIndex].name,
					// 		  data: allDataArr[thirdIndex],
					// 		   marker: {
					// 			 enabled: false,
					// 			 states: {
					// 				hover: {
					// 					enabled: false
					// 				}
					// 			}
					// 		  },
					// 		  showInLegend: false,
					// 		  // color: spendingData[2][thirdIndex].color,
					// 		  color: {
					// 			linearGradient: {
					// 			  x1: 0,
					// 			  x2: 0,
					// 			  y1: 0,
					// 			  y2: 1
					// 			},
					// 			stops: [
					// 			  [0, spendingData[2][thirdIndex].color],
					// 			  [1, spendingData[2][thirdIndex].color+"77"]
					// 			]
					// 		  },
					// 		  img: spendingData[2][thirdIndex].img
					// 	  }, {
					// 		  name: spendingData[2][fourthIndex].name,
					// 		  data: allDataArr[fourthIndex],
					// 		   marker: {
					// 			 enabled: false,
					// 			 states: {
					// 				hover: {
					// 					enabled: false
					// 				}
					// 			}
					// 		  },
					// 		  showInLegend: false,
					// 		  // color: spendingData[2][fourthIndex].color,
					// 		  color: {
					// 			linearGradient: {
					// 			  x1: 0,
					// 			  x2: 0,
					// 			  y1: 0,
					// 			  y2: 1
					// 			},
					// 			stops: [
					// 			  [0, spendingData[2][fourthIndex].color],
					// 			  [1, spendingData[2][fourthIndex].color+"77"]
					// 			]
					// 		  },
					// 		  img: spendingData[2][fourthIndex].img
					// 	  }, {
					// 		  name: spendingData[2][fifthIndex].name,
					// 		  data: allDataArr[fifthIndex],
					// 		   marker: {
					// 			 enabled: false,
					// 			 states: {
					// 				hover: {
					// 					enabled: false
					// 				}
					// 			}
					// 		  },
					// 		  showInLegend: false,
					// 		  // color: spendingData[2][fifthIndex].color,
					// 		  color: {
					// 			linearGradient: {
					// 			  x1: 0,
					// 			  x2: 0,
					// 			  y1: 0,
					// 			  y2: 1
					// 			},
					// 			stops: [
					// 			  [0, spendingData[2][fifthIndex].color],
					// 			  [1, spendingData[2][fifthIndex].color+"77"]
					// 			]
					// 		  },
					// 		  img: spendingData[2][fifthIndex].img
					// 	  }, {
					// 		  name: spendingData[2][sixthIndex].name,
					// 		  data: allDataArr[sixthIndex],
					// 		   marker: {
					// 			 enabled: false,
					// 			 states: {
					// 				hover: {
					// 					enabled: false
					// 				}
					// 			}
					// 		  },
					// 		  showInLegend: false,
					// 		  // color: spendingData[2][sixthIndex].color,
					// 		  color: {
					// 			linearGradient: {
					// 			  x1: 0,
					// 			  x2: 0,
					// 			  y1: 0,
					// 			  y2: 1
					// 			},
					// 			stops: [
					// 			  [0, spendingData[2][sixthIndex].color],
					// 			  [1, spendingData[2][sixthIndex].color+"77"]
					// 			]
					// 		  },
					// 		  img: spendingData[2][sixthIndex].img
					// 	  },{
					// 		  name: spendingData[2][otherIndex].name,
					// 		  data: allDataArr[otherIndex],
					// 		   marker: {
					// 			 enabled: false,
					// 			 states: {
					// 				hover: {
					// 					enabled: false
					// 				}
					// 			}
					// 		  },
					// 		  showInLegend: false,
					// 		  // color: spendingData[2][otherIndex].color,
					// 		  color: {
					// 			linearGradient: {
					// 			  x1: 0,
					// 			  x2: 0,
					// 			  y1: 0,
					// 			  y2: 1
					// 			},
					// 			stops: [
					// 			  [0, spendingData[2][otherIndex].color],
					// 			  [1, spendingData[2][otherIndex].color+"77"]
					// 			]
					// 		  },
					// 		  img: spendingData[2][otherIndex].img
					// 	  }]

					//   }
					//   , function(chart) {

					// 		// var legend = chart.legend;

					// 		// if (legend.display) {
					// 		  // legend.group.hide();
					// 		  // legend.box.hide();
					// 		  // legend.display = false;
					// 		// } else {

					// 		  // legend.group.show();
					// 		  // legend.box.show();
					// 		  // legend.display = true;
					// 		// }
					// 	}
					// 	);



						$('.spending-breakout-section #load').remove();
				  });

			  };


    /** Top Transactions  **/
		this.monthlyTopTransactions = function(month, category = '') {
		  // Service call
      $('.rectrans').append(html);

		minAmt = [0];
		maxAmt = [50];

		$('.rectrans').append(html);

		  this.spendingService.getSpendingTransactions(localStorage.getItem('customerId'), month, category, minAmt, maxAmt)
		  .subscribe( data => {
		debugger;
			this.topTransactions = data;
		$('.rectrans #load').remove();
		$('.spending-breakout-section4').height($('.spending-breakout-section3').height());

        this.changeDetector.detectChanges();
		  });
		};
		// First Time Call



		/** Spending Ratio  **/
		this.spendingRatio = function(month) {
		  // Service call
			$('#sRatio').append(html);
      $($('.colored-btn.ratio')[3 - month]).addClass('active');
      this.spendingService.getSpendingRatio(localStorage.getItem('customerId'), month)
          .subscribe( data => {
          this.ratioData = data;
          this.changeDetector.detectChanges();
          const pratio = parseFloat(data.pratio) / 100;
          const ratio = parseInt(data.ratio);

          // console.log(ratio + pratio);
          if (spendingRatioGlobal) {
              spendingRatioGlobal.destroy();
              spendingRatioGlobal = '';
          }

          const gradient = '<defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="50%" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#2dd8b1"/><stop offset="50%" stop-color="#40d0cb"/><stop offset="100%" stop-color="#65befd"/></linearGradient></defs>';

          spendingRatioGlobal = new ProgressBar.Circle('#spendingRatioCircle', {
              strokeWidth: 10,
              easing: 'easeInOut',
              duration: 1400,
              color: 'url(#gradient)',
              trailColor: '#eee',
              trailWidth: 10,
              svgStyle: null,
              // from: {color: '#2dd8b1', width:10},
              // to: {color: '#5ec1f3', width:10},
              step: function(state, circle) {
              // circle.path.setAttribute('stroke', state.color);
              // circle.path.setAttribute('stroke-width', state.width);

              let value = 0;

              if (ratio) {
                value = Math.round((ratio));
              }


              if (value > 100) {
                circle.setText('>100%');
              } else {
                circle.setText(value + '%');
              }

              }
          });
          spendingRatioGlobal.svg.insertAdjacentHTML('afterbegin', gradient);
          // spendingRatioGlobal.animate(1.0);
          spendingRatioGlobal.text.style.fontSize = '2.5rem';
          spendingRatioGlobal.animate(pratio); // Number from 0.0 to 1.0
          $('#sRatio #load').remove();
		  });
		};
		// First Time Call




    this.transactionsMonths = function(month) {
        let category = '';
        if ($('#tCategories.droptext').text() != '' || $('#tCategories.droptext').text() != 'Category') {
            category = $('#tCategories.droptext').text();
        }
        this.monthlyTopTransactions(month, category);
    };

    this.ddlCategory = function(category) {
        const month = 6;
		this.loading = false;
        if (category == '') {
          $('#tCategories.droptext').text('All');
        } else {
          $('#tCategories.droptext').text(category);
        }
        this.monthlyTopTransactions(month, category);
		$('.spending-ratio-section .right-card').height($('.spending-ratio-section .left-card').height());

    };


	this.renderPopUp = function(category, type= 0, index= 0) {
		// console.log(this.spendingTransArr);
		$('#spendingModal .modal-title').text(category + ' Transactions');
    if (type == 1) {
      const tempDataArr = selfObj.spendingGlobalData[2];

      // selfObj.spendingTransArr = [];

      $('#spendingModal').append(html);
      $.fn.dataTable.moment( 'MMM D, YYYY' );
      const t = $('#transactionsPopTable').DataTable();
      t.clear().order([0, 'desc']).draw();



      for (let a = 0; a < tempDataArr.length; a++) {
        if (tempDataArr[a].name == category) {
          const transactions = tempDataArr[a].transactions[selfObj.spendingGlobalData[0][index]];
          for (let b = 0; b < transactions.length; b++) {
            const posted_date = moment(parseInt(tempDataArr[a].transactions[selfObj.spendingGlobalData[0][index]][b].posted_date)).format('MMM D, YYYY');

            const amount = '$' + addCommasFormat(parseFloat(tempDataArr[a].transactions[selfObj.spendingGlobalData[0][index]][b].amount).toFixed(2));
            t.row.add([posted_date, tempDataArr[a].transactions[selfObj.spendingGlobalData[0][index]][b].normalized_payee_name, tempDataArr[a].transactions[selfObj.spendingGlobalData[0][index]][b].category, amount]).draw(true);
          }
        }
      }

    } else {

      $('#spendingModal').append(html);
      $.fn.dataTable.moment( 'MMM D, YYYY' );
      const t = $('#transactionsPopTable').DataTable();
      t.clear().order([0, 'desc']).draw();


      for (let b = 0; b < selfObj.spendingTransArr.length; b++) {
          const posted_date = moment(parseInt(selfObj.spendingTransArr[b].posted_date)).format('MMM D, YYYY');
          let payee_name = '';
          const data = selfObj.spendingTransArr[b];


          if (data.official_name != undefined) {
              payee_name =  '<br/><span class=\'subsection\'>' + (data.institution_id) + ' - ' + (data.official_name[0]) + ' (' + data.ac_number[0] + ')</span>';
          } else if ((data.accounts != undefined) && data.accounts.length) {
              payee_name = '<br/><span class=\'subsection\'>' + (data.accounts[0]['institution_id']) + ' - ' + (data.accounts[0]['official_name']) + ' (' + data.accounts[0]['ac_number'] + ')</span>';
          } else {
              payee_name = '';
          }
          payee_name = data.normalized_payee_name + payee_name.toLowerCase();
          const amount = '$' + addCommasFormat(parseFloat(selfObj.spendingTransArr[b].amount).toFixed(2));

          t.row.add([posted_date, payee_name, selfObj.spendingTransArr[b].category, amount, selfObj.spendingTransArr[b].trans_id]).draw(true);
	  }
	  $('#transactionsPopTable tbody').unbind().on('click', 'tr', function() {
		const data  =  t.row(this).data();
		selfObj.singleTransactionLoad(data[4]);

	  });

    }
    setTimeout(function() {
        $('#transactionsPopTable').DataTable().columns.adjust();
    }, 100);
    setTimeout(function() {
      if ($('body').hasClass('model-open')) {
        $('body').removeClass('model-open');
        $('body').addClass('model-open');
      } else {
        $('body').addClass('model-open');
      }
      $('#spendingModal').show();

      }, 1000);
  };

  		// Function to load single transaction details pop up
		this.singleTransactionLoad = function(transId) {
			this.transactionsService.getSingleTransaction(localStorage.getItem('customerId'), transId)
				.subscribe( transData => {
			if (transData) {
				transData = transData[0];
				const amount = '$' + addCommasFormat(parseFloat(transData.amount).toFixed(2));
				const merchant = transData.normalized_payee_name;
				const institution_id = transData.accounts[0]['institution_id'];
				const bank_name = (transData.accounts[0]['official_name']) + ' (' + transData.accounts[0]['ac_number'] + ')';
				const posted_date = moment(parseInt(transData.posted_date)).format('MM/DD/YYYY');
				const poptransactionId = transData.trans_id;
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
				$('#modal_single_transaction').modal('setting', 'closable', false).modal('show');
			}
			});
		};
	}

	createChart() {
		this.spendingChart = this.amChart.makeChart('breakOutContainer2', {
			'theme': 'none',
			'type': 'serial',
			// 'rotate': true,
			'startDuration': 1,
			'plotAreaFillAlphas': 0.1,
			'depth3D': 60,
			'angle': 30,
			'categoryField': 'month',
			'categoryAxis': {
					'gridPosition': 'start'
			},
			'export': {
				'enabled': true
			}
		});
	}



	public addCommasFormat(nStr) {
	  nStr += '';
	  const x = nStr.split('.');

	  let x1 = x[0];
	  const x2 = x.length > 1 ? '.' + x[1] : '.00';
	  const rgx = /(\d+)(\d{3})/;
	  while (rgx.test(x1)) {
		  x1 = x1.replace(rgx, '$1' + ',' + '$2');
	  }
	  return x1 + '<sup>' + x2 + '</sup>';
	}

}
	// Return with commas in between
	const numberWithCommas = function(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};
	// Function to add commas
function addCommas1(nStr) {
  nStr += '';
  const x = nStr.split('.');

  let x1 = x[0];
  const x2 = x.length > 1 ? '.' + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

function addCommasFormat(nStr) {
  nStr += '';
  const x = nStr.split('.');

  let x1 = x[0];
  const x2 = x.length > 1 ? '.' + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + '<sup>' + x2 + '</sup>';
}

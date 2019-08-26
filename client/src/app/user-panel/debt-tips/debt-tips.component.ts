import { Component, OnInit,HostBinding,HostListener,ChangeDetectorRef } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import * as Highcharts from 'highcharts';
import { DebtsService } from '../../services/debts.service';

var url = '';
declare var $: any;
declare var noUiSlider: any;

@Component({
  selector: 'app-debt',
  templateUrl: './debt-tips.component.html',
  styleUrls: ['./debt-tips.component.css'],
  providers: [DebtsService]
})


export class DebtTipsComponent implements OnInit {

	calculator = false;
	showq = false;
	chipaway = false;
	suggestions = false;
	percentage = 0;
	product_suggestions = false;
	credit_score_1 = false;
	credit_score_2 = false;
	credit_score_3 = false;
	credit_score_4 = false;
	backchip;
	nextchip;
	errorMsg = '';
	method = '';
	amount = 0.00;
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
      $('.router-container').show();
      $.getScript(url+"/../assets/js/debt-tips.js", function (w) { });

        var softSlider = document.getElementById('monthlyslider');
        noUiSlider.create(softSlider, {
                      start: [1210],
                      tooltips: false,
                      connect: [true, false],
                      range: {
                        'min': [0],
                        'max': [2632]
                      },
                      pips: {
                          mode: 'values',
                          values: [0, 1210, 2632],
                          density: 100,
                          format: {to: function( value, type ){
                                return "$"+addCommas1(value);
                          }}
                      }
        });

    });

          Highcharts.setOptions({
              lang: {
                numericSymbols: ["K", "M", "G", "T", "P", "E"],
                noData: "No Data"
              }
            });
          let xCategories = ['Today', '2 Month', '3 Month', '4 Month', '5 Month', '6 Month'];
          let chartHolder = $('#paydownContainer').highcharts({
                credits: {
                    enabled: false
                },
                chart: {
                  type: 'areaspline',
                  renderTo: 'paydownContainer',
                  plotBorderWidth: 0,
                  zoomType: 'xy',
                  plotBorderDasharray: [0,450,450]

                },
                height: 500,
                title: {
                  text: ''
                },
                tooltip: {
                    style:{
                    padding: 30
                  },
                  useHTML: true,
                  headerFormat: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
                  shared: false,
                  formatter: function() {

                  }
                },
                xAxis: {
                  tickColor: '#3E4873',
                  tickWidth: 2,
                  lineColor: '#3E4873',
                  lineWidth: 2,
                  gridLineColor: 'transparent',
                  tickInterval: 1,
                  minPadding: 0,
                  maxPadding: 0,
                  labels: {
                    enabled: true,
                    formatter: function() { return xCategories[this.value];},
                    style: {
                      fontSize: '14px',
                      fontWeight: '600',
                      fontFamily: 'NunitoSans'
                    }
                  },
                  crosshair: {
                    width: 1,
                    color: '#3E4873',
                    // dashStyle: 'shortdot',
                    zIndex: 5
                 },
                 //categories: ['Today', '2 Month', '3 Month', '4 Month', '5 Month', '6 Month']
                },
                yAxis: {
                  lineColor: '#3E4873',
                  lineWidth: 2,
                  gridLineColor: 'transparent',
                  title: {
                    enabled: false,
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
                  startOnTick: true,
                  endOnTick: true,
                  labels: {
                    enabled: false,
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
                name: 'Interest',
                data: [400, 500, 400, 350,260, 0],
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
                  [0,"#98DAFF"],
                  [1, "#98DAFF77"]
                  ]
                },
                img: 'plane-departure'
              }, {
                name: 'Principal',
                data: [700, 600, 350, 280,150, 0],
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
                  [0,"#8e80ff"],
                  [1, "#8e80ff77"]
                  ]
                },
                img: 'plane-departure'
              }]

              }
         );


    this.scrollView = function(i){

		$($(".sectionRotate")[i]).show(function(){

			if(i!=0){
				$($(".sectionRotate")[0]).hide();
				$($('.chip-away')[0]).show();
			}
			if(i!=1){
				$($(".sectionRotate")[1]).hide();
			}
			if(i!=2){
				$($(".sectionRotate")[2]).hide();;
				$('#products-section').hide();
				$($('.chip-away')[0]).show();
			}
			$($('.chip-away')[1]).hide();
			setTimeout(function(){
				var $container = $("html,body");
				var $scrollTo = $($(".sectionRotate")[i]);
				$container.animate({scrollTop: $scrollTo.offset().top-80},500);
			});

		});

    }

	this.questionView = function(){
		$($('.chip-away')[1]).show(function(){
			$($('.chip-away')[0]).hide();
			setTimeout(function(){
				var $container = $("html,body");
				var $scrollTo = $($(".sectionRotate")[1]);
				$container.animate({scrollTop: $scrollTo.offset().top-80},500);
			});
		});
	}

	this.suggestionView = function(i){

		$('#products-section').show(function(){

				var $container = $("html,body");
				var $scrollTo = $('#products-section');
				$container.animate({scrollTop: $scrollTo.offset().top-80},500);
		});

    }


    // Chip Section next button function
    this.nextchip = function(){
      var flag = true;
      this.errorMsg = '';
      this.percentage = 0;
      if(this.method == ''){
        flag = false;
        this.errorMsg = "Please choose a method.";
        return false;
      }else{
        this.percentage += 20;
      }
      if(this.amount <= 0 || this.amount > 99999){
        flag = false;
        this.errorMsg = "Please enter a valid amount.";
        return false;
      }else{
        this.percentage += 20;
      }

      if(this.percentage >= 100){
        this.percentage = 100;
      }
    }
    // Chip Section back button function
    this.backchip = function(){
      this.percentage -= 20;
      if(this.percentage <= 0){
        this.percentage = 0;
      }
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


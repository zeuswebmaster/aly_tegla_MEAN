import { Component, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../schema/transaction';
import { AccountsService } from '../../services/accounts.service';
import { Account } from '../../schema/account';
import { Chart } from 'chart.js';

var url = '';
declare var $: any;

@Component({
  selector: 'app-networth',
  templateUrl: './networth.component.html',
  styleUrls: ['./networth.component.css'],
  providers: [TransactionsService,AccountsService]
})

export class NetworthComponent implements OnInit {

  // Variables Declaration
  oneMonthlySpending;
  threeMonthlySpending;
  sixMonthlySpending;
  sectionFirst;


  constructor(platformLocation: PlatformLocation, private transactionsService : TransactionsService, private accountsService :          AccountsService) { url = (platformLocation as any).location.href;  }


  ngOnInit() {
	  $(document).ready(function () {
      $('.router-container').show();
		  $.getScript(url+"/../assets/js/networth.js", function (w) { });
		});

		var charts_options = {
            responsive:true,
			maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                titleFontSize: 14,
                titleFontColor: '#000',
                bodyFontColor: '#000',
                backgroundColor: '#fff',
                titleFontFamily: "'Rubik', sans-serif",
                bodyFontFamily: "'Rubik', sans-serif",
                tooltipTitleFontStyle: "bold",
                bodyFontStyle: "bold",
                cornerRadius: 5,
                intersect: false,
                callbacks: {
                    label: function(tooltipItems, data) {
                        return '$' + addCommas1(tooltipItems.yLabel);
                    }
                }
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    fontFamily: "'Rubik', sans-serif"
                },
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Month'
                    }
					,
                    ticks: {
                        fontColor: "rgba(80,80,80,1)",
                        fontSize: 14,
                        mirror: true,
                        beginAtZero: true,
                        labelOffset: 0,
                        maxRotation: 0,
                        minRotation: 0,
                        padding: 0
                    }
                }],
                yAxes: [{
                    display: false,
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            },
            title: {
                display: false,
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            }
        };

		var chartNetEstimate = document.getElementById("chart_net_worth");
        // chartNetEstimate.height = 300;
        var myChart1 = new Chart(chartNetEstimate, {
            type: 'line',
			bezierCurve: true,
            data: {
                labels: [ ['','2018'],['','2023'],['','2028'],['','2033'],['','2038'],['','2043'] ],
                type: 'line',
                defaultFontFamily: "'Rubik', sans-serif",
                datasets: [{
                    data: [ 1584.23,1699.64,1522.49,2230.07,987.18,2046.57 ],
                    label: "Liabilities",
                    backgroundColor: 'rgba(255,130,41,.15)',
                    borderColor: 'rgba(255,130,41,0.7)',
                    borderWidth: 3.5,
                    pointStyle: 'circle',
                    pointRadius: 3,
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'rgba(255,130,41,0.7)',
                },
				{
                    data: [ 150.23,329.64,292.49,1730.07,697.18,1386.57 ],
                    label: "Assets",
                    backgroundColor: 'rgba(94,191,23,.15)',
                    borderColor: 'rgba(94,191,23,0.7)',
                    borderWidth: 3.5,
                    pointStyle: 'circle',
                    pointRadius: 3,
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'rgba(94,191,23,0.7)',
                } ]
            },
            options: charts_options
        });

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

(function($) {
  'use strict';

  $(function() {
    /* Code for attribute data-custom-class for adding custom class to tooltip */
    if (typeof $.fn.tooltip.Constructor === 'undefined') {
      throw new Error('Bootstrap Tooltip must be included first!');
    }

    var Tooltip = $.fn.tooltip.Constructor;

    // add customClass option to Bootstrap Tooltip
    $.extend(Tooltip.Default, {
      customClass: ''
    });

    var _show = Tooltip.prototype.show;

    Tooltip.prototype.show = function() {

      // invoke parent method
      _show.apply(this, Array.prototype.slice.apply(arguments));

      if (this.config.customClass) {
        var tip = this.getTipElement();
        $(tip).addClass(this.config.customClass);
      }

    };

  });
})(jQuery);
$(document).ready(function(){

  $('[data-toggle="tooltip"]').tooltip();
	//Take the page to top on load
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;

  $('.sidebar .nav:not(.sub-menu) > .nav-item').removeClass('active');
  $('.sidebar .nav .nav-link').removeClass('active');
  $('.collapse').collapse("hide");
  $('.sidebar .nav:not(.sub-menu) > .nav-item.menu-dashboard').addClass('active');
	$('.spending .item').click(function(e) {
		$(this).parent().parent().find('.droptext').html($(this).text())
		var duration = $(this).attr('data-intrvl');
		// debugger;
		$('.spending .item').removeClass('active');
		 $(this).addClass('active');

		$('.container_spending').hide();
		$('#container_spending_' + duration).show();
	});


		$('.savings .item').click(function(e) {
             $(this).parent().parent().find('.droptext').html($(this).text());
             var duration = $(this).attr('data-intrvl');
			 $('.savings .item').removeClass('active');
			 $(this).addClass('active');
            /*
            if(duration == 'week') {
                $('#saving_month_date_range_main').hide();
                $('#saving_year_date_range_main').hide();
                $('#saving_week_date_range_main').show();
            }
            if (duration == 'month') {

                $('#saving_year_date_range_main').hide();
                $('#saving_week_date_range_main').hide();
                $('#saving_month_date_range_main').show();
            }
            if (duration == 'year') {
                $('#saving_week_date_range_main').hide();
                $('#saving_month_date_range_main').hide();
                 $('#saving_year_date_range_main').show();
            }*/
            $('.container_saving').hide();
            $('#container_saving_' + duration).show();
        });

		$('.investing .item').click(function(e) {
         $(this).parent().parent().find('.droptext').html($(this).text());
        var duration = $(this).attr('data-intrvl');

			$('.investing-tile .item').removeClass('active');
			 $(this).addClass('active');
        /*
        if(duration == 'week') {
            $('#investing_month_date_range_main').hide();
            $('#investing_year_date_range_main').hide();
            $('#investing_week_date_range_main').show();
        }
        if (duration == 'month') {

            $('#investing_year_date_range_main').hide();
            $('#investing_week_date_range_main').hide();
            $('#investing_month_date_range_main').show();
        }
        if (duration == 'year') {
            $('#investing_week_date_range_main').hide();
            $('#investing_month_date_range_main').hide();
              $('#investing_year_date_range_main').show();
        }*/
        $('.container_invest').hide();
        $('#container_invest_' + duration).show();
    });

	$('.cash_activity .dropdown .menu .item').click(function(e) {
            // alert($(this).text());
			$(this).parent().parent().parent().find('.droptext').html($(this).text())
            // var duration = $(this).attr('data-intrvl');

            // $('.container_spending').hide();
            // $('#container_spending_' + duration).show();
        });


		$('.quarters').click(function() {
            $('.quarters').removeClass('active');
            $(this).removeClass('btn-default');
            $(this).addClass('active');
            $('.money_inflow_quarters').hide();
            $('#money_inflow_quarters' + $(this).attr('data-qtr')).show();
            $('#inflowTotal').html($(this).attr('data-iftotals'));
            $('.inflow a[data-intrvl=month]').attr('data-iftotals', $(this).attr('data-iftotals'));
        });
		 // $('.golden_merchants a').click(function() {
            // $('.golden_merchants a').removeClass('merchant_active');
            // $(this).addClass('merchant_active');
            // $('#golden_merchant').html($(this).html() + ' <i class="fa fa-angle-down"></i>');
            // $('#golden_total').html($('.golden_merchants a.merchant_active').attr('data-' + $('.golden_intervals a.merchant_active').attr('data-intrvl')));
        // });
        // $('.golden_intervals a').click(function() {
            // $('.golden_intervals a').removeClass('merchant_active');
            // $(this).addClass('merchant_active');
            // var durtion = $(this).attr('data-intrvl');
            // $('#golden_interval').html($(this).html() + ' <i class="fa fa-angle-down"></i>');
            // $('#golden_total').html($('.golden_merchants a.merchant_active').attr('data-' + durtion));
        // });
        // $('.golden_merchants li:first a').addClass('merchant_active');
        // $('.golden_intervals li a[data-intrvl=week]').addClass('merchant_active');



        $('#inflowTotal').html($('.quarters[data-qtr=20184]').attr('data-iftotals'));
          $('.inflow a[data-intrvl=2018]').attr('data-iftotals', $('.quarters[data-qtr=20184 ]').attr('data-iftotals'));
          $('#last_year_iftotal[data-intrvl=2017]').attr('data-iftotals', $('.quarters[data-qtr=20174 ]').attr('data-iftotals'));

		$('[data-toggle="tooltip"]').each(function() {
            var $elem = $(this);
            $elem.tooltip({
                placement: 'bottom',
                trigger: 'hover',
                animation: true,
                html: true,
                container: $elem,
                boundary: 'viewport'
            });
        });
		//alert('gettotalCredit'0);
		//alert('gettotalCredit'0);
		//$('#accountsTotal').html('$3,447<sup>.81</sup>');


      var res = getQuarter();

      $('#inflow_data_container_2018 .inflow_btns .quarters:eq(' + res + ')').addClass('active');
      $('#inflow_data_container_2018 .inflow_btns .quarters:eq(' + res + ')').trigger("click");


	  //Savings custom tooltip mouseout/mouseenterevent from chart
	  $('.savings-tile').on('mouseover',function(){
		 $('#chartjs-tooltip').show();
	  });
	  $('.savings-tile').on('mouseout',function(){
		 $('#chartjs-tooltip').hide();
	  });



});
function getQuarter(d) {
  d = d || new Date(); // If no date supplied, use today
  var q = [4,1,2,3];
  return q[Math.floor(d.getMonth() / 3)];
}
function changeDD(e) {

    $(e).parent().parent().find('.droptext').html($(e).text());
    var duration = $(e).attr('data-intrvl');
    var r = $(e).attr('data-intrvl');
    var durtion = $(e).attr('data-intrvl');
    $('.inflow_data_container').hide();
    $('#inflow_data_container_' + r).show();
  //$('#inflow_interval').html($(this).html() + ' <i class="fa fa-angle-down"></i>');
      $('.inflow_data_container').hide();
      $('#inflowTotal').html($(e).attr('data-iftotal'));
      $('#inflow_data_container_' + durtion).show();
      var res = parseInt($('#currentQuarter').text()) - 1;
      $('#inflow_data_container_' + durtion + ' .inflow_btns .quarters').removeClass('btn-default');
      $('#inflow_data_container_' + durtion + ' .inflow_btns .quarters:eq(' + res + ')').addClass('active');
      $('#inflow_data_container_' + durtion + ' .inflow_btns .quarters:eq(' + res + ')').trigger("click");
}

// function changeDDCashAcct(e) {
  // $(e).parent().parent().find('.droptext').html($(e).text());
  // var cashWithdraw = "$"+$(e).attr("cashWithdraw");
  // var bankFees = "$"+$(e).attr("bankFees");

  // $('#cash_withdraw_amt').html(cashWithdraw);
  // $('#cash_atmfee_amt').html(bankFees);

// }


function addCommaFormat(nStr) {
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

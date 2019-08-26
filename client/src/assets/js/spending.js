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
	document.body.scrollTop = 0;1
	document.documentElement.scrollTop = 0;


	// menu active effect
	$('.sidebar .nav:not(.sub-menu) > .nav-item').removeClass('active');
   $('.sidebar .nav .nav-link').removeClass('active');
   $('.collapse').collapse("hide");
	$('.sidebar .nav:not(.sub-menu) > .nav-item.menu-spending').addClass('active');

	$('.spending-section .duration .btn-xs').click(function(){
		$('.spending-section .duration  .btn-xs').removeClass('active');
		$(this).addClass('active');
	});
	$('.spending-detail-section .duration .btn-xs').click(function(){
		$('.spending-detail-section .duration  .btn-xs').removeClass('active');
		$(this).addClass('active');
	});
	$('.spending-ratio-section .duration .btn-xs').click(function(){
		$('.spending-ratio-section .duration  .btn-xs').removeClass('active');
		$(this).addClass('active');
	});


	$.fn.DataTable.ext.pager.numbers_length = 5;

	$('#transactionsPopTable').DataTable({
		// "scrollCollapse": true,
		// "scrollX": "100%",
		// "scrollXInner": "100%",
		"paging": true,
		"pageLength": 100,
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
			{ "width": "20%", "targets": 0 },
			{ "width": "50%", "targets": 1 },
			{ "width": "20%", "targets": 2 },
			{ "width": "10%", "targets": 3 }
		],
		"dom": "i<'row w-100 pt-4'f>rtp",
    "initComplete": function( settings ) {
          $('#spendingModal .dataTable').wrap('<div class="dataTables_scroll" />');
      }
  });
  $("div.toolbar").html('<button type="button" style="position: relative;float:right;" class="btn-xs btn-danger mt-2" data-dismiss="modal">Close</button>');

});

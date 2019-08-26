 $(document).ready(function(){

	var activeMerchants = "";

	//Take the page to top on load
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;

	// menu active effect
	$('.sidebar .nav:not(.sub-menu) > .nav-item').removeClass('active');
	$('.sidebar .nav .nav-link').removeClass('active');
	$('.collapse').collapse("hide");
	$('.sidebar .nav:not(.sub-menu) > .nav-item.menu-transactions').addClass('active');


	// activating all semantic dropdowns
	$('#filter1').dropdown();
	$('#filter2').dropdown();
	$('#filter3').dropdown();
	$('#filter4').dropdown();
	$('#filter5').dropdown();
	$('#filter6').dropdown();
	$('#category').dropdown();

	//All filters click function
	$('#filter1,#filter2,#filter3,#filter4,#filter5,#filter6').on('click',function(event){
		if (event.target !== this){
			if($(this).attr('id')!='filter1'){
				$('#filter1').removeClass('opened');
				$('#filter1').removeClass('active');
				$('#filter1 .menu').attr('style','display: none !important');
			}
			if($(this).attr('id')!='filter2'){
				$('#filter2').removeClass('opened');
				$('#filter2').removeClass('active');
				$('#filter2 .menu').attr('style','display: none !important');
			}
			if($(this).attr('id')!='filter3'){
				$('#filter3').removeClass('opened');
				$('#filter3').removeClass('active');
				$('#filter3 .menu').attr('style','display: none !important');
			}
			if($(this).attr('id')!='filter4'){
				$('#filter4').removeClass('opened');
				$('#filter4').removeClass('active');
				$('#filter4 .menu').attr('style','display: none !important');
			}
			if($(this).attr('id')!='filter5'){
				$('#filter5').removeClass('opened');
				$('#filter5').removeClass('active');
				$('#filter5 .menu').attr('style','display: none !important');
			}
			if($(this).attr('id')!='filter6'){
				$('#filter6').removeClass('opened');
				$('#filter6').removeClass('active');
				$('#filter6 .menu').attr('style','display: none !important');
			}
			// $('.filter').removeClass('opened');
			// $('.filter').removeClass('active');
			// $('.filter .menu').attr('style','display: none !important');
			event.stopPropagation();
			return false;
		}
		if($(this).hasClass('opened')){
			$('.filter').removeClass('opened');
			$('.filter').removeClass('active');
			$('.filter .menu').attr('style','display: none !important');

		}else{
			$('.filter').removeClass('opened');
			$('.filter').removeClass('active');
			// $('.filter .menu').attr('style','display: none !important');

			$(this).addClass('opened');
			// $(this).find('.menu').attr('style','display: block !important');
		}



		event.stopPropagation();


	});

	$('app-transactions:not(.filter)').on('click',function(){


		$('.filter').removeClass('opened');
		$('.filter').removeClass('active');
		$('.filter .menu').attr('style','display: none !important');
		event.stopPropagation();
	});



	// Filter event - Last Week, Last Month, Last 6 Months
	$('.trBtn').on('click', function(){
		event.stopPropagation();

		if($(this).hasClass('active')){
			$('#search_checkin').val("");
			$('#search_checkout').val("");
			$(this).parent().find('.active').removeClass('active');
			$('#filter1 .icon.filter').attr('style','');
		}else{

			$(this).parent().find('.active').removeClass('active');
			$(this).addClass('active');
			$('#search_checkin').val("");
			$('#search_checkout').val("");

			var duration = $(this).parent().find('.active').data('duration');
			var fromDate = 0;
			var toDate = moment().unix()*1000;

			if(duration=="1"){
				fromDate = moment().subtract(1, 'months').unix()*1000;
			}
			else if(duration=="2"){
				fromDate = moment().subtract(3, 'months').unix()*1000;
			}
			else if(duration=="3"){
				fromDate = moment().subtract(6, 'months').unix()*1000;
			}

			$('#fromDateTS').val(fromDate);
			$('#toDateTS').val(toDate);

			$('#filter1 .icon.filter').attr('style','color: #63c0fd');
			// $('#filter1 .notify-icon').addClass('notify-badge');

		}

		var transactionMainTbl = $('#transactionMainTbl').DataTable();
		transactionMainTbl.draw();

	});


	//Filter event Min value
	$('#minAmt').on('keyup mouseup change',function(e){

		var amt = $('#minAmt').val();
		if(amt == ''){
			amt=0;
		}
		$('#filter6 .icon.filter').attr('style','color: #63c0fd');
		var transactionMainTbl = $('#transactionMainTbl').DataTable();
		transactionMainTbl.draw();
	});

	//Filter event Max value
	$('#maxAmt').on('keyup mouseup change',function(e){

		var amt = $('#maxAmt').val();
		if(amt == ''){
			amt=999999;
		}
		$('#filter6 .icon.filter').attr('style','color: #63c0fd');
		var transactionMainTbl = $('#transactionMainTbl').DataTable();
		transactionMainTbl.draw();
	});

	//Filter event status
	$('#filter4 .item').on('click', function(e){
		$('#status').val($(this).text());
		$('#filter4 .icon.filter').attr('style','color: #63c0fd');
		if($(this).text().trim()=="ALL"){
			$('#filter4 .icon.filter').attr('style','');
		}

		var transactionMainTbl = $('#transactionMainTbl').DataTable();
		transactionMainTbl.draw();
	});








	//Transactions Data Table Format and Search Filters function
	$.fn.dataTable.moment( 'MMM DD, YYYY' );
	$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {

	if ( settings.nTable.getAttribute('id') == 'transactionMainTbl' ){
		//Fetching datatable values
		var timestamp = parseInt(data[0]) || data[0];
		var dataMerchant = data[1];
		var dataAccounts = data[2];
    var dataStatus = data[3];
		var dataCategories = data[4];
		var amount = parseFloat( data[5] ) || 0;


		//Date Section
		var fromDate = $('#fromDateTS').val();
		var toDate = $('#toDateTS').val();

		if(fromDate == ""){
			fromDate = 0;
		}else{
			fromDate = parseInt(fromDate);
		}
		if(toDate == ""){
			toDate = new Date().getTime();
		}else{
			toDate = parseInt(toDate);
		}




		//Amount Section
		var minAmt = $('#minAmt').val();
		var maxAmt = $('#maxAmt').val();
		if(minAmt == "" && maxAmt == ""){
			$('#filter6 .icon.filter').attr('style','');
		}

		if(isNaN(minAmt) || minAmt == ""){
			minAmt = 0;
		}else{
			minAmt = parseInt(minAmt);
		}
		if(isNaN(maxAmt)|| maxAmt == ""){
			maxAmt = 9999999;
		}else{
			maxAmt = parseInt(maxAmt);
		}

		if(maxAmt==1000){
			maxAmt = 9999999;
		}


		//Status Section
    var status = $('#status').val().trim();
		var merchants = [];
		var accounts = [];
		var categories = [];

		//Merchants selection
		if($('#activeMerchants').val()!=""){
			merchants = $('#activeMerchants').val().split(',');
		}

		//Accounts selection
		if($('#activeAccounts').val()!=""){
			accounts = $('#activeAccounts').val().split(',');
		}

		//Categories selection
		if($('#activeCategories').val()!=""){
			categories = $('#activeCategories').val().split(',');
		}

		//Date Filter
		if(timestamp > fromDate){

			//Amount Filter
			if ( ( isNaN( minAmt ) && isNaN( maxAmt ) ) ||
			( isNaN( minAmt ) && amount <= maxAmt ) ||
			( minAmt <= amount   && isNaN( maxAmt ) ) ||
			( minAmt <= amount   && amount <= maxAmt ) ){

				//Merchant Filter
				if(($.inArray(dataMerchant,merchants)!== -1) || !(merchants.length)){

					//Accounts Filter
					if(($.inArray(dataAccounts,accounts)!== -1) || !(accounts.length)){

						//Categories Filter
						if(($.inArray(dataCategories,categories)!== -1) || !(categories.length)){
							//Status Filter

							if(status!='ALL'){
							 	if(status!=dataStatus){
							 		return false;
							 	}
              }
							return true;
						}
					}
				}
			}
		}
        return false;
    }else{
		return true;
	}
	}
);


$('#transactionMainTblFake').dataTable( {
	"destroy": true,
	"pageLength": 100,
	"paging": true,
	 "columnDefs": [
		 { "width": "200px", "targets": 0 },
		 // { "width": "30%", "targets": 1 },
		 { "width": "140px", "targets": 2 },
		  { "width": "90px", "targets": 3 },
		 { "width": "138px", "targets": 4 },
		 { "width": "160px", "targets": 5 },
		 { "width": "0px", "targets": 6, "visible": false },
		 { "width": "0px", "targets": 7, "visible": false },
		 { "width": "0px", "targets": 8, "visible": false }
	 ],
	 "language": {
	   "emptyTable": "Loading...",
	   "infoEmpty": "No  items to show",
	   "search": "",
	   "searchPlaceholder": "Find a Transaction"
	 },
	 "dom": 'rt'
 } );





   $('.up1').on('click',function() {
	 var value = $('#minAmt').val();
	 if(value.trim()==""){
		value=0;
	 }
	 $('#minAmt').val(++value);
	 var transactionMainTbl = $('#transactionMainTbl').DataTable();
		transactionMainTbl.draw();
   });

   $('.up2').on('click',function() {
	var value = $('#maxAmt').val();
	if(value.trim()==""){
	   value=0;
	}
	$('#maxAmt').val(++value);
	var transactionMainTbl = $('#transactionMainTbl').DataTable();
		transactionMainTbl.draw();
  });

  $('.down1').on('click',function() {
	var value = $('#minAmt').val();
	if(value.trim()==""){
	   value=0;
	}
	if(value!=0)
	{
		$('#minAmt').val(--value);
	}
	var transactionMainTbl = $('#transactionMainTbl').DataTable();
		transactionMainTbl.draw();
  });

  $('.down2').on('click',function() {
	var value = $('#maxAmt').val();
	if(value.trim()==""){
	   value=0;
	}
	if(value!=0)
	{
		$('#maxAmt').val(--value);
	}
	var transactionMainTbl = $('#transactionMainTbl').DataTable();
		transactionMainTbl.draw();
  });




});

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


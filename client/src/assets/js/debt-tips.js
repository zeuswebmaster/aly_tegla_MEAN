document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;

// menu active effect
$('.sidebar .nav .nav-item').removeClass('active');
$('.sidebar .nav .nav-item').removeClass('menu-debt-summary');
$('.sidebar .nav .nav-link').removeClass('active');
$('.sidebar .nav .nav-item.menu-debt').addClass('active');
$('.sidebar .nav .nav-link.menu-debt-tips-summary').addClass('active');
$('.sidebar .nav .nav-link.menu-debt-tips-summary').parent().removeClass('menu-debt-summary');
$('.sidebar .nav .nav-link.menu-debt-tips-summary').parent().addClass('menu-debt-summary');
$('#debt-menu').collapse("show");
$(function() {
	$(".debts-card li").click(function(e) {
	  $("li").removeClass("active");
	  $(".blue-line").css('opacity',0);
	  $(this).addClass("active");
	  $(this).find('a .blue-line').css('opacity',1);
	});
	$('.debts-card li.nav-item:first-child').addClass("active");
});

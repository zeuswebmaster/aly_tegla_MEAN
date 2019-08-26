 function togglePwd() {
  var x = document.getElementById("pwd");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

 function toggleCPwd() {
  var x = document.getElementById("cpwd");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

$('#phone').on('keypress', function(e) {

	var key = e.charCode || e.keyCode || 0;
  var phone = $('#phone');

  // Auto-format- do not expose the mask as the user begins to type
  if (key !== 8 && key !== 9) {
    if (phone.val().length === 3) {
      phone.val(phone.val() + '-');
    }
    if (phone.val().length === 7) {
      phone.val(phone.val() + '-');
    }
    if (phone.val().length === 9) {
      phone.val(phone.val() + '');
    }
    if (phone.val().length >= 11) {
      phone.val(phone.val().slice(0, 11));
    }
  }

  // Allow numeric (and tab, backspace, delete) keys only
  return (key == 8 ||
    key == 9 ||
    key == 46 ||
    (key >= 48 && key <= 57) ||
    (key >= 96 && key <= 105));
});

import { Component,OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlatformLocation } from '@angular/common';

declare var require: any;
declare var $: any;
var url = '';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthenticationService,FormBuilder]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  forgotPass = false;
  eyeOpen = "password";
  credentials: TokenPayload = {
    email: '',
    password: '',
    first_name: '',
    last_name:'',
    phone: '',
    otp:'',
    requested_otp_on:''
  };

  constructor(private auth: AuthenticationService, private router: Router,private formBuilder: FormBuilder,platformLocation: PlatformLocation) {
     url = (platformLocation as any).location.href;
  }


  ngOnInit() {
      $(document).ready(function () {
              $.getScript(url+"/../assets/js/login.js", function (w) {

              });
      });
      if(this.auth.isLoggedIn()){
          document.location.href = 'dashboard';
      }
      this.loginForm = this.formBuilder.group({
          email: ['', [Validators.required,Validators.email]],
          password: ['', [Validators.required]]
      });
  }
  get f() { return this.loginForm.controls; }

  login() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    this.auth.login(this.credentials).subscribe(() => {
      $('#response').removeClass('alert').removeClass('alert-danger').removeClass('alert-success').addClass('alert').addClass('alert-success').html("<strong>Login</strong> Successful.<br/>Redirecting to dashboard...");
      setTimeout(function(){document.location.href = 'dashboard';} ,3000);

    }, (err) => {
       $('#response').removeClass('alert').removeClass('alert-danger').removeClass('alert-success').addClass('alert').addClass('alert-danger').html("<strong>Login</strong> unsuccessful<br/>");
    });
  }

  forgot() {
    // stop here if form is invalid
    this.submitted = true;
    if(this.loginForm.controls.email.invalid) {
        return;
    }
    this.submitted = false;
    this.auth.forgot(this.credentials).subscribe((res) => {
      if(res.resetToken == 'sent' && res.isExists == true){
          $('#response').removeClass('alert').removeClass('alert-success').removeClass('alert-danger').addClass('alert').addClass('alert-success').html("Please check your email. We have sent you instructions to change your password.");
          this.credentials.email = '';
      }else{
           $('#response').removeClass('alert').removeClass('alert-danger').removeClass('alert-success').addClass('alert').addClass('alert-danger').html("Sorry. This user doesn't exits on our database");
      }

    }, (err) => {
       $('#response').removeClass('alert').removeClass('alert-danger').removeClass('alert-success').addClass('alert').addClass('alert-danger').html("Sorry. This user doesn't exits on our database");
    });
  }
  togglePwd() {
    if(this.eyeOpen === "password"){
      this.eyeOpen = "text";
    }else{
      this.eyeOpen = "password";
    }
  }

}

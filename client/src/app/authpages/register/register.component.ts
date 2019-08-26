import { Component,OnInit,Input} from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../services/authentication.service';
import { Router } from '@angular/router';
import {AbstractControl, FormControl, FormBuilder, FormGroup, Validators}  from '@angular/forms';
import { PlatformLocation } from '@angular/common';
import { UserEmailValidator } from './usernameValidator';

declare var require: any;
declare var $: any;
var url = '';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthenticationService,FormBuilder,UserEmailValidator]
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  otpSent = false;
  chooseMethod = false;
  otpRequested = false;
  eyeOpen = "password";
  eyeCOpen = "password";
  credentials: TokenPayload = {
    email: '',
    first_name: '',
    last_name: ' ',
    password: '',
    phone: '',
    otp:'123456',
    requested_otp_on:'email'
  };
  constructor(private auth: AuthenticationService, private router: Router,private formBuilder: FormBuilder,platformLocation: PlatformLocation,public useremailValidator: UserEmailValidator) {
     url = (platformLocation as any).location.href;
  }

  ngOnInit() {
      $(document).ready(function () {
        $.getScript(url+"/../assets/js/register.js", function (w) {
        });
      });
      if(this.auth.isLoggedIn()){
          document.location.href = 'dashboard';
      }
      let self = this;
      this.registerForm = this.formBuilder.group({
          first_name: ['', Validators.required],
          // last_name: ['', Validators.required],
          email: [Validators.required, Validators.email, this.useremailValidator.checkUserEmail.bind(this.useremailValidator)],
          password: ['', [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}')]],
          cpassword: ['', [Validators.required, this.passwordConfirming]],
          otp: ['', [Validators.required,Validators.minLength(6)]],
          agreement: [false, [Validators.requiredTrue]],
          otpsendon:[],
          phone:[null,null]
      });
  }
  get f() { return this.registerForm.controls; }
  chooseOtpMethod(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.chooseMethod = true;
    this.submitted = false;
    this.otpRequested = false;
  }

  register() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.auth.register(this.credentials).subscribe((res) => {
      if(res.otp=="sent"){
        this.otpSent = true;
        this.submitted = false;
        this.credentials.otp = "";
        this.otpRequested = true;
        $('#response').removeClass('alert').removeClass('alert-success').addClass('alert').addClass('alert-success').html("Please enter the six-digit one-time passcode sent to your "+this.credentials.requested_otp_on);
      }else if(res.isExists){
        $('#response').removeClass('alert').removeClass('alert-success').addClass('alert').addClass('alert-success').html("You are already registered with us. Please login.");
      }else{
        $('#response').removeClass('alert').removeClass('alert-danger').addClass('alert').addClass('alert-danger').html("<strong>Temporary service unavailable. Please try later.</strong>");
      }
    }, (err) => {
       $('#response').removeClass('alert').removeClass('alert-danger').addClass('alert').addClass('alert-danger').html("Temporary service unavailable. Please try later.");
    });
  }

  reSendOtp() {

    this.auth.resendotp(this.credentials).subscribe((res) => {
      if(res.otp=="resent" && !res.isExists){
        this.otpSent = true;
        this.submitted = false;
        this.credentials.otp = "";
        this.otpRequested = true;
        $('#response').removeClass('alert').removeClass('alert-success').addClass('alert').addClass('alert-success').html("Please enter the six-digit one-time passcode sent to your "+this.credentials.requested_otp_on);
      }else if(res.otp=="resent" && res.isExists){
        $('#response').removeClass('alert').removeClass('alert-success').addClass('alert').addClass('alert-success').html("Passcode sent again");
      }else{
        $('#response').removeClass('alert').removeClass('alert-danger').addClass('alert').addClass('alert-danger').html("<strong>Temporary service unavailable. Please try later.</strong>");
      }
    }, (err) => {
       $('#response').removeClass('alert').removeClass('alert-danger').addClass('alert').addClass('alert-danger').html("Temporary service unavailable. Please try later.<br/>");
    });
  }
  verify(){
    this.auth.verify(this.credentials).subscribe((res) => {
      this.submitted = true;
      // stop here if form is invalid
      if(this.registerForm.invalid) {
          return;
      }
      if(res.otp=="verified"){
        $('#response').removeClass('alert').removeClass('alert-success').addClass('alert').addClass('alert-success').html("<strong>Registration</strong> Successful.<br/>Redirecting to login page...");
        setTimeout(function(){document.location.href = 'login';} ,2000);
      }else{
        $('#response').removeClass('alert').removeClass('alert-danger').addClass('alert').addClass('alert-danger').html("<strong>OTP</strong> is invalid");
      }
    }, (err) => {
       $('#response').removeClass('alert').removeClass('alert-danger').addClass('alert').addClass('alert-danger').html("<strong>Registration</strong> unsuccessful<br/>");
    });
  }

  verifyEmail(){
     this.auth.verifyEmail(this.credentials).subscribe((res) => {
        if(res.isExists){
          return {invalid: true};
        }else{
          return null;
        }
      }, (err) => {
        return null;
      });
  }
  passwordConfirming(c:AbstractControl): { invalid: boolean } {

      if ($('#pwd').val() !== $('#cpwd').val()) {
          return {invalid: true};
      }else{
          return null;
      }
  }
  togglePwd() {
    if(this.eyeOpen === "password"){
      this.eyeOpen = "text";
    }else{
      this.eyeOpen = "password";
    }
  }
  toggleCPwd() {
    if(this.eyeCOpen === "password"){
      this.eyeCOpen = "text";
    }else{
      this.eyeCOpen = "password";
    }
  }
}

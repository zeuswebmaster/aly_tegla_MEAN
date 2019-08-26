import { Component,OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import {AbstractControl, FormControl, FormBuilder, FormGroup, Validators}  from '@angular/forms';
import { PlatformLocation } from '@angular/common';

declare var require: any;
declare var $: any;
var url = '';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  providers: [AuthenticationService,FormBuilder]
})
export class ResetComponent {
  resetForm: FormGroup;
  submitted = false;
  resetToken = '';
  eyeOpen = "password";
  eyeCOpen = "password";
  credentials: TokenPayload = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    otp:'',
    requested_otp_on:''
  };

  constructor(private auth: AuthenticationService, private router: Router, private route: ActivatedRoute,private formBuilder: FormBuilder,platformLocation: PlatformLocation) {
     url = (platformLocation as any).location.href;
  }

  ngOnInit() {
      if(this.auth.isLoggedIn()){
          document.location.href = 'dashboard';
      }
      this.route.params.subscribe(params => {
        this.resetToken = params['resetToken'];
      });
      this.resetForm = this.formBuilder.group({
          password: ['', [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}')]],
          cpassword: ['', [Validators.required, this.passwordConfirming]],
      });
  }
  get f() { return this.resetForm.controls; }

  reset() {
    // stop here if form is invalid
    this.submitted = true;
    if(this.resetForm.invalid) {
        return;
    }
    this.submitted = false;
    this.auth.reset(this.credentials,this.resetToken).subscribe((res) => {
      if(res.passwordReset){
          $('#response').removeClass('alert').removeClass('alert-success').removeClass('alert-danger').addClass('alert').addClass('alert-success').html(res.message);
      }else{
           $('#response').removeClass('alert').removeClass('alert-danger').removeClass('alert-success').addClass('alert').addClass('alert-danger').html(res.message);
      }
    }, (err) => {
       $('#response').removeClass('alert').removeClass('alert-danger').removeClass('alert-success').addClass('alert').addClass('alert-danger').html("Temporary service unavailable.");
    });
  }
  passwordConfirming(c: AbstractControl): { invalid: boolean } {

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

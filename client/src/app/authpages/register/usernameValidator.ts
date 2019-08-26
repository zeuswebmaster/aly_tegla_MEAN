import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthenticationService, TokenPayload } from '../../services/authentication.service';
@Injectable()
export class UserEmailValidator {
  credentials: TokenPayload = {
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
    otp:'123456',
    requested_otp_on:'email'
  };
  debouncer: any;

  constructor(public auth: AuthenticationService){

  }

  checkUserEmail(control: FormControl): any {

    clearTimeout(this.debouncer);

    return new Promise(resolve => {

      this.debouncer = setTimeout(() => {
        this.credentials.email = control.value;
        this.auth.verifyEmail(this.credentials).subscribe((res) => {
        if(res.isExists){
          resolve({'isExists': true});
        }else{
          resolve(null);
        }
        }, (err) => {
          resolve(null);
        });
      }, 1000);

    });
  }

}

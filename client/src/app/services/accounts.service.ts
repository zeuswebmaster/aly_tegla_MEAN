import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../schema/transaction';
import { map } from 'rxjs/operators';
import * as config from '../../assets/config';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  token = '';
  constructor(private auth: AuthenticationService,private http: HttpClient) {
    this.token = auth.getToken();
  }

  //retieving all accounts
  getAccounts(customerId,ac_sub_type=""){
	var queryStr = '';
	var paramCount = 0;

	if(ac_sub_type!=""){
		queryStr += (paramCount?"\&":"\?")+"ac_sub_type="+ac_sub_type;
		paramCount++;
	}
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	// console.log("ng-AccountsService: calling API-"+config.host+'/api/accounts/'+queryStr);
    return this.http.get(config.host+'/api/accounts/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }
  
  //retieving all accounts
  deleteAccount(customerId,accId){
	var queryStr = '';
	var paramCount = 0;

	if(accId!=""){
		queryStr += (paramCount?"\&":"\?")+"ac_id="+accId;
		paramCount++;
	}
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	// console.log("ng-AccountsService: calling API-"+config.host+'/api/accounts/'+queryStr);
    return this.http.get(config.host+'/api/accounts/delete/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }
}

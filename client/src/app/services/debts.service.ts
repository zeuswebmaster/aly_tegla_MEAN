import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../schema/transaction';
import { map } from 'rxjs/operators';
import * as config from '../../assets/config';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class DebtsService {

	timezone = '';
	token = '';
	
	constructor(private auth: AuthenticationService,private http: HttpClient) {
		this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		this.token = auth.getToken();
	}
	
	getAccounts(customerId){
		var queryStr = '';
		var paramCount = 0;

		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		return this.http.get(config.host+'/api/debt/getallaccounts/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	}
}

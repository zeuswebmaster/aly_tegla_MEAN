import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../schema/transaction';
import { map } from 'rxjs/operators';
import * as config from '../../assets/config';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class SpendingService {


	timezone = '';
  token = '';
	constructor(private auth: AuthenticationService,private http: HttpClient) {
		this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.token = auth.getToken();
	}

	getCategorizedSpending(customerId,duration,minAmt,maxAmt){
		var queryStr = '';
		var paramCount = 0;

		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		if(minAmt!==""){
			queryStr += (paramCount?"\&":"\?")+"min_amt="+JSON.stringify(minAmt);
			paramCount++;
		}
		if(maxAmt!==""){
			queryStr += (paramCount?"\&":"\?")+"max_amt="+JSON.stringify(maxAmt);
			paramCount++;
		}
		return this.http.get(config.host+'/api/spending/get1monthlyspendingsection/'+duration+"/"+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	}

	getSixMonthsSpendingBreakout(customerId,minAmt,maxAmt){
		var queryStr = '';
		var paramCount = 0;
		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		if(minAmt!=""){
			queryStr += (paramCount?"\&":"\?")+"min_amt="+JSON.stringify(minAmt);
			paramCount++;
		}
		if(maxAmt!=""){
			queryStr += (paramCount?"\&":"\?")+"max_amt="+JSON.stringify(maxAmt);
			paramCount++;
		}
		return this.http.get(config.host+'/api/spending/get6monthlyspendingbreakout/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	}

	getSixMonthsSpendingBreakout2(customerId,minAmt,maxAmt){
		var queryStr = '';
		var paramCount = 0;
		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		if(minAmt!=""){
			queryStr += (paramCount?"\&":"\?")+"min_amt="+JSON.stringify(minAmt);
			paramCount++;
		}
		if(maxAmt!=""){
			queryStr += (paramCount?"\&":"\?")+"max_amt="+JSON.stringify(maxAmt);
			paramCount++;
		}
		return this.http.get(config.host+'/api/spending/get6monthlyspendingbreakout/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	}

	getSpendingDetail(customerId,duration,category,minAmt,maxAmt){
		// debugger;
		var queryStr = '';
		var paramCount = 0;
		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		if(duration!=""){
			queryStr += (paramCount?"\&":"\?")+"duration="+duration;
			paramCount++;
		}
		if(category!=""){
			queryStr += (paramCount?"\&":"\?")+"category="+category;
			paramCount++;
		}
		if(minAmt!==""){
			queryStr += (paramCount?"\&":"\?")+"min_amt="+JSON.stringify(minAmt);
			paramCount++;
		}
		if(maxAmt!==""){
			queryStr += (paramCount?"\&":"\?")+"max_amt="+JSON.stringify(maxAmt);
			paramCount++;
		}
		return this.http.get(config.host+'/api/spending/get1monthspendingdetail/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	}
  getSpendingTransactions(customerId,month,category,minAmt,maxAmt){
    var queryStr = '';
		var paramCount = 0;
		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		if(category!=""){
			queryStr += (paramCount?"\&":"\?")+"category="+category;
			paramCount++;
		}
		if(minAmt!==""){
			queryStr += (paramCount?"\&":"\?")+"min_amt="+minAmt;
			paramCount++;
		}
		if(maxAmt!==""){
			queryStr += (paramCount?"\&":"\?")+"max_amt="+maxAmt;
			paramCount++;
		}
		return this.http.get(config.host+'/api/spending/getTransactions/'+month+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getSpendingRatio(customerId,month){
    var queryStr = '';
		var paramCount = 0;
		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		return this.http.get(config.host+'/api/spending/getSpendingRatio/'+month+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }
}

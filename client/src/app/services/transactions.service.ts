import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../schema/transaction';
import { map } from 'rxjs/operators';
import * as config from '../../assets/config';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

	timezone = '';
  token = '';
  constructor(private auth: AuthenticationService, private http: HttpClient) {
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.token = auth.getToken();
  }

  syncAccountsAndTransactions(customerId){
    // debugger;
    var paramCount = 0;
     var queryStr = '';
    if(customerId!=""){
      queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
      paramCount++;
    }
    return this.http.get(config.host+'/sync/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  //retrieving all transactions
  getTransactions(fromDate, toDate, customerId, accountId="", payeeName=""){
    var queryStr = '';
    var paramCount = 0;

		if(fromDate!=""){
			queryStr += (paramCount?"\&":"\?")+"from_date="+fromDate;
			paramCount++;
		}
		if(toDate!=""){
			queryStr += (paramCount?"\&":"\?")+"to_date="+toDate;
			paramCount++;
		}
		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		if(accountId!=""){
			queryStr += (paramCount?"\&":"\?")+"account_id="+accountId;
			paramCount++;
		}
		if(payeeName!=""){
			queryStr += (paramCount?"\&":"\?")+"payee_name="+payeeName;
			paramCount++;
		}
		// console.log("ng-AccountsService: calling API-"+config.host+'/api/transactions/customfetch/'+queryStr);
		return this.http.get(config.host+'/api/transactions/customfetch/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});

  }

  //retrieving single transactions
  getTransactionsForNuggets(fromDate, toDate, customerId, accountId="", payeeName=""){
    var queryStr = '';
    var paramCount = 0;

		if(fromDate!=""){
			queryStr += (paramCount?"\&":"\?")+"from_date="+fromDate;
			paramCount++;
		}
		if(toDate!=""){
			queryStr += (paramCount?"\&":"\?")+"to_date="+toDate;
			paramCount++;
		}
		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		if(accountId!=""){
			queryStr += (paramCount?"\&":"\?")+"account_id="+accountId;
			paramCount++;
		}
		if(payeeName!=""){
			queryStr += (paramCount?"\&":"\?")+"payee_name="+payeeName;
			paramCount++;
		}
		// console.log("ng-AccountsService: calling API-"+config.host+'/api/transactions/customfetch/'+queryStr);
		return this.http.get(config.host+'/api/transactions/customfetchnuggets/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});

  }

   //retrieving all transactions
  getSingleTransaction(customerId, transId){
    var queryStr = '';
    var paramCount = 0;

		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		if(transId!=""){
			queryStr += (paramCount?"\&":"\?")+"trans_id="+transId;
			paramCount++;
		}
		// console.log("ng-AccountsService: calling API-"+config.host+'/api/transactions/customfetch/'+queryStr);
		return this.http.get(config.host+'/api/transactions/customtransbyid/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});

  }

  changeTransactionCategory(customerId, transId,catName){
    var queryStr = '';
    var paramCount = 0;

		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		if(transId!=""){
			queryStr += (paramCount?"\&":"\?")+"trans_id="+transId;
			paramCount++;
		}
		if(catName!=""){
			queryStr += (paramCount?"\&":"\?")+"new_category="+catName;
			paramCount++;
		}
		// console.log("ng-AccountsService: calling API-"+config.host+'/api/transactions/customfetch/'+queryStr);
		return this.http.get(config.host+'/api/transactions/changeTransCategory/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});

  }

  //Get Spending Chart data weekly
  getSpendingChartDataWeekly(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}

	return this.http.get(config.host+'/api/transactions/getspendingchartdataweekly/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

   //Get Spending Chart data monthly
  getSpendingChartDataMonthly(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}

	return this.http.get(config.host+'/api/transactions/getspendingchartdatamonthly/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  //Get Spending Chart data six monthly
  getSpendingChartDataSixMonthly(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}

	return this.http.get(config.host+'/api/transactions/getspendingchartdatasixmonthly/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  //Get Savings Chart data six monthly
  getSavingsChartData(customerId,duration){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/plaid/getsavingschartdata/'+duration+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  //Get Investing Chart data weekly
  getInvestingChartDataWeekly(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}

	return this.http.get(config.host+'/api/transactions/getinvestingchartdataweekly/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

   //Get Investing Chart data monthly
  getInvestingChartDataMonthly(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}

	return this.http.get(config.host+'/api/transactions/getinvestingchartdatamonthly/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  //Get Investing Chart data six monthly
  getInvestingChartDataSixMonthly(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}

	return this.http.get(config.host+'/api/transactions/getinvestingchartdatasixmonthly/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardSpendingWeeklyChart(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getweeklyspending/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardSpendingMonthlyChart(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getmonthlyspending/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardSpending6MonthlyChart(customerId){
	  var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/get6monthsspending/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardSavingsWeeklyChart(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getsavings/1/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardSavingsMonthlyChart(customerId){
	  var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getsavings/2'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardSavings6MonthlyChart(customerId){
	  var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getsavings/3'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardInvestingWeeklyChart(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getweeklyinvesting/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardInvestingMonthlyChart(customerId){
	  var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getmonthlyinvesting/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardInvesting6MonthlyChart(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/get6monthsinvesting/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardRecentTransactions(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getrecenttransactions/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardCashAndCredit(customerId){
	var queryStr = '';
	var timezoneLocal = this.timezone;
	var paramCount = 0;
	if(timezoneLocal!=""){
		queryStr += (paramCount?"\&":"\?")+"timezone="+timezoneLocal;
		paramCount++;
	}
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getcashandcreditweekly/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardMoneyInflow(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/getMoneyInflow/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardCashActivityWeekly(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getcashactivityweekly/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardCashActivityMonthly(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getcashactivitymonthly/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardCashActivity6Monthly(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getcashactivity6monthly/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardCreditUtilization(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getcreditutilization/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardCreditCards(customerId){
	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	return this.http.get(config.host+'/api/transactions/getcreditcards/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

  getDashboardTopMerchants(customerId,duration){
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
	return this.http.get(config.host+'/api/transactions/gettopmerchants/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

	getAllMerchants(customerId){
		var queryStr = '';
		var paramCount = 0;
		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		return this.http.get(config.host+'/api/transactions/getallmerchants/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	  }

	  getAllCategories(customerId){
		var queryStr = '';
		var paramCount = 0;
		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		return this.http.get(config.host+'/api/transactions/getallcategories/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	  }

  getAddBanksUrl(){
    return this.http.get(config.host+'/addBanksLink');
  }

  getFilteredTransactions(customerId, minAmt, maxAmt, transType, transCat, accId, dateRange){

	var queryStr = '';
	var paramCount = 0;
	if(customerId!=""){
		queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
		paramCount++;
	}
	if(minAmt!=""){
		queryStr += (paramCount?"\&":"\?")+"min_amt="+minAmt;
		paramCount++;
	}
	if(maxAmt!=""){
		queryStr += (paramCount?"\&":"\?")+"max_amt="+maxAmt;
		paramCount++;
	}
	if(transType!=""){
		queryStr += (paramCount?"\&":"\?")+"trans_type="+transType;
		paramCount++;
	}
	if(transCat!=""){
		queryStr += (paramCount?"\&":"\?")+"trans_cat="+transCat;
		paramCount++;
	}
	if(accId!=""){
		queryStr += (paramCount?"\&":"\?")+"acc_id="+accId;
		paramCount++;
	}
	if(dateRange!=""){
		queryStr += (paramCount?"\&":"\?")+"date_range="+dateRange;
		paramCount++;
	}

	return this.http.get(config.host+'/api/transactions/withfilters/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
  }

	getWelcomeData(customerId){
		var queryStr = '';
		var paramCount = 0;
		if(customerId!=""){
			queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
			paramCount++;
		}
		return this.http.get(config.host+'/api/transactions/getwelcomedata/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	  }

	  getIncomeData(customerId){
      var queryStr = '';
      var paramCount = 0;
      if(customerId!=""){
        queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
        paramCount++;
      }
      return this.http.get(config.host+'/api/transactions/getincomesixmonthavg/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	  }

	  getIncomeTrans(customerId){
      var queryStr = '';
      var paramCount = 0;
      if(customerId!=""){
        queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
        paramCount++;
      }
      return this.http.get(config.host+'/api/transactions/getincometranctions/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	  }
	  getProjectedIncomeData(customerId){
      var queryStr = '';
      var paramCount = 0;
      if(customerId!=""){
        queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
        paramCount++;
      }
      return this.http.get(config.host+'/api/transactions/getprojectedincomedata/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	  }

    getIncomeStreamData(customerId){
      var queryStr = '';
      var paramCount = 0;
      if(customerId!=""){
        queryStr += (paramCount?"\&":"\?")+"customer_id="+customerId;
        paramCount++;
      }
      return this.http.get(config.host+'/plaid/income/'+queryStr, { headers: { Authorization: `Bearer ${this.token}` }});
	  }

}

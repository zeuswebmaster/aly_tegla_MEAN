/** Here we will sync the local DB with MX Atrium remote DB */

var isInDevelopment = 0; //0 for production, 1 for development

//Import db schema
const AtriumMxTransModel = require("../models/atrium_mx_transactions");
const AtriumMxAccountsModel = require("../models/atrium_mx_accounts");

//Adding Express
var express = require('express');
var router = express.Router();
const Atrium = require('mx-atrium');
let current_page = 1;
let total_pages = 1;
var msg = "";

// Get Customer Id from login of user. Currently hardcoded because we don't have login functionality
const customerId  = "USR-d24aba9a-8dd2-353d-72d4-2cf3b43ede64";

// Mx API keys Defination Compulsory for application
const MX_API_Key = 'a8ef2dfc9ce2ba47ab85c7e9196b3815ce185fb0';
const MX_Client_ID = '1a41057b-4aed-4c07-813a-463faf02d2a5';

//Check whether app is in development or production and assign MX server URL & Atrium client
var AtriumClient = '';
if(isInDevelopment){
    AtriumClient = new Atrium.Client(MX_API_Key,MX_Client_ID, Atrium.environments.development);
}else{
    AtriumClient = new Atrium.Client(MX_API_Key,MX_Client_ID, Atrium.environments.production);
}

router.get('/addBanksLink',(req,res)=>{
    var request = {
        params: {
            userGuid: customerId
        }
    };
    AtriumClient.getConnectWidgetUrl(request).then(response => res.send(response));
});

router.get('/',(req,res)=>{
console.log('Syncing the local DB...');


/**** Syncing the accounts collection *****/

async function getAccounts(current_page, total_pages){
    
    //Making parameters object for request
    var request = {
        params: {
        userGuid: customerId,
        records_per_page: 100,
        page: current_page
        }
    };

    if(current_page<=total_pages){
        AtriumClient.listAccounts(request).then(async(response)=>{
            var accounts = response.accounts;
            total_pages = response.pagination.total_pages;
            console.log("Accounts response: "+JSON.stringify(response.accounts));
            // console.log("Total Pages: "+total_pages);
            for(let index in  accounts){
                   await AtriumMxAccountsModel.count({ac_id: accounts[index].guid}, async (err, count)=>{
                    
                        if(count>0){
                            // console.log("Existed:"+index+": "+accounts[index].guid);
                        }else{
                            let newAcc = new AtriumMxAccountsModel({
                                ac_id: accounts[index].guid,
                                ac_number: '',
                                ac_name: accounts[index].name,
                                balance: accounts[index].balance,
                                ac_type: accounts[index].type,
                                status: accounts[index].status,
                                customer_id: accounts[index].user_guid,
                                institution_id: accounts[index].institution_code,
                                balance_date: '',
                                last_update_date: new Date(accounts[index].updated_at).getTime(),
                                currency: 'USD',
                                detail: "",
                                credit_limit: accounts[index].credit_limit,
								available_credit: accounts[index].available_credit
                            });

                            newAcc.save((err, trans)=>{
                                if(err){
                                   msg += "Failed to sync accounts: "+accounts[index].guid+", Error: "+err;
                                   console.log(msg);
                                }
                                else{
                                    count++;
                                    msg += "Accounts synced successfully: "+ accounts[index].guid;
                                    console.log(msg);
                                }
                            });
                        }
                    }); 
            }
			current_page++;
            getAccounts(current_page,total_pages);
        });
	}
	
}


/**** Syncing the transaction collection *****/

var resStr = '';
msg = '';
current_page = 1;
total_pages = 1;

//Loop to get all transcation data page by page
async function getTransaction(current_page, total_pages){

    //Making parameters object for request
    var request = {
        params: {
        userGuid: customerId,
        records_per_page: 100,
        page: current_page
        }
    };

    if(current_page<=total_pages){
        AtriumClient.listTransactions(request).then(async(response)=>{
            var transactions = response.transactions;
            total_pages = response.pagination.total_pages;
            // console.log("Current Page: "+current_page);
            // console.log("Total Pages: "+total_pages);
            for(let index in  transactions){
                
                    await AtriumMxTransModel.count({trans_id: transactions[index].guid}, async (err, count)=>{
                    
                        if(count>0){
                            // console.log("Existed:"+index+": "+transactions[index].guid);
                        }else{
                            let newTrans = new AtriumMxTransModel({
                                category: transactions[index].category,
                                created_date: new Date(transactions[index].created_at).getTime(),
								date: transactions[index].date,
								original_description: transactions[index].original_description,
                                status: transactions[index].status,
								type: transactions[index].type,
								posted_date: new Date(transactions[index].posted_at).getTime(),
								top_level_category: transactions[index].top_level_category,
								transacted_at: new Date(transactions[index].transacted_at).getTime(),
								updated_at: new Date(transactions[index].updated_at).getTime(),
								account_id: transactions[index].account_guid,
								amount: transactions[index].amount,
                                normalized_payee_name: transactions[index].description,
								trans_id: transactions[index].guid,
								is_bill_pay: transactions[index].is_bill_pay,
								is_direct_deposit: transactions[index].is_direct_deposit,
								is_expense: transactions[index].is_expense,
								is_fee: transactions[index].is_fee,
								is_income: transactions[index].is_income,
								is_overdraft_fee: transactions[index].is_overdraft_fee,
								is_payroll_advance: transactions[index].is_payroll_advance,
								member_guid: transactions[index].member_guid,
                                memo: transactions[index].memo,
                                merchant_guid: transactions[index].merchant_guid,
                                customer_id: transactions[index].user_guid
                            });

                            newTrans.save((err, trans)=>{
                                if(err){
                                   msg += "Failed to sync transaction: "+transactions[index].guid+", Error: "+err;
                                   console.log(msg);
                                }
                                else{
                                    count++;
                                    msg += "Transaction synced successfully: "+ transactions[index].guid;
                                    console.log(msg);
                                }
                            });
                        }
                    }); 
                

                

            }
            current_page++;
            getTransaction(current_page,total_pages);
        });

    }

}

console.log("Syncing Transaction now...");
getTransaction(1,1);
console.log("Syncing Accounts now...");
getAccounts(1,1);


console.log("All syncing done...");
res.send("");

});




module.exports = router;



// // Check whether it is in development or production and assign atrium client accordingly
// var AtriumClient = '';
// if(isInDevelopment){
//     AtriumClient = new Atrium.Client(MX_API_Key,MX_Client_ID, Atrium.environments.development);
// }else{
//     AtriumClient = new Atrium.Client(MX_API_Key,MX_Client_ID, Atrium.environments.production);
// }

// app.get('/user/account', (request, response) => {
//     request.params.userGuid = customerId;
//   AtriumClient.listAccounts(request)
//   .then(json=>{response.send(json)});
// });

// app.use(express.static("client")); // myApp will be the same folder name.

// app.get('/', function (req, res,next) {
//  res.sendFile(path.resolve('client/dist/client/index.html'));
// });

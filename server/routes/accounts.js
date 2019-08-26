//Adding Express
var express = require('express');
var router = express.Router();

//Import db schema
const PlaidAccountsTokensModel = require("../models/accounts_tokens");
const PlaidReportTokensModel = require("../models/reporttokens");
const AtriumMxTransModel = require("../models/atrium_mx_transactions");
const AtriumMxAccountsModel = require("../models/atrium_mx_accounts");
const AccountsBalanceHistoryModel = require("../models/accounts_bal_hist");
/*
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
*/
//Receiving a GET request to fetch all accounts based on filters
router.get('/',  (req, res, next)=>{
    // console.log("Fetching accounts data...");

    //Getting all the request parameters
    var query = {};
    if(req.query != null){
        query = req.query;
    }
	console.log("query:"+ JSON.stringify(query));
    AtriumMxAccountsModel.find(query).sort( { institution_id: 1 } ).exec((err, trans) => {
            
				res.send(trans);
			}
		);;
});

//POST request to save account data
router.post('/add',(req, res, next)=>{

    // console.log("trying to add account...");

    var reqStr = req.body;
    var count = 0;
    var msg = "";
    // console.log(reqStr);

    for (var query in reqStr) {

        
        let newAcc = new AtriumMxAccountsModel({
            ac_id: reqStr[query].ac_id,
            ac_number: reqStr[query].ac_number,
            ac_name: reqStr[query].ac_name,
            official_name: reqStr[query].official_name,
            balance: reqStr[query].balance,
            ac_type: reqStr[query].ac_type,
            status: reqStr[query].status,
            customer_id: reqStr[query].customer_id,
            institution_id: reqStr[query].institution_id,
            balance_date: reqStr[query].balance_date,
            last_update_date: reqStr[query].last_update_date,
            currency: reqStr[query].currency,
            detail: reqStr[query].detail,
            credit_limit: reqStr[query].credit_limit,
			available_credit: reqStr[query].available_credit
        });

        
    
        newAcc.save((err, trans)=>{
            if(err){
               msg += "Failed to add account"+err+"<br/>";
               console.log(msg);
            }
            else{
                count++;
                msg += "Transaction added account - "+ count+"<br/>";
                console.log(msg);
            }
        });

    }
    res.send(msg);
});

//Delete request to delete data
router.get('/delete',(req, res, next)=>{
	
	var params = {};
	
    if(req.query != null){
      if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.ac_id!=null){
			params.ac_id = req.query.ac_id;
		}
		
	}
	
	AtriumMxAccountsModel.findOne(params,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            //console.log({'delParam':params});
            AtriumMxTransModel.deleteMany(params,function(err,result){
                if(err){
                    console.log(err);
                }
            });
             var delparams = {};
             //console.log(result);
             if(result){
                    delparams.token_id = result.token_id;
                    delparams.customer_id = params.customer_id;
                    //console.log({'delparams':delparams});
                    AtriumMxAccountsModel.find(delparams,function(err,result){
                        if(err){
                            console.log(err);
                        }
                        else{
                            
                            if(result){
                                //console.log(result);
                                for(var i=0 ;i < result.length;i++){
                                    var delParam = {'account_id':result[i].ac_id};
                                    
                                    delParam.customer_id = params.customer_id;
                                    //console.log({'delParam':delParam});
                                    AtriumMxTransModel.deleteMany(delParam,function(err,result){
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                                }
                                AtriumMxAccountsModel.deleteMany(delparams,function(err,result){
                                    if(err){
                                        console.log(err);
                                    }
                                });
                                var deltransparams = {};
                                deltransparams.item_id = delparams.token_id;
                                deltransparams.customer_id = params.customer_id;
                                //console.log(deltransparams);
                                PlaidAccountsTokensModel.deleteMany(deltransparams,function(err,result){
                                    if(err){
                                        console.log(err);
                                    }
                                    res.send({"success":true});
                                });
                                
                            }
                        }
                    });
             
             }else{
                 res.send({"success":false});
             }
        }
    });
	
   
});

//Receiving a GET request to fetch all accounts related transactions based on filters
router.get('/transactions', (req, res, next)=>{
    // console.log("Fetching accounts related transaction data...");

	var filters = {};
	
    //Getting all the request parameters
    var query = {};
	var mandatoryDataFlag = true;
    if(req.query != null){
		
		if(req.query.from_date!=null && req.query.to_date!=null && req.query.ac_id!=null && req.query.category!=null && req.query.from_date!=null && req.query.to_amount!=null && req.query.customer_id){
			filters = {
			"transactions.posted_date":{'$gte':req.query.from_date, '$lt':req.query.to_date},
			"ac_id":req.query.account_id,
			"transactions.category":req.query.category,
			"transactions.amount":{'$gte':req.query.from_amount, '$lt':req.query.to_amount},
			"transactions.customer_id":req.query.customer_id
			};
		}
		else{
			res.send({status:"FAILED",msg:"Mandatory fields are not supplied in the URL."});
		}
    }

    AtriumMxAccountsModel.aggregate([
		{
			$lookup:{
				from: "atriummxtransmodels",       // other table name
				localField: "ac_id",   // name of users table field
				foreignField: "account_id", // name of userinfo table field
				as: "transactions"         // alias for userinfo table
			}
		}
		,
		{   $unwind:"$transactions" }
		,
		{
			$match:{
				"transactions.normalized_payee_name": "Apple iTunes"
				// ,"institution_id": "chase"
			}
		}
		
        ]).exec((err, data) => {
			if(err){
				console.log('Error occured. :'+ err);
			}else{  
				console.log(data);
				res.send(data);
			}
		});
});

module.exports = router;

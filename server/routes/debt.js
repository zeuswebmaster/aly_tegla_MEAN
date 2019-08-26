 //Adding Express
var express = require('express');
var moment = require('moment');
var mongoose = require('mongoose');
var router = express.Router();

//Import db schema
const AtriumMxTransModel = require("../models/atrium_mx_transactions");
const AtriumMxAccountsModel = require("../models/atrium_mx_accounts");

router.get('/', (req, res, next)=>{
	res.send("Debts API root");
});

router.get('/getallaccounts', (req, res, next)=>{
	
	// console.log("Inside getallaccounts");
	
	var params = {};
	var customer_id = '';
	
	customer_id = req.query.customer_id;
	params = {"customer_id":customer_id};
	
	 AtriumMxAccountsModel.find(params, function(err,accArr){
			 if(err){
				console.log('Error occured. :'+ err);
			}else{ 
				//console.log(JSON.stringify(accArr));
				res.send(accArr);
			}
	 });
	
});

module.exports = router;

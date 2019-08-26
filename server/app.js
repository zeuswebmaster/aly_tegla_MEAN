//Importing modules
var express = require('express');


var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var cors = require('cors');
var cron = require('node-cron');
var request = require('request');

//const Atrium = require('mx-atrium'); //Atrium API


var app = express();

var fs = require('fs')

var key = fs.readFileSync('config/key.pem').toString();
var cert = fs.readFileSync('config/cert.pem').toString();  
var https = require('https');
var http = require('http');

require('./models/users');
require('./config/passport');
app.use(passport.initialize());
const sync = require('./routes/sync');
const server = require('./routes/server');
const transactions = require('./routes/transactions');
const accounts = require('./routes/accounts');
const spending = require('./routes/spending');
const debt = require('./routes/debt');
const authentication = require('./routes/authentication');
const profile = require('./routes/profile');
const plaid = require('./routes/plaid');

//Connect to mongodb

var options = {
  user: "alyuser",
  pass: "Fdj3#jsf^d-+dkasWE73hd",
  useNewUrlParser:true
};

// const mongoConnectionString = 'mongodb://localhost:27017/chunkmoney';
const mongoConnectionString = 'mongodb://chunkmoney.com:56743/chunkmoney';

// const syncUrl = 'http://localhost:7000/plaid/syncall';
const syncUrl = 'http://chunkmoney.com:7000/plaid/syncall';

var mongoClientInst = mongoose.connect(mongoConnectionString,options); 
var agenda;
//On connection
mongoose.connection.on('connected',(conn)=>{
    console.log('Connected to mongodb');
});
mongoose.connection.on('error',(err)=>{
    if(err){
        console.log('Error in database connection: '+err);
    }
});
// 
// Define port to use by node
//var port = 3000;

//Add middleware
app.use(cors());

//Add body parser
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));

//Add Routers
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
app.use('/',plaid);  //We will redirect root to sync node at the start of the application [after login]
app.use('/plaid',plaid);
app.use('/api',server);
app.use('/api/transactions',auth,transactions);
app.use('/api/accounts',auth,accounts);
app.use('/api/spending',auth,spending);
app.use('/api/debt',auth,debt);
app.use('/api/login',authentication.login);
app.use('/api/register',authentication.register);
app.use('/api/profile',profile.profileRead);
app.use('/api/verify',authentication.verify);
app.use('/api/sendotp',authentication.sendotp);
app.use('/api/reset/:token',authentication.resetpass);
app.use('/api/forgot',authentication.forgotpass);
app.use('/api/verifyemail',authentication.verifyEmail);

// Catch unauthorized errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});
https.createServer({key: key, cert:cert},app).listen(3000);
http.createServer(app).listen(7000);
/*
//Add listening port
app.listen(port,()=>{
    console.log('Node Server started at port:'+port);
});
*/


cron.schedule('*/10 * * * *', () => {
   request(syncUrl, function (error, response, body) {
	  // console.log("Cron ran1.");
	  if (!error && response.statusCode == 200) {
		 // console.log("Cron ran2.");
	  }else{
		  console.log("Error:"+error);
	  }
	})
	
	// console.log("Cron ran.");
   
});








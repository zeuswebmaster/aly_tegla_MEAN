"use strict";
const nodemailer = require("nodemailer");

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
// Need to come from config

//Test Credentials Twillio
//const accountSid = 'ACf56c1921eab51ce44ad6fe73752dd86d';
//const authToken = 'c86b44de35e98d1ab595f125297379a0';


// Live Credentials Twillio
const accountSid = 'ACf56c1921eab51ce44ad6fe73752dd86d';
const authToken = 'c86b44de35e98d1ab595f125297379a0';

const from_number = '+13365422287';
// Twilio object declaration
const twillioClient = require('twilio')(accountSid, authToken);


// Email Settings
const email_user = "_mainaccount@chunkmoney.com";
const email_password = "T?Q=CTqmV(lM";
const email_from = "accounts@chunkmoney.com";
const email_host = "chunkmoney.com";

// Registration 
module.exports.register = function(req, res) {
  var user = new User();
  user.first_name = req.body.first_name.split(" ")[0];
  user.last_name = req.body.first_name.substr(req.body.first_name.indexOf(" ") + 1);
  user.email = req.body.email.trim().toLowerCase();
  var country_code = "+1";
  if(user.email.indexOf("+") > -1) {
    country_code = "+91";
  }
  //var country_code = "+1";
  user.phone = country_code+req.body.phone.replace(/-/gi,"");   
  user.setPassword(req.body.password);
  user.verified = false;
    
  var otp = generateOtp(6);
  user.registration_otp = otp;  
  let sendOtpOn = req.body.requested_otp_on;
  
  var query = {email:user.email,verified:false};     
    User.findOne(query, function (err, found){
            var isExists = false;
            if (err) return res.send(500, { error: err });
            if(found){                
                otp = found.registration_otp;
                found.first_name = user.first_name;
                found.last_name = user.last_name;
                found.salt = user.salt;
                found.hash = user.hash;
                found.save();
            }else{
                    user.save(function(err) {                         
                        if (err) { 
                            if(err.code == 11000){
                                isExists = true;
                            }
                        }                        
                    });
            }
            
            if(sendOtpOn == 'email'){
                sendOtpMail(user,otp);
                res.status(200);
                res.json({
                    "otp" : "sent",
                    "isExists" : isExists
                }); 
                
            }else if(sendOtpOn == 'phone'){
                twillioClient.messages
                .create({
                    body: 'Your verification otp is '+otp,
                    from: '+13365422287',
                    to: user.phone
                })
                .then(message => console.log(message.sid));
                res.status(200);
                res.json({
                    "otp" : "sent",
                    "isExists" : isExists
                });            
                
            }else{
                res.status(200);
                res.json({
                    "otp" : "pending"
                });
                
            }
            
            return;
            
    });
  
};

// Resend Otp Function
module.exports.sendotp = function(req, res) {
    var user = new User();
    user.email = req.body.email.trim().toLowerCase();
    var country_code = "+1";
    if(user.email.indexOf("+") > -1) {
        country_code = "+91";
    }
    //var country_code = "+1";
    user.phone = country_code+req.body.phone.replace(/-/gi,"");   
    let otp = generateOtp(6);
    let sendOtpOn = req.body.requested_otp_on;
    
    user.registration_otp = otp;
    
    var query = {'email':user.email};
        
    User.findOne(query, function (err, found){
            if (err) return res.send(500, { error: err });
            found.registration_otp = otp;   
            var phone = found.phone;
            found.save();
            if(sendOtpOn == 'email'){
                sendOtpMail(user,otp);
                
            }else if(sendOtpOn == 'phone'){
                twillioClient.messages
                .create({
                    body: 'Your verification otp is '+otp,
                    from: '+13365422287',
                    to: phone
                })
                .then(message => console.log(message.sid));                
            }
            res.status(200);
            res.json({
                "otp" : "resent",
                "isExists" : true
            });            
            return;
           
    });
};
// Forgot Password 
module.exports.forgotpass = function(req, res) {
    var user = new User();
    user.email = req.body.email.trim().toLowerCase();   
    var query = {'email':user.email};    
    User.findOne(query, function (err, found){
            if (err) return res.send(500, { error: err });      
            // Generate Token
            if(found){
                var token = found.resetPasswordToken = resetToken(20);
                // Set Expiration datatime 1 hour == 3600000
                found.resetPasswordExpires = Date.now() + 3600000;
                // Save Changed data
                found.save();
                
                // Send forgot password mail
                sendforgotPasswordMail(user,token);            
                
                // Send response
                res.status(200);
                res.json({
                    "resetToken" : "sent",
                    "isExists" : true
                });       
            }else{
                res.json({
                    "resetToken" : "notsent",
                    "isExists" : false
                });
            }
            return;
    });
};
// Reset Pass 
module.exports.resetpass = function(req, res) {
    var user = new User(); 
    var password = req.body.password;  
    var query = {resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } };
    User.findOne(query, function (err, found){
            if (err) return res.send(500, { error: err });          
            if (!found) {
                // Token is invalid or expired
                res.status(200);
                res.json({
                    "passwordReset" : false,
                    "message" : "Request token is invalid or expired."
                });  
            }else{
                // Set Expiration time so that reset link can't be used more than once
                found.resetPasswordExpires = Date.now();
                // Set user password in database
                user.setPassword(password);
                // Set user email in user object
                user.email = found.email;
                // Set Password fields in database
                found.hash = user.hash;
                found.salt = user.salt;
                // Save user changed data
                found.save();
                // Send Password change confirmation mail to user
                sendresetPasswordConfirmationMail(user);         
                // Send Response
                res.status(200);
                res.json({
                    "passwordReset" : true,
                    "message" : "Your password has been changed."
                });     
            }
            return;
    });
};

// Login 
module.exports.login = function(req, res) {
    
  passport.authenticate('local', function(err, user, info){
    var token;
    
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};

// Verify User & Register
module.exports.verify = function(req, res) {  
  let otp = req.body.otp;
  
  passport.authenticate('local', function(err, user, info){
      
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){      
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      if(info.registration_otp == otp){
        var query = {'_id':info._id};        
        User.findOne(query, function (err, found){
                if (err) return res.send(500, { error: err });
                
                found.verified = true;                
                found.save();
                //var token;
                //token = user.generateJwt();
                res.status(200);
                res.json({
                    "otp": "verified"
                });
                return true;
        });
        
      }else{
        res.json({
            "otp" : "invalid"
        });
      }
    }
  })(req, res);
};


// Verify Email isexist or not
module.exports.verifyEmail = function(req, res) {  
    let email = req.body.email.trim().toLowerCase();
    var query = {'email':email,'verified':true};        
    User.findOne(query, function (err, found){
            if (err) return res.send(500, { error: err });
            if(found){
                res.status(200);
                res.json({
                    "isExists": true
                });
            }else{
                res.status(200);
                res.json({
                    "isExists": false
                });
            }
    });
};
/* 
 * Email Template functions 
 * Parameters : as required
 * Default configuration for mail is defined  on top of this page
 *  
 */

// Send Otp on mail function
async function sendOtpMail(user,otp){
         //let account = await nodemailer.createTestAccount();
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: email_host,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: email_user, // generated ethereal user
                pass: email_password // generated ethereal password
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Chunk Money ✔" <'+email_from+'>', // sender address
            to: user.email, // list of receivers
            subject: "Account Confirmation Otp ✔", // Subject line
            html: "<b>Your account confirmation otp is "+otp+"</b>" // html body
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        //console.log(info);
}
// Forgot password token mail
async function sendforgotPasswordMail(user,token){
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: email_host,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: email_user, // generated ethereal user
                pass: email_password // generated ethereal password
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Chunk Money ✔" <'+email_from+'>', // sender address
            to: user.email, // list of receivers
            subject: "Your password reset request ✔", // Subject line
            html: "Please click on password reset link to reset your password. </br></br/><a href='http://chunkmoney.com/production/reset/"+token+"'>Password Reset Link</a><br/> If you have not done this request then please ignore.</b>" // html body
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        //console.log(info);
}
// Password change confirmation mail
async function sendresetPasswordConfirmationMail(user){
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: email_host,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: email_user, // generated ethereal user
                pass: email_password // generated ethereal password
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Chunk Money ✔" <'+email_from+'>', // sender address
            to: user.email, // list of receivers
            subject: "Your password has been reset ✔", // Subject line
            html: "Your password has been changed." // html body
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        //console.log(info);
}

function generateOtp(length) {
  var text = "";
  var possible = "0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function resetToken(length) {
  var text = "";
  var possible = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

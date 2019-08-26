//Importing modules
var util = require('util');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var moment = require('moment');
var plaid = require('plaid');

var router = express.Router();

//Import db schema
const PlaidAccountsTokensModel = require("../models/accounts_tokens");
const PlaidReportTokensModel = require("../models/reporttokens");
const AtriumMxTransModel = require("../models/atrium_mx_transactions");
const AtriumMxAccountsModel = require("../models/atrium_mx_accounts");
const AccountsBalanceHistoryModel = require("../models/accounts_bal_hist");
const PlaidCategoriesModel = require("../models/categories");

//Variables and constants
var PLAID_CLIENT_ID = '5a75ff1b8d923957f008f026';
var PLAID_SECRET = 'c128c7e6a16606e3f5765d12dc140a';
var PLAID_PUBLIC_KEY = '2e793d8d52d0d0013c12edf1b94dec';
// var PLAID_ENV = 'sandbox';
var PLAID_ENV = 'development';
var CUSTOMER_ID = '';
var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;


var client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments.development,
  // plaid.environments.sandbox,
  {version: '2018-05-22'}
);

let incomeCategory = ["ACH","Billpay","Keep the Change Savings Program","Payroll","Benefits","Check","Credit","Debit","Deposit","Save As You Go","ATM","Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid"];
router.get('/test',(req,res)=>{
// console.log('Root for plaid...');
});

router.get('/get_access_token', function(request, response, next) {
  //console.log('inside token...');
  // console.log(request);
  PUBLIC_TOKEN = request.query.public_token;
  CUSTOMER_ID = request.query.customer_id;
  
  if(!(CUSTOMER_ID != '' && CUSTOMER_ID != null)){
	response.send("No customer id found!");
	return false;
  }
  
  // console.log('Token:'+PUBLIC_TOKEN);
  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    if (error != null) {
      var msg = 'Could not exchange public_token!';
      console.log(msg + '\n' + JSON.stringify(error));
      return response.json({
        error: msg
      });
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    
	// Save access token in db
	let newAccessToken = new PlaidAccountsTokensModel({
		customer_id: CUSTOMER_ID,
		access_token: ACCESS_TOKEN,
		item_id: ITEM_ID,
		added_on: new Date()
	});
	
	let params = {};
	params = {"customer_id":CUSTOMER_ID};

	newAccessToken.save((err, trans)=>{
		if(err){
		   console.log("Failed to save token! Error: "+err);
		}
		else{
			// console.log("Token saved successfully!");
			
			AtriumMxAccountsModel.deleteMany(params,getAccounts);
	
			/**** Syncing the accounts collection *****/
			async function getAccounts(){
				 PlaidAccountsTokensModel.find(params, function(err,tokensArr){   
					 if(err){
						console.log('Error occured. :'+ err);
					}else{ 
									
						for(var a=0;a<tokensArr.length;a++){
							let access_token = tokensArr[a].access_token;
							let item_id = tokensArr[a].item_id;
							
							client.getAccounts(access_token, async function(error, authResponse) {
								if (error != null) {
								  console.log(error);
								}else{
									// console.log("Accounts response: "+JSON.stringify(authResponse));
									let accounts = authResponse.accounts;
									let item_inner_id = authResponse.item.item_id;
									let ins_id = authResponse.item.institution_id;
									//console.log(JSON.stringify(accounts)); 
									// console.log("Ins Id:"+ins_id);
									var option = {'include_optional_metadata':true};
									
									//Fetching bank/institution data
									client.getInstitutionById(ins_id, option, (err, result) => {
									  let institution = result.institution;
									  // console.log("Institution data:"+institution);
									  for(var index=0; index<accounts.length; index++){
										  if(accounts[index] != undefined){
												let newAcc = new AtriumMxAccountsModel({
													ac_id: accounts[index].account_id,
													ac_number: accounts[index].mask,
													ac_name: accounts[index].name,
													balance: accounts[index].balances.available,
													ac_type: accounts[index].type,
													ac_sub_type: accounts[index].subtype,
													status: '',
													customer_id: CUSTOMER_ID,
													institution_id: institution.name,
													bank_logo: institution.logo,
													balance_date: '',
													last_update_date: new Date(accounts[index].updated_at).getTime(),
													currency: accounts[index].balances.iso_currency_code,
													detail: "",
													credit_limit: accounts[index].balances.limit,
													available_credit: accounts[index].balances.available,
													token_id: item_inner_id
												});

												newAcc.save((err, trans)=>{
													if(err){
													// console.log("Failed to sync accounts: "+accounts[index].account_id+", Error: "+err);
													}
													else{
														// console.log("Accounts synced successfully: "+ accounts[index].account_id);
													}
												});
										   }
										
										}
									  
									});
									
									
									
								}
							});
						}
						
					}
				 });
			
			}
			
			/**** Syncing the transaction collection *****/
			async function getTransactions(offsetCount){
			
				var startDate = moment().subtract(180, 'days').format('YYYY-MM-DD');
				var endDate = moment().format('YYYY-MM-DD');
				
				 PlaidAccountsTokensModel.find(params, function(err,tokensArr){   
					 if(err){
						console.log('Error occured. :'+ err);
					}else{ 
					
						for(var a=0;a<tokensArr.length;a++){
							let access_token = tokensArr[a].access_token;
							let item_id = tokensArr[a].item_id;
							
							
							
							client.getTransactions(access_token, startDate, endDate, {count: 500,offset: offsetCount}, async function(error, authResponse) {
								if (error != null) {
								  console.log(error);
								}else{
									//console.log("Transactions response: "+JSON.stringify(authResponse.transactions));
									
									let transactions = authResponse.transactions;
                                    let transactionLength = transactions.length;
                                    // console.log("Rows fetched: "+transactions.length);
                                    // console.log("Length:"+accounts.length);/
                                    // console.log(JSON.stringify(transactions));
                                    for(let index=0; index<transactions.length; index++){
                                        
                                        let status = "POSTED";
                                        if(transactions[index].pending){
                                            status = "PENDING";
                                        }
                                        if(transactions[index].pending_transaction_id != null){
                                            
                                            let pending_params = {};
                                            pending_params.trans_id   = transactions[index].pending_transaction_id;
                                            pending_params.customer_id = CUSTOMER_ID;
                                            let pending_timestamp_of_trans = new Date(transactions[index].date+" 00:12 PM").getTime();
                                            AtriumMxTransModel.find(pending_params,function(err,response){
                                                if(err){
                                                    console.log('Error occured. :'+ err);
                                                }else{ 
                                                    if(response.length > 0){
                                                        pending_timestamp_of_trans = response[0].posted_date;
                                                    }
                                                    let type = "CREDIT";
                                                    if(transactions[index].amount>=0){
                                                        type = "DEBIT";
                                                    }
                                                    let category = "";
                                                    let top_category = "";
                                                    let highest_category = "";
                                                    // console.log('Length:'+transactions[index].category.length );
                                                    if(transactions[index].category.length == 1){
                                                        category = transactions[index].category;
                                                        top_category = transactions[index].category;
                                                        highest_category = transactions[index].category;
                                                    }else if(transactions[index].category.length == 2){
                                                        category = transactions[index].category[1];
                                                        top_category = transactions[index].category[0];
                                                        highest_category = transactions[index].category[0];
                                                    }else if(transactions[index].category.length == 3){
                                                        category = transactions[index].category[2];
                                                        top_category = transactions[index].category[1];
                                                        highest_category = transactions[index].category[0];
                                                    }
                                                
                                                    let newTrans = new AtriumMxTransModel({
                                                        category: category,
                                                        created_date: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                        date: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                        original_description: '',
                                                        status: status,
                                                        type: type,
                                                        posted_date: pending_timestamp_of_trans,
                                                        top_level_category: top_category,
                                                        highest_level_category: highest_category,
                                                        transacted_at: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                        updated_at: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                        account_id: transactions[index].account_id,
                                                        amount: Math.abs(transactions[index].amount),
                                                        normalized_payee_name: transactions[index].name,
                                                        trans_id: transactions[index].transaction_id,
                                                        // is_bill_pay: '',
                                                        // is_direct_deposit: '',
                                                        // is_expense: '',
                                                        // is_fee: '',
                                                        // is_income: '',
                                                        // is_overdraft_fee: '',
                                                        // is_payroll_advance: '',
                                                        member_guid: '',
                                                        memo: '',
                                                        merchant_guid: '',
                                                        customer_id: CUSTOMER_ID,
                                                        our_category_id:transactions[index].category_id+'',
                                                        plaid_category_id:transactions[index].category_id+''
                                                    });

                                                    newTrans.save((err, trans)=>{
                                                        if(err){
                                                        // console.log("Failed to sync transaction: "+transactions[index].category+" Error:"+err);
                                                        }
                                                        else{
                                                            // console.log("Transaction synced successfully: "+ transactions[index].transaction_id);
                                                        }
                                                    });
                                                    AtriumMxTransModel.deleteMany(pending_params,function(err,response){
                                                        if(err){console.log(err);}
                                                    });
                                                }
                                            });
                                            
                                        }else{
                                            let type = "CREDIT";
                                            if(transactions[index].amount>=0){
                                                type = "DEBIT";
                                            }
                                            let category = "";
                                            let top_category = "";
                                            let highest_category = "";
                                            // console.log('Length:'+transactions[index].category.length );
                                            if(transactions[index].category.length == 1){
                                                category = transactions[index].category;
                                                top_category = transactions[index].category;
                                                highest_category = transactions[index].category;
                                            }else if(transactions[index].category.length == 2){
                                                category = transactions[index].category[1];
                                                top_category = transactions[index].category[0];
                                                highest_category = transactions[index].category[0];
                                            }else if(transactions[index].category.length == 3){
                                                category = transactions[index].category[2];
                                                top_category = transactions[index].category[1];
                                                highest_category = transactions[index].category[0];
                                            }
                                        
                                            let newTrans = new AtriumMxTransModel({
                                                category: category,
                                                created_date: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                date: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                original_description: '',
                                                status: status,
                                                type: type,
                                                posted_date: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                top_level_category: top_category,
                                                highest_level_category: highest_category,
                                                transacted_at: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                updated_at: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                account_id: transactions[index].account_id,
                                                amount: Math.abs(transactions[index].amount),
                                                normalized_payee_name: transactions[index].name,
                                                trans_id: transactions[index].transaction_id,
                                                // is_bill_pay: '',
                                                // is_direct_deposit: '',
                                                // is_expense: '',
                                                // is_fee: '',
                                                // is_income: '',
                                                // is_overdraft_fee: '',
                                                // is_payroll_advance: '',
                                                member_guid: '',
                                                memo: '',
                                                merchant_guid: '',
                                                customer_id: CUSTOMER_ID,
                                                our_category_id:transactions[index].category_id+'',
                                                plaid_category_id:transactions[index].category_id+''
                                            });

                                            newTrans.save((err, trans)=>{
                                                if(err){
                                                // console.log("Failed to sync transaction: "+transactions[index].category+" Error:"+err);
                                                }
                                                else{
                                                    // console.log("Transaction synced successfully: "+ transactions[index].transaction_id);
                                                }
                                            });
                                        }
									}
									if(transactionLength > 0){
										offsetCount += 500;
										// console.log("Getting data from row "+offsetCount+".");
										getTransactions(offsetCount);
									}
									
								}
							});
						}
						
					}
				 });
			
			}
			
			getTransactions(0);
			// console.log("Getting data from row 0.");
			
			
			/**** Syncing the accounts report history *****/
			/*
			PlaidReportTokensModel.deleteMany(params,getReportTokens);
			async function getReportTokens(){
				 // console.log("inside report tokens");		
				 PlaidAccountsTokensModel.find(params, function(err,tokensArr){   
					if(err){
						console.log('Error occured. :'+ err);
						return;
					}else{ 
						var access_token = [];
						for(var a = 0; a < tokensArr.length;a++){
							access_token.push(tokensArr[a].access_token);
						}
						const daysRequested = 180;                
						
						// ACCESS_TOKENS is an array of Item access tokens.
						// Note that the assets product must be enabled for all Items.
						// All fields on the options object are optional.
						//console.log(access_token);
						client.createAssetReport(access_token, daysRequested,(error, createResponse) => {
							if (error != null) {
								console.log('Error occured. :'+ err);
								return;
							}
							if(createResponse.asset_report_token != undefined){
								let newTokens = new PlaidReportTokensModel({                                        
													customer_id: CUSTOMER_ID,
													asset_report_token: createResponse.asset_report_token,
													asset_report_id: createResponse.asset_report_id
												});
								console.log("New Tokens:"+newTokens);
								newTokens.save();
							}
						});				
					}
				 });
			
			}
			*/
			
		}
	});
	
  });
});

router.get('/categories', function(req, res, next) {
    //console.log("afas");
    var params = {};
    // PlaidCategoriesModel.find(params,function(err,result){
    //     res.json(result);
    // });
    
    let barsCategory = ["Wine Bar","Sports Bar","Food and Drink","Hotel Lounge","Bar","Breweries"]; // Bars
    let restaurantsCategory = ["Food and Drink","Wine Bar","Sports Bar","Hotel Lounge","Internet Cafes","Restaurants","Winery","Vegan and Vegetarian","Turkish","Thai","Swiss","Sushi","Steakhouses","Spanish","Seafood","Scandinavian","Portuguese","Pizza","Moroccan","Middle Eastern","Mexican","Mediterranean","Latin American","Korean","Juice Bar","Japanese","Italian","Indonesian","Indian","Ice Cream","Greek","German","Gastropub","French","Food Truck","Fish and Chips","Filipino","Fast Food","Falafel","Ethiopian","Eastern European","Donuts","Distillery","Diners","Dessert","Delis","Cupcake Shop","Cuban","Coffee Shop","Chinese","Caribbean","Cajun","Cafe","Burrito","Burgers","Breakfast Spot","Brazilian","Barbecue","Bakery","Bagel Shop","Australian","Asian","American","African","Afghan"]; // Restaurants
    let shoppingCategory = ["Shops","Adult","Antiques","Arts and Crafts","Auctions","Beauty Products","Bicycles","Boat Dealers","Bookstores","Cards and Stationery","Children","Clothing and Accessories","Computers and Electronics","Construction Supplies","Convenience Stores","Costumes","Dance and Music","Department Stores","Digital Purchase","Discount Stores","Electrical Equipment","Equipment Rental","Flea Markets","Florists","Food and Beverage Store","Fuel Dealer","Furniture and Home Decor","Gift and Novelty","Glasses and Optometrist","Hardware Store","Hobby and Collectibles","Industrial Supplies","Jewelry and Watches","Luggage","Marine Supplies","Music, Video and DVD","Musical Instruments","Newsstands","Office Supplies","Outlet","Pawn Shops","Pharmacies","Photos and Frames","Shopping Centers and Malls","Sporting Goods","Supermarkets and Groceries","Tobacco","Toys","Vintage and Thrift","Warehouses and Wholesale Stores","Wedding and Bridal","Wholesale","Lawn and Garden","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","","Video Games","Mobile Phones","Cameras","Specialty","Health Food","Farmers Markets","Beer, Wine and Spirits"]; // Shopping
    let entertainmentCategory = ["Entertainment","Media", "Arts and Entertainment",  "Athletic Fields",  "Baseball",  "Basketball",  "Batting Cages",  "Boating",  "Campgrounds and RV Parks",  "Canoes and Kayaks",  "Combat Sports",  "Cycling",  "Dance",  "Equestrian",  "Football",  "Go Carts",  "Golf",  "Gun Ranges",  "Gymnastics",  "Gyms and Fitness Centers",  "Hiking",  "Hockey",  "Hot Air Balloons",  "Hunting and Fishing",  "Landmarks",  "Miniature Golf",  "Outdoors",  "Paintball",  "Parks",  "Personal Trainers",  "Race Tracks",  "Racquet Sports",  "Racquetball",  "Rafting",  "Recreation Centers",  "Rock Climbing",  "Running",  "Scuba Diving",  "Skating",  "Skydiving",  "Snow Sports",  "Soccer",  "Sports and Recreation Camps",  "Sports Clubs",  "Stadiums and Arenas",  "Swimming",  "Tennis",  "Water Sports",  "Yoga and Pilates",  "Zoo","Theatrical Productions",  "Symphony and Opera",  "Sports Venues",  "Social Clubs",  "Psychics and Astrologers",  "Party Centers",  "Music and Show Venues",  "Museums",  "Movie Theatres",  "Fairgrounds and Rodeos",  "Entertainment",  "Dance Halls and Saloons",  "Circuses and Carnivals",  "Casinos and Gaming",  "Bowling",  "Billiards and Pool",  "Art Dealers and Galleries",  "Arcades and Amusement Parks",  "Aquarium",  "Monuments and Memorials",  "Historic Sites",  "Gardens",  "Buildings and Structures",  "Rivers",  "Mountains",  "Lakes",  "Forests",  "Beaches",  "Playgrounds",  "Picnic Areas",  "Natural Parks" , "Recreation","Strip Club","Night Clubs","Karaoke","Jazz and Blues Cafe","Hookah Lounges","Adult Entertainment"];  // Entertainment
    let transportCategory = ["Travel","Airlines and Aviation Services","Airports","Boat","Bus Stations","Car and Truck Rentals","Car Service","Charter Buses","Cruises","Heliports","Limos and Chauffeurs","Parking","Public Transportation Services","Rail","Taxi","Tolls and Fees","Transportation Centers","Ride Share",]; // Transportation
    let insuranceCategory = ["Service","Insurance"]; // Insurance
    let checksCategory = ["Withdrawal Check","Check","Transfer","Withdrawal","Deposit"]; // Checks
    let schoolCategory = ["Vocational Schools","Tutoring and Educational Services","Primary and Secondary Schools","Fraternities and Sororities","Driving Schools","Dance Schools","Culinary Lessons and Schools","Computer Training","Colleges and Universities","Art School","Adult Education","Education","Community"]; // School
    let personalCategory = ["Service","Tattooing","Tanning Salons","Spas","Skin Care","Piercing","Massage Clinics and Therapists","Manicures and Pedicures","Laundry and Garment Services","Hair Salons and Barbers","Hair Removal","Personal Care"]; // Personal Care
    let lodgingCategory = ["Travel","Resorts","Lodges and Vacation Rentals","Hotels and Motels","Hostels","Cottages and Cabins","Bed and Breakfasts","Lodging"]; // Hotels and Lodging
    let loanCategory = ["Loan","Overdraft","ATM","Late Payment","Fraud Dispute","Foreign Transaction","Wire Transfer","Insufficient Funds","Cash Advance","Excess Activity","Bank Fees","Interest Charged","Interest"]; // Loan and Bank Fees
    let healthCategory = ["Healthcare Services","Physicians","Healthcare","Psychologists","Pregnancy and Sexual Health","Podiatrists","Physical Therapy","Optometrists","Nutritionists","Nurses","Mental Health","Medical Supplies and Labs","Hospitals, Clinics and Medical Centers","Emergency Services","Dentists","Counseling and Therapy","Chiropractors","Blood Banks and Centers","Alternative Medicine","Acupuncture","","Urologists","Respiratory","Radiologists","Psychiatrists","Plastic Surgeons","Pediatricians","Pathologists","Orthopedic Surgeons","Ophthalmologists","Oncologists","Obstetricians and Gynecologists","Neurologists","Internal Medicine","General Surgery","Gastroenterologists","Family Medicine","Ear, Nose and Throat","Dermatologists","Cardiologists","Anesthesiologists"]; // Healthcare 
    let gasCategory = ["Gas Stations","Travel"]; // Gas Stations
    let homeCategory = ["Home Improvement","Service","Shops","Automotive","Household","Rent","Real Estate","Payment"]; // Home and Auto
    let tvCategory = ["Service","Internet Services","Cable","Telecommunication Services"]; // TV, Phone, and Internet
    let petCategory = ["Pets","Shops"]; // Petcare
    let incomeCategory = ["ACH","Billpay","Keep the Change Savings Program","Payroll","Benefits","Check","Credit","Debit","Deposit","Save As You Go","ATM","Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid"];
    let transferCategory = ["Transfer","Internal Account Transfer","ACH","Billpay","Check","Credit","Debit","Deposit","Check","ATM","Keep the Change Savings Program","Payroll","Benefits","Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid","Wire","Withdrawal","Check","ATM","Save As You Go"];
    let othersCategory = ["Animal Shelter","Assisted Living Services","Cemetery","Courts","Day Care and Preschools","Disabled Persons Services","Drug and Alcohol Services","Government Departments and Agencies","Government Lobbyists","Housing Assistance and Shelters","Law Enforcement","Libraries","Military","Organizations and Associations","Post Offices","Public and Social Services","Religious","Senior Citizen Services","Nightlife","Interest Earned","Credit Card","Advertising and Marketing","Art Restoration","Audiovisual","Automation and Control Systems","Business and Strategy Consulting","Business Services","Chemicals and Gasses","Cleaning","Computers","Construction","Credit Counseling and Bankruptcy Services","Dating and Escort","Employment Agencies","Engineering","Events and Event Planning","Financial","Food and Beverage","Funeral Services","Geological","Human Resources","Immigration","Import and Export","Industrial Machinery and Vehicles","Leather","Legal","Logging and Sawmills","Machine Shops","Management","Manufacturing","Media Production","Metals","Mining","News Reporting","Oil and Gas","Packaging","Paper","Petroleum","Photography","Plastics","Real Estate","Refrigeration and Ice","Renewable Energy","Repair Services","Research","Rubber","Scientific","Security and Safety","Shipping and Freight","Software Development","Storage","Subscription","Tailors","Textiles","Tourist Information and Services","Transportation","Travel Agents and Tour Operators","Utilities","Veterinarians","Water and Waste Management","Web Design and Development","Welding","Agriculture and Forestry","Art and Graphic Design","Refund","Payment","Internal Account Transfer","Facilities and Nursing Homes","Caretakers","Police Stations","Fire Stations","Correctional Institutions","Youth Organizations","Environmental","Charities and Non-Profits","Temple","Synagogues","Mosques","Churches","Retirement","Writing, Copywriting and Technical Writing","Search Engine Marketing and Optimization","Public Relations","Promotional Items","Print, TV, Radio and Outdoor Advertising","Online Advertising","Market Research and Consulting","Direct Mail and Email Marketing Services","Creative Services","Advertising Agencies and Media Buyers","Towing","Motorcycle, Moped and Scooter Repair","Maintenance and Repair","Car Wash and Detail","Car Appraisers","Auto Transmission","Auto Tires","Auto Smog Check","Auto Oil and Lube","Printing and Publishing","Software Development","Roofers","Painting","Masonry","Infrastructure","Heating, Ventilating and Air Conditioning","Electricians","Contractors","Carpet and Flooring","Carpenters","Taxes","Student Aid and Grants","Stock Brokers","Loans and Mortgages","Holding and Investment Offices","Fund Raising","Financial Planning and Investments","Credit Reporting","Collections","Check Cashing","Business Brokers and Franchises","Banking and Finance","ATMs","Accounting and Bookkeeping","Distribution","Catering","Upholstery","Tree Service","Swimming Pool Maintenance and Services","Storage","Pools and Spas","Plumbing","Pest Control","Movers","Mobile Homes","Lighting Fixtures","Landscaping and Gardeners","Kitchens","Interior Design","Housewares","Home Inspection Services","Home Appliances","Heating, Ventilation and Air Conditioning","Hardware and Services","Fences, Fireplaces and Garage Doors","Doors and Windows","Architects","Apparel and Fabric Products","Chemicals and Gasses","Computers and Office Machines","Electrical Equipment and Components","Food and Beverage","Furniture and Fixtures","Glass Products","Industrial Machinery and Equipment","Leather Goods","Metal Products","Nonmetallic Mineral Products","Paper Products","Petroleum","Plastic Products","Rubber Products","Service Instruments","Textiles","Transportation Equipment","Wood Products","Coal","Metal","Non-Metallic Minerals","Real Estate Development and Title Companies","Real Estate Appraiser","Real Estate Agents","Property Management","Corporate Housing","Commercial Real Estate","Building and Land Surveyors","Boarding Houses","Apartments, Condos and Houses","Water","Sanitary and Waste Management","Heating, Ventilating, and Air Conditioning","Gas","Electric","Crop Production","Forestry","Livestock and Animals","Services","Used Car Dealers","Salvage Yards","RVs and Motor Homes","Motorcycles, Mopeds and Scooters","Classic and Antique Car","Car Parts and Accessories","Car Dealers and Leasing"];
    
    let investingCategory = ['Holding and Investment Offices','Financial Planning and Investments'];

    PlaidCategoriesModel.deleteMany(params,function(err,res){
        //console.log(res);
    });
	client.getCategories(function(err, response) {
        response = response.categories;
        for(var i = 0 ; i < response.length; i++){
            
            let catName = "Others";
            // console.log('Cat:'+cat);
            if(response[i].hierarchy.every(r=> barsCategory.indexOf(r) >= 0)){                    
                catName = "Bars";
            } 
            // Filter Food Categories
            else if(response[i].hierarchy.every(r=> restaurantsCategory.indexOf(r) >= 0)){                    
                catName = "Restaurants";
            }
            // Filter Shopping Categories
            else  if(response[i].hierarchy.every(r=> shoppingCategory.indexOf(r) >= 0)){ 
                catName = "Shopping";
            }
            // Filter Entertainment Categories
            else  if(response[i].hierarchy.every(r=> entertainmentCategory.indexOf(r) >= 0)){  
                catName = "Entertainment";
            }      
            // Filter Travel Categories
            else  if(response[i].hierarchy.every(r=> transportCategory.indexOf(r) >= 0)){          
                catName = "Transportation";
            }
            // Filter Insurance Categories
            else  if(response[i].hierarchy.every(r=> insuranceCategory.indexOf(r) >= 0)){   
                catName = "Insurance";
            }
            // Filter Checks Categories
            else  if(response[i].hierarchy.every(r=> checksCategory.indexOf(r) >= 0)){  
                catName = "Checks";
            }
            // Filter School Categories
            else  if(response[i].hierarchy.every(r=> schoolCategory.indexOf(r) >= 0)){ 
                catName = "School";
            }
            // Filter Personal Care Categories
            else if(response[i].hierarchy.every(r=> personalCategory.indexOf(r) >= 0)){  
                catName = "Personal Care";
            }
            // Filter Taxes Categories
            else if(response[i].hierarchy.every(r=> lodgingCategory.indexOf(r) >= 0)){  
                catName = "Hotels & Lodging";
            }
            // Filter Loan and Bank Fees Categories
            else if(response[i].hierarchy.every(r=> loanCategory.indexOf(r) >= 0)){  
                catName = "Loan and Bank Fees";
            }
            // Filter Healthcare Categories
            else if(response[i].hierarchy.every(r=> healthCategory.indexOf(r) >= 0)){                      
                catName = "Healthcare";
            }
            // Filter Childcare Categories
            else if(response[i].hierarchy.every(r=> gasCategory.indexOf(r) >= 0)){   
                catName = "Gas Stations";
            }
            // Filter Home Categories
            else if(response[i].hierarchy.every(r=> homeCategory.indexOf(r) >= 0)){   
                catName = "Home & Auto";
            }
            // Filter TV, Phone & Internet Categories
            else if(response[i].hierarchy.every(r=> tvCategory.indexOf(r) >= 0)){                     
                catName = "TV, Phone & Internet";
            }
            // Filter Petcare Categories
            else if(response[i].hierarchy.every(r=> petCategory.indexOf(r) >= 0)){                             
                catName = "Pet Care";
            }
            else{
                catName = "Others";
            }
            
            
            let plaidCategoriesModel = new PlaidCategoriesModel({
                category_id: response[i].category_id,
                group: response[i].category_id,
                hierarchy: JSON.stringify(response[i].hierarchy),
                our_category: catName
            });
            //console.log(plaidCategoriesModel);
            plaidCategoriesModel.save();
        }
        
	});
    
});



router.get('/syncall/', function(request, response, next) {  
	//console.log("Inside syncall");
    CUSTOMER_ID = request.query.customer_id;
	var params = {};
	// params = {"customer_id":CUSTOMER_ID};
	
	AtriumMxAccountsModel.deleteMany(params,getAccounts);
	//AtriumMxTransModel.deleteMany(params,function(err,res){console.log(res);});
	/**** Syncing the accounts collection *****/
    
	async function getAccounts(){
		 PlaidAccountsTokensModel.find(params, function(err,tokensArr){   
			 if(err){
				console.log('Error occured. :'+ err);
			}else{ 
				//console.log(tokensArr);			
				for(var a=0;a<tokensArr.length;a++){
					let access_token = tokensArr[a].access_token;
					let item_id = tokensArr[a].item_id;
					let customer_id = tokensArr[a].customer_id;
					
					client.getAccounts(access_token, async function(error, authResponse) {
						if (error != null) {
						  console.log(error);
						}else{
							// console.log("Accounts response: "+JSON.stringify(authResponse));
							let accounts = authResponse.accounts;
							let item_inner_id = authResponse.item.item_id;
							let ins_id = authResponse.item.institution_id;
							// console.log(JSON.stringify(accounts)); 
                            // console.log("Ins Id:"+ins_id);
							var option = {'include_optional_metadata':true};
							
							//Fetching bank/institution data
							client.getInstitutionById(ins_id, option, (err, result) => {
							  let institution = result.institution;
							  // console.log("Institution data:"+institution);
							  for(var index=0; index<accounts.length; index++){
                                  if(accounts[index] != undefined){
                                        let newAcc = new AtriumMxAccountsModel({
                                            ac_id: accounts[index].account_id,
                                            ac_number: accounts[index].mask,
                                            ac_name: accounts[index].name,                                            
                                            official_name: accounts[index].official_name,
                                            balance: accounts[index].balances.current,
                                            ac_type: accounts[index].type,
                                            ac_sub_type: accounts[index].subtype,
                                            status: '',
                                            customer_id: customer_id,
                                            institution_id: institution.name,
											bank_logo: institution.logo,
                                            balance_date: '',
                                            last_update_date: new Date(accounts[index].updated_at).getTime(),
                                            currency: accounts[index].balances.iso_currency_code,
                                            detail: "",
                                            credit_limit: accounts[index].balances.limit,
                                            available_credit: accounts[index].balances.available,
											token_id: item_inner_id
                                        });

                                        newAcc.save((err, trans)=>{
                                            if(err){
                                            // console.log("Failed to sync accounts: "+accounts[index].account_id+", Error: "+err);
                                            }
                                            else{
                                                // console.log("Accounts synced successfully: "+ accounts[index].account_id);
                                            }
                                        });
                                   }
								
								}
							  
							});
							
							
							
						}
					});
				}
				
			}
		 });
	
	}
	
	
	
	
	/**** Syncing the transaction collection *****/
	async function getTransactions(offsetCount){
	
		var startDate = moment().subtract(180, 'days').format('YYYY-MM-DD');
		var endDate = moment().format('YYYY-MM-DD');
		
		 PlaidAccountsTokensModel.find(params, function(err,tokensArr){   
			 if(err){
				console.log('Error occured. :'+ err);
			}else{ 
			
				for(var a=0;a<tokensArr.length;a++){
					let access_token = tokensArr[a].access_token;
					let item_id = tokensArr[a].item_id;
					let customer_id = tokensArr[a].customer_id;
					
					
					
					client.getTransactions(access_token, startDate, endDate, {count: 500,offset: offsetCount}, async function(error, authResponse) {
						if (error != null) {
						  console.log(error);
						}else{ 
							//console.log("Transactions response: "+JSON.stringify(authResponse.transactions));
							
							let transactions = authResponse.transactions;
							let transactionLength = transactions.length;
							// console.log("Rows fetched: "+transactions.length);
							// console.log("Length:"+accounts.length);/
							 // console.log(JSON.stringify(transactions));
							for(let index=0; index<transactions.length; index++){
                                
                                
                                let status = "POSTED";
                                if(transactions[index].pending){
                                    status = "PENDING";
                                }
                                if(transactions[index].pending_transaction_id != null){
                                    
                                    let pending_params = {};
                                    pending_params.trans_id   = transactions[index].pending_transaction_id;
                                    pending_params.customer_id = customer_id;
                                    let pending_timestamp_of_trans = new Date(transactions[index].date+" 00:12 PM").getTime();
                                    AtriumMxTransModel.find(pending_params,function(err,response){
                                        if(err){
                                            console.log('Error occured. :'+ err);
                                        }else{ 
                                            if(response.length > 0){
                                                pending_timestamp_of_trans = response[0].posted_date;
                                            }
                                            let type = "CREDIT";
                                            if(transactions[index].amount>=0){
                                                type = "DEBIT";
                                            }
                                            let category = "";
                                            let top_category = "";
                                            let highest_category = "";
                                            // console.log('Length:'+transactions[index].category.length );
                                            if(transactions[index].category.length == 1){
                                                category = transactions[index].category;
                                                top_category = transactions[index].category;
                                                highest_category = transactions[index].category;
                                            }else if(transactions[index].category.length == 2){
                                                category = transactions[index].category[1];
                                                top_category = transactions[index].category[0];
                                                highest_category = transactions[index].category[0];
                                            }else if(transactions[index].category.length == 3){
                                                category = transactions[index].category[2];
                                                top_category = transactions[index].category[1];
                                                highest_category = transactions[index].category[0];
                                            }
                                        
                                            let newTrans = new AtriumMxTransModel({
                                                category: category,
                                                created_date: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                date: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                original_description: '',
                                                status: status,
                                                type: type,
                                                posted_date: pending_timestamp_of_trans,
                                                top_level_category: top_category,
                                                highest_level_category: highest_category,
                                                transacted_at: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                updated_at: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                                account_id: transactions[index].account_id,
                                                amount: Math.abs(transactions[index].amount),
                                                normalized_payee_name: transactions[index].name,
                                                trans_id: transactions[index].transaction_id,
                                                // is_bill_pay: '',
                                                // is_direct_deposit: '',
                                                // is_expense: '',
                                                // is_fee: '',
                                                // is_income: '',
                                                // is_overdraft_fee: '',
                                                // is_payroll_advance: '',
                                                member_guid: '',
                                                memo: '',
                                                merchant_guid: '',
                                                customer_id: customer_id,
                                                our_category_id:transactions[index].category_id+'',
                                                plaid_category_id:transactions[index].category_id+''
                                            });

                                            newTrans.save((err, trans)=>{
                                                if(err){
                                                // console.log("Failed to sync transaction: "+transactions[index].category+" Error:"+err);
                                                }
                                                else{
                                                    // console.log("Transaction synced successfully: "+ transactions[index].transaction_id);
                                                }
                                            });
                                            AtriumMxTransModel.deleteMany(pending_params,function(err,response){
                                                if(err){console.log(err);}
                                            });
                                        }
                                    });
                                    
                                }else{
                                    let type = "CREDIT";
                                    if(transactions[index].amount>=0){
                                        type = "DEBIT";
                                    }
                                    let category = "";
                                    let top_category = "";
                                    let highest_category = "";
                                    // console.log('Length:'+transactions[index].category.length );
                                    if(transactions[index].category.length == 1){
                                        category = transactions[index].category;
                                        top_category = transactions[index].category;
                                        highest_category = transactions[index].category;
                                    }else if(transactions[index].category.length == 2){
                                        category = transactions[index].category[1];
                                        top_category = transactions[index].category[0];
                                        highest_category = transactions[index].category[0];
                                    }else if(transactions[index].category.length == 3){
                                        category = transactions[index].category[2];
                                        top_category = transactions[index].category[1];
                                        highest_category = transactions[index].category[0];
                                    }
                                
                                    let newTrans = new AtriumMxTransModel({
                                        category: category,
                                        created_date: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                        date: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                        original_description: '',
                                        status: status,
                                        type: type,
                                        posted_date: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                        top_level_category: top_category,
                                        highest_level_category: highest_category,
                                        transacted_at: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                        updated_at: new Date(transactions[index].date+" 00:12 PM").getTime(),
                                        account_id: transactions[index].account_id,
                                        amount: Math.abs(transactions[index].amount),
                                        normalized_payee_name: transactions[index].name,
                                        trans_id: transactions[index].transaction_id,
                                        // is_bill_pay: '',
                                        // is_direct_deposit: '',
                                        // is_expense: '',
                                        // is_fee: '',
                                        // is_income: '',
                                        // is_overdraft_fee: '',
                                        // is_payroll_advance: '',
                                        member_guid: '',
                                        memo: '',
                                        merchant_guid: '',
                                        customer_id: customer_id,
                                        our_category_id:transactions[index].category_id+'',
                                        plaid_category_id:transactions[index].category_id+''
                                    });

                                    newTrans.save((err, trans)=>{
                                        if(err){
                                        // console.log("Failed to sync transaction: "+transactions[index].category+" Error:"+err);
                                        }
                                        else{
                                            // console.log("Transaction synced successfully: "+ transactions[index].transaction_id);
                                        }
                                    });
                                }
							}
							if(transactionLength > 0){
								offsetCount += 500;
								// console.log("Getting data from row "+offsetCount+".");
								getTransactions(offsetCount);
							}
							
						}
					});
				}
				
			}
		 });
	
	}
	getTransactions(0);
	
	
    /**********************************************/
	/**** Syncing the accounts report history *****/
	/**********************************************/
	async function refreshReportTokens(){
		let today_date = moment().utc().format('MM-DD-YYYY');
	var countParams = {date:today_date,customer_id:CUSTOMER_ID};

	//console.log("Today's date: "+today_date);
	
		//Count the report token which are updated today
		//console.log("Fetching report count for today");
		//console.log("Count Params: "+countParams);
		PlaidReportTokensModel.count(countParams,function(err,count){
			if(err){
				console.log('Error occured. :'+ err);
			}else{ 
				//console.log("Count:"+count);
				if(!count){ //if report tokens are not updated today

					//Delete the report token models
					//console.log("Deleting report tokens");
					PlaidReportTokensModel.deleteMany(params,getReportTokens);

					//Get new report tokens and save them in local db
					async function getReportTokens(){
						
						//Fetching accounts access token to get report tokens for each accounts
						//console.log("Fetching new report tokens");
						PlaidAccountsTokensModel.find(params, function(err,tokensArr){   
							
							if(err){
								console.log('Error occured. :'+ err);
								return;
							}else{ 
								var access_token = [];
								
								//Loop through all access tokens and get report tokens
								for(var a = 0; a < tokensArr.length;a++){
									var access_token = [];
									access_token.push(tokensArr[a].access_token);
									
									const daysRequested = 180; //Max 180 days can be requested by Plaid
									let CUSTOMER_ID = tokensArr[a].customer_id;

									//Fetch token report by Plaid API for given account using access token
									client.createAssetReport(access_token, daysRequested,(error, createResponse) => {
										if (error != null) {
											console.log('Error occured. :'+ err);
											return;
										}
										if(createResponse.asset_report_token != undefined){
											//console.log("Saving new report token");
											//Save new token inside local db
											let newTokens = new PlaidReportTokensModel({                                        
																customer_id: CUSTOMER_ID,
																asset_report_token: createResponse.asset_report_token,
																asset_report_id: createResponse.asset_report_id,
																last_updated_on: today_date
															});
											newTokens.save();
										}
									});	
								}
											
							}
						});
					
					}/**getReportTokens() ends here */
				}
				else{	//if report tokens are already updated today
					//Do nothing for now
				}
			}
		});
	}
	refreshReportTokens();
	
});


router.get('/income', function(req, res, next) {	
    
	var customerId = '';
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id + '';
		}		
		
    }
	
		
    AtriumMxTransModel.aggregate(
            [{ "$match": { $and :  [{'customer_id': customerId}, {'category': { $in: incomeCategory}}, {'type':'DEBIT'}  ] }  },
            {"$lookup":
			{
				from: "atriummxaccountsmodels",
				localField: "account_id",
				foreignField: "ac_id",
				as: "accounts"
			}},
            { "$group": { _id: "$normalized_payee_name", 
                amountOfstream:{$sum:{ $toDouble: "$amount" } },
                stream: { $sum: 1}                
            }}]
    ).exec((err, data) => {
        var final_data = {};
        if(data.length > 0){            
            final_data.incomeStreamCount = 0;
            final_data.streams = data;
            for(var i = 0; i < data.length;i++){
                final_data.incomeStreamCount += parseInt(data[i].stream);                    
            }
           
            res.send(final_data);
        }
        
    });
					
	
	
});

router.get('/getsavingschartdata/:duration', function(request, response, next) {	
    // console.log("Inside /getsavingschartdata/");
	CUSTOMER_ID = request.query.customer_id;
    var duration = 1;
	if(request.params.duration != null){
		duration = request.params.duration;
	}
	let params = {};
	params = {"customer_id":CUSTOMER_ID};
    let accountsData = [];
	//console.log("[Plaid.js:918]Parameters:"+JSON.stringify(params));
	// ASSET_REPORT_TOKEN is the token from the createAssetReport 
	
	let today_date = moment().utc().format('MM-DD-YYYY');
	// console.log('Today Date:'+today_date);

	//check when history is last updated
	var countParams = {date:today_date,customer_id:CUSTOMER_ID};
	// console.log("CountParams:"+JSON.stringify(countParams));

	AccountsBalanceHistoryModel.count(countParams,function(err,count){
		if(err){
			console.log('Error occured. :'+ err);
		}else{ 
			//console.log('CountObject:'+count);
			if(!count){
				//console.log("Doing sync:");
				PlaidReportTokensModel.find(params, function(err,tokensArr){   
					 if(err){
						console.log('Error occured. :'+ err);
					}else{ 
						//console.log("[Plaid.js:928]TokensArr:"+JSON.stringify(tokensArr));
						if(tokensArr[0] !=undefined){
							ASSET_REPORT_TOKEN = tokensArr[0].asset_report_token;
							
							client.getAssetReport(ASSET_REPORT_TOKEN, false, (error, 
								getResponse) => {
									console.log("Inside getassetsreport");
								let showFlag = true;
								if (error != null) {
									showFlag = false;
									if (error.status_code === 400 &&
										error.error_code === 'PRODUCT_NOT_READY') {
										console.log('Report Not ready. :'+ err);
									} else {
										//console.log('Report Not ready. :'+ err);
									}
								}
								var deleteparams = params;
								var accTransactions = [];    
								if(showFlag){
									//console.log("Report found");			   
											//console.log("Report Length:"+getResponse.report.items.length);
											for(var a=0;a<getResponse.report.items.length;a++){   
												// if(getResponse.report.items[a].accounts.length > 0){                                                                                    
													// for(var b=0;b<getResponse.report.items[a].accounts.length;b++){
														//console.log(getResponse.report.items[a].accounts[b].subtype.toLowerCase());
													
														// if(getResponse.report.items[a].accounts[b].subtype.toLowerCase() == 'checking' ||  getResponse.report.items[a].accounts[b].subtype.toLowerCase() == 'savings'){
															
															// var date = {$lt: (moment().startOf('day').unix()+'')};
															// deleteparams.date = date;
															//console.log(deleteparams);
															// AccountsBalanceHistoryModel.deleteMany(deleteparams,function(err,response){
															//     if(err){
															//         console.log(err);
															//     }else{
																	//console.log(response);
																// }
															// });
														// }
													// }
												// }
												//console.log("a:"+a);
												for(var b=0;b<getResponse.report.items[a].accounts.length;b++){
													//console.log("Fetched Account:"+JSON.stringify(getResponse.report.items[a].accounts));
													//console.log(getResponse.report.items[a].accounts[b].subtype.toLowerCase());
												   
													if(getResponse.report.items[a].accounts[b].subtype.toLowerCase() == 'checking' ||  getResponse.report.items[a].accounts[b].subtype.toLowerCase() == 'savings'){
													   //console.log("b:"+b);
													   //console.log("Adding new history for "+today_date);
														// Save balance history in db
                                                        today_date = moment().format('MM-DD-YYYY');
														let saveparams = {
															customer_id: CUSTOMER_ID,
															account_id: getResponse.report.items[a].accounts[b].account_id,
															account_type: getResponse.report.items[a].accounts[b].subtype.toLowerCase()
															// ,
															// date: (moment().startOf('day').unix()+'')
														};
														let newSavingsHistory = new AccountsBalanceHistoryModel({
															customer_id: CUSTOMER_ID,
															account_id: getResponse.report.items[a].accounts[b].account_id,
															account_type: getResponse.report.items[a].accounts[b].subtype.toLowerCase(),
															balance: JSON.stringify(getResponse.report.items[a].accounts[b].historical_balances),
															date: today_date
														});
														AccountsBalanceHistoryModel.deleteMany(saveparams,function(err,response){
															if(err){
																console.log(err);
															}else{
																newSavingsHistory.save();
															}
														});
														
														
													}
												}
											}
											 
								}
								
								var date = moment().startOf('day').unix()+'';
								// deleteparams.date = date;
								var fetchParams = {"customer_id":CUSTOMER_ID};
								// console.log("Params:"+JSON.stringify(fetchParams));
								AccountsBalanceHistoryModel.find(fetchParams,function(err,accTrans){
										if(err){
											console.log(err);
										}
										accTransactions = accTrans;
										// console.log("AccountTransLength:"+accTransactions.length);
										let savingData = {};
										let labels = [];
										let monthlyLabels = [];
										let lblTracer = [];
										let savingsAmounts = [];
										
										
										if(duration==1){
											
											var label =['<p>Su<br/>&nbsp;</p>','<p>M<br/>&nbsp;</p>','<p>T<br/>&nbsp;</p>','<p>W<br/>&nbsp;</p>','<p>Th<br/>&nbsp;</p>','<p>F<br/>&nbsp;</p>','<p>Sa<br/>&nbsp;</p>'];
											var fromDate = moment().subtract(7, 'days').unix();
											var toDate = moment().unix(); 
											var start = moment.unix(fromDate).format('D MMM');
											var end = moment.unix(toDate).format('D MMM');
											savingData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
											var transData = [];
											for(var i=0,j=6; i<=6; i++,j--) {
												var curDate = moment().subtract(i, 'days');
												var tempDay = label[curDate.format('d')];
												labels[j] = tempDay;
												lblTracer[j] = label[curDate.format('d')];
												monthlyLabels[j] = curDate.unix();
												savingsAmounts[j]=0;
												var currentDate = moment().subtract((i), 'days').format('YYYY-MM-DD'); 
												//console.log("Fetching data for "+currentDate+"\n");
												for(var b=0;b<accTransactions.length;b++){            
													let balance = JSON.parse(accTransactions[b].balance);
													// console.log("Balance:"+JSON.stringify(accTransactions[b].balance));
													for(var a=0;a<balance.length;a++){
													   
														var transDate = balance[a].date;   
														if(transDate == currentDate){                                                    
															var dayLbl = label[moment(balance[a].date,'YYYY-MM-DD').format('d')];                                                    
															var dayIndex = lblTracer.indexOf(dayLbl);                                                      
															savingsAmounts[dayIndex] += balance[a].current;
															savingsAmounts[dayIndex] = parseFloat(savingsAmounts[dayIndex].toFixed(2));
															let transactions = {};   
															transactions.dayIndex = dayIndex;
															transactions.account_id = accTransactions[b].account_id;
															/*
																* transactions.accounts = [];
																var param = {'ac_id':transactions.account_id};
																accountsModel.findOne(param,function(err,accountRes){
																	transactions.accounts.push(accountRes);
																});
																*/
														
															//transactions.account_name = accTransactions[b].account_name;
															transactions.savingBalance = balance[a].current;
															transData.push(transactions);
															
														}
													}
												
												}
											}                                  
								
											//console.log("[Plaid.js:1002] Saving Amounts array:"+JSON.stringify(savingsAmounts));
											if(savingsAmounts[6]==0){
												savingsAmounts.splice(-1,1);
												labels.splice(-1,1);
												monthlyLabels.splice(-1,1);
											}
											if(savingsAmounts[5]==0){
												savingsAmounts.splice(-1,1);
												labels.splice(-1,1);
												monthlyLabels.splice(-1,1);
											}
										
										}else if(duration==2){
											var transData = [];
											var fromDate = moment().subtract(1, 'month').unix();
											var toDate = moment().unix(); 
											var start = moment.unix(fromDate).format('D MMM');
											var end = moment.unix(toDate).format('D MMM');
											savingData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
											for(var i=1,j=5; i<=30; i=i+5,j--) {
													var curPreDate = moment().subtract(i, 'days');
													var curPostDate = moment().subtract((i+4), 'days');
													var tempLabel = curPostDate.format('DD').replace(/^0+/, '');//+"-"+curPreDate.format('DD');
													var tempDay = "<p style='text-align: center;'>"+tempLabel+"<br/>"+curPostDate.format('MMM')+"</p>";
													
													labels[j] = tempDay;
													monthlyLabels[j] = curPostDate.startOf('day').unix() + "-" + curPreDate.endOf('day').unix();
													savingsAmounts[j] = 0;
													
													var currentDate = curPreDate.format('YYYY-MM-DD'); 
												
													for(var b=0;b<accTransactions.length;b++){         
														var balance = JSON.parse(accTransactions[b].balance);
														for(var a=0;a<balance.length;a++){
															var transDate = balance[a].date;   
															if(transDate == currentDate){                   
																savingsAmounts[j] += balance[a].current;
																savingsAmounts[j] = parseFloat(savingsAmounts[j].toFixed(2));
																let transactions = {};   
																transactions.dayIndex = j;
																transactions.account_id = accTransactions[b].account_id;
																/*
																* transactions.accounts = [];
																var param = {'ac_id':transactions.account_id};
																accountsModel.findOne(param,function(err,accountRes){
																	transactions.accounts.push(accountRes);
																});
																*/
															
																//transactions.account_name = accTransactions[b].account_name;
																transactions.savingBalance = balance[a].current;
																transData.push(transactions);
															}
														}                                            
													}
													
											}
											if(savingsAmounts[6]==0){
												savingsAmounts.splice(-1,1);
												labels.splice(-1,1);
												monthlyLabels.splice(-1,1);
											}
											if(savingsAmounts[5]==0){
												savingsAmounts.splice(-1,1);
												labels.splice(-1,1);
												monthlyLabels.splice(-1,1);
											}
											
										}else if(duration==3){
											var transData = [];
											var fromDate = moment().subtract(6, 'month').unix();
											var toDate = moment().unix(); 
											var start = moment.unix(fromDate).format('D MMM');
											var end = moment.unix(toDate).format('D MMM');
											savingData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
											for(var i=0,j=5; i<=5; i++,j--) {
													
													var curPreDate = moment().subtract(i, 'months');
													var curPostDate = moment().subtract(i+1, 'months');
													var tempLabel = curPreDate.format('MMM');
													var tempDay = tempLabel;
													labels[j] = "<p>"+tempDay+"<br/>&nbsp;</p>";;
													monthlyLabels[j] = curPostDate.startOf('day').unix() + "-" + curPreDate.endOf('day').unix();
													lblTracer[j] = curPreDate.format('M');
													savingsAmounts[j]=0;
													var currentDate  = '';
													if(i==0){
														currentDate = curPreDate.subtract(2, 'days').format('YYYY-MM-DD');                                                 
													}else{
														currentDate = curPreDate.endOf('month').format('YYYY-MM-DD'); 
													}
													for(var b=0;b<accTransactions.length;b++){       
														var balance = JSON.parse(accTransactions[b].balance);
														for(var a=0;a<balance.length;a++){
															var transDate =balance[a].date;   
															
															if(transDate == currentDate){                   
																savingsAmounts[j] += balance[a].current;
																savingsAmounts[j] = parseFloat(savingsAmounts[j].toFixed(2));
																let transactions = {};   
																transactions.dayIndex = j;
																transactions.account_id = accTransactions[b].account_id;
																/*
																* transactions.accounts = [];
																var param = {'ac_id':transactions.account_id};
																accountsModel.findOne(param,function(err,accountRes){
																	transactions.accounts.push(accountRes);
																});
																*/
																//transactions.account_name = accTransactions[b].account_name;
																transactions.savingBalance = balance[a].current;
																transData.push(transactions);
															}
														}                                            
													}
													
											}
										}
									   
										delete params.date;
										// console.log(params);
										AtriumMxAccountsModel.find(params,function(err,accountRes){
											
											savingData.rawdata = transData; 
											
											for(var i = 0;i < accountRes.length;i++){
												for(var j = 0; j< savingData.rawdata.length;j++){                                                       
													if((accountRes[i].ac_id == savingData.rawdata[j].account_id) && (savingData.rawdata[j].accounts == undefined)){                                                           
														savingData.rawdata[j].accounts = [];
														savingData.rawdata[j].accounts.push(accountRes[i]);
													}
												}
											}
											
											savingData.labels = labels;
											savingData.data = savingsAmounts;
											//savingData.rawdata = accTransactions;
											savingData.monthly_labels = monthlyLabels;
											
											response.send(savingData);
										});
								});   
								
							});
						
						
						}
					}
			});
		}else{
			//console.log("Not doing sync");
			var date = moment().startOf('day').unix()+'';
								// deleteparams.date = date;
								var fetchParams = {"customer_id":CUSTOMER_ID};
								// console.log("Params:"+JSON.stringify(fetchParams));
								let accTransactions = [];  
								AccountsBalanceHistoryModel.find(fetchParams,function(err,accTrans){
										if(err){
											console.log(err);
										}
										accTransactions = accTrans;
										// console.log("AccountTransLength:"+accTransactions.length);
										let savingData = {};
										let labels = [];
										let monthlyLabels = [];
										let lblTracer = [];
										let savingsAmounts = [];
										
										
										if(duration==1){
											
											var label =['<p>Su<br/>&nbsp;</p>','<p>M<br/>&nbsp;</p>','<p>T<br/>&nbsp;</p>','<p>W<br/>&nbsp;</p>','<p>Th<br/>&nbsp;</p>','<p>F<br/>&nbsp;</p>','<p>Sa<br/>&nbsp;</p>'];
											var fromDate = moment().subtract(7, 'days').unix();
											var toDate = moment().unix(); 
											var start = moment.unix(fromDate).format('D MMM');
											var end = moment.unix(toDate).format('D MMM');
											savingData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
											var transData = [];
											for(var i=0,j=6; i<=6; i++,j--) {
												var curDate = moment().subtract(i, 'days');
												var tempDay = label[curDate.format('d')];
												labels[j] = tempDay;
												lblTracer[j] = label[curDate.format('d')];
												monthlyLabels[j] = curDate.unix();
												savingsAmounts[j]=0;
												var currentDate = moment().subtract((i), 'days').format('YYYY-MM-DD'); 
												//console.log("Fetching data for "+currentDate+"\n");
												for(var b=0;b<accTransactions.length;b++){            
													let balance = JSON.parse(accTransactions[b].balance);
													
													for(var a=0;a<balance.length;a++){
													   
														var transDate = balance[a].date;   
														if(transDate == currentDate){  
															//console.log("Balance JSON for "+currentDate+": "+JSON.stringify(balance[a])+"\n");                                                    
															var dayLbl = label[moment(balance[a].date,'YYYY-MM-DD').format('d')];                                                    
															var dayIndex = lblTracer.indexOf(dayLbl);                                                      
															savingsAmounts[dayIndex] += balance[a].current;
															savingsAmounts[dayIndex] = parseFloat(savingsAmounts[dayIndex].toFixed(2));
															let transactions = {};   
															transactions.dayIndex = dayIndex;
															transactions.account_id = accTransactions[b].account_id;
															/*
																* transactions.accounts = [];
																var param = {'ac_id':transactions.account_id};
																accountsModel.findOne(param,function(err,accountRes){
																	transactions.accounts.push(accountRes);
																});
																*/
														
															//transactions.account_name = accTransactions[b].account_name;
															transactions.savingBalance = balance[a].current;
															//console.log("Prepared transaction data for "+currentDate+": "+JSON.stringify(transactions)+"\n");
															transData.push(transactions);
															
														}
													}
												
												}
											}                                  
								
											// console.log("[Plaid.js:1002] Saving Amounts array:"+JSON.stringify(savingsAmounts));
											if(savingsAmounts[6]==0){
												savingsAmounts.splice(-1,1);
												labels.splice(-1,1);
												monthlyLabels.splice(-1,1);
											}
											if(savingsAmounts[5]==0){
												savingsAmounts.splice(-1,1);
												labels.splice(-1,1);
												monthlyLabels.splice(-1,1);
											}
										
										}else if(duration==2){
											var transData = [];
											var fromDate = moment().subtract(1, 'month').unix();
											var toDate = moment().unix(); 
											var start = moment.unix(fromDate).format('D MMM');
											var end = moment.unix(toDate).format('D MMM');
											savingData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
											for(var i=1,j=5; i<=30; i=i+5,j--) {
													var curPreDate = moment().subtract(i, 'days');
													var curPostDate = moment().subtract((i+4), 'days');
													var tempLabel = curPostDate.format('DD').replace(/^0+/, '');//+"-"+curPreDate.format('DD');
													var tempDay = "<p style='text-align: center;'>"+tempLabel+"<br/>"+curPostDate.format('MMM')+"</p>";
													
													labels[j] = tempDay;
													monthlyLabels[j] = curPostDate.startOf('day').unix() + "-" + curPreDate.endOf('day').unix();
													savingsAmounts[j] = 0;
													
													var currentDate = curPreDate.format('YYYY-MM-DD'); 	

													//console.log("Current date for month:"+currentDate+"\n");
												
													for(var b=0;b<accTransactions.length;b++){         
														var balance = JSON.parse(accTransactions[b].balance);
														for(var a=0;a<balance.length;a++){
															var transDate = balance[a].date;   
															if(transDate == currentDate){   
																//console.log("Balance JSON for "+currentDate+": "+JSON.stringify(balance[a])+"\n");           
																savingsAmounts[j] += balance[a].current;
																savingsAmounts[j] = parseFloat(savingsAmounts[j].toFixed(2));
																let transactions = {};   
																transactions.dayIndex = j;
																transactions.account_id = accTransactions[b].account_id;
																/*
																* transactions.accounts = [];
																var param = {'ac_id':transactions.account_id};
																accountsModel.findOne(param,function(err,accountRes){
																	transactions.accounts.push(accountRes);
																});
																*/
															
																//transactions.account_name = accTransactions[b].account_name;
																transactions.savingBalance = balance[a].current;
																//console.log("Prepared transaction data for "+currentDate);
																transData.push(transactions);
															}
														}                                            
													}
													
											}
											if(savingsAmounts[6]==0){
												savingsAmounts.splice(-1,1);
												labels.splice(-1,1);
												monthlyLabels.splice(-1,1);
											}
											if(savingsAmounts[5]==0){
												savingsAmounts.splice(-1,1);
												labels.splice(-1,1);
												monthlyLabels.splice(-1,1);
											}
											
										}else if(duration==3){
											var transData = [];
											var fromDate = moment().subtract(6, 'month').unix();
											var toDate = moment().unix(); 
											var start = moment.unix(fromDate).format('D MMM');
											var end = moment.unix(toDate).format('D MMM');
											savingData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
											for(var i=0,j=5; i<=5; i++,j--) {
													
													var curPreDate = moment().subtract(i, 'months');
													var curPostDate = moment().subtract(i+1, 'months');
													var tempLabel = curPreDate.format('MMM');
													var tempDay = tempLabel;
													labels[j] = "<p>"+tempDay+"<br/>&nbsp;</p>";;
													monthlyLabels[j] = curPostDate.startOf('day').unix() + "-" + curPreDate.endOf('day').unix();
													lblTracer[j] = curPreDate.format('M');
													savingsAmounts[j]=0;
													var currentDate  = '';
													if(i==0){
														currentDate = curPreDate.subtract(2, 'days').format('YYYY-MM-DD');                                                 
													}else{
														currentDate = curPreDate.endOf('month').format('YYYY-MM-DD'); 
													}
													for(var b=0;b<accTransactions.length;b++){       
														var balance = JSON.parse(accTransactions[b].balance);
														for(var a=0;a<balance.length;a++){
															var transDate =balance[a].date;   
															
															if(transDate == currentDate){                   
																savingsAmounts[j] += balance[a].current;
																savingsAmounts[j] = parseFloat(savingsAmounts[j].toFixed(2));
																let transactions = {};   
																transactions.dayIndex = j;
																transactions.account_id = accTransactions[b].account_id;
																/*
																* transactions.accounts = [];
																var param = {'ac_id':transactions.account_id};
																accountsModel.findOne(param,function(err,accountRes){
																	transactions.accounts.push(accountRes);
																});
																*/
																//transactions.account_name = accTransactions[b].account_name;
																transactions.savingBalance = balance[a].current;
																transData.push(transactions);
															}
														}                                            
													}
													
											}
											if(savingsAmounts[6]==0){
												savingsAmounts.splice(-1,1);
												labels.splice(-1,1);
												monthlyLabels.splice(-1,1);
											}
										}
									   
										delete params.date;
										// console.log(params);
										AtriumMxAccountsModel.find(params,function(err,accountRes){
											
											savingData.rawdata = transData; 
											
											for(var i = 0;i < accountRes.length;i++){
												for(var j = 0; j< savingData.rawdata.length;j++){                                                       
													if((accountRes[i].ac_id == savingData.rawdata[j].account_id) && (savingData.rawdata[j].accounts == undefined)){                                                           
														savingData.rawdata[j].accounts = [];
														savingData.rawdata[j].accounts.push(accountRes[i]);
													}
												}
											}
											
											savingData.labels = labels;
											savingData.data = savingsAmounts;
											//savingData.rawdata = accTransactions;
											savingData.monthly_labels = monthlyLabels;
											
											response.send(savingData);
										});
								}); 
		}
		}
	});
	

    
});
function getCatName(cat){
	var catName = "Others";
	// console.log('Cat:'+cat);
	if(barsCategory.indexOf(cat) > -1 ){                    
		catName = "Bars";
	} 
	// Filter Food Categories
	else if(restaurantsCategory.indexOf(cat) > -1 ){                    
		catName = "Restaurants";
	}
	// Filter Shopping Categories
	else if(shoppingCategory.indexOf(cat) > -1 ){                    
		catName = "Shopping";
	}
	// Filter Entertainment Categories
	else if(entertainmentCategory.indexOf(cat) > -1 ){                    
		catName = "Entertainment";
	}      
	// Filter Travel Categories
	else if(transportCategory.indexOf(cat) > -1 ){                    
		catName = "Transportation";
	}
	// Filter Insurance Categories
	else if(insuranceCategory.indexOf(cat) > -1 ){                    
		catName = "Insurance";
	}
	// Filter Checks Categories
	else if(checksCategory.indexOf(cat) > -1 ){                    
		catName = "Checks";
	}
	// Filter School Categories
	else if(schoolCategory.indexOf(cat) > -1 ){                    
		catName = "School";
	}
	// Filter Personal Care Categories
	else if(personalCategory.indexOf(cat) > -1 ){                    
		catName = "Personal Care";
	}
	// Filter Taxes Categories
	else if(lodgingCategory.indexOf(cat) > -1 ){                    
		catName = "Hotels & Lodging";
	}
	// Filter Loan and Bank Fees Categories
	else if(loanCategory.indexOf(cat) > -1 ){                    
		catName = "Loan and Bank Fees";
	}
	// Filter Healthcare Categories
	else if(healthCategory.indexOf(cat) > -1 ){                    
		catName = "Healthcare";
	}
	// Filter Childcare Categories
	else if(gasCategory.indexOf(cat) > -1 ){                    
		catName = "Gas Stations";
	}
	// Filter Home Categories
	else if(homeCategory.indexOf(cat) > -1 ){                    
		catName = "Home & Auto";
	}
	// Filter TV, Phone & Internet Categories
	else if(tvCategory.indexOf(cat) > -1 ){                    
		catName = "TV, Phone & Internet";
	}
	// Filter Petcare Categories
	else if(petCategory.indexOf(cat) > -1 ){                    
		catName = "Petcare";
	}else{
		catName = "Others";
	}
	
	return catName;
	
}


router.get('/gettransjson/:offset', function(request, response, next) {	
    var offset = 0;
	if(request.params.offset != null){
		offset = parseInt(request.params.offset);
	}
    response.json(getTransactionsJson(offset));
});

router.get('/deleteAccessToken/:id', function(request, response, next) {	
    var id = 0;
    let params = {};
	if(request.params.id != null){
		params._id = request.params.id;
	}
	PlaidAccountsTokensModel.deleteOne(params,function(err,res){
        if(err){
            console.log(err);
        }else{
            //console.log(res);
            response.send(res);
        }
    });
});

/**** function to Get Transactions from plaid for all customers *****/
function getTransactionsJson(offsetCount){

    var startDate = moment().subtract(180, 'days').format('YYYY-MM-DD');
    var endDate = moment().format('YYYY-MM-DD');
    let params = {};
        PlaidAccountsTokensModel.find(params, function(err,tokensArr){   
            if(err){
            console.log('Error occured. :'+ err);
        }else{ 
            let transactions = [];
            for(let a=0;a<tokensArr.length;a++){
                let access_token = tokensArr[a].access_token;
                let item_id = tokensArr[a].item_id;
                let customer_id = tokensArr[a].customer_id;
                
                client.getTransactions(access_token, startDate, endDate, {count: 500,offset: offsetCount}, async function(error, authResponse) {
                    if (error != null) {
                        console.log(error);
                        console.log(tokensArr[a]);
                        
                    }else{ 
                        //console.log("Transactions response: "+JSON.stringify(authResponse.transactions));
                        transactions.push(authResponse.transactions);
                        if(a  == (tokensArr.length-1)){
                            return transactions;
                        }
                        
                    }
                });
            }
            
        }
        });

}
module.exports = router;

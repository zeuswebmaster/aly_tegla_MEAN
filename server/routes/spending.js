 //Adding Express
var express = require('express');
var moment = require('moment');
var router = express.Router();

//Import db schema
const AtriumMxTransModel = require("../models/atrium_mx_transactions");
const AtriumMxAccountsModel = require("../models/atrium_mx_accounts");

let plaidSpendingCategories = ["Overdraft","ATM","Late Payment","Fraud Dispute","Foreign Transaction","Wire Transfer","Insufficient Funds","Cash Advance","Excess Activity","Animal Shelter","Assisted Living Services","Cemetery","Courts","Day Care and Preschools","Disabled Persons Services","Drug and Alcohol Services","Education","Government Departments and Agencies","Government Lobbyists","Housing Assistance and Shelters","Law Enforcement","Libraries","Military","Organizations and Associations","Post Offices","Public and Social Services","Religious","Senior Citizen Services","Bar","Breweries","Internet Cafes","Nightlife","Restaurants","Healthcare Services","Physicians","Interest Earned","Interest Charged","Credit Card","Rent","Loan","Arts and Entertainment","Athletic Fields","Baseball","Basketball","Batting Cages","Boating","Campgrounds and RV Parks","Canoes and Kayaks","Combat Sports","Cycling","Dance","Equestrian","Football","Go Carts","Golf","Gun Ranges","Gymnastics","Gyms and Fitness Centers","Hiking","Hockey","Hot Air Balloons","Hunting and Fishing","Landmarks","Miniature Golf","Outdoors","Paintball","Parks","Personal Trainers","Race Tracks","Racquet Sports","Racquetball","Rafting","Recreation Centers","Rock Climbing","Running","Scuba Diving","Skating","Skydiving","Snow Sports","Soccer","Sports and Recreation Camps","Sports Clubs","Stadiums and Arenas","Swimming","Tennis","Water Sports","Yoga and Pilates","Zoo","Advertising and Marketing","Art Restoration","Audiovisual","Automation and Control Systems","Automotive","Business and Strategy Consulting","Business Services","Cable","Chemicals and Gasses","Cleaning","Computers","Construction","Credit Counseling and Bankruptcy Services","Dating and Escort","Employment Agencies","Engineering","Entertainment","Events and Event Planning","Financial","Food and Beverage","Funeral Services","Geological","Home Improvement","Household","Human Resources","Immigration","Import and Export","Industrial Machinery and Vehicles","Insurance","Internet Services","Leather","Legal","Logging and Sawmills","Machine Shops","Management","Manufacturing","Media Production","Metals","Mining","News Reporting","Oil and Gas","Packaging","Paper","Personal Care","Petroleum","Photography","Plastics","Rail","Real Estate","Refrigeration and Ice","Renewable Energy","Repair Services","Research","Rubber","Scientific","Security and Safety","Shipping and Freight","Software Development","Storage","Subscription","Tailors","Telecommunication Services","Textiles","Tourist Information and Services","Transportation","Travel Agents and Tour Operators","Utilities","Veterinarians","Water and Waste Management","Web Design and Development","Welding","Agriculture and Forestry","Art and Graphic Design","Adult","Antiques","Arts and Crafts","Auctions","Beauty Products","Bicycles","Boat Dealers","Bookstores","Cards and Stationery","Children","Clothing and Accessories","Computers and Electronics","Construction Supplies","Convenience Stores","Costumes","Dance and Music","Department Stores","Digital Purchase","Discount Stores","Electrical Equipment","Equipment Rental","Flea Markets","Florists","Food and Beverage Store","Fuel Dealer","Furniture and Home Decor","Gift and Novelty","Glasses and Optometrist","Hardware Store","Hobby and Collectibles","Industrial Supplies","Jewelry and Watches","Luggage","Marine Supplies","Music, Video and DVD","Musical Instruments","Newsstands","Office Supplies","Outlet","Pawn Shops","Pets","Pharmacies","Photos and Frames","Shopping Centers and Malls","Sporting Goods","Supermarkets and Groceries","Tobacco","Toys","Vintage and Thrift","Warehouses and Wholesale Stores","Wedding and Bridal","Wholesale","Lawn and Garden","Refund","Payment","Internal Account Transfer","Facilities and Nursing Homes","Caretakers","Vocational Schools","Tutoring and Educational Services","Primary and Secondary Schools","Fraternities and Sororities","Driving Schools","Dance Schools","Culinary Lessons and Schools","Computer Training","Colleges and Universities","Art School","Adult Education","Police Stations","Fire Stations","Correctional Institutions","Youth Organizations","Environmental","Charities and Non-Profits","Temple","Synagogues","Mosques","Churches","Retirement","Wine Bar","Sports Bar","Hotel Lounge","Strip Club","Night Clubs","Karaoke","Jazz and Blues Cafe","Hookah Lounges","Adult Entertainment","Winery","Vegan and Vegetarian","Turkish","Thai","Swiss","Sushi","Steakhouses","Spanish","Seafood","Scandinavian","Portuguese","Pizza","Moroccan","Middle Eastern","Mexican","Mediterranean","Latin American","Korean","Juice Bar","Japanese","Italian","Indonesian","Indian","Ice Cream","Greek","German","Gastropub","French","Food Truck","Fish and Chips","Filipino","Fast Food","Falafel","Ethiopian","Eastern European","Donuts","Distillery","Diners","Dessert","Delis","Cupcake Shop","Cuban","Coffee Shop","Chinese","Caribbean","Cajun","Cafe","Burrito","Burgers","Breakfast Spot","Brazilian","Barbecue","Bakery","Bagel Shop","Australian","Asian","American","African","Afghan","Psychologists","Pregnancy and Sexual Health","Podiatrists","Physical Therapy","Optometrists","Nutritionists","Nurses","Mental Health","Medical Supplies and Labs","Hospitals, Clinics and Medical Centers","Emergency Services","Dentists","Counseling and Therapy","Chiropractors","Blood Banks and Centers","Alternative Medicine","Acupuncture","Urologists","Respiratory","Radiologists","Psychiatrists","Plastic Surgeons","Pediatricians","Pathologists","Orthopedic Surgeons","Ophthalmologists","Oncologists","Obstetricians and Gynecologists","Neurologists","Internal Medicine","General Surgery","Gastroenterologists","Family Medicine","Ear, Nose and Throat","Dermatologists","Cardiologists","Anesthesiologists","Theatrical Productions","Symphony and Opera","Sports Venues","Social Clubs","Psychics and Astrologers","Party Centers","Music and Show Venues","Museums","Movie Theatres","Fairgrounds and Rodeos","Entertainment","Dance Halls and Saloons","Circuses and Carnivals","Casinos and Gaming","Bowling","Billiards and Pool","Art Dealers and Galleries","Arcades and Amusement Parks","Aquarium","Monuments and Memorials","Historic Sites","Gardens","Buildings and Structures","Rivers","Mountains","Lakes","Forests","Beaches","Playgrounds","Picnic Areas","Natural Parks","Writing, Copywriting and Technical Writing","Search Engine Marketing and Optimization","Public Relations","Promotional Items","Print, TV, Radio and Outdoor Advertising","Online Advertising","Market Research and Consulting","Direct Mail and Email Marketing Services","Creative Services","Advertising Agencies and Media Buyers","Towing","Motorcycle, Moped and Scooter Repair","Maintenance and Repair","Car Wash and Detail","Car Appraisers","Auto Transmission","Auto Tires","Auto Smog Check","Auto Oil and Lube","Printing and Publishing","Software Development","Specialty","Roofers","Painting","Masonry","Infrastructure","Heating, Ventilating and Air Conditioning","Electricians","Contractors","Carpet and Flooring","Carpenters","Media","Taxes","Student Aid and Grants","Stock Brokers","Loans and Mortgages","Holding and Investment Offices","Fund Raising","Financial Planning and Investments","Credit Reporting","Collections","Check Cashing","Business Brokers and Franchises","Banking and Finance","ATMs","Accounting and Bookkeeping","Distribution","Catering","Upholstery","Tree Service","Swimming Pool Maintenance and Services","Storage","Pools and Spas","Plumbing","Pest Control","Movers","Mobile Homes","Lighting Fixtures","Landscaping and Gardeners","Kitchens","Interior Design","Housewares","Home Inspection Services","Home Appliances","Heating, Ventilation and Air Conditioning","Hardware and Services","Fences, Fireplaces and Garage Doors","Doors and Windows","Architects","Apparel and Fabric Products","Chemicals and Gasses","Computers and Office Machines","Electrical Equipment and Components","Food and Beverage","Furniture and Fixtures","Glass Products","Industrial Machinery and Equipment","Leather Goods","Metal Products","Nonmetallic Mineral Products","Paper Products","Petroleum","Plastic Products","Rubber Products","Service Instruments","Textiles","Tobacco","Transportation Equipment","Wood Products","Coal","Metal","Non-Metallic Minerals","Tattooing","Tanning Salons","Spas","Skin Care","Piercing","Massage Clinics and Therapists","Manicures and Pedicures","Laundry and Garment Services","Hair Salons and Barbers","Hair Removal","Real Estate Development and Title Companies","Real Estate Appraiser","Real Estate Agents","Property Management","Corporate Housing","Commercial Real Estate","Building and Land Surveyors","Boarding Houses","Apartments, Condos and Houses","Rent","Water","Sanitary and Waste Management","Heating, Ventilating, and Air Conditioning","Gas","Electric","Crop Production","Forestry","Livestock and Animals","Services","Used Car Dealers","Salvage Yards","RVs and Motor Homes","Motorcycles, Mopeds and Scooters","Classic and Antique Car","Car Parts and Accessories","Car Dealers and Leasing","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","Video Games","Mobile Phones","Cameras","Health Food","Farmers Markets","Beer, Wine and Spirits"];

let barsCategory = ["Wine Bar","Sports Bar","Hotel Lounge","Bar","Breweries"]; // Bars
let restaurantsCategory = ["Bar","Wine Bar","Sports Bar","Hotel Lounge","Internet Cafes","Restaurants","Winery","Vegan and Vegetarian","Turkish","Thai","Swiss","Sushi","Steakhouses","Spanish","Seafood","Scandinavian","Portuguese","Pizza","Moroccan","Middle Eastern","Mexican","Mediterranean","Latin American","Korean","Juice Bar","Japanese","Italian","Indonesian","Indian","Ice Cream","Greek","German","Gastropub","French","Food Truck","Fish and Chips","Filipino","Fast Food","Falafel","Ethiopian","Eastern European","Donuts","Distillery","Diners","Dessert","Delis","Cupcake Shop","Cuban","Coffee Shop","Chinese","Caribbean","Cajun","Cafe","Burrito","Burgers","Breakfast Spot","Brazilian","Barbecue","Bakery","Bagel Shop","Australian","Asian","American","African","Afghan"]; // Restaurants
let shoppingCategory = ["Adult","Antiques","Arts and Crafts","Auctions","Beauty Products","Bicycles","Boat Dealers","Bookstores","Cards and Stationery","Children","Clothing and Accessories","Computers and Electronics","Construction Supplies","Convenience Stores","Costumes","Dance and Music","Department Stores","Digital Purchase","Discount Stores","Electrical Equipment","Equipment Rental","Flea Markets","Florists","Food and Beverage Store","Fuel Dealer","Furniture and Home Decor","Gift and Novelty","Glasses and Optometrist","Hardware Store","Hobby and Collectibles","Industrial Supplies","Jewelry and Watches","Luggage","Marine Supplies","Music, Video and DVD","Musical Instruments","Newsstands","Office Supplies","Outlet","Pawn Shops","Pets","Pharmacies","Photos and Frames","Shopping Centers and Malls","Sporting Goods","Supermarkets and Groceries","Tobacco","Toys","Vintage and Thrift","Warehouses and Wholesale Stores","Wedding and Bridal","Wholesale","Lawn and Garden","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","","Video Games","Mobile Phones","Cameras","Specialty","Health Food","Farmers Markets","Beer, Wine and Spirits"]; // Shopping
let entertainmentCategory = ["Entertainment","Media", "Arts and Entertainment",  "Athletic Fields",  "Baseball",  "Basketball",  "Batting Cages",  "Boating",  "Campgrounds and RV Parks",  "Canoes and Kayaks",  "Combat Sports",  "Cycling",  "Dance",  "Equestrian",  "Football",  "Go Carts",  "Golf",  "Gun Ranges",  "Gymnastics",  "Gyms and Fitness Centers",  "Hiking",  "Hockey",  "Hot Air Balloons",  "Hunting and Fishing",  "Landmarks",  "Miniature Golf",  "Outdoors",  "Paintball",  "Parks",  "Personal Trainers",  "Race Tracks",  "Racquet Sports",  "Racquetball",  "Rafting",  "Recreation Centers",  "Rock Climbing",  "Running",  "Scuba Diving",  "Skating",  "Skydiving",  "Snow Sports",  "Soccer",  "Sports and Recreation Camps",  "Sports Clubs",  "Stadiums and Arenas",  "Swimming",  "Tennis",  "Water Sports",  "Yoga and Pilates",  "Zoo","Theatrical Productions",  "Symphony and Opera",  "Sports Venues",  "Social Clubs",  "Psychics and Astrologers",  "Party Centers",  "Music and Show Venues",  "Museums",  "Movie Theatres",  "Fairgrounds and Rodeos",  "Entertainment",  "Dance Halls and Saloons",  "Circuses and Carnivals",  "Casinos and Gaming",  "Bowling",  "Billiards and Pool",  "Art Dealers and Galleries",  "Arcades and Amusement Parks",  "Aquarium",  "Monuments and Memorials",  "Historic Sites",  "Gardens",  "Buildings and Structures",  "Rivers",  "Mountains",  "Lakes",  "Forests",  "Beaches",  "Playgrounds",  "Picnic Areas",  "Natural Parks" , "Recreation","Strip Club","Night Clubs","Karaoke","Jazz and Blues Cafe","Hookah Lounges","Adult Entertainment"];  // Entertainment
let transportCategory = ["Airlines and Aviation Services","Airports","Boat","Bus Stations","Car and Truck Rentals","Car Service","Charter Buses","Cruises","Heliports","Limos and Chauffeurs","Parking","Public Transportation Services","Rail","Taxi","Tolls and Fees","Transportation Centers","Ride Share",]; // Transportation
let insuranceCategory = ["Insurance"]; // Insurance
let checksCategory = ["Withdrawal Check","Check"]; // Checks
let schoolCategory = ["Vocational Schools","Tutoring and Educational Services","Primary and Secondary Schools","Fraternities and Sororities","Driving Schools","Dance Schools","Culinary Lessons and Schools","Computer Training","Colleges and Universities","Art School","Adult Education","Education"]; // School
let personalCategory = ["Tattooing","Tanning Salons","Spas","Skin Care","Piercing","Massage Clinics and Therapists","Manicures and Pedicures","Laundry and Garment Services","Hair Salons and Barbers","Hair Removal","Personal Care"]; // Personal Care
let lodgingCategory = ["Resorts","Lodges and Vacation Rentals","Hotels and Motels","Hostels","Cottages and Cabins","Bed and Breakfasts","Lodging"]; // Hotels and Lodging
let loanCategory = ["Loan","Overdraft","ATM","Late Payment","Fraud Dispute","Foreign Transaction","Wire Transfer","Insufficient Funds","Cash Advance","Excess Activity","Bank Fees","Interest Charged","Interest"]; // Loan and Bank Fees
let healthCategory = ["Healthcare Services","Physicians","Healthcare","Psychologists","Pregnancy and Sexual Health","Podiatrists","Physical Therapy","Optometrists","Nutritionists","Nurses","Mental Health","Medical Supplies and Labs","Hospitals, Clinics and Medical Centers","Emergency Services","Dentists","Counseling and Therapy","Chiropractors","Blood Banks and Centers","Alternative Medicine","Acupuncture","","Urologists","Respiratory","Radiologists","Psychiatrists","Plastic Surgeons","Pediatricians","Pathologists","Orthopedic Surgeons","Ophthalmologists","Oncologists","Obstetricians and Gynecologists","Neurologists","Internal Medicine","General Surgery","Gastroenterologists","Family Medicine","Ear, Nose and Throat","Dermatologists","Cardiologists","Anesthesiologists"]; // Healthcare 
let gasCategory = ["Gas Stations"]; // Gas Stations
let homeCategory = ["Home Improvement","Automotive","Household","Rent"]; // Home and Auto
let tvCategory = ["Internet Services","Cable","Telecommunication Services"]; // TV, Phone, and Internet
let petCategory = ["Pets"]; // Petcare
let incomeCategory = ["ACH","Billpay","Keep the Change Savings Program","Payroll","Benefits","Check","Credit","Debit","Deposit","Save As You Go","ATM","Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid"];
let transferCategory = ["Transfer","Internal Account Transfer","ACH","Billpay","Check","Credit","Debit","Deposit","Check","ATM","Keep the Change Savings Program","Payroll","Benefits","Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid","Wire","Withdrawal","Check","ATM","Save As You Go"];
let othersCategory = ["Animal Shelter","Assisted Living Services","Cemetery","Courts","Day Care and Preschools","Disabled Persons Services","Drug and Alcohol Services","Government Departments and Agencies","Government Lobbyists","Housing Assistance and Shelters","Law Enforcement","Libraries","Military","Organizations and Associations","Post Offices","Public and Social Services","Religious","Senior Citizen Services","Nightlife","Interest Earned","Credit Card","Advertising and Marketing","Art Restoration","Audiovisual","Automation and Control Systems","Business and Strategy Consulting","Business Services","Chemicals and Gasses","Cleaning","Computers","Construction","Credit Counseling and Bankruptcy Services","Dating and Escort","Employment Agencies","Engineering","Events and Event Planning","Financial","Food and Beverage","Funeral Services","Geological","Human Resources","Immigration","Import and Export","Industrial Machinery and Vehicles","Leather","Legal","Logging and Sawmills","Machine Shops","Management","Manufacturing","Media Production","Metals","Mining","News Reporting","Oil and Gas","Packaging","Paper","Petroleum","Photography","Plastics","Real Estate","Refrigeration and Ice","Renewable Energy","Repair Services","Research","Rubber","Scientific","Security and Safety","Shipping and Freight","Software Development","Storage","Subscription","Tailors","Textiles","Tourist Information and Services","Transportation","Travel Agents and Tour Operators","Utilities","Veterinarians","Water and Waste Management","Web Design and Development","Welding","Agriculture and Forestry","Art and Graphic Design","Refund","Payment","Internal Account Transfer","Facilities and Nursing Homes","Caretakers","Police Stations","Fire Stations","Correctional Institutions","Youth Organizations","Environmental","Charities and Non-Profits","Temple","Synagogues","Mosques","Churches","Retirement","Writing, Copywriting and Technical Writing","Search Engine Marketing and Optimization","Public Relations","Promotional Items","Print, TV, Radio and Outdoor Advertising","Online Advertising","Market Research and Consulting","Direct Mail and Email Marketing Services","Creative Services","Advertising Agencies and Media Buyers","Towing","Motorcycle, Moped and Scooter Repair","Maintenance and Repair","Car Wash and Detail","Car Appraisers","Auto Transmission","Auto Tires","Auto Smog Check","Auto Oil and Lube","Printing and Publishing","Software Development","Roofers","Painting","Masonry","Infrastructure","Heating, Ventilating and Air Conditioning","Electricians","Contractors","Carpet and Flooring","Carpenters","Taxes","Student Aid and Grants","Stock Brokers","Loans and Mortgages","Holding and Investment Offices","Fund Raising","Financial Planning and Investments","Credit Reporting","Collections","Check Cashing","Business Brokers and Franchises","Banking and Finance","ATMs","Accounting and Bookkeeping","Distribution","Catering","Upholstery","Tree Service","Swimming Pool Maintenance and Services","Storage","Pools and Spas","Plumbing","Pest Control","Movers","Mobile Homes","Lighting Fixtures","Landscaping and Gardeners","Kitchens","Interior Design","Housewares","Home Inspection Services","Home Appliances","Heating, Ventilation and Air Conditioning","Hardware and Services","Fences, Fireplaces and Garage Doors","Doors and Windows","Architects","Apparel and Fabric Products","Chemicals and Gasses","Computers and Office Machines","Electrical Equipment and Components","Food and Beverage","Furniture and Fixtures","Glass Products","Industrial Machinery and Equipment","Leather Goods","Metal Products","Nonmetallic Mineral Products","Paper Products","Petroleum","Plastic Products","Rubber Products","Service Instruments","Textiles","Transportation Equipment","Wood Products","Coal","Metal","Non-Metallic Minerals","Real Estate Development and Title Companies","Real Estate Appraiser","Real Estate Agents","Property Management","Corporate Housing","Commercial Real Estate","Building and Land Surveyors","Boarding Houses","Apartments, Condos and Houses","Water","Sanitary and Waste Management","Heating, Ventilating, and Air Conditioning","Gas","Electric","Crop Production","Forestry","Livestock and Animals","Services","Used Car Dealers","Salvage Yards","RVs and Motor Homes","Motorcycles, Mopeds and Scooters","Classic and Antique Car","Car Parts and Accessories","Car Dealers and Leasing"];
let categoryArr = [barsCategory,restaurantsCategory,shoppingCategory,entertainmentCategory,transportCategory,insuranceCategory,checksCategory,schoolCategory,personalCategory,lodgingCategory,loanCategory,healthCategory,gasCategory,homeCategory,tvCategory,petCategory,incomeCategory,transferCategory,othersCategory];

let investingCategory = ['Holding and Investment Offices','Financial Planning and Investments'];


router.get('/', (req, res, next)=>{
	// res.send("Spending");
});

//Receiving a GET request to fetch all 1 month spending
router.get('/get1monthlyspendingsection/:month', (req, res, next)=>{
    // console.log("Fetching spending data...");
	
	var minAmt=[0], maxAmt = [99999999];
	
	var monthDuration = req.params.month;

    //Getting all the request parameters
    var params = {};
    params.$and = [];
    var fromDate = moment().subtract(monthDuration, 'months').unix()*1000;
    var toDate = moment().unix()*1000; 
    
    let spendingData = {};
	
	 if(req.query != null){
		if(req.query.min_amt!=null){
			minAmt = JSON.parse(req.query.min_amt);
		}
		if(req.query.max_amt!=null){
			maxAmt = JSON.parse(req.query.max_amt);
		}
	 }
	 
	 // console.log("Min:"+minAmt);
	 // console.log("Max:"+maxAmt);
	 
	 
    params.$and.push({"posted_date":{'$gte':(fromDate+''), '$lt':(toDate+'')}});
    
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			params.$and.push({'customer_id':(req.query.customer_id+'')});
		}
		if(req.query.account_id!=null){
			//params.account_id = req.query.account_id;
			params.$and.push({'account_id':(req.query.account_id+'')});
		}
		// if(req.query.duration!=null){
			// params.account_id = req.query.account_id;
		// }
		
		
		
		
    }
	//console.log(params);
	
    AtriumMxTransModel.aggregate([
		{
			$match: params
		},
		// { "$limit": 10 },
		{
			$lookup:
			{
				from: "atriummxaccountsmodels",
				localField: "account_id",
				foreignField: "ac_id",
				as: "accounts"
			}
		},
        {
			$lookup:
			{
				from: "plaidcategoriesmodels",
				localField: "our_category_id",
				foreignField: "category_id",
				as: "categories"
			}
		}
	]).exec((err, transactionArr) => {
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
		// Temp Variables Delarations
		var rent = 0, rentArr= [];
		var food=0, foodArr = [];
		var shopping=0, shoppingArr = [];
		var entertainment = 0, entertainmentArr = [];
		var travel = 0, travelArr = [];
		var insurance = 0, insuranceArr = [];
		var checks = 0, checksArr = [];
		var school = 0, schoolArr = [];
		var personal = 0, personalArr = [];
		var taxes = 0, taxesArr = [];
		var loan = 0, loanArr = [];
		var health = 0, healthArr = [];
		var child = 0, childArr = [];
		var home = 0, homeArr = [];
		var tv = 0, tvArr = [];
		var pet = 0, petArr = [];
		var others = 0, othersArr = [];
		var total = 0, totalArr = [];
			
		// loop through transactions
		for(var a=0;a<transactionArr.length;a++){
			
			for(var b=0; b<minAmt.length;b++){
				var minVal = minAmt[b];
				var maxVal = maxAmt[b];
				// console.log("Min:"+minVal);
				// console.log("Max:"+maxVal);
				if( (parseFloat(transactionArr[a].amount) >= minVal) && (parseFloat(transactionArr[a].amount) <= maxVal) ){
					// Filter Rent Categories 
					if(barsCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						rent += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						rentArr.push(transactionArr[a]);
					} 
					// Filter Food Categories
					if(restaurantsCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						food += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						foodArr.push(transactionArr[a]);
					}
					// Filter Shopping Categories
					if(shoppingCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						shopping += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						shoppingArr.push(transactionArr[a]);
					}
					// Filter Entertainment Categories
					if(entertainmentCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						entertainment += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						entertainmentArr.push(transactionArr[a]);
					}      
					// Filter Travel Categories
					if(transportCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						travel += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						travelArr.push(transactionArr[a]);
					}
					// Filter Insurance Categories
					if(insuranceCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						insurance += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						insuranceArr.push(transactionArr[a]);
					}
					// Filter Checks Categories
					if(checksCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						checks += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						checksArr.push(transactionArr[a]);
					}
					// Filter School Categories
					if(schoolCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						school += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						schoolArr.push(transactionArr[a]);
					}
					// Filter Personal Care Categories
					if(personalCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						personal += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						personalArr.push(transactionArr[a]);
					}
					// Filter Taxes Categories
					if(lodgingCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						taxes += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						taxesArr.push(transactionArr[a]);
					}
					// Filter Loan and Bank Fees Categories
					if(loanCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						loan += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						loanArr.push(transactionArr[a]);
					}
					// Filter Healthcare Categories
					if(healthCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						health += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						healthArr.push(transactionArr[a]);
					}
					// Filter Childcare Categories
					if(gasCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						child += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						childArr.push(transactionArr[a]);
					}
					// Filter Home Categories
					if(homeCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						home += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						homeArr.push(transactionArr[a]);
					}
					// Filter TV, Phone & Internet Categories
					if(tvCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						tv += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						tvArr.push(transactionArr[a]);
					}
					// Filter Petcare Categories
					if(petCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						pet += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						petArr.push(transactionArr[a]);
					}
					// Filter Others Categories
					if(othersCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						others += parseFloat(transactionArr[a].amount);
						total += parseFloat(transactionArr[a].amount);
						transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
						othersArr.push(transactionArr[a]);
					}
					
				}
			}
		}
		
		var dataArr = [
		{'name':'Bars', 'value':rent, 'img':'home', 'img_path':'others', 'transactions':rentArr, 'color': '#47007d99'},
		{'name':'Restaurants', 'value':food, 'img':'utensils', 'img_path':'others', 'transactions':foodArr, 'color': '#99398999'},
		{'name':'Shopping', 'value':shopping, 'img':'shopping-cart', 'img_path':'shoppingcart', 'transactions':shoppingArr, 'color': '#fda62a99'},
		{'name':'Entertainment', 'value':entertainment, 'img':'film', 'img_path':'entertainment', 'transactions':entertainmentArr, 'color': '#28ca6d99'},
		{'name':'Transportation', 'value':travel, 'img':'plane-departure', 'img_path':'travel', 'transactions':travelArr, 'color': '#6542fc99'},
		{'name':'Insurance', 'value':insurance, 'img':'shield-alt', 'img_path':'others', 'transactions':insuranceArr, 'color': '#8f00fb99'},
		{'name':'Checks', 'value':checks, 'img':'money-check-alt', 'img_path':'checks','transactions':checksArr, 'color': '#7e2c2699'},
		{'name':'School', 'value':school, 'img':'school', 'img_path':'others', 'transactions':schoolArr, 'color': '#8d80ff99'},
		{'name':'Personal Care', 'value':personal, 'img':'user', 'img_path':'personal_care', 'transactions':personalArr, 'color': '#72a1d199'},
		{'name':'Hotels & Lodging', 'value':taxes, 'img':'percent', 'img_path':'others', 'transactions':taxesArr, 'color': '#65bffb99'},
		{'name':'Loan and Bank Fees', 'value':loan, 'img':'hand-holding-usd', 'img_path':'others', 'transactions':loanArr, 'color': '#79c3a899'},
		{'name':'Healthcare', 'value':health, 'img':'medkit', 'img_path':'others', 'transactions':healthArr, 'color': '#d58fa699'},
		{'name':'Gas Stations', 'value':child, 'img':'child', 'img_path':'others', 'transactions':childArr, 'color': '#8e80ff99'},
		{'name':'Home & Auto', 'value':home, 'img':'warehouse', 'img_path':'others', 'transactions':homeArr, 'color': '#53b2b799'},
		{'name':'TV, Phone & Internet', 'value':tv, 'img':'tv', 'img_path':'others', 'transactions':tvArr, 'color': '#C3624199'},
		{'name':'Petcare', 'value':pet, 'img':'dog', 'img_path':'others', 'transactions':petArr, 'color': '#7F462C99'}
		];
		
		dataArr.sort(function (a, b) {
			if (a.value < b.value) { return 1; }
			else if (a.value == b.value) { return 0; }
			else { return -1; }
		});
		
		var slicedArr = dataArr.slice(0, 5);
		
		slicedArr[0].percent = addCommasFormat((roundPercentage((parseFloat(slicedArr[0].value)),total)));
		slicedArr[1].percent = addCommasFormat((roundPercentage((parseFloat(slicedArr[1].value)),total)));
		slicedArr[2].percent = addCommasFormat((roundPercentage((parseFloat(slicedArr[2].value)),total)));
		slicedArr[3].percent = addCommasFormat((roundPercentage((parseFloat(slicedArr[3].value)),total)));
		slicedArr[4].percent = addCommasFormat((roundPercentage((parseFloat(slicedArr[4].value)),total)));
		//slicedArr[5].percent = addCommasFormat((((parseFloat(slicedArr[5].value))/total)*100).toFixed(2));
		
		slicedArr[0].value = addCommasFormat(slicedArr[0].value.toFixed(2));
		slicedArr[1].value = addCommasFormat(slicedArr[1].value.toFixed(2));
		slicedArr[2].value = addCommasFormat(slicedArr[2].value.toFixed(2));
		slicedArr[3].value = addCommasFormat(slicedArr[3].value.toFixed(2));
		slicedArr[4].value = addCommasFormat(slicedArr[4].value.toFixed(2));
		//slicedArr[5].value = addCommasFormat(slicedArr[5].value.toFixed(2));
		
		var otherSlicedArr = dataArr.slice(5, 16);
		
		// console.log("Other Value1:"+others);
		// for(otherElem in otherSlicedArr){
		otherSlicedArr.forEach(function(otherElem) {
			// console.log("Other Value:"+otherElem.value);
			others += otherElem.value;
			othersArr = othersArr.concat(otherElem.transactions);
		});
		
		var othersPercent = roundPercentage(others,total);
		
		
		slicedArr.push({'name':'Others','img_path':'others','value':addCommasFormat(others.toFixed(2)),'color':'#f90cd4', 'img':'others', 'transactions':othersArr, 'percent': addCommasFormat(othersPercent)});
	
		spendingData.section = slicedArr;
		spendingData.total = addCommasFormat(total.toFixed(2));
		
		res.send(spendingData);
		// console.log(spendingData);
        }
    });
    
});


//Receiving a GET request to fetch all 1 month spending details grouped day by day
router.get('/get1monthspendingdetail', (req, res, next)=>{
    //console.log("Fetching spending data...");
	
	var duration = 1;
	var customerId = '';
	var accId = '';
	var category = '';
	let scategory = plaidSpendingCategories.slice();
	
	
	var minAmt=[0], maxAmt=[99999999];
	
	//Getting all the request parameters
	
	if(req.query != null){
        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id;
		}
		if(req.query.duration!=null){
			duration = req.query.duration;
		}
		if(req.query.category != '' || req.query.category != null){
                
			let filtercategory = req.query.category;
			// console.log("Filter Category:"+filtercategory);
			// Housing Categories
			if(filtercategory == 'Bars'){
				scategory = barsCategory;
			}
			// Food Categories
			if(filtercategory == 'Restaurants'){
				scategory = restaurantsCategory;
			}
			// Shopping Categories
			if(filtercategory == 'Shopping'){
				scategory = shoppingCategory;
			}
			// Entertainment Categories
			if(filtercategory == 'Entertainment'){
				scategory = entertainmentCategory;
			}
			// Travel Categories
			if(filtercategory == 'Transportation'){
				scategory = transportCategory;     
			}
			// Insurance Categories
			if(filtercategory == 'Insurance'){
				scategory = insuranceCategory;     
			}
			// Checks Categories
			if(filtercategory == 'Checks'){
				scategory = checksCategory;     
			}
			// School Categories
			if(filtercategory == 'School'){
				scategory = schoolCategory;     
			}
			// Personal Care Categories
			if(filtercategory == 'Personal Care'){
				scategory = personalCategory;     
			}
			// Taxes Categories
			if(filtercategory == 'Hotels '){
				scategory = lodgingCategory;   			
			}
			// Loan and Bank Fees Categories
			if(filtercategory == 'Loan and Bank Fees'){
				scategory = loanCategory;     
			}
			// Healthcare Categories
			if(filtercategory == 'Healthcare'){
				scategory = healthCategory;     
			}
			// Childcare Categories
			if(filtercategory == 'Gas Stations'){
				scategory = gasCategory;     
			}
			// Home Categories
			if(filtercategory == 'Home '){
				scategory = homeCategory;     
			}
			// TV, Phone & Internet Categories
			if(filtercategory == 'TV, Phone '){
				scategory = tvCategory;     
			}
			// Petcare Categories
			if(filtercategory == 'Petcare'){
				scategory = petCategory;     
			}
			// Others Categories
			if(filtercategory == 'Others'){
				scategory = othersCategory;
			}                
                
        }
		if(req.query.min_amt!=null){
			minAmt = JSON.parse(req.query.min_amt);
		}
		if(req.query.max_amt!=null){
			maxAmt = JSON.parse(req.query.max_amt);
		}
		// console.log(minAmt+'~'+maxAmt);
    }
	// console.log("Min:"+minAmt);
	// console.log("Max:"+maxAmt);
	
    var fromDate = moment().subtract(duration, 'months').unix();
	// var fromDate = moment().subtract(7, 'day').unix();
    var toDate = moment().unix(); 
	
    let spendingData = {};
        
	if(duration == 1 || duration == 3 || duration == 6){
		//Db call to fetch the data 1 month
		AtriumMxTransModel.aggregate([
			{ "$match": { $and :  [ 
									{ posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }}, 
									{'top_level_category': {$not: /Transfer$/}}, 
									{'category': {$ne: 'Interest Earned'}},
									{'customer_id': customerId} 
									] }  },
			{
				$addFields: {
					posted_date: { $dateToParts: { date: { $toDate: { $toLong: "$posted_date" } } } }
				}
			},
			{
				$group: {
					_id: { 
						normalized_payee_name: "$normalized_payee_name",
						day: "$posted_date.day",
						month: "$posted_date.month",
						year: "$posted_date.year",
						category: "$category"
					},
					amount: { $sum: { $toDouble: "$amount" } }
				}
			},
			{
				$project: {
					_id: 0,
					normalized_payee_name: "$_id.normalized_payee_name",
					category: "$_id.category",
					amount: 1,
					date: { $concat: [ { $toString: "$_id.day" }, "/", { $toString: "$_id.month" } ] },
					day: "$_id.day",
					month: "$_id.month",
					year: "$_id.year"
				}
			},
			{ "$sort": { 'normalized_payee_name': 1,'month': 1, 'day': 1 }}
		]).exec((err, transactionArr) => {
				if(err){
					console.log('Error occured. :'+ err);
				}else{  
					// console.log(transactionArr);
					// res.send(transactionArr);
					let labelArr = [];
					let wholeData = {};
					// let allData = [{"data":[[1,0,0]],"name":"","showInLegend":false,"color":"#000","marker":{fillOpacity:0},"cat":"Travel"}];
					let allData = [];
					let dateIndex = 0;
					let tempName = '';
					let singleData;
					
					var totalDays = moment().diff(moment().subtract(duration, 'months'),'days');
					// console.log('Total Days:'+totalDays);
					let dateArr = [];
					let dateArrIndex = [];
					
					var oldMonth = "";
					var dateIndexCounter = 1;
					
					dateArr.push("");//blank Data for chart padding
					for(var t=totalDays-1;t>=0;t--){
						if(duration==1){
							// dateArr.push([moment().subtract(t, 'day').format("MM").replace(/^0+/, '')+'/'+moment().subtract(t, 'day').format("DD").replace(/^0+/, '')]);
							
							if(dateIndexCounter == 1){
								dateArr.push([moment().subtract(t, 'day').format("Do").replace(/^0+/, '')+"<br/>"+moment().subtract(t, 'day').format("MMM").replace(/^0+/, '')]);
							}else{
								if(parseInt(moment().subtract(t, 'day').format("Do")) == 1){
									dateArr.push(["<br/>"+moment().subtract(t, 'day').format("MMM").replace(/^0+/, '')]);
								}else{
									dateArr.push([moment().subtract(t, 'day').format("Do").replace(/^0+/, '')]);
								}
							}
							
							
							if( ((parseInt(moment().subtract(t, 'day').format("Do"))) % 7 == 0 && (parseInt(moment().subtract(t, 'day').format("Do"))) != 0) || dateIndexCounter == 1 || parseInt(moment().subtract(t, 'day').format("Do")) == 1){
								// console.log("DayNo:"+parseInt(moment().subtract(t, 'day').format("Do")));
								dateArrIndex.push(dateIndexCounter);
							}
							
							
							
						}else if(duration==3 ||  duration == 6){
							
							if(dateIndexCounter == 1){
								// dateArr.push([moment().subtract(t, 'day').format("MM").replace(/^0+/, '')+'/'+moment().subtract(t, 'day').format("DD").replace(/^0+/, '')]);
								dateArr.push([moment().subtract(t, 'day').format("Do").replace(/^0+/, '')+"<br/>"+moment().subtract(t, 'day').format("MMM").replace(/^0+/, '')]);
							}else{
								if(parseInt(moment().subtract(t, 'day').format("Do")) == 1){
									dateArr.push(["<br/>"+moment().subtract(t, 'day').format("MMM").replace(/^0+/, '')]);
								}else{
									dateArr.push([moment().subtract(t, 'day').format("Do").replace(/^0+/, '')]);
								}
							}
							
							if( ((parseInt(moment().subtract(t, 'day').format("Do"))) == 1) || ( dateIndexCounter % 14 == 0 ) || ( dateIndexCounter == 1 ) ){
								dateArrIndex.push(dateIndexCounter);
							}
								
						}
						dateIndexCounter++;
					}
					dateArr.push("");//blank Data for chart padding
					
					wholeData.labels = dateArr;
					wholeData.indexes = dateArrIndex;
					
					// console.log("Min:"+minAmt+" Max:"+maxAmt);
					
					
					var totalAmountAllMerchant = 0;
					var merchantTotalAmtArr = [];
					var merchantArr = [];
					var merchantTotalAmtSortedArr = [];
					var maxMerchantAmount = 0;
					
					// console.log("Transaction Array: "+transactionArr.length);
					for(var a=0;a<transactionArr.length;a++){
						for(var b=0; b<minAmt.length;b++){
							var minVal = minAmt[b];
							var maxVal = maxAmt[b];
							// console.log("Category Filter:"+scategory);
							if( ((parseFloat(transactionArr[a].amount)>=minVal) && (parseFloat(transactionArr[a].amount)<=maxVal) && scategory.indexOf(transactionArr[a].category) > -1) ){
								// console.log('Filtered transaction#'+a+": "+transactionArr[a]);
								//Merchant Name pushed into array
								let obj = merchantArr.find(x => x.name === transactionArr[a].normalized_payee_name);
								let index = merchantArr.indexOf(obj);
								
								if(index < 0){
									merchantArr.push({"name": transactionArr[a].normalized_payee_name, "amount": transactionArr[a].amount});
								}else{
									merchantArr[index].amount += transactionArr[a].amount;
								}
								
								totalAmountAllMerchant += transactionArr[a].amount;
								
							}
						}
					}
					
					merchantArr = sortByKey(merchantArr, 'amount');
					
					var rank = 1;
					
					for(var i=0;i<merchantArr.length;i++){
						
						
						if(maxMerchantAmount<merchantArr[i].amount){
							maxMerchantAmount = merchantArr[i].amount;
						}
						
						merchantArr[i].rank = Math.ceil((merchantArr[i].amount/maxMerchantAmount)*20);
					}
					
					// console.log("merchantTotalAmtArr:"+JSON.stringify(merchantArr));
					
					
					for(var a=0;a<transactionArr.length;a++){
						for(var b=0; b<minAmt.length;b++){
							var minVal = minAmt[b];
							var maxVal = maxAmt[b];
							if( (parseFloat(transactionArr[a].amount)>=minVal && parseFloat(transactionArr[a].amount)<=maxVal && scategory.indexOf(transactionArr[a].category) > -1) ){
							
								dateIndex = (moment([transactionArr[a].day+"."+transactionArr[a].month+"."+transactionArr[a].year],"DD.MM.YYYY").diff(moment().subtract(duration, 'months'), 'days'))+1;
								// console.log("Date:"+transactionArr[a].day+"."+transactionArr[a].month+"."+transactionArr[a].year);
								// console.log("RefDate:"+moment().subtract(duration, 'months'));
								// console.log(dateIndex);
								let singleInData = {};
								var obj = merchantArr.find(x => x.name === transactionArr[a].normalized_payee_name);
								var index = merchantArr.indexOf(obj);
								if(tempName == ''){
									singleData = {};
									singleData.data = [];
									singleData.showInLegend = false;
									singleData.name = transactionArr[a].normalized_payee_name;
									singleData.data.push([dateIndex, merchantArr[index].rank, transactionArr[a].amount]);
									// singleData.color = intToRGB(hashCode(transactionArr[a].normalized_payee_name));
									singleData.color = getColor(transactionArr[a].category);
									singleData.marker = {fillColor: {radialGradient: { cx: 0.5, cy: 1.5, r: 1 },stops: [[0, 'rgba(255,255,255,1)'],[1, getColor(transactionArr[a].category)+"99"]]}};
									singleData.cat = getCatName(transactionArr[a].category);
									tempName = transactionArr[a].normalized_payee_name;
									allData.push(singleData);
								}else if(tempName == transactionArr[a].normalized_payee_name){
									singleData.data.push([dateIndex, merchantArr[index].rank, transactionArr[a].amount]);
								}else{
									singleData = {};
									singleData.data = [];
									singleData.name = transactionArr[a].normalized_payee_name;
									singleData.showInLegend = false;
									singleData.data.push([dateIndex, merchantArr[index].rank, transactionArr[a].amount]);
									singleData.color = getColor(transactionArr[a].category);
									singleData.marker = {fillColor: {radialGradient: { cx: 0.5, cy: 1.5, r: 1 },stops: [[0, 'rgba(255,255,255,1)'],[1, getColor(transactionArr[a].category)+"99"]]}};
									singleData.cat = getCatName(transactionArr[a].category);
									tempName = transactionArr[a].normalized_payee_name;
									allData.push(singleData);
								}
								
								// singleData['']
								
							}
						}
						
					}
					// console.log("spending.js: allData arr len="+allData.length);
					if(allData.length){
						allData.push({"data":[[0,0,0]],"showInLegend":false,"name":"INTRST PYMNT","color":"transparent","marker":{"fillColor":'transparent'},"cat":"fake"});
					}
					
					wholeData.data = allData;
					res.send(wholeData);
				}
			});
	}
	
	
});


//Receiving a GET request to fetch all 6 month spending breakout
router.get('/get6monthlyspendingbreakout', (req, res, next)=>{
    //console.log("Fetching spending data...");

    //Getting all the request parameters
    var params = {};
    params.$and = [];
    var fromDate = moment().subtract(6, 'months').unix()*1000;
    var toDate = moment().unix()*1000; 
	var minAmt = [0], maxAmt = [99999999];
    
    let spendingData = {};
        
    params.$and.push({"posted_date":{'$gte':(fromDate+''), '$lt':(toDate+'')}});
    
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			params.$and.push({'customer_id':(req.query.customer_id+'')});
		}
		if(req.query.account_id!=null){
			//params.account_id = req.query.account_id;
            params.$and.push({'account_id':(req.query.account_id+'')});
		}
		if(req.query.min_amt!=null){
			minAmt = JSON.parse(req.query.min_amt);
		}
		if(req.query.max_amt!=null){
			maxAmt = JSON.parse(req.query.max_amt);
		}
		
		//console.log(params);
    }
   AtriumMxTransModel.aggregate([
		{
			$match: params
		},
		// { "$limit": 10 },
		{
			$lookup:
			{
				from: "atriummxaccountsmodels",
				localField: "account_id",
				foreignField: "ac_id",
				as: "accounts"
			}
		},
        {
			$lookup:
			{
				from: "plaidcategoriesmodels",
				localField: "our_category_id",
				foreignField: "category_id",
				as: "categories"
			}
		}
	]).exec((err, transactionArr) => {
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
			let finalArr = [];
			let dataArr = [];
			let housingArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthHousing = 0, housingTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let foodArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthFood = 0, foodTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let shoppingArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthShopping = 0, shoppingTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let entertainmentArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthEntertainment = 0, entertainmentTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let travelArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthTravel = 0, travelTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let insuranceArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthInsurance = 0, insuranceTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let checksArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthCheck = 0, checksTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let schoolArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthSchool = 0, schoolTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let personalArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthPersonal = 0, personalTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let taxesArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthTaxes = 0, taxesTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let loanArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthLoan = 0, loanTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let healthArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthHealth = 0, healthTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let childArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthChild = 0, childTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let homeArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthHome = 0, homeTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let tvArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthTv = 0, tvTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let petArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthPet = 0, petTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			let othersArr = [0,0,0,0,0,0,0,0,0,0,0,0], totalSixMonthOthers = 0, othersTransArr = [[],[],[],[],[],[],[],[],[],[],[],[]];
			var monthNum = 0;
			
			let dateNumArr = [];
			let dateNameArr = [];
			
			for(var t=5;t>=0;t--){
				var monthNumber = moment().subtract(t, 'months').month();
				dateNumArr.push(monthNumber);
				var monthName = moment().subtract(t, 'months').format('MMM');
				dateNameArr.push([monthName]);
			}
			
			// console.log("Min:"+minAmt+" Max:"+maxAmt);
			
            // loop through transactions
            for(var a=0;a<transactionArr.length;a++){
				for(var b=0; b<minAmt.length;b++){
					var minVal = minAmt[b];
					var maxVal = maxAmt[b];
					if( (parseFloat(transactionArr[a].amount)>=minVal) && (parseFloat(transactionArr[a].amount)<=maxVal)  )
					{
							
								
						monthNum = moment(parseInt(transactionArr[a].posted_date)).month();
						// console.log('MonthName:'+monthNum);
						
						// Filter Rent Categories 
						if(barsCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(housingArr[monthNum]!=null && housingArr[monthNum]!=undefined){
								housingArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								housingArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthHousing += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							housingTransArr[monthNum].push(transactionArr[a]);
						} 
						// Filter Food Categories
						if(restaurantsCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(foodArr[monthNum]!=null && foodArr[monthNum]!=undefined){
								foodArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								foodArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthFood += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							foodTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Shopping Categories
						if(shoppingCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(shoppingArr[monthNum]!=null && shoppingArr[monthNum]!=undefined){
								shoppingArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								shoppingArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthShopping += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							shoppingTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Entertainment Categories
						if(entertainmentCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
						   if(entertainmentArr[monthNum]!=null && entertainmentArr[monthNum]!=undefined){
								entertainmentArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								entertainmentArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthEntertainment += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							entertainmentTransArr[monthNum].push(transactionArr[a]);
						}      
						// Filter Travel Categories
						if(transportCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(travelArr[monthNum]!=null && travelArr[monthNum]!=undefined){
								travelArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								travelArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthTravel += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							travelTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Insurance Categories
						if(insuranceCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(insuranceArr[monthNum]!=null && insuranceArr[monthNum]!=undefined){
								insuranceArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								insuranceArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthInsurance += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							insuranceTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Checks Categories
						if(checksCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(checksArr[monthNum]!=null && checksArr[monthNum]!=undefined){
								checksArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								checksArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthCheck += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							checksTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter School Categories
						if(schoolCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(schoolArr[monthNum]!=null && schoolArr[monthNum]!=undefined){
								schoolArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								schoolArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthSchool += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							schoolTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Personal Care Categories
						if(personalCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(personalArr[monthNum]!=null && personalArr[monthNum]!=undefined){
								personalArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								personalArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthPersonal += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							personalTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Taxes Categories
						if(lodgingCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(taxesArr[monthNum]!=null && taxesArr[monthNum]!=undefined){
								taxesArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								taxesArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthTaxes += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							taxesTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Loan and Bank Fees Categories
						if(loanCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(loanArr[monthNum]!=null && loanArr[monthNum]!=undefined){
								loanArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								loanArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthLoan += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							loanTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Healthcare Categories
						if(healthCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(healthArr[monthNum]!=null && healthArr[monthNum]!=undefined){
								healthArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								healthArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthHealth += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							healthTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Childcare Categories
						if(gasCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(childArr[monthNum]!=null && childArr[monthNum]!=undefined){
								childArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								childArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthChild += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							childTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Home Categories
						if(homeCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(homeArr[monthNum]!=null && homeArr[monthNum]!=undefined){
								homeArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								homeArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthHome += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							homeTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter TV, Phone & Internet Categories
						if(tvCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(tvArr[monthNum]!=null && tvArr[monthNum]!=undefined){
								tvArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								tvArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthTv += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							tvTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Petcare Categories
						if(petCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(petArr[monthNum]!=null && petArr[monthNum]!=undefined){
								petArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								petArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthPet += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							petTransArr[monthNum].push(transactionArr[a]);
						}
						// Filter Others Categories
						if(othersCategory.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
							if(othersArr[monthNum]!=null && othersArr[monthNum]!=undefined){
								othersArr[monthNum] += parseFloat(transactionArr[a].amount);
							}else{
								othersArr[monthNum] = parseFloat(transactionArr[a].amount);
							}
							totalSixMonthOthers += parseFloat(transactionArr[a].amount);
							transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
							othersTransArr[monthNum].push(transactionArr[a]);
						}
					}
				}
            }
			
			var dataObj = [
							{"name":"Bars","value":totalSixMonthHousing,"data":housingArr, 'transactions':housingTransArr, 'color': '#47007d','img':'home'},
							{"name":"Restaurants","value":totalSixMonthFood,"data":foodArr, 'transactions':foodTransArr, 'color': '#993989', 'img':'utensils'},
							{"name":"Shopping","value":totalSixMonthShopping,"data":shoppingArr, 'transactions':shoppingTransArr, 'color': '#fda62a', 'img':'shopping-cart'},
							{"name":"Entertainment","value":totalSixMonthEntertainment,"data":entertainmentArr, 'transactions':entertainmentTransArr, 'color': '#28ca6d', 'img':'film'},
							{"name":"Transportation","value":totalSixMonthTravel,"data":travelArr, 'transactions':travelTransArr, 'color': '#6542fc', 'img':'plane-departure'},
							{"name":"Insurance","value":totalSixMonthInsurance,"data":insuranceArr, 'transactions':insuranceTransArr, 'color': '#8f00fb', 'img':'shield-alt'},
							{"name":"Checks","value":totalSixMonthCheck,"data":checksArr, 'transactions':checksTransArr, 'color': '#7e2c26', 'img':'money-check-alt'},
							{"name":"School","value":totalSixMonthSchool,"data":schoolArr, 'transactions':schoolTransArr, 'color': '#8d80ff', 'img':'school'},
							{"name":"Personal Care","value":totalSixMonthPersonal,"data":personalArr, 'transactions':personalTransArr, 'color': '#72a1d1', 'img':'user'},
							{"name":"Hotels & Lodging","value":totalSixMonthTaxes,"data":taxesArr, 'transactions':taxesTransArr, 'color': '#65bffb', 'img':'percent'},
							{"name":"Loan & Bank Fees","value":totalSixMonthLoan,"data":loanArr, 'transactions':loanTransArr, 'color': '#79c3a8', 'img':'hand-holding-usd'},
							{"name":"Healthcare","value":totalSixMonthHealth,"data":healthArr, 'transactions':healthTransArr, 'color': '#d58fa6', 'img':'medkit'},
							{"name":"Gas Stations","value":totalSixMonthChild,"data":childArr, 'transactions':childTransArr, 'color': '#8e80ff', 'img':'child'},
							{"name":"Home & Auto","value":totalSixMonthHome,"data":homeArr, 'transactions':homeTransArr, 'color': '#53b2b7', 'img':'warehouse'},
							{"name":"TV, Phone & Internet","value":totalSixMonthTv,"data":tvArr, 'transactions':tvTransArr, 'color': '#C36241', 'img':'tv'},
							{"name":"Petcare","value":totalSixMonthPet,"data":petArr, 'transactions':petTransArr, 'color': '#7F462C', 'img':'dog'}
							];
							
			dataObj.sort(function (a, b) {
				if (a.value < b.value) { return 1; }
				else if (a.value == b.value) { return 0; }
				else { return -1; }
			});
			
			var slicedArr = dataObj.slice(0, 6);
			// slicedArr[0].color = '#47cc4a';
			// slicedArr[1].color = '#4f87fb';
			// slicedArr[2].color = '#ffbb33';
			// slicedArr[3].color = '#eb2135';
			// slicedArr[4].color = '#93298e';
			// slicedArr[5].color = '#445792';
			
			slicedArr[0].value = (slicedArr[0].value.toFixed(2));
			slicedArr[1].value = (slicedArr[1].value.toFixed(2));
			slicedArr[2].value = (slicedArr[2].value.toFixed(2));
			slicedArr[3].value = (slicedArr[3].value.toFixed(2));
			slicedArr[4].value = (slicedArr[4].value.toFixed(2));
			slicedArr[5].value = (slicedArr[5].value.toFixed(2));
		
	
			var otherSlicedArr = dataObj.slice(6, 16);
			otherSlicedArr.forEach(function(otherElem) {
				// console.log("Other Value:"+otherElem.value);
				totalSixMonthOthers += otherElem.value;
				for(var x=0; x<dateNumArr.length;x++){
					othersArr[dateNumArr[x]] += otherElem.data[dateNumArr[x]];
					othersTransArr[x] = othersTransArr[x].concat(otherElem.transactions);
				}
			});
			
			slicedArr.push({'name':'Others','value':(totalSixMonthOthers.toFixed(2)),'color':'#f90cd4', 'data':othersArr, 'transactions':othersTransArr, 'img':'others'});
	
            // Data Bind to send back in response
            // dataArr.push(housingArr);
			// dataArr.push(foodArr);
			// dataArr.push(shoppingArr);
			// dataArr.push(entertainmentArr);
			// dataArr.push(travelArr);
			// dataArr.push(insuranceArr);
			// dataArr.push(checksArr);
			// dataArr.push(schoolArr);
			// dataArr.push(personalArr);
			// dataArr.push(taxesArr);
			// dataArr.push(loanArr);
			// dataArr.push(healthArr);
			// dataArr.push(childArr);
			// dataArr.push(homeArr);
			// dataArr.push(tvArr);
			// dataArr.push(petArr);
			// dataArr.push(othersArr);
			
			finalArr.push(dateNumArr);
			finalArr.push(dateNameArr);
			finalArr.push(slicedArr);
			
            res.send(finalArr);
            // console.log(finalArr);
        }
    });
    
});





//Receiving a GET request to fetch recent transactions
router.get('/gettransactions/:month', (req, res, next)=>{
	let params = {};
    params.$and = [];
    let month = 0;
	var minAmt=0, maxAmt = 99999999;
   // let scategory = ['ATM Fee','Advertising','Air Travel','Alcohol & Bars','Allowance','Amusement','Arts','Auto & Transport','Auto Insurance','Auto Payment','Baby Supplies','Babysitter & Daycare','Bank Fee','Bills & Utilities','Books','Books & Supplies','Business Services','Buy','Charity','Check','Child Support','Clothing','Coffee Shops','Dentist','Doctor','Education','Electronics & Software','Entertainment','Eyecare','Fast Food','Federal Tax','Fees & Charges','Financial','Financial Advisor','Food & Dining','Furnishings','Gas & Fuel','Gift','Gifts & Donations','Groceries','Gym','Hair','Health & Fitness','Health Insurance','Hobbies','Home','Home Improvement','Home Insurance','Home Phone','Home Services','Home Supplies','Hotel','Internet','Investments','Kids','Kids Activities','Laundry','Lawn & Garden','Legal','Life Insurance','Loan Fees and Charges','Loan Insurance','Loan Interest','Loan Payment','Loan Principal','Loans','Local Tax','Mobile Phone','Mortgage & Rent','Movies & DVDs','Music','Newspapers & Magazines','Office Supplies','Parking','Personal Care','Pet Food & Supplies','Pet Grooming','Pets','Pharmacy','Printing','Property Tax','Public Transportation','Rental Car & Taxi','Restaurants','Sales Tax','Service & Parts','Shipping','Shopping','Spa & Massage','Sporting Goods','Sports','State Tax','Student Loan','Taxes','Television','Toys','Trade Commissions','Travel','Tuition','Uncategorized','Utilities','Vacation','Veterinary'];
    let scategory = plaidSpendingCategories.slice();
	if(req.query != null){        
		if(req.query.customer_id!=null){
			params.$and.push({'customer_id':(req.query.customer_id+'')});
		}
		
        if(req.query.category != '' || req.query.category != null){
                
                let filtercategory = req.query.category;
                // Housing Categories
                if(filtercategory == 'Bars'){
                    scategory = barsCategory;
                }
                // Food Categories
                if(filtercategory == 'Restaurants'){
                    scategory = restaurantsCategory;
                }
                // Shopping Categories
                if(filtercategory == 'Shopping'){
                    scategory = shoppingCategory;
                }
                // Entertainment Categories
                if(filtercategory == 'Entertainment'){
                    scategory = entertainmentCategory;
                }
                // Travel Categories
                if(filtercategory == 'Transportation'){
                    scategory = transportCategory;     
                }
				// Insurance Categories
                if(filtercategory == 'Insurance'){
                    scategory = insuranceCategory;     
                }
				// Checks Categories
                if(filtercategory == 'Checks'){
                    scategory = checksCategory;     
                }
				// School Categories
                if(filtercategory == 'School'){
                    scategory = schoolCategory;     
                }
				// Personal Care Categories
                if(filtercategory == 'Personal Care'){
                    scategory = personalCategory;     
                }
				// Taxes Categories
                if(filtercategory == 'Hotels & Lodging'){
                    scategory = lodgingCategory;     
                }
				// Loan and Bank Fees Categories
                if(filtercategory == 'Loan and Bank Fees'){
                    scategory = loanCategory;     
                }
				// Healthcare Categories
                if(filtercategory == 'Healthcare'){
                    scategory = healthCategory;     
                }
				// Childcare Categories
                if(filtercategory == 'Gas Stations'){
                    scategory = gasCategory;     
                }
				// Home Categories
                if(filtercategory == 'Home & Auto'){
                    scategory = homeCategory;     
                }
				// TV, Phone & Internet Categories
                if(filtercategory == 'TV, Phone & Internet'){
                    scategory = tvCategory;     
                }
				// Petcare Categories
                if(filtercategory == 'Petcare'){
                    scategory = petCategory;     
                }
                // Others Categories
                if(filtercategory == 'Others'){
                    scategory = othersCategory;
                }                
                
        }
    }
    if(req.params.month != '' || req.params.month != null){
        month = req.params.month;
    }
	if(req.query.min_amt!=null){
		minAmt = req.query.min_amt;
	}
	if(req.query.max_amt!=null){
		maxAmt = req.query.max_amt;
	}
    
	if(month > 0){
        var fromDate = moment().subtract(month, 'months').unix()*1000;
        var toDate = moment().unix()*1000;
        //params.posted_date = {'$gte':fromDate, '$lt':toDate};
        params.$and.push({'posted_date': {'$gte':(fromDate+''), '$lt':(toDate+'')}});
    }
    //console.log(JSON.stringify(params));
	AtriumMxTransModel.aggregate([
		{
			$match: params
		},
		// { "$limit": 10 },
		{
			$lookup:
			{
				from: "atriummxaccountsmodels",
				localField: "account_id",
				foreignField: "ac_id",
				as: "accounts"
			}
		},
        {
			$lookup:
			{
				from: "plaidcategoriesmodels",
				localField: "our_category_id",
				foreignField: "category_id",
				as: "categories"
			}
		}
	]).exec((err, transactionArr) => {
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{  
			var transId = "";
			var transTime = "";
			var transDate = '';
			var transMonth = '';
			var payeeName = "";
            var payeeName_details = '';
			var arrElement = "";
			var amount = "";
			var amountInt = "";
			var amountDec = "";
			var transYear = "";
			var spendingcategory = '';
			var recentTransData = [];
			
			// console.log("tA:"+JSON.stringify(transactionArr));
			var transArr = Object.values(transactionArr);
			
			// console.log("Min:"+minAmt+" Max:"+maxAmt);
			
            var count = 0;
			for(var a=0;a<transactionArr.length;a++){ 
                if(count < 7){
					if( (parseFloat(transactionArr[a].amount)>=minAmt && parseFloat(transactionArr[a].amount)<=maxAmt) || (parseFloat(transactionArr[a].amount)>=minAmt && maxAmt==99999999) )
					{
						if((scategory.indexOf(transactionArr[a].category) > -1) && (transactionArr[a].accounts.length > 0)){
							count++;
							// console.log("Single Transaction:\n"+JSON.stringify(transactionArr[a]));
							transId = transactionArr[a].trans_id;
							transTimestamp = parseInt(transactionArr[a].posted_date);
							transTime = moment(transTimestamp).format("hh:mm A");
							transDate = moment(transTimestamp).format("D");
							transMonth = moment(transTimestamp).format("MMM");
							transYear = moment(transTimestamp).format("YYYY");
							payeeName = transactionArr[a].normalized_payee_name;
                            if(transactionArr[a].accounts.length > 0){
                                payeeName_details = "<br/><span class='subsection'>" +transactionArr[a].accounts[0]['institution_id'] + " - " + transactionArr[a].accounts[0]['official_name'] + " ("+transactionArr[a].accounts[0]['ac_number']+")</span>";
                            }else{
                                payeeName_details = '';
                            }
                            payeeName_details = transactionArr[a].normalized_payee_name + payeeName_details.toLowerCase();
							spendingcategory = getCatName(transactionArr[a].categories[0].our_category);
							amount = addCommasFormat(parseFloat(transactionArr[a].amount).toFixed(2));
							
							arrElement = {'timestamp':transTimestamp,'time':transTime,'date':transDate,'month':transMonth,'year':transYear,'payee':payeeName,'payee_details':payeeName_details,'category':spendingcategory,'amount':amount,'img':getCatImg(spendingcategory),'transId':transId};                    
							recentTransData.push(arrElement);
							
						}			
					}
                }
			}
            res.send(recentTransData);
		}
		
	}).sort({"posted_date":-1});
	
});


//Receiving a GET request to fetch recent transactions
router.get('/getSpendingRatio/:month', (req, res, next)=>{
	let params = {};
    params.$and = [];
    let month = 0;
    // let icategory = ['Income','Bonus','Interest Income','Paycheck', 'Reimbursement', 'Rental Income'];
    
    
    // let scategory = [
		// 'Mortgage & Rent',
		// 'Coffee Shops','Fast Food','Food & Dining','Groceries', 'Restaurants',
		// 'Shopping', 'Clothing', 'Electronics & Software', 'Personal Care', 'Sporting Goods', 'Toys',
		// 'Entertainment','Alcohol & Bars', 'Amusement', 'Arts', 'Movies & DVDs','Music','Newspapers & Magazines','Sports', 'Hobbies',
		// 'Travel', 'Rental Car & Taxi','Air Travel', 'Public Transportation', 'Gas & Fuel', 'Auto & Transport', 'Auto Payment', 'Hotel', 'Parking', 'Service & Parts',
		// 'Auto Insurance', 'Health Insurance', 'Home Insurance', 'Life Insurance', 'Loan Insurance',
		// 'Check',
		// 'Education', 'Student Loan', 'Tuition',
		// 'Gym', 'Hair', 'Health & Fitness', 'Spa & Massage',
		// 'Property Tax', 'Federal Tax', 'Taxes', 'Local Tax', 'Sales Tax', 'State Tax',
		// 'Loan Interest', 'Loan Payment', 'Loan Principal', 'Loans', 'ATM Fee', 'Bank Fee', 'Fees & Charges', 'Loan Fees and Charges',
		// 'Dentist','Doctor','Eyecare', 'Pharmacy',
		// 'Baby Supplies','Babysitter & Daycare', 'Child Support', 'Kids','Kids Activities',
		// 'Home','Home Improvement', 'Home Services', 'Home Supplies', 'Furnishings', 'Lawn & Garden',
		// 'Mobile Phone', 'Internet', 'Home Phone', 'Television',
		// 'Pet Food & Supplies', 'Pet Grooming', 'Pets',
		// 'Advertising', 'Allowance', 'Bills & Utilities','Books','Books & Supplies','Business Services','Buy','Charity', 'Financial', 'Financial Advisor', 'Gift','Gifts & Donations', 'Investments', 'Laundry', 'Legal', , 'Office Supplies', 'Printing',' Shipping', 'Trade Commissions', ,'Uncategorized','Utilities','Vacation','Veterinary'
	// ];
	if(req.query != null){        
		if(req.query.customer_id!=null){
			params.$and.push({'customer_id':(req.query.customer_id+'')});
		}		        
    }
    if(req.params.month != '' || req.params.month != null){
        month = req.params.month;
    }
    
	if(month >= 0){
        var fromDate = moment().subtract(month, 'months').startOf('month').unix()*1000;
        var toDate = moment().subtract(month, 'months').endOf('month').unix()*1000;
        params.$and.push({'posted_date': {'$gte':(fromDate+''), '$lt':(toDate+'')}});
    }
	
    console.log(params);
	AtriumMxTransModel.aggregate([
		{
			$match: params
		},
		{
			$lookup:
			{
				from: "atriummxaccountsmodels",
				localField: "account_id",
				foreignField: "ac_id",
				as: "accounts"
			}
		},
        {
			$lookup:
			{
				from: "plaidcategoriesmodels",
				localField: "our_category_id",
				foreignField: "category_id",
				as: "categories"
			}
		}
	]).exec((err, transactionArr) => {
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{  
			let income = 0;
			let spending = 0;
			let transAmounts = {};
			let spendArr = [];
			let incArr = [];
			
			for(var a=0;a<transactionArr.length;a++){ 
                if(plaidSpendingCategories.indexOf(transactionArr[a].categories[0].our_category) > -1 ){                    
                    spending += parseFloat(transactionArr[a].amount);
                    transactionArr[a].category = getCatName(transactionArr[a].categories[0].our_category);
					spendArr.push(transactionArr[a]);
                }
				
				if(incomeCategory.indexOf(transactionArr[a].category) > -1 ){
                    if(transactionArr[a].type=="DEBIT"){
						income += parseFloat(transactionArr[a].amount);
                        transactionArr[a].category = getCatName(transactionArr.category);
						incArr.push(transactionArr[a]);
					}
                }
			}
			transAmounts.spending = addCommasFormat(parseFloat(spending).toFixed(2));
            transAmounts.income = addCommasFormat(parseFloat(income).toFixed(2));
            var ratio = parseFloat((spending/income)*100).toFixed(0);
			var pratio = ratio;
            if(ratio > 100){
                pratio = 100;
            }
                
            transAmounts.ratio = ratio;
			transAmounts.pratio = pratio;
			transAmounts.spendArr = spendArr;
			transAmounts.incomeArr = incArr;
            res.json(transAmounts);
		}
		
	}).sort({"posted_date":-1});
	
});

function addCommasFormat(nStr) {
  nStr += '';
  var x = nStr.split('.');

  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + "<sup>"+x2+"</sup>";
}

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return hexToRgbA("#"+("00000".substring(0, 6 - c.length) + c));
}
function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

function getColor(cat){
	var color = "#000";
	// console.log('Cat:'+cat);
	if(barsCategory.indexOf(cat) > -1 ){                    
		color = "#47007d";
	} 
	// Filter Food Categories
	else if(restaurantsCategory.indexOf(cat) > -1 ){                    
		color = "#993989";
	}
	// Filter Shopping Categories
	else if(shoppingCategory.indexOf(cat) > -1 ){                    
		color = "#fda62a";
	}
	// Filter Entertainment Categories
	else if(entertainmentCategory.indexOf(cat) > -1 ){                    
		color = "#28ca6d";
	}      
	// Filter Travel Categories
	else if(transportCategory.indexOf(cat) > -1 ){                    
		color = "#6542fc";
	}
	// Filter Insurance Categories
	else if(insuranceCategory.indexOf(cat) > -1 ){                    
		color = "#8f00fb";
	}
	// Filter Checks Categories
	else if(checksCategory.indexOf(cat) > -1 ){                    
		color = "#7e2c26";
	}
	// Filter School Categories
	else if(schoolCategory.indexOf(cat) > -1 ){                    
		color = "#8d80ff";
	}
	// Filter Personal Care Categories
	else if(personalCategory.indexOf(cat) > -1 ){                    
		color = "#72a1d1";
	}
	// Filter Taxes Categories
	else if(lodgingCategory.indexOf(cat) > -1 ){                    
		color = "#65bffb";
	}
	// Filter Loan and Bank Fees Categories
	else if(loanCategory.indexOf(cat) > -1 ){                    
		color = "#79c3a8";
	}
	// Filter Healthcare Categories
	else if(healthCategory.indexOf(cat) > -1 ){                    
		color = "#d58fa6";
	}
	// Filter Childcare Categories
	else if(gasCategory.indexOf(cat) > -1 ){                    
		color = "#8e80ff";
	}
	// Filter Home Categories
	else if(homeCategory.indexOf(cat) > -1 ){                    
		color = "#53b2b7";
	}
	// Filter TV, Phone & Internet Categories
	else if(tvCategory.indexOf(cat) > -1 ){                    
		color = "#C36241";
	}
	// Filter Petcare Categories
	else if(petCategory.indexOf(cat) > -1 ){                    
		color = "#7F462C";
	}
	// Filter Others Categories
	else if(othersCategory.indexOf(cat) > -1 ){                    
		color = "#f90cd4";
	}else{
		color = "#f90cd4";
	}
	
	return color;
	
}

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

function sortByKey(array, key) {
    return array.sort(function(b, a) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function roundPercentage(p,t){
	var perc = (p/t)*100;
	if(perc == 0){
		perc = (0).toFixed(0);
	}else if(perc <= 0.50){
		perc = (0.5).toFixed(2);
	}else{
		perc = Math.round(perc).toFixed(0);
	}
	return perc;
}

function getCatImg(cat){
	var catImg = "Others";
	// console.log('Cat:'+cat);
	if(barsCategory.indexOf(cat) > -1 ){                    
		catImg = "other.png";
	} 
	// Filter Food Categories
	else if(restaurantsCategory.indexOf(cat) > -1 ){                    
		catImg = "restaurants.png";
	}
	// Filter Shopping Categories
	else if(shoppingCategory.indexOf(cat) > -1 ){                    
		catImg = "shopping.png";
	}
	// Filter Entertainment Categories
	else if(entertainmentCategory.indexOf(cat) > -1 ){                    
		catImg = "movie-tickets.png";
	}      
	// Filter Travel Categories
	else if(transportCategory.indexOf(cat) > -1 ){                    
		catImg = "transport.png";
	}
	// Filter Insurance Categories
	else if(insuranceCategory.indexOf(cat) > -1 ){                    
		catImg = "umbrella.png";
	}
	// Filter Checks Categories
	else if(checksCategory.indexOf(cat) > -1 ){                    
		catImg = "other.png";
	}
	// Filter School Categories
	else if(schoolCategory.indexOf(cat) > -1 ){                    
		catImg = "students-cap.png";
	}
	// Filter Personal Care Categories
	else if(personalCategory.indexOf(cat) > -1 ){                    
		catImg = "barbershop.png";
	}
	// Filter Taxes Categories
	else if(lodgingCategory.indexOf(cat) > -1 ){                    
		catImg = "other.png";
	}
	// Filter Loan and Bank Fees Categories
	else if(loanCategory.indexOf(cat) > -1 ){                    
		catImg = "other.png";
	}
	// Filter Healthcare Categories
	else if(healthCategory.indexOf(cat) > -1 ){                    
		catImg = "plus-black-symbol.png";
	}
	// Filter Childcare Categories
	else if(gasCategory.indexOf(cat) > -1 ){                    
		catImg = "other.png";
	}
	// Filter Home Categories
	else if(homeCategory.indexOf(cat) > -1 ){                    
		catImg = "other.png";
	}
	// Filter TV, Phone & Internet Categories
	else if(tvCategory.indexOf(cat) > -1 ){                    
		catImg = "tvwifi.png";
	}
	// Filter Petcare Categories
	else if(petCategory.indexOf(cat) > -1 ){                    
		catImg = "other.png";
	}else{
		catImg = "other.png";
	}
	
	return catImg;
	
}

module.exports = router;

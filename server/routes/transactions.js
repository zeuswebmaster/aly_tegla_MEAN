//Adding Express
var express = require('express');
var moment = require('moment');
var router = express.Router();
const Atrium = require('mx-atrium');

//Import db schema
const AtriumMxTransModel = require("../models/atrium_mx_transactions");
const AtriumMxAccountsModel = require("../models/atrium_mx_accounts");
const PlaidCategoriesModel = require("../models/categories");

let plaidAllCategories = ["Bank Fees","Overdraft","ATM","Late Payment","Fraud Dispute","Foreign Transaction","Wire Transfer", "Insufficient Funds","Cash Advance","Excess Activity","Cash Advance","Community","Animal Shelter","Assisted Living Services","Facilities and Nursing Homes","Caretakers","Cemetery","Courts","Day Care and Preschools","Disabled Persons Services","Drug and Alcohol Services","Education","Vocational Schools","Tutoring and Educational Services","Primary and Secondary Schools","Fraternities and Sororities","Driving Schools","Dance Schools","Culinary Lessons and Schools","Computer Training","Colleges and Universities","Art School","Adult Education","Government Departments and Agencies","Government Lobbyists","Housing Assistance and Shelters","Law Enforcement","Police Stations","Fire Stations","Correctional Institutions","Libraries","Military","Organizations and Associations","Youth Organizations","Environmental","Charities and Non-Profits","Post Offices","Public and Social Services","Religious","Temple","Synagogues","Mosques","Churches","Senior Citizen Services","Retirement","Food and Drink","Bar","Wine Bar","Sports Bar","Hotel Lounge","Breweries","Internet Cafes","Nightlife","Strip Club","Night Clubs","Karaoke","Jazz and Blues Cafe","Hookah Lounges","Adult Entertainment","Restaurants","Winery","Vegan and Vegetarian","Turkish","Thai","Swiss","Sushi","Steakhouses","Spanish","Seafood","Scandinavian","Portuguese","Pizza","Moroccan","Middle Eastern","Mexican","Mediterranean","Latin American","Korean","Juice Bar","Japanese","Italian","Indonesian","Indian","Ice Cream","Greek","German","Gastropub","French","Food Truck","Fish and Chips","Filipino","Fast Food","Falafel","Ethiopian","Eastern European","Donuts","Distillery","Diners","Dessert","Delis","Cupcake Shop","Cuban","Coffee Shop","Chinese","Caribbean","Cajun","Cafe","Burrito","Burgers","Breakfast Spot","Brazilian","Barbecue","Bakery","Bagel Shop","Australian","Asian","American","African","Afghan","Healthcare","Healthcare Services","Psychologists","Pregnancy and Sexual Health","Podiatrists","Physical Therapy","Optometrists","Nutritionists","Nurses","Mental Health","Medical Supplies and Labs","Hospitals, Clinics and Medical Centers","Emergency Services","Dentists","Counseling and Therapy","Chiropractors","Blood Banks and Centers","Alternative Medicine","Acupuncture","Physicians","Urologists","Respiratory","Radiologists","Psychiatrists","Plastic Surgeons","Pediatricians","Pathologists","Orthopedic Surgeons","Ophthalmologists","Oncologists","Obstetricians and Gynecologists","Neurologists","Internal Medicine","General Surgery","Gastroenterologists","Family Medicine","Ear, Nose and Throat","Dermatologists","Cardiologists","Anesthesiologists","Interest","Interest Earned","Interest Charged","Payment","Credit Card","Rent","Loan","Recreation","Arts and Entertainment","Theatrical Productions","Symphony and Opera","Sports Venues","Social Clubs","Psychics and Astrologers","Party Centers","Music and Show Venues","Museums","Movie Theatres","Fairgrounds and Rodeos","Entertainment","Dance Halls and Saloons","Circuses and Carnivals","Casinos and Gaming","Bowling","Billiards and Pool","Art Dealers and Galleries","Arcades and Amusement Parks","Aquarium","Athletic Fields","Baseball","Basketball","Batting Cages","Boating","Campgrounds and RV Parks","Canoes and Kayaks","Combat Sports","Cycling","Dance","Equestrian","Football","Go Carts","Golf","Gun Ranges","Gymnastics","Gyms and Fitness Centers","Hiking","Hockey","Hot Air Balloons","Hunting and Fishing","Landmarks","Monuments and Memorials","Historic Sites","Gardens","Buildings and Structures","Miniature Golf","Outdoors","Rivers","Mountains","Lakes","Forests","Beaches","Paintball","Parks","Playgrounds","Picnic Areas","Natural Parks","Personal Trainers","Race Tracks","Racquet Sports","Racquetball","Rafting","Recreation Centers","Rock Climbing","Running","Scuba Diving","Skating","Skydiving","Snow Sports","Soccer","Sports and Recreation Camps","Sports Clubs","Stadiums and Arenas","Swimming","Tennis","Water Sports","Yoga and Pilates","Service","Zoo","Advertising and Marketing","Writing, Copywriting and Technical Writing","Search Engine Marketing and Optimization","Public Relations","Promotional Items","Print, TV, Radio and Outdoor Advertising","Online Advertising","Market Research and Consulting","Direct Mail and Email Marketing Services","Creative Services","Advertising Agencies and Media Buyers","Art Restoration","Audiovisual","Automation and Control Systems","Automotive","Towing","Motorcycle, Moped and Scooter Repair","Maintenance and Repair","Car Wash and Detail","Car Appraisers","Auto Transmission","Auto Tires","Auto Smog Check","Auto Oil and Lube","Business and Strategy Consulting","Business Services","Printing and Publishing","Cable","Chemicals and Gasses","Cleaning","Computers","Maintenance and Repair","Software Development","Construction","Specialty","Roofers","Painting","Masonry","Infrastructure","Heating, Ventilating and Air Conditioning","Electricians","Contractors","Carpet and Flooring","Carpenters","Credit Counseling and Bankruptcy Services","Dating and Escort","Employment Agencies","Engineering","Entertainment","Media","Events and Event Planning","Financial","Taxes","Student Aid and Grants","Stock Brokers","Loans and Mortgages","Holding and Investment Offices","Fund Raising","Financial Planning and Investments","Credit Reporting","Collections","Check Cashing","Business Brokers and Franchises","Banking and Finance","ATMs","Accounting and Bookkeeping","Food and Beverage","Distribution","Catering","Funeral Services","Geological","Home Improvement","Upholstery","Tree Service","Swimming Pool Maintenance and Services","Storage","Roofers","Pools and Spas","Plumbing","Pest Control","Painting","Movers","Mobile Homes","Lighting Fixtures","Landscaping and Gardeners","Kitchens","Interior Design","Housewares","Home Inspection Services","Home Appliances","Heating, Ventilation and Air Conditioning","Hardware and Services","Fences, Fireplaces and Garage Doors","Electricians","Doors and Windows","Contractors","Carpet and Flooring","Carpenters","Architects","Household","Human Resources","Immigration","Import and Export","Industrial Machinery and Vehicles","Insurance","Internet Services","Leather","Legal","Logging and Sawmills","Machine Shops","Management","Manufacturing","Apparel and Fabric Products","Chemicals and Gasses","Computers and Office Machines","Electrical Equipment and Components","Food and Beverage","Furniture and Fixtures","Glass Products","Industrial Machinery and Equipment","Leather Goods","Metal Products","Nonmetallic Mineral Products","Paper Products","Petroleum","Plastic Products","Rubber Products","Service Instruments","Textiles","Tobacco","Transportation Equipment","Wood Products","Media Production","Metals","Mining","Coal","Metal","Non-Metallic Minerals","News Reporting","Oil and Gas","Packaging","Paper","Personal Care","Tattooing","Tanning Salons","Spas","Skin Care","Piercing","Massage Clinics and Therapists","Manicures and Pedicures","Laundry and Garment Services","Hair Salons and Barbers","Hair Removal","Petroleum","Photography","Plastics","Rail","Real Estate","Real Estate Development and Title Companies","Real Estate Appraiser","Real Estate Agents","Property Management","Corporate Housing","Commercial Real Estate","Building and Land Surveyors","Boarding Houses","Apartments, Condos and Houses","Rent","Refrigeration and Ice","Renewable Energy","Repair Services","Research","Rubber","Scientific","Security and Safety","Shipping and Freight","Software Development","Storage","Subscription","Tailors","Telecommunication Services","Textiles","Tourist Information and Services","Transportation","Travel Agents and Tour Operators","Utilities","Water","Sanitary and Waste Management","Heating, Ventilating, and Air Conditioning","Gas","Electric","Veterinarians","Water and Waste Management","Web Design and Development","Welding","Agriculture and Forestry","Crop Production","Forestry","Livestock and Animals","Services","Art and Graphic Design","Shops","Adult","Antiques","Arts and Crafts","Auctions","Automotive","Used Car Dealers","Salvage Yards","RVs and Motor Homes","Motorcycles, Mopeds and Scooters","Classic and Antique Car","Car Parts and Accessories","Car Dealers and Leasing","Beauty Products","Bicycles","Boat Dealers","Bookstores","Cards and Stationery","Children","Clothing and Accessories","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","Computers and Electronics","Video Games","Mobile Phones","Cameras","Construction Supplies","Convenience Stores","Costumes","Dance and Music","Department Stores","Digital Purchase","Discount Stores","Electrical Equipment","Equipment Rental","Flea Markets","Florists","Food and Beverage Store","Specialty","Health Food","Farmers Markets","Beer, Wine and Spirits","Fuel Dealer","Furniture and Home Decor","Gift and Novelty","Glasses and Optometrist","Hardware Store","Hobby and Collectibles","Industrial Supplies","Jewelry and Watches","Luggage","Marine Supplies","Music, Video and DVD","Musical Instruments","Newsstands","Office Supplies","Outlet","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","Pawn Shops","Pets","Pharmacies","Photos and Frames","Shopping Centers and Malls","Sporting Goods","Supermarkets and Groceries","Tobacco","Toys","Vintage and Thrift","Warehouses and Wholesale Stores","Wedding and Bridal","Wholesale","Lawn and Garden","Tax","Refund","Payment","Transfer","Internal Account Transfer","ACH","Billpay","Check","Credit","Debit","Deposit","Check","ATM","Keep the Change Savings Program","Payroll","Benefits","Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid","Wire","Withdrawal","Check","ATM","Save As You Go","Travel","Airlines and Aviation Services","Airports","Boat","Bus Stations","Car and Truck Rentals","Car Service","Ride Share","Charter Buses","Cruises","Gas Stations","Heliports","Limos and Chauffeurs","Lodging","Resorts","Lodges and Vacation Rentals","Hotels and Motels","Hostels","Cottages and Cabins","Bed and Breakfasts","Parking","Public Transportation Services","Rail","Taxi","Tolls and Fees","Transportation Centers"];

let plaidSpendingCategories = ["Overdraft","ATM","Late Payment","Fraud Dispute","Foreign Transaction","Wire Transfer","Insufficient Funds","Cash Advance","Excess Activity","Animal Shelter","Assisted Living Services","Cemetery","Courts","Day Care and Preschools","Disabled Persons Services","Drug and Alcohol Services","Education","Government Departments and Agencies","Government Lobbyists","Housing Assistance and Shelters","Law Enforcement","Libraries","Military","Organizations and Associations","Post Offices","Public and Social Services","Religious","Senior Citizen Services","Bar","Breweries","Internet Cafes","Nightlife","Restaurants","Healthcare Services","Physicians","Interest Earned","Interest Charged","Credit Card","Rent","Loan","Arts and Entertainment","Athletic Fields","Baseball","Basketball","Batting Cages","Boating","Campgrounds and RV Parks","Canoes and Kayaks","Combat Sports","Cycling","Dance","Equestrian","Football","Go Carts","Golf","Gun Ranges","Gymnastics","Gyms and Fitness Centers","Hiking","Hockey","Hot Air Balloons","Hunting and Fishing","Landmarks","Miniature Golf","Outdoors","Paintball","Parks","Personal Trainers","Race Tracks","Racquet Sports","Racquetball","Rafting","Recreation Centers","Rock Climbing","Running","Scuba Diving","Skating","Skydiving","Snow Sports","Soccer","Sports and Recreation Camps","Sports Clubs","Stadiums and Arenas","Swimming","Tennis","Water Sports","Yoga and Pilates","Zoo","Advertising and Marketing","Art Restoration","Audiovisual","Automation and Control Systems","Automotive","Business and Strategy Consulting","Business Services","Cable","Chemicals and Gasses","Cleaning","Computers","Construction","Credit Counseling and Bankruptcy Services","Dating and Escort","Employment Agencies","Engineering","Entertainment","Events and Event Planning","Financial","Food and Beverage","Funeral Services","Geological","Home Improvement","Household","Human Resources","Immigration","Import and Export","Industrial Machinery and Vehicles","Insurance","Internet Services","Leather","Legal","Logging and Sawmills","Machine Shops","Management","Manufacturing","Media Production","Metals","Mining","News Reporting","Oil and Gas","Packaging","Paper","Personal Care","Petroleum","Photography","Plastics","Rail","Real Estate","Refrigeration and Ice","Renewable Energy","Repair Services","Research","Rubber","Scientific","Security and Safety","Shipping and Freight","Software Development","Storage","Subscription","Tailors","Telecommunication Services","Textiles","Tourist Information and Services","Transportation","Travel Agents and Tour Operators","Utilities","Veterinarians","Water and Waste Management","Web Design and Development","Welding","Agriculture and Forestry","Art and Graphic Design","Adult","Antiques","Arts and Crafts","Auctions","Beauty Products","Bicycles","Boat Dealers","Bookstores","Cards and Stationery","Children","Clothing and Accessories","Computers and Electronics","Construction Supplies","Convenience Stores","Costumes","Dance and Music","Department Stores","Digital Purchase","Discount Stores","Electrical Equipment","Equipment Rental","Flea Markets","Florists","Food and Beverage Store","Fuel Dealer","Furniture and Home Decor","Gift and Novelty","Glasses and Optometrist","Hardware Store","Hobby and Collectibles","Industrial Supplies","Jewelry and Watches","Luggage","Marine Supplies","Music, Video and DVD","Musical Instruments","Newsstands","Office Supplies","Outlet","Pawn Shops","Pets","Pharmacies","Photos and Frames","Shopping Centers and Malls","Sporting Goods","Supermarkets and Groceries","Tobacco","Toys","Vintage and Thrift","Warehouses and Wholesale Stores","Wedding and Bridal","Wholesale","Lawn and Garden","Refund","Payment","Internal Account Transfer","Facilities and Nursing Homes","Caretakers","Vocational Schools","Tutoring and Educational Services","Primary and Secondary Schools","Fraternities and Sororities","Driving Schools","Dance Schools","Culinary Lessons and Schools","Computer Training","Colleges and Universities","Art School","Adult Education","Police Stations","Fire Stations","Correctional Institutions","Youth Organizations","Environmental","Charities and Non-Profits","Temple","Synagogues","Mosques","Churches","Retirement","Wine Bar","Sports Bar","Hotel Lounge","Strip Club","Night Clubs","Karaoke","Jazz and Blues Cafe","Hookah Lounges","Adult Entertainment","Winery","Vegan and Vegetarian","Turkish","Thai","Swiss","Sushi","Steakhouses","Spanish","Seafood","Scandinavian","Portuguese","Pizza","Moroccan","Middle Eastern","Mexican","Mediterranean","Latin American","Korean","Juice Bar","Japanese","Italian","Indonesian","Indian","Ice Cream","Greek","German","Gastropub","French","Food Truck","Fish and Chips","Filipino","Fast Food","Falafel","Ethiopian","Eastern European","Donuts","Distillery","Diners","Dessert","Delis","Cupcake Shop","Cuban","Coffee Shop","Chinese","Caribbean","Cajun","Cafe","Burrito","Burgers","Breakfast Spot","Brazilian","Barbecue","Bakery","Bagel Shop","Australian","Asian","American","African","Afghan","Psychologists","Pregnancy and Sexual Health","Podiatrists","Physical Therapy","Optometrists","Nutritionists","Nurses","Mental Health","Medical Supplies and Labs","Hospitals, Clinics and Medical Centers","Emergency Services","Dentists","Counseling and Therapy","Chiropractors","Blood Banks and Centers","Alternative Medicine","Acupuncture","Urologists","Respiratory","Radiologists","Psychiatrists","Plastic Surgeons","Pediatricians","Pathologists","Orthopedic Surgeons","Ophthalmologists","Oncologists","Obstetricians and Gynecologists","Neurologists","Internal Medicine","General Surgery","Gastroenterologists","Family Medicine","Ear, Nose and Throat","Dermatologists","Cardiologists","Anesthesiologists","Theatrical Productions","Symphony and Opera","Sports Venues","Social Clubs","Psychics and Astrologers","Party Centers","Music and Show Venues","Museums","Movie Theatres","Fairgrounds and Rodeos","Entertainment","Dance Halls and Saloons","Circuses and Carnivals","Casinos and Gaming","Bowling","Billiards and Pool","Art Dealers and Galleries","Arcades and Amusement Parks","Aquarium","Monuments and Memorials","Historic Sites","Gardens","Buildings and Structures","Rivers","Mountains","Lakes","Forests","Beaches","Playgrounds","Picnic Areas","Natural Parks","Writing, Copywriting and Technical Writing","Search Engine Marketing and Optimization","Public Relations","Promotional Items","Print, TV, Radio and Outdoor Advertising","Online Advertising","Market Research and Consulting","Direct Mail and Email Marketing Services","Creative Services","Advertising Agencies and Media Buyers","Towing","Motorcycle, Moped and Scooter Repair","Maintenance and Repair","Car Wash and Detail","Car Appraisers","Auto Transmission","Auto Tires","Auto Smog Check","Auto Oil and Lube","Printing and Publishing","Software Development","Specialty","Roofers","Painting","Masonry","Infrastructure","Heating, Ventilating and Air Conditioning","Electricians","Contractors","Carpet and Flooring","Carpenters","Media","Taxes","Student Aid and Grants","Stock Brokers","Loans and Mortgages","Holding and Investment Offices","Fund Raising","Financial Planning and Investments","Credit Reporting","Collections","Check Cashing","Business Brokers and Franchises","Banking and Finance","ATMs","Accounting and Bookkeeping","Distribution","Catering","Upholstery","Tree Service","Swimming Pool Maintenance and Services","Storage","Pools and Spas","Plumbing","Pest Control","Movers","Mobile Homes","Lighting Fixtures","Landscaping and Gardeners","Kitchens","Interior Design","Housewares","Home Inspection Services","Home Appliances","Heating, Ventilation and Air Conditioning","Hardware and Services","Fences, Fireplaces and Garage Doors","Doors and Windows","Architects","Apparel and Fabric Products","Chemicals and Gasses","Computers and Office Machines","Electrical Equipment and Components","Food and Beverage","Furniture and Fixtures","Glass Products","Industrial Machinery and Equipment","Leather Goods","Metal Products","Nonmetallic Mineral Products","Paper Products","Petroleum","Plastic Products","Rubber Products","Service Instruments","Textiles","Tobacco","Transportation Equipment","Wood Products","Coal","Metal","Non-Metallic Minerals","Tattooing","Tanning Salons","Spas","Skin Care","Piercing","Massage Clinics and Therapists","Manicures and Pedicures","Laundry and Garment Services","Hair Salons and Barbers","Hair Removal","Real Estate Development and Title Companies","Real Estate Appraiser","Real Estate Agents","Property Management","Corporate Housing","Commercial Real Estate","Building and Land Surveyors","Boarding Houses","Apartments, Condos and Houses","Rent","Water","Sanitary and Waste Management","Heating, Ventilating, and Air Conditioning","Gas","Electric","Crop Production","Forestry","Livestock and Animals","Services","Used Car Dealers","Salvage Yards","RVs and Motor Homes","Motorcycles, Mopeds and Scooters","Classic and Antique Car","Car Parts and Accessories","Car Dealers and Leasing","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","Video Games","Mobile Phones","Cameras","Health Food","Farmers Markets","Beer, Wine and Spirits"];
let plaidInvestingCategories = [];

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

// let barsCategory = ['Mortgage & Rent'];// Rent Categories
// let restaurantsCategory = ['Coffee Shops','Fast Food','Food & Dining','Groceries', 'Restaurants'];// Food Categories
// let shoppingCategory = ['Shopping', 'Clothing', 'Electronics & Software', 'Personal Care', 'Sporting Goods', 'Toys'];// Shopping Categories
// let entertainmentCategory = ['Entertainment','Alcohol & Bars', 'Amusement', 'Arts', 'Movies & DVDs','Music','Newspapers & Magazines','Sports', 'Hobbies'];// Entertainment Categories
// let transportCategory = ['Travel', 'Rental Car & Taxi','Air Travel', 'Public Transportation', 'Gas & Fuel', 'Auto & Transport', 'Auto Payment', 'Hotel', 'Parking', 'Service & Parts'];         // Travel Categories
// let insuranceCategory = ['Auto Insurance', 'Health Insurance', 'Home Insurance', 'Life Insurance', 'Loan Insurance'];// Insurance Categories
// let checksCategory = ['Check'];// Checks Categories
// let schoolCategory = ['Education', 'Student Loan', 'Tuition'];// School Categories
// let personalCategory = ['Gym', 'Hair', 'Health & Fitness', 'Spa & Massage'];// Personal Care Categories
// let lodgingCategory = ['Property Tax', 'Federal Tax', 'Taxes', 'Local Tax', 'Sales Tax', 'State Tax'];// Taxes Categories
// let loanCategory = ['Loan Interest', 'Loan Payment', 'Loan Principal', 'Loans', 'ATM Fee', 'Bank Fee', 'Fees & Charges', 'Loan Fees and Charges'];// Loan and Bank Fees Categories
// let healthCategory = ['Dentist','Doctor','Eyecare', 'Pharmacy'];// Healthcare Categories
// let gasCategory = ['Baby Supplies','Babysitter & Daycare', 'Child Support', 'Kids','Kids Activities'];// Childcare Categories
// let homeCategory = ['Home','Home Improvement', 'Home Services', 'Home Supplies', 'Furnishings', 'Lawn & Garden'];// Home Categories
// let tvCategory = ['Mobile Phone', 'Internet', 'Home Phone', 'Television'];// TV, Phone & Internet Categories
// let petCategory = ['Pet Food & Supplies', 'Pet Grooming', 'Pets'];// Petcare Categories
// let incomeCategory = ['Income','Bonus','Interest Income','Paycheck', 'Reimbursement', 'Rental Income'];// Income Categories
// let transferCategory = ['Transfer', 'Credit Card Payment', 'Transfer for Cash Spending', 'Mortgage Payment'];// Transfers Categories
// let othersCategory = ['Advertising', 'Allowance', 'Bills & Utilities','Books','Books & Supplies','Business Services','Buy','Charity', 'Financial', 'Financial Advisor', 'Gift','Gifts & Donations', 'Investments', 'Laundry', 'Legal', , 'Office Supplies', 'Printing',' Shipping', 'Trade Commissions', ,'Uncategorized','Utilities','Vacation','Veterinary'];// Others Categories
// let categoryArr = [barsCategory,restaurantsCategory,shoppingCategory,entertainmentCategory,transportCategory,insuranceCategory,checksCategory,schoolCategory,personalCategory,lodgingCategory,loanCategory,healthCategory,gasCategory,homeCategory,tvCategory,petCategory,incomeCategory,transferCategory,othersCategory];

let current_page = 1;
let total_pages = 1;
var msg = "";

// Get Customer Id from login of user. Currently hardcoded because we don't have login functionality
const customerId  = "";

// Mx API keys Defination Compulsory for application
const MX_API_Key = 'a8ef2dfc9ce2ba47ab85c7e9196b3815ce185fb0';
const MX_Client_ID = '1a41057b-4aed-4c07-813a-463faf02d2a5';

var isInDevelopment = 0;

//Check whether app is in development or production and assign MX server URL & Atrium client
var AtriumClient = '';
if(isInDevelopment){
    AtriumClient = new Atrium.Client(MX_API_Key,MX_Client_ID, Atrium.environments.development);
}else{
    AtriumClient = new Atrium.Client(MX_API_Key,MX_Client_ID, Atrium.environments.production);
}

//Receiving a GET request to fetch all transactions based on filters
router.get('/', (req, res, next)=>{
    // console.log("Fetching transaction data...");

    //Getting all the request parameters
    var query = {};
    if(req.query != null){
        query = req.query;
    }

    AtriumMxTransModel.find(query, function(err,trans){
        res.send(trans); 
        // console.log('Fetching transaction data done.');
    });
});

//Receiving a GET request to fetch all transactions based on filters
router.get('/withfilters', (req, res, next)=>{
    // console.log("Fetching transaction data...");

	var minAmt = 0.01;
	var maxAmt = 99999999;
	var transType = "";
	var transCat = "";
	var accId = "";
	var dateRange = 1;
	var customerId = "";
	var fromDate = "";
	var toDate = "";
	
    //Getting all the request parameters
    var params = {};
	params.$and = [];
	
    if(req.query != null){
       if(req.query.customer_id!=null){
			params.$and.push({'customer_id':req.query.customer_id});
		}
		if(req.query.min_amt!=null){
			minAmt = req.query.min_amt;
		}
		if(req.query.max_amt!=null){
			maxAmt = req.query.max_amt;
			if(maxAmt == 1000){
				maxAmt = 99999999;
			}
		}
		if(req.query.trans_type!=null){
			params.$and.push({'type':req.query.trans_type});
		}
		if(req.query.trans_cat!=null){
			// params.$and.push({'category':req.query.trans_cat});
			transCat = req.query.trans_cat;
		}
		if(req.query.acc_id!=null){
			params.$and.push({'account_id':req.query.acc_id});
		}
		if(req.query.date_range!=null){
			dateRange = req.query.date_range;
			fromDate = moment().subtract(dateRange, 'months').unix()*1000+"";
			toDate = moment().unix()*1000+""; 
			if(req.query.date_range!=null){
				// params.$and.push({"posted_date":{'$gte':fromDate, '$lt':toDate}});
			}
		}
    }
	
	// params.$or = [{ac_sub_type:"CHECKING"},{ac_sub_type:"SAVINGS"}];
	
	
	// console.log("Min:"+minAmt);
	// console.log("Max:"+maxAmt);
	
	// console.log('Params:'+JSON.stringify(params));
	
	let transactionData = [];
	
	AtriumMxTransModel.aggregate([
		{
			$match: params
		},
        {
            $sort:{"posted_date":-1}
		},
		
        // {
        //     $limit: 10
        // },
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
	]).exec((err, data) => {
		if(err){
            console.log('Error occured. :'+ err);
        }else{  		
			// console.log(data);
			res.send(data);
		}
	});
	
    
	/*
    AtriumMxTransModel.find(params, function(err,transactionArr){
        
		// loop through transactions
		for(var a=0;a<transactionArr.length;a++){
			if( transCat!= "" && categoryArr[transCat].indexOf(transactionArr[a].category) > -1 && (parseFloat(transactionArr[a].amount) >= minAmt) && (parseFloat(transactionArr[a].amount) <= maxAmt) ){                    
				transactionData.push(transactionArr[a]);
			}else if(transCat == "" && (parseFloat(transactionArr[a].amount) >= minAmt) && (parseFloat(transactionArr[a].amount) <= maxAmt)){
				transactionData.push(transactionArr[a]);
			}
		}
		
		res.send(transactionData); 
    });
    */
	
});
//Receiving a GET request to fetch all transactions based on custom filters
router.get('/customfetch', (req, res, next)=>{
    // console.log("Fetching custom data...");

    //Getting all the request parameters
    var params = {};

    if(req.query != null){

        params = {"posted_date":{'$gte':req.query.from_date, '$lt':req.query.to_date}};
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.account_id!=null){
			params.account_id = req.query.account_id;
		}
		if(req.query.payee_name!=null){
			params.normalized_payee_name = req.query.payee_name;
            
		}
		
		// console.log(params);
    }

    //console.log("Node-Parameters:"+params);

    AtriumMxTransModel.find(params, function(err,trans){        
        if(err){
            console.log('Error occured.');
            console.log(err);    
        }else{
            // console.log('Custom fetching done.');
            //console.log(trans);    
            res.send(trans); 
        }
    });
});


//Receiving a GET request to fetch all transactions based on custom filters
router.get('/customfetchnuggets', (req, res, next)=>{
     //console.log("Fetching custom data...");

    //Getting all the request parameters
    var params = {};
    params.$and = [];
    if(req.query != null){

        params.$and.push({"posted_date":{"$gte":req.query.from_date, "$lt":req.query.to_date}});
		if(req.query.customer_id!=null){
			params.$and.push({"customer_id": req.query.customer_id});
		}
		if(req.query.account_id!=null){			
            params.$and.push({"account_id": req.query.account_id});
		}
		if(req.query.payee_name!=null){			
            params.$and.push({"normalized_payee_name": req.query.payee_name});            
		}
		params.$and.push({top_level_category: {$not: /Transfer$/}}); 
		
    }
    AtriumMxTransModel.aggregate([
		{
			$match:params

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
	]).exec((err, trans) => {    
        if(err){
            console.log('Error occured.');
            console.log(err);    
        }else{
            // console.log('Custom fetching done.');
            //console.log(trans);   
            for(var i=0;i<trans.length;i++){
				// trans[i].category = getCatName(trans[i].category);
				trans[i].category =  trans[i].categories[0].our_category;
            }
            res.send(trans); 
        }
    });
});


//Receiving a GET request to fetch all transactions based on custom filters
router.get('/customtransbyid', (req, res, next)=>{
     //console.log("Fetching custom data...");

    //Getting all the request parameters
    var params = {};
    params.$and = [];
    if(req.query != null){
       
		if(req.query.customer_id!=null){
			params.$and.push({"customer_id": req.query.customer_id});
		}
		if(req.query.trans_id !=null){			
            params.$and.push({"trans_id": req.query.trans_id});
		}		
    }
    AtriumMxTransModel.aggregate([
		{
			$match:params

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
	]).exec((err, trans) => {    
        if(err){
            console.log('Error occured.');
            console.log(err);    
        }else{            
            res.send(trans); 
        }
    });
});

//Receiving a GET request to fetch all transactions based on custom filters
router.get('/changeTransCategory', (req, res, next)=>{
     //console.log("Fetching custom data...");

    //Getting all the request parameters
    let params = {};    
    let new_category = "Others";
    if(req.query != null){
       
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.trans_id !=null){		
            params.trans_id = req.query.trans_id;
		}
		
		if(req.query.new_category !=null){			
            new_category = req.query.new_category;
		}	
    }
    let newdata = {};
    newdata.our_category = new_category;
    
    
    PlaidCategoriesModel.find(newdata,function(err,data){
            if(err){console.log(err);return false;}
            if(data){
                if(data.length){
                    console.log(data[0].category_id);
                    let newdatas = {};
                    newdatas.our_category_id = data[0].category_id;
                    //console.log(data);
                    //console.log(params);
                    AtriumMxTransModel.findOneAndUpdate(params, newdatas, {upsert:true}, function(err, response){
                        if(err){console.log(err);return false;}
                        res.send(response);                    
                    });
                }
            }else{
                res.send({"success":true});
            }
    }).limit(1);
    
});
//POST request to save transaction data
router.post('/add',(req, res, next)=>{

    // console.log("trying to add transaction...");

    var reqStr = req.body;
    var count = 0;
    var msg = "";
    // console.log(reqStr);

    for (var query in reqStr) {

        
        let newTrans = new AtriumMxTransModel({
            trans_id: reqStr[query].trans_id,
            account_id: reqStr[query].account_id,
            customer_id: reqStr[query].customer_id,
            status: reqStr[query].status,
            description: reqStr[query].description,
            memo: reqStr[query].memo,
            posted_date: reqStr[query].posted_date,
            created_date: reqStr[query].created_date,
            normalized_payee_name: reqStr[query].normalized_payee_name,
            category: reqStr[query].category,
            amount: reqStr[query].amount,
            schedule_c: reqStr[query].schedule_c,
            user_id: reqStr[query].user_id
        });

        
    
        newTrans.save((err, trans)=>{
            if(err){
               msg += "Failed to add transaction"+err+"<br/>";
               console.log(msg);
            }
            else{
                count++;
                msg += "Transaction added successfully - "+ count+"<br/>";
                console.log(msg);
            }
        });

    }
    res.send(msg);
});

//Delete request to delete data
router.delete('/delete/:id',(req, res, next)=>{
    AtriumMxTransModel.remove({_id:req.params.id},function(err,result){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
});


//Receiving a GET request to fetch transactions based on duration to render the charts
router.get('/', (req, res, next)=>{
    // console.log("Fetching transaction data...");

    //Getting all the request parameters
    var query = {};
    if(req.query != null){
        query = req.query;
		
    }

    AtriumMxTransModel.find(query, function(err,trans){
        res.send(trans); 
        // console.log('Fetching transaction data done.');
    });
});



//Get Spending Chart Data weekly
router.get('/getspendingchartdataweekly', (req, res, next)=>{
   	
    var fromDate = moment().subtract(1, 'week').unix();
    var toDate = moment().unix(); 
	
    let wholeData = {};
	let dateArr = [];
	let dataArr = [];
	
    var customerId = '';
	
    if(req.query != null){        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id;
		}
		 
    }
	//console.log("customer id:" +customerId);
	var start = moment.unix(fromDate).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
    
	AtriumMxTransModel.aggregate([
		{ "$match": { $and :  [ 
								{ posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }},
								{'category': {$in: plaidSpendingCategories}},
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
					day: "$posted_date.day",
					month: "$posted_date.month",
					year: "$posted_date.year"
				},
				amount: { $sum: { $toDouble: "$amount" } }
			}
		},
		{
			$project: {
				_id: 0,
				amount: 1,
				day: "$_id.day",
				month: "$_id.month",
				year: "$_id.year"
			}
		},
		{ "$sort": { 'month': 1, 'day': 1 }}
	]).exec((err, transactionArr) => {
		
		let labels = [];
        let spendingAmounts = [];
		
		//Make date labels array 
		dateArr = [];
		indexArr = [];
		dataArr = [];
		
		var label =['<p>Su<br/>&nbsp;</p>','<p>M<br/>&nbsp;</p>','<p>T<br/>&nbsp;</p>','<p>W<br/>&nbsp;</p>','<p>Th<br/>&nbsp;</p>','<p>F<br/>&nbsp;</p>','<p>Sa<br/>&nbsp;</p>'];
		
		for(var i=0; i<transactionArr.length; i++){
			// console.log('Transaction#'+i+": "+JSON.stringify(transactionArr[i]));
			var dateIndex = 6+(moment([transactionArr[i].day+"."+transactionArr[i].month+"."+transactionArr[i].year],"DD.MM.YYYY").diff(moment(), 'days'));
			dataArr[dateIndex] = transactionArr[i].amount;
			// console.log("Date Index: "+dateIndex);
		}
		
		for(var i=6; i>=0; i--){
			var dateNum = [moment().subtract(i, 'day').format("d")];
			var dateStr = label[dateNum];
			dateArr[6-i] = dateStr;
			if(dataArr[6-i] == null){
				dataArr[6-i] = 0.00;
			}
			indexArr[6-i] = 6-i;
		}
		
		wholeData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
		wholeData.labels = dateArr;
		wholeData.data = dataArr;
		wholeData.index = indexArr;
		
		res.send(wholeData);
			
	});
        
});


//Get Spending Chart Data monthly
router.get('/getspendingchartdatamonthly', (req, res, next)=>{
   	
    var fromDate = moment().subtract(1, 'months').unix();
    var toDate = moment().unix(); 
	
    let wholeData = {};
	let dateArr = [];
	let dataArr = [];
	
    var customerId = '';
	
    if(req.query != null){        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id;
		}
		 
    }
	
	var start = moment.unix(fromDate).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
	
	AtriumMxTransModel.aggregate([
		{ "$match": { $and :  [ 
								{ posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }},
								{'category': {$in: plaidSpendingCategories}},
								{'customer_id': customerId} 
								] }  }
	]).exec((err, transactionArr) => {
		
		  if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
			let labels = [];
            let spendingAmounts = [];

            for(var i=1,j=5; i<=30; i=i+5,j--) {
                var curPreDate = moment().subtract(i, 'days');
                var curPostDate = moment().subtract((i+4), 'days');
                var tempLabel = curPostDate.format('DD').replace(/^0+/, '');//+"-"+curPreDate.format('DD');
                // var tempDay = tempLabel+"<br/>"+curPostDate.format('MMM');
				var tempDay = "<p style='text-align: center;'>"+tempLabel+"<br/>"+curPostDate.format('MMM')+"</p>";
                labels[j] = tempDay;

                // console.log("Array length:"+JSON.stringify(transactionArr));
                var tempSpendingAmt = 0;

                for(var a=0;a<transactionArr.length;a++){
                    var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).getTime();//setting the datetime time to 00:00:00

                // console.log('DbDateWithTime:'+new Date(parseInt(transactionArr[a].posted_date)));
                // console.log('DbDate:'+transactionDate);
                // console.log('curPreDate:'+curPreDate.startOf('day').unix()*1000);
                // console.log('curPostDate:'+curPostDate.startOf('day').unix()*1000);
                // console.log('Amount:'+transactionArr[a].amount);
                // console.log('Amount:'+transactionArr[a].category);
                    if(transactionDate < curPreDate.startOf('day').unix()*1000 && transactionDate >= curPostDate.startOf('day').unix()*1000){
                        tempSpendingAmt += parseFloat(transactionArr[a].amount);
                    }
                }
                
                
                spendingAmounts[j] = parseFloat(tempSpendingAmt.toFixed(2));
                // console.log('Total Amount:'+tempSpendingAmt+' on '+labels[j]);
            }
           
            wholeData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
			wholeData.labels = labels;
            wholeData.data = spendingAmounts;
			
            res.send(wholeData); 
            
        }
			
	});
        
});

//Get Spending Chart Data six monthly
router.get('/getspendingchartdatasixmonthly', (req, res, next)=>{
   	
    var fromDate = moment().subtract(6, 'months').unix();
    var toDate = moment().unix(); 
	
    let wholeData = {};
	let dateArr = [];
	let dataArr = [];
	
    var customerId = '';
	
    if(req.query != null){        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id;
		}
		 
    }
	
	var start = moment.unix(fromDate).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
	
	AtriumMxTransModel.aggregate([
		{ "$match": { $and :  [ 
								{ posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }},
								{'category': {$in: plaidSpendingCategories}},
								{'customer_id': customerId} 
								] }  }
	]).exec((err, transactionArr) => {
		
		 if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
            // console.log("Transaction array:"+transactionArr);
            
            let labels = [];
            let spendingAmounts = [];

            
            for(var i=0,j=5; i<=5; i++,j--) {
                var curPreDate = moment().subtract(i, 'months');
                var curPostDate = moment().subtract(i+1, 'months');
                var tempLabel = curPreDate.format('MMM');
                var tempDay = "<p>"+tempLabel+"<br/>&nbsp;</p>";
                labels[j] = tempDay;

                 //console.log("Array length:"+JSON.stringify(transactionArr.length));
                var tempSpendingAmt = 0;
                
                for(var a=0;a<transactionArr.length;a++){
                    var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).getTime();//setting the datetime time to 00:00:00

                    // console.log('DbDateWithTime:'+new Date(parseInt(transactionArr[a].posted_date)));
                    // console.log('DbDate:'+transactionDate);
                    // console.log('curPreDate:'+curPreDate.startOf('day').unix()*1000);
                    // console.log('curPostDate:'+curPostDate.startOf('day').unix()*1000);
                    // console.log('Amount:'+transactionArr[a].amount);
                    // console.log('Amount:'+transactionArr[a].category);
                    if(transactionDate < curPreDate.startOf('day').unix()*1000 && transactionDate >= curPostDate.startOf('day').unix()*1000){
                        // console.log('res:'+spendCat.indexOf(transactionArr[a].category) );
                        
                        if(plaidSpendingCategories.indexOf(transactionArr[a].category) > -1 ){
                        // console.log('Spending-'+transactionArr[a].category+' $'+transactionArr[a].amount+" on "+new Date(parseInt(transactionArr[a].posted_date)));
                            tempSpendingAmt += parseFloat(transactionArr[a].amount);
                        }
                    }
                }
                spendingAmounts[j] =  parseFloat(tempSpendingAmt.toFixed(2));
            }
           
            wholeData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
			wholeData.labels = labels;
            wholeData.data = spendingAmounts;
			
            res.send(wholeData);  
            
        }
			
	});
        
});
/*
//Get Savings Chart Data
router.get('/getsavingschartdata/:duration', (req, res, next)=>{
        
	
    var params = {};
	var groupParams = {};
	var projectQuery = {};
	var customerId = "";
	var duration = 1;
	let fromDate = moment().subtract(1, 'week').unix()*1000;
	
	if(req.params.duration != null){
		duration = req.params.duration;
	}
	
	if(duration==1){	//weekly
	
		fromDate = moment().subtract(1, 'week').startOf('day').unix()*1000;
		groupParams = { 
					ac_name: "$accounts.ac_name",
					day: "$new_posted_date.day",
					month: "$new_posted_date.month",
					year: "$new_posted_date.year"
		}
		projectQuery = {
				_id: 0,
				ac_name: "$_id.ac_name",
				amount: 1,
				date: { $concat: [ { $toString: "$_id.day" }, "/", { $toString: "$_id.month" }, "/", { $toString: "$_id.year" } ] }
		}
		
	}else if(duration==2){	//Monthly
	
		fromDate = moment().subtract(1, 'months').startOf('day').unix()*1000;
		groupParams = { 
					ac_name: "$accounts.ac_name",
					day: "$new_posted_date.day",
					month: "$new_posted_date.month",
					year: "$new_posted_date.year"
				  }
				  
		projectQuery = {
				_id: 0,
				ac_name: "$_id.ac_name",
				amount: 1,
				date: { $concat: [ { $toString: "$_id.day" }, "/", { $toString: "$_id.month" }, "/", { $toString: "$_id.year" } ] }
			}
		
	}else if(duration==3){	//6 Monthly
	
		fromDate = moment().subtract(6, 'months').startOf('day').unix()*1000;
		groupParams = { 
					ac_name: "$accounts.ac_name",
					month: "$new_posted_date.month",
					year: "$new_posted_date.year"
				  }
		projectQuery = {
				_id: 0,
				ac_name: "$_id.ac_name",
				amount: 1,
				date: { $concat: [ { $toString: "$_id.month" }, "/", { $toString: "$_id.year" } ] }
			}
		
	}
	
    let toDate = moment().endOf('day').unix()*1000;
	
    let savingData = {};

    if(req.query != null){
        
		if(req.query.customer_id!=null){
			params = { $and :  [ { posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }}, { customer_id: req.query.customer_id } ]};
		}else{
			params = { $and :  [ { posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }} ]};
		}
    }else{
		params = { $and :  [ { posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }} ]};
	}
	
	
	
	// console.log('Params:'+JSON.stringify(params));
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
		}
		,
		{
			$match : { $or:[{"accounts.ac_sub_type": "checking"},{"accounts.ac_sub_type": "savings"}]}
		},
		{
			$addFields: {
				new_posted_date: { $dateToParts: { date: { $toDate: { $toLong: "$posted_date" } } } }
			}
		},
		{
			$group: {
				_id: groupParams,
				amount: { $sum: { $toDouble: "$amount" } }
			}
		},
		{
			$project: projectQuery
		}
		,
		{
			$sort: {"ac_name": 1}
		}
	]).exec((err, accTransactions) => {
            if(err){
				res.send(err);
			}else{
				
				let savingData = {};
				let labels = [];
				let monthlyLabels = [];
				let lblTracer = [];
				let savingsAmounts = [];
				
				var start = moment.unix(fromDate/1000).format('D MMM');
				var end = moment.unix(toDate/1000).format('D MMM');
				savingData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
				
				// console.log("Date Range: "+start+"~"+end);
					
				if(duration==1){
					
					var label =['<p>Su<br/>&nbsp;</p>','<p>M<br/>&nbsp;</p>','<p>T<br/>&nbsp;</p>','<p>W<br/>&nbsp;</p>','<p>Th<br/>&nbsp;</p>','<p>F<br/>&nbsp;</p>','<p>Sa<br/>&nbsp;</p>'];
					
					for(var i=0,j=6; i<=6; i++,j--) {
						var curDate = moment().subtract(i, 'days');
						var tempDay = label[curDate.format('d')];
						labels[j] = tempDay;
						lblTracer[j] = label[curDate.format('d')];
						monthlyLabels[j] = curDate.unix();
						savingsAmounts[j]=0;
					}
					
					for(var a=0;a<accTransactions.length;a++){
						var dayLbl = label[moment(accTransactions[a].date,'D/M/YYYY').format('d')];
						
						var dayIndex = lblTracer.indexOf(dayLbl);
						
						savingsAmounts[dayIndex] += accTransactions[a].amount;
						savingsAmounts[dayIndex] = parseFloat(savingsAmounts[dayIndex].toFixed(2));
					}
					
					
					
					
				
				}else if(duration==2){
					
					for(var i=1,j=5; i<=30; i=i+5,j--) {
						var curPreDate = moment().subtract(i, 'days');
						var curPostDate = moment().subtract((i+4), 'days');
						var tempLabel = curPostDate.format('DD').replace(/^0+/, '');//+"-"+curPreDate.format('DD');
						var tempDay = "<p style='text-align: center;'>"+tempLabel+"<br/>"+curPostDate.format('MMM')+"</p>";
						
						labels[j] = tempDay;
						monthlyLabels[j] = curPostDate.startOf('day').unix() + "-" + curPreDate.endOf('day').unix();
						savingsAmounts[j] = 0;
						
						for(var a=0;a<accTransactions.length;a++){
							var transDate = moment(accTransactions[a].date,'D/M/YYYY').unix();
							// console.log("J: "+j);
							// console.log("TD:"+transDate+">="+curPreDate.unix()+" && "+ transDate+" < "+curPostDate.unix());
							if((transDate >= curPostDate.startOf('day').unix()) && (transDate < curPreDate.endOf('day').unix())){
								savingsAmounts[j] += accTransactions[a].amount;
								savingsAmounts[j] = parseFloat(savingsAmounts[j].toFixed(2));
							}
						}
					}
				}else if(duration==3){
					 for(var i=0,j=5; i<=5; i++,j--) {
						var curPreDate = moment().subtract(i, 'months');
						var curPostDate = moment().subtract(i+1, 'months');
						var tempLabel = curPreDate.format('MMM');
						var tempDay = tempLabel;
						labels[j] = "<p>"+tempDay+"<br/>&nbsp;</p>";;
						monthlyLabels[j] = curPostDate.startOf('day').unix() + "-" + curPreDate.endOf('day').unix();
						lblTracer[j] = curPreDate.format('M');
						savingsAmounts[j]=0;
					 }
					
					for(var a=0;a<accTransactions.length;a++){
						var monLbl = moment(accTransactions[a].date,'M/YYYY').format('M');
						
						var monIndex = lblTracer.indexOf(monLbl);
						
						savingsAmounts[monIndex] += accTransactions[a].amount;
						savingsAmounts[monIndex] = parseFloat(savingsAmounts[monIndex].toFixed(2));
					}
					
				}
				
				savingData.labels = labels;
				savingData.data = savingsAmounts;
				savingData.rawdata = accTransactions;
				savingData.monthly_labels = monthlyLabels;
				
				res.send(savingData);
				
			}
			
		
	});
});
*/
//Get Investing Chart Data weekly
router.get('/getinvestingchartdataweekly', (req, res, next)=>{
   	
    var fromDate = moment().subtract(1, 'week').unix();
    var toDate = moment().unix(); 
	
    let wholeData = {};
	let dateArr = [];
	let dataArr = [];
	
    var customerId = '';
	
    if(req.query != null){        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id;
		}
		 
    }
	
	var start = moment.unix(fromDate).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
    
	AtriumMxTransModel.aggregate([
		{ "$match": { $and :  [ 
								{ posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }},
								{'category': {$in: plaidInvestingCategories}},
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
					day: "$posted_date.day",
					month: "$posted_date.month",
					year: "$posted_date.year"
				},
				amount: { $sum: { $toDouble: "$amount" } }
			}
		},
		{
			$project: {
				_id: 0,
				amount: 1,
				day: "$_id.day",
				month: "$_id.month",
				year: "$_id.year"
			}
		},
		{ "$sort": { 'month': 1, 'day': 1 }}
	]).exec((err, transactionArr) => {
		
		let labels = [];
        let investingAmounts = [];
		
		//Make date labels array 
		dateArr = [];
		indexArr = [];
		dataArr = [];
		
		var label =['<p>Su<br/>&nbsp;</p>','<p>M<br/>&nbsp;</p>','<p>T<br/>&nbsp;</p>','<p>W<br/>&nbsp;</p>','<p>Th<br/>&nbsp;</p>','<p>F<br/>&nbsp;</p>','<p>Sa<br/>&nbsp;</p>'];
		
		for(var i=0; i<transactionArr.length; i++){
			// console.log('Transaction#'+i+": "+JSON.stringify(transactionArr[i]));
			var dateIndex = 6+(moment([transactionArr[i].day+"."+transactionArr[i].month+"."+transactionArr[i].year],"DD.MM.YYYY").diff(moment(), 'days'));
			dataArr[dateIndex] = transactionArr[i].amount;
			// console.log("Date Index: "+dateIndex);
		}
		
		for(var i=6; i>=0; i--){
			var dateNum = [moment().subtract(i, 'day').format("d")];
			var dateStr = label[dateNum];
			dateArr[6-i] = dateStr;
			if(dataArr[6-i] == null){
				dataArr[6-i] = 0.00;
			}
			indexArr[6-i] = 6-i;
		}
		
		wholeData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
		wholeData.labels = dateArr;
		wholeData.data = dataArr;
		wholeData.index = indexArr;
		
		res.send(wholeData);
			
	});
        
});


//Get Investing Chart Data monthly
router.get('/getinvestingchartdatamonthly', (req, res, next)=>{
   	
    var fromDate = moment().subtract(1, 'months').unix();
    var toDate = moment().unix(); 
	
    let wholeData = {};
	let dateArr = [];
	let dataArr = [];
	
    var customerId = '';
	
    if(req.query != null){        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id;
		}
		 
    }
	
	var start = moment.unix(fromDate).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
	
	AtriumMxTransModel.aggregate([
		{ "$match": { $and :  [ 
								{ posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }},
								{'category': {$in: plaidInvestingCategories}},
								{'customer_id': customerId} 
								] }  }
	]).exec((err, transactionArr) => {
		
		  if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
			let labels = [];
            let investingAmounts = [];

            for(var i=1,j=5; i<=30; i=i+5,j--) {
                var curPreDate = moment().subtract(i, 'days');
                var curPostDate = moment().subtract((i+4), 'days');
                var tempLabel = curPostDate.format('DD').replace(/^0+/, '');//+"-"+curPreDate.format('DD');
                // var tempDay = tempLabel+"<br/>"+curPostDate.format('MMM');
				var tempDay = "<p style='text-align: center;'>"+tempLabel+"<br/>"+curPostDate.format('MMM')+"</p>";
                labels[j] = tempDay;

                // console.log("Array length:"+JSON.stringify(transactionArr));
                var tempInvestingAmt = 0;

                for(var a=0;a<transactionArr.length;a++){
                    var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).getTime();//setting the datetime time to 00:00:00

                // console.log('DbDateWithTime:'+new Date(parseInt(transactionArr[a].posted_date)));
                // console.log('DbDate:'+transactionDate);
                // console.log('curPreDate:'+curPreDate.startOf('day').unix()*1000);
                // console.log('curPostDate:'+curPostDate.startOf('day').unix()*1000);
                // console.log('Amount:'+transactionArr[a].amount);
                // console.log('Amount:'+transactionArr[a].category);
                    if(transactionDate < curPreDate.startOf('day').unix()*1000 && transactionDate >= curPostDate.startOf('day').unix()*1000){
                        tempInvestingAmt += parseFloat(transactionArr[a].amount);
                    }
                }
                
                
                investingAmounts[j] = parseFloat(tempInvestingAmt.toFixed(2));
                // console.log('Total Amount:'+tempInvestingAmt+' on '+labels[j]);
            }
           
            wholeData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
			wholeData.labels = labels;
            wholeData.data = investingAmounts;
			
            res.send(wholeData); 
            
        }
			
	});
        
});

//Get Investing Chart Data six monthly
router.get('/getinvestingchartdatasixmonthly', (req, res, next)=>{
   	
    var fromDate = moment().subtract(6, 'months').unix();
    var toDate = moment().unix(); 
	
    let wholeData = {};
	let dateArr = [];
	let dataArr = [];
	
    var customerId = '';
	
    if(req.query != null){        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id;
		}
		 
    }
	
	var start = moment.unix(fromDate).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
	
	AtriumMxTransModel.aggregate([
		{ "$match": { $and :  [ 
								{ posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }},
								{'category': {$in: plaidInvestingCategories}},
								{'customer_id': customerId} 
								] }  }
	]).exec((err, transactionArr) => {
		
		 if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
            // console.log("Transaction array:"+transactionArr);
            
            let labels = [];
            let investingAmounts = [];

            
            for(var i=0,j=5; i<=5; i++,j--) {
                var curPreDate = moment().subtract(i, 'months');
                var curPostDate = moment().subtract(i+1, 'months');
                var tempLabel = curPreDate.format('MMM');
                var tempDay = "<p>"+tempLabel+"<br/>&nbsp;</p>";
                labels[j] = tempDay;

                 //console.log("Array length:"+JSON.stringify(transactionArr.length));
                var tempInvestingAmt = 0;
                
                for(var a=0;a<transactionArr.length;a++){
                    var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).getTime();//setting the datetime time to 00:00:00

                    // console.log('DbDateWithTime:'+new Date(parseInt(transactionArr[a].posted_date)));
                    // console.log('DbDate:'+transactionDate);
                    // console.log('curPreDate:'+curPreDate.startOf('day').unix()*1000);
                    // console.log('curPostDate:'+curPostDate.startOf('day').unix()*1000);
                    // console.log('Amount:'+transactionArr[a].amount);
                    // console.log('Amount:'+transactionArr[a].category);
                    if(transactionDate < curPreDate.startOf('day').unix()*1000 && transactionDate >= curPostDate.startOf('day').unix()*1000){
                        // console.log('res:'+spendCat.indexOf(transactionArr[a].category) );
                        
                        if(plaidInvestingCategories.indexOf(transactionArr[a].category) > -1 ){
                        // console.log('Investing-'+transactionArr[a].category+' $'+transactionArr[a].amount+" on "+new Date(parseInt(transactionArr[a].posted_date)));
                            tempInvestingAmt += parseFloat(transactionArr[a].amount);
                        }
                    }
                }
                investingAmounts[j] =  parseFloat(tempInvestingAmt.toFixed(2));
            }
           
            wholeData.date_range = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
			wholeData.labels = labels;
            wholeData.data = investingAmounts;
			
            res.send(wholeData);  
            
        }
			
	});
        
});


//Receiving a GET request to fetch all weekly spending line chart data
router.get('/getweeklyspending', (req, res, next)=>{
    //console.log("Fetching spending data...");

    //Getting all the request parameters
    var params = {};
    var fromLast7Date = moment().subtract(7, 'days').unix();
    var fromLast1MonthDate = moment().subtract(1, 'months').unix();
    var fromLast6MonthDate = moment().subtract(6, 'months').unix();
    var toDate = moment().unix(); 
    
    let spendingData = {};

    // var spendingCategory = ['ATM Fee','Advertising','Air Travel','Alcohol & Bars','Allowance','Amusement','Arts','Auto & Transport','Auto Insurance','Auto Payment','Baby Supplies','Babysitter & Daycare','Bank Fee','Bills & Utilities','Books','Books & Supplies','Business Services','Buy','Charity','Check','Child Support','Clothing','Coffee Shops','Dentist','Doctor','Education','Electronics & Software','Entertainment','Eyecare','Fast Food','Federal Tax','Fees & Charges','Financial','Financial Advisor','Food & Dining','Furnishings','Gas & Fuel','Gift','Gifts & Donations','Groceries','Gym','Hair','Health & Fitness','Health Insurance','Hobbies','Home','Home Improvement','Home Insurance','Home Phone','Home Services','Home Supplies','Hotel','Internet','Investments','Kids','Kids Activities','Laundry','Lawn & Garden','Legal','Life Insurance','Loan Fees and Charges','Loan Insurance','Loan Interest','Loan Payment','Loan Principal','Loans','Local Tax','Mobile Phone','Mortgage & Rent','Movies & DVDs','Music','Newspapers & Magazines','Office Supplies','Parking','Personal Care','Pet Food & Supplies','Pet Grooming','Pets','Pharmacy','Printing','Property Tax','Public Transportation','Rental Car & Taxi','Restaurants','Sales Tax','Service & Parts','Shipping','Shopping','Spa & Massage','Sporting Goods','Sports','State Tax','Student Loan','Taxes','Television','Toys','Trade Commissions','Travel','Tuition','Uncategorized','Utilities','Vacation','Veterinary'];
    
    params = {"posted_date":{'$gte':fromLast7Date, '$lt':toDate}};
    
    var start = moment.unix(fromLast7Date).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
    spendingData['date_range'] = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
    
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.account_id!=null){
			params.account_id = req.query.account_id;
		}
		
		//console.log(params);
    }
    AtriumMxTransModel.find(params, function(err,transactionArr){
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
            // console.log("Transaction array:"+transactionArr);
            
            let labels = [];
            let spendingAmounts = [];

            for(var i=1,j=6; i<=7; i++,j--) {
                var curDate = moment().subtract(i, 'days');
                var label =['Su','M','T','W','Th','F','Sa'];
                // var tempDay = ['',label[curDate.format('d')],curDate.format('M/D')];
                var tempDay = ['',label[curDate.format('d')],''];
                labels[j] = tempDay;

                // console.log("Array length:"+JSON.stringify(transactionArr));
                var tempSpendingAmt = 0;

                for(var a=0;a<transactionArr.length;a++){
                    var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).setHours(0,0,0,0);//setting the datetime time to 00:00:00
                    var tempDate = curDate.startOf('day').unix()*1000;
                    // console.log('DbDateWithTime:'+new Date(parseInt(transactionArr[a].posted_date)));
                    // console.log('DbDate:'+transactionDate);
                    // console.log('TempDate:'+tempDate);
                    // console.log('Amount:'+transactionArr[a].amount);
                    // console.log('Amount:'+transactionArr[a].category);
                    if(transactionDate==tempDate){
                        // console.log('res:'+spendCat.indexOf(transactionArr[a].category) );
                        
                        if(plaidSpendingCategories.indexOf(transactionArr[a].category) > -1 ){
                        // console.log('Spending-'+transactionArr[a].category+' $'+transactionArr[a].amount+" on "+new Date(parseInt(transactionArr[a].posted_date)));
                        tempSpendingAmt += parseFloat(transactionArr[a].amount);
                        }
                    }
                }
                spendingAmounts[j] = tempSpendingAmt.toFixed(2);
                // console.log('Total Amount:'+tempAmt+' on '+labels[j]);
            }
           
            spendingData['labels'] = labels;
            spendingData['amounts'] = spendingAmounts;
            res.send(spendingData); 
            // console.log(spendingData);
        }
    });
    
});


//Receiving a GET request to fetch monthly spending line chart data
router.get('/getmonthlyspending', (req, res, next)=>{
    //console.log("Fetching spending data...");

    //Getting all the request parameters
    var params = {};
    
    var fromLast1MonthDate = moment().subtract(1, 'months').unix();
   
    var toDate = moment().unix(); 
    
    let spendingData = {};

    // var spendingCategory = ['ATM Fee','Advertising','Air Travel','Alcohol & Bars','Allowance','Amusement','Arts','Auto & Transport','Auto Insurance','Auto Payment','Baby Supplies','Babysitter & Daycare','Bank Fee','Bills & Utilities','Books','Books & Supplies','Business Services','Buy','Charity','Check','Child Support','Clothing','Coffee Shops','Dentist','Doctor','Education','Electronics & Software','Entertainment','Eyecare','Fast Food','Federal Tax','Fees & Charges','Financial','Financial Advisor','Food & Dining','Furnishings','Gas & Fuel','Gift','Gifts & Donations','Groceries','Gym','Hair','Health & Fitness','Health Insurance','Hobbies','Home','Home Improvement','Home Insurance','Home Phone','Home Services','Home Supplies','Hotel','Internet','Investments','Kids','Kids Activities','Laundry','Lawn & Garden','Legal','Life Insurance','Loan Fees and Charges','Loan Insurance','Loan Interest','Loan Payment','Loan Principal','Loans','Local Tax','Mobile Phone','Mortgage & Rent','Movies & DVDs','Music','Newspapers & Magazines','Office Supplies','Parking','Personal Care','Pet Food & Supplies','Pet Grooming','Pets','Pharmacy','Printing','Property Tax','Public Transportation','Rental Car & Taxi','Restaurants','Sales Tax','Service & Parts','Shipping','Shopping','Spa & Massage','Sporting Goods','Sports','State Tax','Student Loan','Taxes','Television','Toys','Trade Commissions','Travel','Tuition','Uncategorized','Utilities','Vacation','Veterinary'];
    
    
    params = {"posted_date":{'$gte':fromLast1MonthDate, '$lt':toDate}}; 
    
    var start = moment.unix(fromLast1MonthDate).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
    spendingData['date_range'] = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
    
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.account_id!=null){
			params.account_id = req.query.account_id;
		}
		
		//console.log(params);
    }
    AtriumMxTransModel.find(params, function(err,transactionArr){
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
            // console.log("Transaction array:"+transactionArr);
            
            let labels = [];
            let spendingAmounts = [];

            
            for(var i=1,j=5; i<=30; i=i+5,j--) {
                var curPreDate = moment().subtract(i, 'days');
                var curPostDate = moment().subtract((i+4), 'days');
                var tempLabel = curPostDate.format('DD').replace(/^0+/, '');//+"-"+curPreDate.format('DD');
                var tempDay = ['',tempLabel,curPostDate.format('MMM')];
                labels[j] = tempDay;

                // console.log("Array length:"+JSON.stringify(transactionArr));
                var tempSpendingAmt = 0;

                for(var a=0;a<transactionArr.length;a++){
                    var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).getTime();//setting the datetime time to 00:00:00

                // console.log('DbDateWithTime:'+new Date(parseInt(transactionArr[a].posted_date)));
                // console.log('DbDate:'+transactionDate);
                // console.log('curPreDate:'+curPreDate.startOf('day').unix()*1000);
                // console.log('curPostDate:'+curPostDate.startOf('day').unix()*1000);
                // console.log('Amount:'+transactionArr[a].amount);
                // console.log('Amount:'+transactionArr[a].category);
                    if(transactionDate < curPreDate.startOf('day').unix()*1000 && transactionDate >= curPostDate.startOf('day').unix()*1000){
                        // console.log('res:'+spendCat.indexOf(transactionArr[a].category) );
                        
                        if(plaidSpendingCategories.indexOf(transactionArr[a].category) > -1 ){
                        // console.log('Spending-'+transactionArr[a].category+' $'+transactionArr[a].amount+" on "+new Date(parseInt(transactionArr[a].posted_date)));
                        tempSpendingAmt += parseFloat(transactionArr[a].amount);
                        }
                    }
                }
                
                
                spendingAmounts[j] = tempSpendingAmt.toFixed(2);
                // console.log('Total Amount:'+tempSpendingAmt+' on '+labels[j]);
            }
           
            spendingData['labels'] = labels;
            spendingData['amounts'] = spendingAmounts;
            res.send(spendingData); 
            
        }
    });
    
});

//Receiving a GET request to fetch 6 months spending line chart data
router.get('/get6monthsspending', (req, res, next)=>{
    //console.log("Fetching spending data...");

    //Getting all the request parameters
    var params = {};
    
    var fromLast6MonthDate = moment().subtract(6, 'months').unix();
    var toDate = moment().unix(); 
    
    let spendingData = {};

    // var spendingCategory = ['ATM Fee','Advertising','Air Travel','Alcohol & Bars','Allowance','Amusement','Arts','Auto & Transport','Auto Insurance','Auto Payment','Baby Supplies','Babysitter & Daycare','Bank Fee','Bills & Utilities','Books','Books & Supplies','Business Services','Buy','Charity','Check','Child Support','Clothing','Coffee Shops','Dentist','Doctor','Education','Electronics & Software','Entertainment','Eyecare','Fast Food','Federal Tax','Fees & Charges','Financial','Financial Advisor','Food & Dining','Furnishings','Gas & Fuel','Gift','Gifts & Donations','Groceries','Gym','Hair','Health & Fitness','Health Insurance','Hobbies','Home','Home Improvement','Home Insurance','Home Phone','Home Services','Home Supplies','Hotel','Internet','Investments','Kids','Kids Activities','Laundry','Lawn & Garden','Legal','Life Insurance','Loan Fees and Charges','Loan Insurance','Loan Interest','Loan Payment','Loan Principal','Loans','Local Tax','Mobile Phone','Mortgage & Rent','Movies & DVDs','Music','Newspapers & Magazines','Office Supplies','Parking','Personal Care','Pet Food & Supplies','Pet Grooming','Pets','Pharmacy','Printing','Property Tax','Public Transportation','Rental Car & Taxi','Restaurants','Sales Tax','Service & Parts','Shipping','Shopping','Spa & Massage','Sporting Goods','Sports','State Tax','Student Loan','Taxes','Television','Toys','Trade Commissions','Travel','Tuition','Uncategorized','Utilities','Vacation','Veterinary'];   
    
    
    params = {"posted_date":{'$gte':fromLast6MonthDate, '$lt':toDate}}; 
    
    var start = moment.unix(fromLast6MonthDate).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
    spendingData['date_range'] = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
    
    if(req.query != null){        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.account_id!=null){
			params.account_id = req.query.account_id;
		}
		
		//console.log(params);
    }
    AtriumMxTransModel.find(params, function(err,transactionArr){
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
            // console.log("Transaction array:"+transactionArr);
            
            let labels = [];
            let spendingAmounts = [];

            
            for(var i=0,j=5; i<=5; i++,j--) {
                var curPreDate = moment().subtract(i, 'months');
                var curPostDate = moment().subtract(i+1, 'months');
                var tempLabel = curPreDate.format('MMM');
                var tempDay = ['', tempLabel, ''];
                labels[j] = tempDay;

                 //console.log("Array length:"+JSON.stringify(transactionArr.length));
                var tempSpendingAmt = 0;
                
                for(var a=0;a<transactionArr.length;a++){
                    var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).getTime();//setting the datetime time to 00:00:00

                    // console.log('DbDateWithTime:'+new Date(parseInt(transactionArr[a].posted_date)));
                    // console.log('DbDate:'+transactionDate);
                    // console.log('curPreDate:'+curPreDate.startOf('day').unix()*1000);
                    // console.log('curPostDate:'+curPostDate.startOf('day').unix()*1000);
                    // console.log('Amount:'+transactionArr[a].amount);
                    // console.log('Amount:'+transactionArr[a].category);
                    if(transactionDate < curPreDate.startOf('day').unix()*1000 && transactionDate >= curPostDate.startOf('day').unix()*1000){
                        // console.log('res:'+spendCat.indexOf(transactionArr[a].category) );
                        
                        if(plaidSpendingCategories.indexOf(transactionArr[a].category) > -1 ){
                        // console.log('Spending-'+transactionArr[a].category+' $'+transactionArr[a].amount+" on "+new Date(parseInt(transactionArr[a].posted_date)));
                            tempSpendingAmt += parseFloat(transactionArr[a].amount);
                        }
                    }
                }
                spendingAmounts[j] = tempSpendingAmt.toFixed(2);
            }
           
            spendingData['labels'] = labels;
            spendingData['amounts'] = spendingAmounts;
           res.send(spendingData); 
            
        }
    });
    
});


//Receiving a GET request to fetch savings account data
router.get('/getsavings/:duration', (req, res, next)=>{
	
    var params = {};
	var groupParams = {};
	var projectQuery = {};
	var customerId = "";
	var duration = 1;
	let fromDate = moment().subtract(1, 'months').unix()*1000;
	
	if(req.params.duration != null){
		duration = req.params.duration;
	}
	
	if(duration==1){	//weekly
	
		fromDate = moment().subtract(7, 'days').startOf('day').unix()*1000;
		groupParams = { 
					ac_name: "$accounts.ac_name",
					day: "$new_posted_date.day",
					month: "$new_posted_date.month",
					year: "$new_posted_date.year"
				  }
		projectQuery = {
				_id: 0,
				ac_name: "$_id.ac_name",
				amount: 1,
				date: { $concat: [ { $toString: "$_id.day" }, "/", { $toString: "$_id.month" }, "/", { $toString: "$_id.year" } ] }
			}
		
	}else if(duration==2){	//Monthly
	
		fromDate = moment().subtract(1, 'months').startOf('day').unix()*1000;
		groupParams = { 
					ac_name: "$accounts.ac_name",
					day: "$new_posted_date.day",
					month: "$new_posted_date.month",
					year: "$new_posted_date.year"
				  }
				  
		projectQuery = {
				_id: 0,
				ac_name: "$_id.ac_name",
				amount: 1,
				date: { $concat: [ { $toString: "$_id.day" }, "/", { $toString: "$_id.month" }, "/", { $toString: "$_id.year" } ] }
			}
		
	}else if(duration==3){	//6 Monthly
	
		fromDate = moment().subtract(6, 'months').startOf('day').unix()*1000;
		groupParams = { 
					ac_name: "$accounts.ac_name",
					month: "$new_posted_date.month",
					year: "$new_posted_date.year"
				  }
		projectQuery = {
				_id: 0,
				ac_name: "$_id.ac_name",
				amount: 1,
				date: { $concat: [ { $toString: "$_id.month" }, "/", { $toString: "$_id.year" } ] }
			}
		
	}
	
    let toDate = moment().endOf('day').unix()*1000;
	
	
    
    let savingData = {};

    if(req.query != null){
        
		if(req.query.customer_id!=null){
			// params.customer_id = req.query.customer_id;
			// customerId = req.query.customer_id;
			params = { $and :  [ { posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }}, { customer_id: req.query.customer_id } ]};
		}else{
			params = { $and :  [ { posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }} ]};
		}
    }else{
		params = { $and :  [ { posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }} ]};
	}
	
	
	
	// console.log('Params:'+JSON.stringify(params));
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
		,
		{
			$match : { $or:[{"accounts.ac_sub_type": "checking"},{"accounts.ac_sub_type": "savings"}]}
		},
		{
			$addFields: {
				new_posted_date: { $dateToParts: { date: { $toDate: { $toLong: "$posted_date" } } } }
			}
		},
		{
			$group: {
				_id: groupParams,
				amount: { $sum: { $toDouble: "$amount" } }
			}
		},
		{
			$project: projectQuery
		}
		,
		{
			$sort: {"ac_name": 1}
		}
	]).exec((err, accTransactions) => {
            if(err){
				res.send(err);
			}else{
				
				let savingData = {};
				let labels = [];
				let monthlyLabels = [];
				let lblTracer = [];
				let savingsAmounts = [];
				
				var start = moment.unix(fromDate/1000).format('D MMM');
				var end = moment.unix(toDate/1000).format('D MMM');
				savingData['date_range'] = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
				
				// console.log("Date Range: "+start+"~"+end);
					
				if(duration==1){
					
					var label =['Su','M','T','W','Th','F','Sa'];
					
					for(var i=1,j=6; i<=7; i++,j--) {
						var curDate = moment().subtract(i, 'days');
						var tempDay = ['',label[curDate.format('d')],''];
						labels[j] = tempDay;
						lblTracer[j] = label[curDate.format('d')];
						monthlyLabels[j] = curDate.unix();
						savingsAmounts[j]=0;
					}
					
					for(var a=0;a<accTransactions.length;a++){
						var dayLbl = label[moment(accTransactions[a].date,'D/M/YYYY').format('d')];
						
						var dayIndex = lblTracer.indexOf(dayLbl);
						
						savingsAmounts[dayIndex] += accTransactions[a].amount;
						savingsAmounts[dayIndex] = parseFloat(savingsAmounts[dayIndex].toFixed(2));
					}
					
					
					
					
				
				}else if(duration==2){
					
					for(var i=1,j=5; i<=30; i=i+5,j--) {
						var curPreDate = moment().subtract(i, 'days');
						var curPostDate = moment().subtract((i+4), 'days');
						var tempLabel = curPostDate.format('DD').replace(/^0+/, '');//+"-"+curPreDate.format('DD');
						var tempDay = ['',tempLabel,curPostDate.format('MMM')];
						
						labels[j] = tempDay;
						monthlyLabels[j] = curPostDate.startOf('day').unix() + "-" + curPreDate.endOf('day').unix();
						savingsAmounts[j] = 0;
						
						for(var a=0;a<accTransactions.length;a++){
							var transDate = moment(accTransactions[a].date,'D/M/YYYY').unix();
							// console.log("J: "+j);
							// console.log("TD:"+transDate+">="+curPreDate.unix()+" && "+ transDate+" < "+curPostDate.unix());
							if((transDate >= curPostDate.startOf('day').unix()) && (transDate < curPreDate.endOf('day').unix())){
								savingsAmounts[j] += accTransactions[a].amount;
								savingsAmounts[j] = parseFloat(savingsAmounts[j].toFixed(2));
							}
						}
					}
				}else if(duration==3){
					 for(var i=0,j=5; i<=5; i++,j--) {
						var curPreDate = moment().subtract(i, 'months');
						var curPostDate = moment().subtract(i+1, 'months');
						var tempLabel = curPreDate.format('MMM');
						var tempDay = ['',tempLabel,''];
						labels[j] = tempDay;
						monthlyLabels[j] = curPostDate.startOf('day').unix() + "-" + curPreDate.endOf('day').unix();
						lblTracer[j] = curPreDate.format('M');
						savingsAmounts[j]=0;
					 }
					
					for(var a=0;a<accTransactions.length;a++){
						var monLbl = moment(accTransactions[a].date,'M/YYYY').format('M');
						
						var monIndex = lblTracer.indexOf(monLbl);
						
						savingsAmounts[monIndex] += accTransactions[a].amount;
						savingsAmounts[monIndex] = parseFloat(savingsAmounts[monIndex].toFixed(2));
					}
					
				}
				
				savingData['labels'] = labels;
				savingData['amounts'] = savingsAmounts;
				savingData['rawdata'] = accTransactions;
				savingData['monthly_labels'] = monthlyLabels;
				
				res.send(savingData);
				
			}
			
		
	});
	
});

//Receiving a GET request to fetch all weekly spending line chart data
router.get('/getweeklyinvesting', (req, res, next)=>{
    //console.log("Fetching investing data...");

    //Getting all the request parameters
    var params = {};
    var fromLast7Date = moment().subtract(7, 'days').unix();
    var fromLast1MonthDate = moment().subtract(1, 'months').unix();
    var fromLast6MonthDate = moment().subtract(6, 'months').unix();
    var toDate = moment().unix(); 
    
    let investingData = {};
    
    // var investingCategory = ['Buy','Deposit','Dividend & Cap Gains','Sell','Withdrawal'];
    
    params = {"posted_date":{'$gte':fromLast7Date, '$lt':toDate}};  
    
    var start = moment.unix(fromLast7Date).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
    investingData['date_range'] = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
    
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.account_id!=null){
			params.account_id = req.query.account_id;
		}
		
		//console.log(params);
    }
    AtriumMxTransModel.find(params, function(err,transactionArr){
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
            // console.log("Transaction array:"+transactionArr);
            
            let labels = [];
            let investingAmounts = [];

            for(var i=1,j=6; i<=7; i++,j--) {
                var curDate = moment().subtract(i, 'days');
                var label =['Su','M','T','W','Th','F','Sa'];
                // var tempDay = ['',label[curDate.format('d')],curDate.format('M/D')];
				var tempDay = ['',label[curDate.format('d')],''];
                labels[j] = tempDay;

                // console.log("Array length:"+JSON.stringify(transactionArr));
                var tempInvestingAmt = 0;

                for(var a=0;a<transactionArr.length;a++){
                    var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).setHours(0,0,0,0);//setting the datetime time to 00:00:00
                    var tempDate = curDate.startOf('day').unix()*1000;
                    // console.log('DbDateWithTime:'+new Date(parseInt(transactionArr[a].posted_date)));
                    // console.log('DbDate:'+transactionDate);
                    // console.log('TempDate:'+tempDate);
                    // console.log('Amount:'+transactionArr[a].amount);
                    // console.log('Amount:'+transactionArr[a].category);
                    if(transactionDate==tempDate){
                        // console.log('res:'+spendCat.indexOf(transactionArr[a].category) );
                        
                        if(investingCategory.indexOf(transactionArr[a].category) > -1 ){
                        // console.log('Spending-'+transactionArr[a].category+' $'+transactionArr[a].amount+" on "+new Date(parseInt(transactionArr[a].posted_date)));
                            tempInvestingAmt += parseFloat(transactionArr[a].amount);
                        }
                    }
                }
                investingAmounts[j] = tempInvestingAmt.toFixed(2);
                // console.log('Total Amount:'+tempAmt+' on '+labels[j]);
            }
           
            investingData['labels'] = labels;
            investingData['amounts'] = investingAmounts;
           res.send(investingData); 
            
        }
    });
    
});


//Receiving a GET request to fetch monthly spending line chart data
router.get('/getmonthlyinvesting', (req, res, next)=>{
    //console.log("Fetching spending data...");

    //Getting all the request parameters
    var params = {};
    
    var fromLast1MonthDate = moment().subtract(1, 'months').unix();
   
    var toDate = moment().unix(); 
    
    let investingData = {};

    // var investingCategory = ['Buy','Deposit','Dividend & Cap Gains','Sell','Withdrawal'];
    
    
    params = {"posted_date":{'$gte':fromLast1MonthDate, '$lt':toDate}};    
    
    var start = moment.unix(fromLast1MonthDate).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
    investingData['date_range'] = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.account_id!=null){
			params.account_id = req.query.account_id;
		}
		
		//console.log(params);
    }
    AtriumMxTransModel.find(params, function(err,transactionArr){
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
            // console.log("Transaction array:"+transactionArr);
            
            let labels = [];
            let investingAmounts = [];

            
            for(var i=1,j=5; i<=30; i=i+5,j--) {
                var curPreDate = moment().subtract(i, 'days');
                var curPostDate = moment().subtract((i+4), 'days');
                var tempLabel = curPostDate.format('DD').replace(/^0+/, '');//+"-"+curPreDate.format('DD');
                var tempDay = ['',tempLabel,curPostDate.format('MMM')];
                labels[j] = tempDay;

                // console.log("Array length:"+JSON.stringify(transactionArr));
                var tempInvestingAmt = 0;

                for(var a=0;a<transactionArr.length;a++){
                    var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).getTime();//setting the datetime time to 00:00:00

                // console.log('DbDateWithTime:'+new Date(parseInt(transactionArr[a].posted_date)));
                // console.log('DbDate:'+transactionDate);
                // console.log('curPreDate:'+curPreDate.startOf('day').unix()*1000);
                // console.log('curPostDate:'+curPostDate.startOf('day').unix()*1000);
                // console.log('Amount:'+transactionArr[a].amount);
                // console.log('Amount:'+transactionArr[a].category);
                    if(transactionDate < curPreDate.startOf('day').unix()*1000 && transactionDate >= curPostDate.startOf('day').unix()*1000){
                        // console.log('res:'+spendCat.indexOf(transactionArr[a].category) );
                        
                        if(investingCategory.indexOf(transactionArr[a].category) > -1 ){
                        // console.log('Spending-'+transactionArr[a].category+' $'+transactionArr[a].amount+" on "+new Date(parseInt(transactionArr[a].posted_date)));
                        tempInvestingAmt += parseFloat(transactionArr[a].amount);
                        }
                    }
                }
                
                
                investingAmounts[j] = tempInvestingAmt.toFixed(2);
                // console.log('Total Amount:'+tempSpendingAmt+' on '+labels[j]);
            }
           
            investingData['labels'] = labels;
            investingData['amounts'] = investingAmounts;
            res.send(investingData); 
            
        }
    });
    
});

//Receiving a GET request to fetch 6 months spending line chart data
router.get('/get6monthsinvesting', (req, res, next)=>{
    //console.log("Fetching spending data...");

    //Getting all the request parameters
    var params = {};
    
    var fromLast6MonthDate = moment().subtract(6, 'months').unix();
    var toDate = moment().unix(); 
    
    let investingData = {};

    // var investingCategory = ['Buy','Deposit','Dividend & Cap Gains','Sell','Withdrawal'];
    
    params = {"posted_date":{'$gte':fromLast6MonthDate, '$lt':toDate}}; 
    
    var start = moment.unix(fromLast6MonthDate).format('D MMM');
    var end = moment.unix(toDate).format('D MMM');
    investingData['date_range'] = start.replace(/^0+/, '')+"-"+end.replace(/^0+/, '');
    
    if(req.query != null){        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.account_id!=null){
			params.account_id = req.query.account_id;
		}
		
		//console.log(params);
    }
    AtriumMxTransModel.find(params, function(err,transactionArr){
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{            
            
            // console.log("Transaction array:"+transactionArr);
            
            let labels = [];
            let investingAmounts = [];

            
            for(var i=0,j=5; i<=5; i++,j--) {
                var curPreDate = moment().subtract(i, 'months');
                var curPostDate = moment().subtract(i+1, 'months');
                var tempLabel = curPreDate.format('MMM');
                var tempDay = ['',tempLabel,''];
                labels[j] = tempDay;

                //console.log("Array length:"+JSON.stringify(transactionArr.length));
                var tempInvestingAmt = 0;
                
                for(var a=0;a<transactionArr.length;a++){
                    var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).getTime();//setting the datetime time to 00:00:00

                    // console.log('DbDateWithTime:'+new Date(parseInt(transactionArr[a].posted_date)));
                    // console.log('DbDate:'+transactionDate);
                    // console.log('curPreDate:'+curPreDate.startOf('day').unix()*1000);
                    // console.log('curPostDate:'+curPostDate.startOf('day').unix()*1000);
                    // console.log('Amount:'+transactionArr[a].amount);
                    // console.log('Amount:'+transactionArr[a].category);
                    if(transactionDate < curPreDate.startOf('day').unix()*1000 && transactionDate >= curPostDate.startOf('day').unix()*1000){
                        // console.log('res:'+spendCat.indexOf(transactionArr[a].category) );
                        
                        if(investingCategory.indexOf(transactionArr[a].category) > -1 ){
                        // console.log('Spending-'+transactionArr[a].category+' $'+transactionArr[a].amount+" on "+new Date(parseInt(transactionArr[a].posted_date)));
                            tempInvestingAmt += parseFloat(transactionArr[a].amount);
                        }
                    }
                }
                investingAmounts[j] = tempInvestingAmt.toFixed(2);
            }
           
            investingData['labels'] = labels;
            investingData['amounts'] = investingAmounts;
           res.send(investingData); 
            
        }
    });
    
});

//Receiving a GET request to fetch recent transactions
router.get('/getrecenttransactions', (req, res, next)=>{
	var params = {};
    params.$and = [];
	if(req.query != null){        
		if(req.query.customer_id!=null){
			params.$and.push({'customer_id':(req.query.customer_id+'')});
		}
    }
	
	AtriumMxTransModel.aggregate([
		{
			$match:params

		},
        {
            $sort:{"posted_date":-1}
        },
        {
            $limit: 100
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
			var transTime = "";
			var transDate = '';
			var transMonth = '';
			var payeeName = "";
			var category = "";
			var arrElement = "";
			var amount = "";
			var amountInt = "";
			var amountDec = "";
			var transYear = "";
			var type = "";
			var spendingcategory = '';
			var recentTransData = [];
			
			// console.log("tA:"+JSON.stringify(transactionArr));
			//var transArr = Object.values(transactionArr);
			var counter = 0;
			for(var a=0;a<transactionArr.length;a++){
                if(transactionArr[a].accounts.length > 0){
                    if(counter < 7){
                        transTimestamp = parseInt(transactionArr[a].posted_date);
                        transTime = moment(transTimestamp).format("hh:mm A");
                        transDate = moment(transTimestamp).format("D");
                        transMonth = moment(transTimestamp).format("MMM");
                        transYear = moment(transTimestamp).format("YYYY");
                        payeeName = transactionArr[a].normalized_payee_name;
                        //category = getCatName(transactionArr[a].category);
                        type = transactionArr[a].type;
                        amount = transactionArr[a].amount;
                        accounts = transactionArr[a].accounts;
                        //console.log(JSON.stringify(transactionArr[a].accounts));
                        amountInt = transactionArr[a].amount.split(".")[0];
                        amountDec = transactionArr[a].amount.split(".")[1];
                        spendingcategory = transactionArr[a].category;
                        if(amountDec=="" || amountDec==undefined){
                            amountDec = "00";
                        }else if(amountDec.length == 1){
                            amountDec += "0";
                        }
                        arrElement = {'transId':transactionArr[a].trans_id,'timestamp':transTimestamp,'time':transTime,'date':transDate,'month':transMonth,'year':transYear,'payee':payeeName,'category':category,'amount':amount,'amount_int':amountInt,'amount_dec':amountDec,'type':type,'accounts':accounts,'img':getCatImg(spendingcategory)};
                        
                        recentTransData.push(arrElement);
                        counter++;
                    }
                }
			}
			 res.send(recentTransData);
		}		
	});
	
});

//Receiving a GET request to fetch cash and credit data (week)
router.get('/getcashactivityweekly', (req, res, next)=>{
	
	var params = {};
	var timezone = "";
	
	if(req.query != null){        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.timezone!=null){
			// var moment = require('moment-timezone');
			// timezone = req.query.timezone;
			// moment().tz("America/Los_Angeles").format();
		}
    }
	
	var fromLast7Date = moment().subtract(7, 'days').unix();
    var toDate = moment().unix();
	
	params.posted_date = {"$gte":fromLast7Date, "$lt":toDate};
	params.$or = [{category:"Bank Fees"},{top_level_category:"Bank Fees"},{highest_level_category:"Bank Fees"},{category:"Interest"},{top_level_category:"Interest"},{highest_level_category:"Interest"}];
	
	// console.log(params);
	
	AtriumMxTransModel.find(params, function(err,transactionArr){
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{  
			//console.log('Data found: '+ transactionArr.length);
			var atmFee = 0;
			var bankFee = 0;
            var financeCharge = 0;
            var lateFee = 0;
            var serviceFee = 0;
            var tradeCommisions = 0;
			var transArr = Object.values(transactionArr);
			var response = {};
			
			for(var a=0;a<transactionArr.length;a++){
				// if(transactionArr[a].category == "ATM Fee"){
					// atmFee += parseFloat(transactionArr[a].amount);
				// }
				// if(transactionArr[a].type == "CREDIT"){
					if(transactionArr[a].category == "Bank Fees" || transactionArr[a].category == "Overdraft"|| transactionArr[a].category == "ATM"|| transactionArr[a].category == "Late Payment"|| transactionArr[a].category == "Fraud Dispute"|| transactionArr[a].category == "Foreign Transaction" || transactionArr[a].category == "Wire Transfer" || transactionArr[a].category == "Insufficient Funds" || transactionArr[a].category == "Cash Advance" || transactionArr[a].category == "Excess Activity"){
						bankFee += parseFloat(transactionArr[a].amount);
					}
					if(transactionArr[a].category == "Interest" || transactionArr[a].category == "Interest Charged"){
						financeCharge += parseFloat(transactionArr[a].amount);
					}
				// }
				// if(transactionArr[a].category == "Late Fee"){
					// lateFee += parseFloat(transactionArr[a].amount);
				// }
				// if(transactionArr[a].category == "Service Fee"){
					// serviceFee += parseFloat(transactionArr[a].amount);
				// }
				// if(transactionArr[a].category == "Trade Commissions"){
					// tradeCommisions += parseFloat(transactionArr[a].amount);
				// }
			}
			
			response['atmFee'] = atmFee;
			response['bankFee'] = bankFee;
			response['financeCharge'] = financeCharge;
            response['lateFee'] = lateFee;
            response['serviceFee'] = serviceFee;
            response['tradeCommisions'] = tradeCommisions;
			// response.withdrawals = "500";
			// response.fee = "1000";
			
			// console.log(response);
			res.send(response);
			
		}
		
	});
	
});

//Receiving a GET request to fetch cash and credit data (monthly)
router.get('/getcashactivitymonthly', (req, res, next)=>{
	
	var params = {};
	var timezone = "";
	
	if(req.query != null){        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
		if(req.query.timezone!=null){
			// var moment = require('moment-timezone');
			// timezone = req.query.timezone;
			// moment().tz("America/Los_Angeles").format();
		}
    }
	
	var fromDate = moment().subtract(1, 'month').unix();
    var toDate = moment().unix();
	
	params.posted_date = {"$gte":fromDate, "$lt":toDate};
	params.$or = [{category:"ATM Fee"},{category:"Banking Fee"},{category:"Finance Charge"},{category:"Late Fee"},{category:"Service Fee"},{category:"Trade Commissions"}];
	
	// console.log(params);
	
	AtriumMxTransModel.find(params, function(err,transactionArr){
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{  
			//console.log('Data found: '+ transactionArr.length);
			var atmFee = 0;
			var bankFee = 0;
            var financeCharge = 0;
            var lateFee = 0;
            var serviceFee = 0;
            var tradeCommisions = 0;
			var transArr = Object.values(transactionArr);
			var response = {};
			
			for(var a=0;a<transactionArr.length;a++){
				if(transactionArr[a].category == "ATM Fee"){
					atmFee += parseFloat(transactionArr[a].amount);
				}
				if(transactionArr[a].category == "Banking Fee"){
					bankFee += parseFloat(transactionArr[a].amount);
				}
				if(transactionArr[a].category == "Finance Charge"){
					financeCharge += parseFloat(transactionArr[a].amount);
				}
				if(transactionArr[a].category == "Late Fee"){
					lateFee += parseFloat(transactionArr[a].amount);
				}
				if(transactionArr[a].category == "Service Fee"){
					serviceFee += parseFloat(transactionArr[a].amount);
				}
				if(transactionArr[a].category == "Trade Commissions"){
					tradeCommisions += parseFloat(transactionArr[a].amount);
				}
			}
			
			response['atmFee'] = atmFee;
			response['bankFee'] = bankFee;
			response['financeCharge'] = financeCharge;
            response['lateFee'] = lateFee;
            response['serviceFee'] = serviceFee;
            response['tradeCommisions'] = tradeCommisions;
			// response.withdrawals = "500";
			// response.fee = "1000";
			
			// console.log(response);
			res.send(response);
			
		}
		
	});
});

//Receiving a GET request to fetch cash and credit data (6 monthly)
router.get('/getcashactivity6monthly', (req, res, next)=>{
	
	var params= {};
    params.$and = [];
    //params.$or = [];
	var timezone = "";
	
	if(req.query != null){        
		if(req.query.customer_id!=null){
			params.$and.push({'customer_id':req.query.customer_id+""});
		}
		if(req.query.timezone!=null){
			// var moment = require('moment-timezone');
			// timezone = req.query.timezone;
			// moment().tz("America/Los_Angeles").format();
		}
    }
	
	var fromDate = moment().subtract(6, 'month').unix()*1000;
    var toDate = moment().unix()*1000;
	
	params.$and.push({'posted_date': {"$gte":(fromDate+''), "$lt":(toDate+'')}});
    params.$and.push({'category':{"$in":["Bank Fees","Overdraft","Late Payment","Fraud Dispute","Foreign Transaction","Wire Transfer","Insufficient Funds","Cash Advance","Excess Activity","Interest","Interest Charged"]}});
    
    /*
	params.$or.push({"category":"Bank Fees"});
    params.$or.push({"category":"Overdraft"});
    params.$or.push({"category":"Late Payment"});
    params.$or.push({"category":"Fraud Dispute"});
    params.$or.push({"category":"Foreign Transaction"});
    params.$or.push({"category":"Wire Transfer"});
    params.$or.push({"category":"Insufficient Funds"});
    params.$or.push({"category":"Cash Advance"});
    params.$or.push({"category":"Excess Activity"});
    params.$or.push({"category":"Interest"});
    params.$or.push({"category":"Interest Charged"});
	*/
	AtriumMxTransModel.aggregate([
		{
			$match:params

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
			// console.log('Data found: '+ JSON.stringify(transactionArr));
			var atmFee = 0;
			var bankFee = 0;
            var financeCharge = 0;
            var lateFee = 0;
            var serviceFee = 0;
            var tradeCommisions = 0;
			var transArr = Object.values(transactionArr);
			var response = {};
            var financeTrans = [];
            var bankTrans = [];
			
			for(var a=0;a<transactionArr.length;a++){
				
				if((transactionArr[a].type == "DEBIT") && transactionArr[a].accounts.length){
					if(transactionArr[a].category == "Bank Fees" || transactionArr[a].category == "Overdraft"|| transactionArr[a].category == "ATM"|| transactionArr[a].category == "Late Payment"|| transactionArr[a].category == "Fraud Dispute"|| transactionArr[a].category == "Foreign Transaction" || transactionArr[a].category == "Wire Transfer" || transactionArr[a].category == "Insufficient Funds" || transactionArr[a].category == "Cash Advance" || transactionArr[a].category == "Excess Activity"){
						bankFee += parseFloat(transactionArr[a].amount);
                        //transactionArr[a].category = getCatName(transactionArr[a].category);
                        bankTrans.push(transactionArr[a]);
                        
					}
					if(transactionArr[a].category == "Interest" || transactionArr[a].category == "Interest Charged"){
						financeCharge += parseFloat(transactionArr[a].amount);
                        //transactionArr[a].category = getCatName(transactionArr[a].category);
                        financeTrans.push(transactionArr[a]);
					}
				}
			}
			
			response['atmFee'] = atmFee;
			response['bankFee'] = bankFee;
			response['financeCharge'] = financeCharge;
            response['lateFee'] = lateFee;
            response['serviceFee'] = serviceFee;
            response['tradeCommisions'] = tradeCommisions;
            response['bankTrans'] = bankTrans;
            response['financeTrans'] = financeTrans;
             
			res.send(response);
			
		}
		
	});
});

//Receiving a GET request to fetch credit card details
router.get('/getcreditutilization', (req, res, next)=>{
	
	var params = {};
	var timezone = "";
	
	if(req.query != null){        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
    }
	
	//params.ac_sub_type = "CREDIT_CARD";
	// console.log(params);
	
	params.$or = [{ac_sub_type:"LOAN"},{ac_sub_type:"CREDIT_CARD"},{ac_sub_type:"LINE_OF_CREDIT"},{ac_sub_type:"MORTGAGE"},{ac_sub_type:"CHECKING"},{ac_sub_type:"SAVING"},{ac_sub_type:"INVESTMENT"}];
	let assets = ["CHECKING","SAVING","INVESTMENT"];
	AtriumMxAccountsModel.find(params, function(err,accountsArr){
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{  
		// console.log(accountsArr);
			var usedCredit = 0;
			var availableCredit = 0;
			var response = {};
			
			for(var a=0;a<accountsArr.length;a++){
                if(assets.indexOf(accountsArr[a].ac_sub_type) > -1 ){
                    if(accountsArr[a].balance!=null && accountsArr[a].balance!=""){
                        usedCredit += parseFloat(accountsArr[a].balance);
                    }else{
                        usedCredit += 0;
                    }
                }else{
                    if(accountsArr[a].balance!=null && accountsArr[a].balance!=""){
                        availableCredit += parseFloat(accountsArr[a].balance);
                    }else{
                        availableCredit += 0;
                    }
                }
			}
			
			response['used_credit'] = usedCredit;
			response['available_credit'] = availableCredit;
			
			res.send(response);
			
			
		}
		
	});
	
});

//Receiving a GET request to fetch credit card details
router.get('/getcreditcards', (req, res, next)=>{
	 
	var params = {};
	var timezone = "";
	
	if(req.query != null){        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
		}
    }
	
	//params.ac_sub_type = "CREDIT_CARD";
	
	// params.$or = [{ac_sub_type:"CHECKING"},{ac_sub_type:"SAVINGS"},{ac_sub_type:"LOAN"},{ac_sub_type:"CREDIT_CARD"},{ac_sub_type:"INVESTMENT"},{ac_sub_type:"LINE_OF_CREDIT"},{ac_sub_type:"MORTGAGE"},{ac_sub_type:"PROPERTY"},{ac_sub_type:"CASH"},{ac_sub_type:"INSURANCE"},{ac_sub_type:"PREPAID"}];
	params.$or = [{ac_sub_type:"loan"},{ac_sub_type:"credit card"}];
	
	AtriumMxAccountsModel.find(params, function(err,accountsArr){
        
        if(err){
            console.log('Error occured. :'+ err);
        }else{  
		// console.log("accounts:"+accountsArr);
		
			var usedCredit = 0;
			var availableCredit = 0;
			let cards = [];
			
			for(let a=0;a<accountsArr.length;a++){
                
				let card = {};
				if(accountsArr[a].balance!=null){
					card['balance']=(parseFloat(accountsArr[a].balance)).toFixed(2);
				}else{
					card['balance']='0.00';
				}
				
				if(accountsArr[a].credit_limit!=null){
					card['credit_limit']=(parseFloat(accountsArr[a].credit_limit)).toFixed(2);
				}else{
					card['credit_limit']='0.00';
				}
				
				if(accountsArr[a].available_credit!=null){
					card['available_credit']=(parseFloat(accountsArr[a].available_credit)).toFixed(2);
				}else{
					card['available_credit']='0.00';
				}
				card['name']=accountsArr[a].ac_name;
				card['institution_id']=accountsArr[a].institution_id;
                card['official_name']=accountsArr[a].official_name;
				card['bank_logo']=accountsArr[a].bank_logo;
                card['mask']=accountsArr[a].ac_number;
                card['ac_id']=accountsArr[a].ac_id;
				cards[a] = card;
			}
			
			let cardLength = cards.length;
			//console.log("cards length:"+cardLength);
			let counterAcc = 1;
			for(let i=0;i<cardLength;i++){
				let newParams = {};
				newParams.$and = [{category:"Credit"},{top_level_category:"Transfer"},{customer_id: req.query.customer_id},{account_id:cards[i]['ac_id']}];
				//console.log(newParams);
				AtriumMxTransModel.find(newParams).limit(1).exec((err, transaction) => {
					if(err){
						console.log('error'+err);
					}
					//console.log(transaction);
					//console.log(counterAcc);
					//console.log(transaction[0].posted_date);
                    
                    if(transaction[0] != undefined){
                        cards[i]['due_date'] =	moment(parseInt(transaction[0].posted_date)).format("MMM D, YYYY");
                    }else{
                         cards[i]['due_date'] =	'N/A';
                    }
					//console.log(cards[i]);
					if(counterAcc==cardLength){
						res.send(cards);
					}
					counterAcc++;
				});
			}
			
			// res.send(cards);
			
		}
		
	});
	
	
	
});

//Receiving a GET request to fetch all merchants  [Transactions]
router.get('/getallmerchants', (req, res, next)=>{
	
	//Getting all the request parameters
    var params = {};
	if(req.query != null){        
		if(req.query.customer_id!=null){
			customer_id = req.query.customer_id;
		}
	}
	
	AtriumMxTransModel.distinct('normalized_payee_name').exec((err, merchants) => {
            
				res.send(merchants);
			
		});
	
	
});

//Receiving a GET request to fetch all categories [Transactions]
router.get('/getallcategories', (req, res, next)=>{
	
	//Getting all the request parameters
    var params = {};
	if(req.query != null){        
		if(req.query.customer_id!=null){
			customer_id = req.query.customer_id;
		}
	}
	
	AtriumMxTransModel.distinct('category').exec((err, categories) => {
            
				res.send(categories);
			
		});
	
	
});

//Receiving a GET request to fetch 12 months top merchants (Golden Nuggets)
router.get('/gettopmerchants', (req, res, next)=>{
    
    //Getting all the request parameters
    var params = {};
    
    var fromDate = moment().subtract(1, 'years').unix();
    var toDate = moment().unix(); 
	
	// console.log("From Date:"+fromLastYearDate);
	// console.log("To Date:"+toDate);
    
    let spendingData = {};
    // var spendingCategory = ['ATM Fee','Advertising','Air Travel','Alcohol & Bars','Allowance','Amusement','Arts','Auto & Transport','Auto Insurance','Auto Payment','Baby Supplies','Babysitter & Daycare','Bank Fee','Bills & Utilities','Books','Books & Supplies','Business Services','Buy','Charity','Check','Child Support','Clothing','Coffee Shops','Dentist','Doctor','Education','Electronics & Software','Entertainment','Eyecare','Fast Food','Federal Tax','Fees & Charges','Financial','Financial Advisor','Food & Dining','Furnishings','Gas & Fuel','Gift','Gifts & Donations','Groceries','Gym','Hair','Health & Fitness','Health Insurance','Hobbies','Home','Home Improvement','Home Insurance','Home Phone','Home Services','Home Supplies','Hotel','Internet','Investments','Kids','Kids Activities','Laundry','Lawn & Garden','Legal','Life Insurance','Loan Fees and Charges','Loan Insurance','Loan Interest','Loan Payment','Loan Principal','Loans','Local Tax','Mobile Phone','Movies & DVDs','Music','Newspapers & Magazines','Office Supplies','Parking','Personal Care','Pet Food & Supplies','Pet Grooming','Pets','Pharmacy','Printing','Property Tax','Public Transportation','Rental Car & Taxi','Restaurants','Sales Tax','Service & Parts','Shipping','Shopping','Spa & Massage','Sporting Goods','Sports','State Tax','Student Loan','Taxes','Television','Toys','Trade Commissions','Travel','Tuition','Uncategorized','Utilities','Vacation','Veterinary'];   
    var customer_id = '';
	
    if(req.query != null){        
		if(req.query.customer_id!=null){
			customer_id = req.query.customer_id;
		}
		if(req.query.duration != null){
            if(req.query.duration == 'week'){
                fromDate = moment().subtract(1, 'week').unix();
                toDate = moment().unix(); 
            }else if(req.query.duration == 'month'){
                fromDate = moment().subtract(1, 'months').unix();
                toDate = moment().unix(); 
            }else if(req.query.duration == '6months'){
                fromDate = moment().subtract(6, 'months').unix();
                toDate = moment().unix(); 
            }else if(req.query.duration == 'all'){
                fromDate = 0;
                toDate = moment().unix(); 
            }else if(req.query.duration == 'year'){
                fromDate = moment().subtract(12, 'months').unix();
                toDate = moment().unix(); 
            }
        }
		//console.log(params);
    }
    
	 AtriumMxTransModel.aggregate(
	 [
	 { "$match": { $and :  [ { posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }}, {top_level_category: {$not: /Transfer$/}}, {customer_id: customer_id}  ] }  },
	 { "$group": { _id: "$normalized_payee_name", totalSales: { $sum: { "$toDouble":"$amount"} }}},
	 { "$sort": { totalSales: -1}},
     { "$sort": { _id: 1}},
	 ]).exec((err, merchants) => {
            let merchantsArr = [];
			if(err){
				console.log('Error occured. :'+ err);
			}else{  
				//console.log(merchants);
                for(var i = 0; i < merchants.length;i++){                        
                    if(parseFloat(merchants[i]['totalSales']) > 0){
                        merchantsArr.push(merchants[i]);
                    }
                }
                //console.log(merchantsArr);
				res.send(merchantsArr);
			}
		});
    
});


//Receiving a GET request to fetch top merchants on the basis of month (Spending Screen)
router.get('/gettopmerchantdata/:month', (req, res, next)=>{    
    //Getting all the request parameters
    var params = {};    
    var fromDate = moment().subtract(req.params.month, 'months').unix();
    var toDate = moment().unix(); 
	
	// console.log("From Date:"+fromLastYearDate);
	// console.log("To Date:"+toDate);
    
    let spendingData = {};
    // var spendingCategory = ['ATM Fee','Advertising','Air Travel','Alcohol & Bars','Allowance','Amusement','Arts','Auto & Transport','Auto Insurance','Auto Payment','Baby Supplies','Babysitter & Daycare','Bank Fee','Bills & Utilities','Books','Books & Supplies','Business Services','Buy','Charity','Check','Child Support','Clothing','Coffee Shops','Dentist','Doctor','Education','Electronics & Software','Entertainment','Eyecare','Fast Food','Federal Tax','Fees & Charges','Financial','Financial Advisor','Food & Dining','Furnishings','Gas & Fuel','Gift','Gifts & Donations','Groceries','Gym','Hair','Health & Fitness','Health Insurance','Hobbies','Home','Home Improvement','Home Insurance','Home Phone','Home Services','Home Supplies','Hotel','Internet','Investments','Kids','Kids Activities','Laundry','Lawn & Garden','Legal','Life Insurance','Loan Fees and Charges','Loan Insurance','Loan Interest','Loan Payment','Loan Principal','Loans','Local Tax','Mobile Phone','Mortgage & Rent','Movies & DVDs','Music','Newspapers & Magazines','Office Supplies','Parking','Personal Care','Pet Food & Supplies','Pet Grooming','Pets','Pharmacy','Printing','Property Tax','Public Transportation','Rental Car & Taxi','Restaurants','Sales Tax','Service & Parts','Shipping','Shopping','Spa & Massage','Sporting Goods','Sports','State Tax','Student Loan','Taxes','Television','Toys','Trade Commissions','Travel','Tuition','Uncategorized','Utilities','Vacation','Veterinary'];   
    var customer_id = '';
	
	
	
    if(req.query != null){        
		if(req.query.customer_id!=null){
			params.customer_id = req.query.customer_id;
			customer_id = req.query.customer_id;
		}
		if(req.query.account_id!=null){
			params.account_id = req.query.account_id;
		}
		
    }
	
	 
	 AtriumMxTransModel.aggregate(
	 [
	 // { "$match": { posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }}},
	 { "$match": { $and :  [ { posted_date: { '$gte':fromDate+"", '$lt':toDate+"" }}, {'top_level_category': {$ne: /Transfer$/}}, {'customer_id': customer_id} ] }  },
	 { "$group": { _id: "$normalized_payee_name", totalSales: { $sum: { "$toDouble":"$amount"} }}},
	 { "$sort": { totalSales: -1 }}
	 // ,
	 // { "$limit": 10 }
	 ]).exec((err, merchants) => {
			if(err){
				console.log('Error occured. :'+ err);
			}else{  
				//console.log(merchants);
				res.send(merchants);
			}
		});
    
});


//Making parameters object for request
    var request = {
        params: {
        userGuid: customerId,
        records_per_page: 100,
        page: current_page
        }
    };

	
//Receiving a GET request to fetch all transactions based on filters
router.get('/getwelcomedata', (req, res, next)=>{
    // console.log("Fetching welcome data...");

   //Getting all the request parameters
    var params = {};
	// var spendingData = {};
	var customerId = "";
	let thisMonthSpending = "";
	let lastMonthSpending = "";
	let creditBalance = 0;
	let availableCredit = 0;
	let creditLimit = 0;
	let ccCount = 0;
	let sixMonthAvgSpending = 0;
    
    var fromLast1MonthDate = moment().subtract(1, 'months').unix();
	var fromLast2MonthDate = moment().subtract(2, 'months').unix();
	var fromLast6MonthDate = moment().subtract(6, 'months').unix();
    var toDate = moment().unix();
    var thismonthfromdate = moment().startOf('month').unix();
    var lastmonthfromdate = moment().subtract(1, 'months').startOf('month').unix();
    var lastmonthtodate = moment().subtract(1, 'months').unix();
    
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id;
		}		
		//console.log(params);
    }
	
	var spendingCategoryFilter = plaidSpendingCategories;
		// PlaidCategoriesModel
	AtriumMxTransModel.aggregate(
	 [{ "$match": { $and :  [ { posted_date: { '$gte':thismonthfromdate+"", '$lt':toDate+"" }}, 
								 {'customer_id': customerId}, 
								 {'$or' :[{'category':{'$in':spendingCategoryFilter}},
								 	{'$and':[
											 {'highest_level_category':'Transfer'},{'top_level_category':'Withdrawal'}
										]
									},
									{'$and':[
										{'highest_level_category':'Transfer'},{'top_level_category':'Third Party'}
								   	]
							   		},
							   		{'$and':[
										{'highest_level_category':'Transfer'},{'top_level_category':'Transfer'}
						   				]
					   				}
								]
							}, {'type': 'DEBIT'} 
						] }  },
     {"$lookup":
			{
				from: "atriummxaccountsmodels",
				localField: "account_id",
				foreignField: "ac_id",
				as: "accounts"
			}},
			{
				$lookup:
				{
					from: "plaidcategoriesmodels",
					localField: "our_category_id",
					foreignField: "category_id",
					as: "categories"
				}
			},
            
	 { "$group": { _id: null, spending: { $sum: { "$toDouble":"$amount"} },     
          items: { $push:  {
                                                
                                                    posted_date: "$posted_date", 
                                                    normalized_payee_name: "$normalized_payee_name" ,
                                                    category : "$category",
                                                    amount: "$amount",
                                                    ac_number: "$accounts.ac_number",
                                                    official_name: "$accounts.official_name", 
                                                    institution_id: "$accounts.institution_id",
                                                    trans_id:"$trans_id",
													our_category:"$categories.our_category"
                                            } }
    }}
         
    
    ]
	
	).exec((err, data) => {
                if(data != undefined){
                    let oneMonthTransactions = [];
                    let sixMonthTransactions = [];
                    if(data.length > 0){
                        // console.log("This month data:"+data[0].spending);
                        thisMonthSpending = data[0].spending;
                        oneMonthTransactions = data[0].items;
                        for(var i=0;i<oneMonthTransactions.length;i++){
							// oneMonthTransactions[i].category = getCatName(oneMonthTransactions[i].category);
							oneMonthTransactions[i].category =  oneMonthTransactions[i].our_category;
                        }
                        AtriumMxTransModel.aggregate(
                        [{ "$match": { $and :  [ { posted_date: { '$gte':lastmonthfromdate+"", '$lt':lastmonthtodate+"" }}, {'customer_id': customerId} , {'$or' :[{'category':{'$in':spendingCategoryFilter}},
						{'$and':[
								{'highest_level_category':'Transfer'},{'top_level_category':'Withdrawal'}
						   ]
					   },
					   {'$and':[
						   {'highest_level_category':'Transfer'},{'top_level_category':'Third Party'}
						  ]
						  },
						  {'$and':[
						   {'highest_level_category':'Transfer'},{'top_level_category':'Transfer'}
							  ]
						  }
				   ]
			   }, {'type': 'DEBIT'}  ] }  },
                        { "$group": { _id: null, spendingLastMonth: { $sum: { "$toDouble":"$amount"} }}}]
                        
                        ).exec((err, data) => {
                                
                                    // console.log("Last month data:"+data[0].spendingLastMonth);
                                    lastMonthSpending = data[0].spendingLastMonth;
                                    
                                    AtriumMxAccountsModel.aggregate(
                                    [{ "$match": { $and :  [ { ac_sub_type: 'credit card'}, {'customer_id': customerId}  ] }  },
                                    { "$group": { _id: '$_id', credit_limit: { $sum: { "$toDouble":"$credit_limit"} },  balance: { $sum: { "$toDouble":"$balance"} }, available_credit: { $sum: { "$toDouble":"$available_credit"} }}}]
                                    
                                    ).exec((err, data) => {
                                         // console.log("data:"+ JSON.stringify(data));
                                        for(var a=0; a<data.length;a++){
                                            
                                            if(data[a].balance!=null && data[a].balance!='')
                                            creditBalance += data[a].balance;
                                            
                                            if(data[a].credit_limit!=null)
                                            creditLimit += data[a].credit_limit;
                                        
                                            if(data[a].available_credit!=null)
                                            availableCredit += data[a].available_credit;
                                            
                                            ccCount++;
											// console.log("CCcount:"+ccCount);
                                        }
                                        
                                        AtriumMxTransModel.aggregate(
                                        [{ "$match": { $and :  [ { posted_date: { '$gte':fromLast6MonthDate+"", '$lt':toDate+"" }}, {'customer_id': customerId}, {'$or' :[{'category':{'$in':spendingCategoryFilter}},
										{'$and':[
												{'highest_level_category':'Transfer'},{'top_level_category':'Withdrawal'}
										   ]
									   },
									   {'$and':[
										   {'highest_level_category':'Transfer'},{'top_level_category':'Third Party'}
										  ]
										  },
										  {'$and':[
										   {'highest_level_category':'Transfer'},{'top_level_category':'Transfer'}
											  ]
										  }
								   ]
							   }, {'type': 'DEBIT'}   ] }  },
                                        {"$lookup":
                                        {
                                            from: "atriummxaccountsmodels",
                                            localField: "account_id",
                                            foreignField: "ac_id",
                                            as: "accounts"
                                        }},
										{
											$lookup:
											{
												from: "plaidcategoriesmodels",
												localField: "our_category_id",
												foreignField: "category_id",
												as: "categories"
											}
										},
                                        { "$group": { 
                                            _id: null, 
                                            spending: { $sum: { "$toDouble":"$amount"} },
                                            items: { 
                                                $push:  {
                                                
                                                    posted_date: "$posted_date", 
                                                    normalized_payee_name: "$normalized_payee_name" ,
                                                    category : "$category",
                                                    amount: "$amount",
                                                    ac_number: "$accounts.ac_number",
                                                    official_name: "$accounts.official_name", 
                                                    institution_id: "$accounts.institution_id",
                                                    trans_id:"$trans_id",
													our_category:"$categories.our_category"
                                                }                                                 
                                            }                                            
                                        }}]
                                        
                                        ).exec((err, data) => {
                                            sixMonthAvgSpending = data[0].spending;
                                            sixMonthTransactions = data[0].items;
                                             for(var i=0;i<sixMonthTransactions.length;i++){
													// sixMonthTransactions[i].category = getCatName(sixMonthTransactions[i].category);
													sixMonthTransactions[i].category =  sixMonthTransactions[i].our_category;
                                            }
                                            res.send({'this_month_spending' : addCommasFormat(thisMonthSpending.toFixed(2)), 
                                                'last_month_spending' : addCommasFormat(lastMonthSpending), 
                                                'ratio' : (((thisMonthSpending-lastMonthSpending)/lastMonthSpending)*100).toFixed(0), 
                                                'credit_balance' : addCommasFormat((creditBalance).toFixed(2)),
                                                'credit_limit' : creditLimit,
                                                'credit_available' : availableCredit,
                                                'credit_utilization' : (((creditBalance)/(creditBalance+availableCredit))*100).toFixed(0),
                                                'cc_count' : ccCount,
                                                'avg_six_month_spending' : addCommasFormat((sixMonthAvgSpending/6).toFixed(2)),
                                                'oneMonthTransactions':oneMonthTransactions,
                                                'sixMonthTransactions':sixMonthTransactions
                                            });
                                            
                                            
                                        });
                                        
                                    });
                                }
                        );
                    }
                }
			}
    );
		
});


//Fetch average 6 month incomeCategory
router.get('/getincomesixmonthavg', (req, res, next)=>{
    // console.log("Fetching 6 months average income...");

    var params = {};
	var customerId = "";
	
	let sixMonthAvgIncome = 0;
    
    var fromLast6MonthDate = moment().subtract(6, 'months').unix()*1000+'';
    var toDate = moment().unix() + '';
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id+"";
		}		
		
    }
	
// // // 		
	AtriumMxTransModel.aggregate(
	 [{ "$match": { $and :  [ { posted_date: { '$gte':fromLast6MonthDate+"", '$lt':toDate+"" }}, {'customer_id': customerId}, {'category': { $in: incomeCategory}}, {'type':'DEBIT'}  ] }  },
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
		},
	 { "$group": { _id: null, 
         income: { $sum: { "$toDouble":"$amount"} },
        items: { $push:  {            
                posted_date: "$posted_date", 
                normalized_payee_name: "$normalized_payee_name" ,
                category : "$category",
                amount: "$amount" ,
                ac_number: "$accounts.ac_number",
                official_name: "$accounts.official_name", 
                institution_id: "$accounts.institution_id",
				trans_id:"$trans_id",
				our_category: "$categories.our_category"
        } }
         
         
    }}]
	
	).exec((err, data) => {
		if(data.length > 0){
			// console.log("Total Data:"+data[0].income);
			//sixMonthAvgIncome = (data[0].income)/6;
            var sixMonthIncomeTransactions = [];
            let sixMonthIncome = 0;
            for(var i = 0;i< data[0].items.length;i++){
                if(data[0].items[i].ac_number != undefined){
					// data[0].items[i].category = getCatName(data[0].items[i].category);
					data[0].items[i].category =  data[0].items[i].our_category;
                    sixMonthIncomeTransactions.push(data[0].items[i]);
                    try{
                        sixMonthIncome += parseFloat(data[0].items[i].amount);
                        
                    }catch(e){
                        realamount += 0;
                    }
                }
            }
            sixMonthAvgIncome = sixMonthIncome/6;
            var sixMonthIncomeTransactions = data[0].items;            
			res.send({'six_month_avg_income' : addCommasFormat(sixMonthAvgIncome.toFixed(2)),
                'sixMonthIncomeTransactions': sixMonthIncomeTransactions
            });	
		}
	});
});

//Fetch average 6 month incomeCategory
router.get('/getincometranctions', (req, res, next)=>{
    // console.log("Fetching 6 months average income...");

    var params = {};
	var customerId = "";
	
	let sixMonthAvgIncome = 0;
    
    var fromLast6MonthDate = moment().subtract(6, 'months').unix();
    var toDate = moment().unix();
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id;
		}		
		
    }
	
		
	AtriumMxTransModel.aggregate(
	 [{ "$match": { $and :  [ { posted_date: { '$gte':fromLast6MonthDate+"", '$lt':toDate+"" }}, {'customer_id': customerId}, {'category': { $in: incomeCategory}}, {'type':'DEBIT'}  ] }  }]
	
	).exec((err, data) => {
        var transactions = [];
		if(data.length > 0){
			// console.log("Total Data:"+data[0].income);
			transactions = data;
			res.send(data);	
		}
	});
});


//Fetch projected yearly income
router.get('/getprojectedincomedata', (req, res, next)=>{
    // console.log("inside projected income");
    var params = {};
	var customerId = "";
	
	let projectedIncome = 0;
    
    var fromLastDate = (moment().startOf('year').unix()*1000) + '';
    var toDate = (moment().subtract(1,'months').endOf('month').unix()*1000) + '';
	var lastMonthNum = moment().subtract(1,'months').endOf('month').format('M');
    
    if(req.query != null){
        
		if(req.query.customer_id!=null){
			customerId = req.query.customer_id + '';
		}		
		
    }
	
		
	AtriumMxTransModel.aggregate(
	 [{ "$match": { $and :  [ { posted_date: { '$gte':fromLastDate+"", '$lt':toDate+"" }}, {'customer_id': customerId}, {'category': { $in: incomeCategory}}, {'type':'DEBIT'}  ] 
         
         
    }  },
	 { "$group": {
         _id: null, 
         income: { $sum: { "$toDouble":"$amount"} },
         last_timestamp: { $min: { "$toDouble":"$posted_date"} }
         
    }}   
         
    ]
	
	).exec((err, data) => {
        if(err){
            console.log(err);
        }
        var finaldata = {};
		if(data.length > 0){		
            var first_data_timestamp = data[0].last_timestamp;
            var first_data_month = moment.unix(parseInt(first_data_timestamp/1000)).startOf('month').format('M');
			projectedIncome = ((data[0].income)/parseInt((lastMonthNum - first_data_month + 1)))*12;
			// console.log("total income this year:"+data[0].income);
			// console.log("Projected Income:"+projectedIncome);
            finaldata.projected_yearly_income = addCommasFormat(projectedIncome.toFixed(2));
            toDate = (moment().unix()*1000) + '';
            AtriumMxTransModel.aggregate(
            [{ "$match": { $and :  [ { posted_date: { '$gte':fromLastDate+"", '$lt':toDate+"" }}, {'customer_id': customerId}, {'category': { $in: incomeCategory}}, {'type':'DEBIT'}  ] }  },
            {"$lookup":
			{
				from: "atriummxaccountsmodels",
				localField: "account_id",
				foreignField: "ac_id",
				as: "accounts"
			}},
			{
				$lookup:
				{
					from: "plaidcategoriesmodels",
					localField: "our_category_id",
					foreignField: "category_id",
					as: "categories"
				}
			},
            { "$group": { _id: null, 
                income: { $sum: { "$toDouble":"$amount"} },     
                items: { $push:  {
                    
                        posted_date: "$posted_date", 
                        normalized_payee_name: "$normalized_payee_name" ,
                        category : "$category",
                        amount: "$amount",
                        ac_number: "$accounts.ac_number",
                        official_name: "$accounts.official_name", 
                        institution_id: "$accounts.institution_id",
						trans_id:"$trans_id",
						our_category:"$categories.our_category"
                    
                } }
                
            }}]
            ).exec((err, data) => {
                var this_year_income = data[0].income;
                for(var i=0;i<data[0].items.length;i++){
					// data[0].items[i].category = getCatName(data[0].items[i].category);
					data[0].items[i].category =  data[0].items[i].our_category;
                }
                finaldata.this_year_income_trans = data[0].items;
                
                finaldata.this_year_income = addCommasFormat(this_year_income.toFixed(2));
                res.send(finaldata);
            });
            

		}
	});
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

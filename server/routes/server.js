//Adding Express
var express = require('express');
var moment = require('moment');
var router = express.Router();



let plaidAllCategories = ["Bank Fees","Overdraft","ATM","Late Payment","Fraud Dispute","Foreign Transaction","Wire Transfer","Insufficient Funds","Cash Advance","Excess Activity","Cash Advance","Community","Animal Shelter","Assisted Living Services","Facilities and Nursing Homes","Caretakers","Cemetery","Courts","Day Care and Preschools","Disabled Persons Services","Drug and Alcohol Services","Education","Vocational Schools","Tutoring and Educational Services","Primary and Secondary Schools","Fraternities and Sororities","Driving Schools","Dance Schools","Culinary Lessons and Schools","Computer Training","Colleges and Universities","Art School","Adult Education","Government Departments and Agencies","Government Lobbyists","Housing Assistance and Shelters","Law Enforcement","Police Stations","Fire Stations","Correctional Institutions","Libraries","Military","Organizations and Associations","Youth Organizations","Environmental","Charities and Non-Profits","Post Offices","Public and Social Services","Religious","Temple","Synagogues","Mosques","Churches","Senior Citizen Services","Retirement","Food and Drink","Bar","Wine Bar","Sports Bar","Hotel Lounge","Breweries","Internet Cafes","Nightlife","Strip Club","Night Clubs","Karaoke","Jazz and Blues Cafe","Hookah Lounges","Adult Entertainment","Restaurants","Winery","Vegan and Vegetarian","Turkish","Thai","Swiss","Sushi","Steakhouses","Spanish","Seafood","Scandinavian","Portuguese","Pizza","Moroccan","Middle Eastern","Mexican","Mediterranean","Latin American","Korean","Juice Bar","Japanese","Italian","Indonesian","Indian","Ice Cream","Greek","German","Gastropub","French","Food Truck","Fish and Chips","Filipino","Fast Food","Falafel","Ethiopian","Eastern European","Donuts","Distillery","Diners","Dessert","Delis","Cupcake Shop","Cuban","Coffee Shop","Chinese","Caribbean","Cajun","Cafe","Burrito","Burgers","Breakfast Spot","Brazilian","Barbecue","Bakery","Bagel Shop","Australian","Asian","American","African","Afghan","Healthcare","Healthcare Services","Psychologists","Pregnancy and Sexual Health","Podiatrists","Physical Therapy","Optometrists","Nutritionists","Nurses","Mental Health","Medical Supplies and Labs","Hospitals, Clinics and Medical Centers","Emergency Services","Dentists","Counseling and Therapy","Chiropractors","Blood Banks and Centers","Alternative Medicine","Acupuncture","Physicians","Urologists","Respiratory","Radiologists","Psychiatrists","Plastic Surgeons","Pediatricians","Pathologists","Orthopedic Surgeons","Ophthalmologists","Oncologists","Obstetricians and Gynecologists","Neurologists","Internal Medicine","General Surgery","Gastroenterologists","Family Medicine","Ear, Nose and Throat","Dermatologists","Cardiologists","Anesthesiologists","Interest","Interest Earned","Interest Charged","Payment","Credit Card","Rent","Loan","Recreation","Arts and Entertainment","Theatrical Productions","Symphony and Opera","Sports Venues","Social Clubs","Psychics and Astrologers","Party Centers","Music and Show Venues","Museums","Movie Theatres","Fairgrounds and Rodeos","Entertainment","Dance Halls and Saloons","Circuses and Carnivals","Casinos and Gaming","Bowling","Billiards and Pool","Art Dealers and Galleries","Arcades and Amusement Parks","Aquarium","Athletic Fields","Baseball","Basketball","Batting Cages","Boating","Campgrounds and RV Parks","Canoes and Kayaks","Combat Sports","Cycling","Dance","Equestrian","Football","Go Carts","Golf","Gun Ranges","Gymnastics","Gyms and Fitness Centers","Hiking","Hockey","Hot Air Balloons","Hunting and Fishing","Landmarks","Monuments and Memorials","Historic Sites","Gardens","Buildings and Structures","Miniature Golf","Outdoors","Rivers","Mountains","Lakes","Forests","Beaches","Paintball","Parks","Playgrounds","Picnic Areas","Natural Parks","Personal Trainers","Race Tracks","Racquet Sports","Racquetball","Rafting","Recreation Centers","Rock Climbing","Running","Scuba Diving","Skating","Skydiving","Snow Sports","Soccer","Sports and Recreation Camps","Sports Clubs","Stadiums and Arenas","Swimming","Tennis","Water Sports","Yoga and Pilates","Service","Zoo","Advertising and Marketing","Writing, Copywriting and Technical Writing","Search Engine Marketing and Optimization","Public Relations","Promotional Items","Print, TV, Radio and Outdoor Advertising","Online Advertising","Market Research and Consulting","Direct Mail and Email Marketing Services","Creative Services","Advertising Agencies and Media Buyers","Art Restoration","Audiovisual","Automation and Control Systems","Automotive","Towing","Motorcycle, Moped and Scooter Repair","Maintenance and Repair","Car Wash and Detail","Car Appraisers","Auto Transmission","Auto Tires","Auto Smog Check","Auto Oil and Lube","Business and Strategy Consulting","Business Services","Printing and Publishing","Cable","Chemicals and Gasses","Cleaning","Computers","Maintenance and Repair","Software Development","Construction","Specialty","Roofers","Painting","Masonry","Infrastructure","Heating, Ventilating and Air Conditioning","Electricians","Contractors","Carpet and Flooring","Carpenters","Credit Counseling and Bankruptcy Services","Dating and Escort","Employment Agencies","Engineering","Entertainment","Media","Events and Event Planning","Financial","Taxes","Student Aid and Grants","Stock Brokers","Loans and Mortgages","Holding and Investment Offices","Fund Raising","Financial Planning and Investments","Credit Reporting","Collections","Check Cashing","Business Brokers and Franchises","Banking and Finance","ATMs","Accounting and Bookkeeping","Food and Beverage","Distribution","Catering","Funeral Services","Geological","Home Improvement","Upholstery","Tree Service","Swimming Pool Maintenance and Services","Storage","Roofers","Pools and Spas","Plumbing","Pest Control","Painting","Movers","Mobile Homes","Lighting Fixtures","Landscaping and Gardeners","Kitchens","Interior Design","Housewares","Home Inspection Services","Home Appliances","Heating, Ventilation and Air Conditioning","Hardware and Services","Fences, Fireplaces and Garage Doors","Electricians","Doors and Windows","Contractors","Carpet and Flooring","Carpenters","Architects","Household","Human Resources","Immigration","Import and Export","Industrial Machinery and Vehicles","Insurance","Internet Services","Leather","Legal","Logging and Sawmills","Machine Shops","Management","Manufacturing","Apparel and Fabric Products","Chemicals and Gasses","Computers and Office Machines","Electrical Equipment and Components","Food and Beverage","Furniture and Fixtures","Glass Products","Industrial Machinery and Equipment","Leather Goods","Metal Products","Nonmetallic Mineral Products","Paper Products","Petroleum","Plastic Products","Rubber Products","Service Instruments","Textiles","Tobacco","Transportation Equipment","Wood Products","Media Production","Metals","Mining","Coal","Metal","Non-Metallic Minerals","News Reporting","Oil and Gas","Packaging","Paper","Personal Care","Tattooing","Tanning Salons","Spas","Skin Care","Piercing","Massage Clinics and Therapists","Manicures and Pedicures","Laundry and Garment Services","Hair Salons and Barbers","Hair Removal","Petroleum","Photography","Plastics","Rail","Real Estate","Real Estate Development and Title Companies","Real Estate Appraiser","Real Estate Agents","Property Management","Corporate Housing","Commercial Real Estate","Building and Land Surveyors","Boarding Houses","Apartments, Condos and Houses","Rent","Refrigeration and Ice","Renewable Energy","Repair Services","Research","Rubber","Scientific","Security and Safety","Shipping and Freight","Software Development","Storage","Subscription","Tailors","Telecommunication Services","Textiles","Tourist Information and Services","Transportation","Travel Agents and Tour Operators","Utilities","Water","Sanitary and Waste Management","Heating, Ventilating, and Air Conditioning","Gas","Electric","Veterinarians","Water and Waste Management","Web Design and Development","Welding","Agriculture and Forestry","Crop Production","Forestry","Livestock and Animals","Services","Art and Graphic Design","Shops","Adult","Antiques","Arts and Crafts","Auctions","Automotive","Used Car Dealers","Salvage Yards","RVs and Motor Homes","Motorcycles, Mopeds and Scooters","Classic and Antique Car","Car Parts and Accessories","Car Dealers and Leasing","Beauty Products","Bicycles","Boat Dealers","Bookstores","Cards and Stationery","Children","Clothing and Accessories","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","Computers and Electronics","Video Games","Mobile Phones","Cameras","Construction Supplies","Convenience Stores","Costumes","Dance and Music","Department Stores","Digital Purchase","Discount Stores","Electrical Equipment","Equipment Rental","Flea Markets","Florists","Food and Beverage Store","Specialty","Health Food","Farmers Markets","Beer, Wine and Spirits","Fuel Dealer","Furniture and Home Decor","Gift and Novelty","Glasses and Optometrist","Hardware Store","Hobby and Collectibles","Industrial Supplies","Jewelry and Watches","Luggage","Marine Supplies","Music, Video and DVD","Musical Instruments","Newsstands","Office Supplies","Outlet","Women's Store","Swimwear","Shoe Store","Men's Store","Lingerie Store","Kids' Store","Boutique","Accessories Store","Pawn Shops","Pets","Pharmacies","Photos and Frames","Shopping Centers and Malls","Sporting Goods","Supermarkets and Groceries","Tobacco","Toys","Vintage and Thrift","Warehouses and Wholesale Stores","Wedding and Bridal","Wholesale","Lawn and Garden","Tax","Refund","Payment","Transfer","Internal Account Transfer","ACH","Billpay","Check","Credit","Debit","Deposit","Check","ATM","Keep the Change Savings Program","Payroll","Benefits","Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid","Wire","Withdrawal","Check","ATM","Save As You Go","Travel","Airlines and Aviation Services","Airports","Boat","Bus Stations","Car and Truck Rentals","Car Service","Ride Share","Charter Buses","Cruises","Gas Stations","Heliports","Limos and Chauffeurs","Lodging","Resorts","Lodges and Vacation Rentals","Hotels and Motels","Hostels","Cottages and Cabins","Bed and Breakfasts","Parking","Public Transportation Services","Rail","Taxi","Tolls and Fees","Transportation Centers"];

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
/*
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
*/
router.get('/', (req,res)=>{
    res.send('This is server node');
});
/*
 router.get('/', (req,res)=>{
    res.send('This is server node');
});
*/
const AtriumMxTransModel = require("../models/atrium_mx_transactions");
//Receiving a GET request to fetch all weekly spending line chart data
router.get('/getMoneyInflow', (req, res, next)=>{
    //console.log("Fetching spending data...");

    //Getting all the request parameters
    var params = [];
    var currTime = moment().unix()*1000;
    var month1 = moment().startOf('month').unix()*1000;
    var month2 = moment().startOf('month').subtract(1, 'month').unix()*1000;
    var month3 = moment().startOf('month').subtract(2, 'month').unix()*1000;
    var month4 = moment().startOf('month').subtract(3, 'month').unix()*1000;
    var month5 = moment().startOf('month').subtract(4, 'month').unix()*1000;
    var month6 = moment().startOf('month').subtract(5, 'month').unix()*1000;
    let firstTime = moment().unix()*1000;
    let lastTime = moment().unix()*1000;
    
    let moneyInflowData = [
            {label: moment(month6).format('MMM'),'directAmount':0,'cashAmount':0,'othersAmount':0,'extAmount':0,'checkAmount':0,'totalAmount':0,'directTransactions':[],'cashTransactions':[],'othersTransactions':[],'extTransactions':[],'checkTransactions':[],'totalTransactions':[]},
            {label: moment(month5).format('MMM'),'directAmount':0,'cashAmount':0,'othersAmount':0,'extAmount':0,'checkAmount':0,'totalAmount':0,'directTransactions':[],'cashTransactions':[],'othersTransactions':[],'extTransactions':[],'checkTransactions':[],'totalTransactions':[]},
           {label: moment(month4).format('MMM'),'directAmount':0,'cashAmount':0,'othersAmount':0,'extAmount':0,'checkAmount':0,'totalAmount':0,'directTransactions':[],'cashTransactions':[],'othersTransactions':[],'extTransactions':[],'checkTransactions':[],'totalTransactions':[]},
            {label: moment(month3).format('MMM'),'directAmount':0,'cashAmount':0,'othersAmount':0,'extAmount':0,'checkAmount':0,'totalAmount':0,'directTransactions':[],'cashTransactions':[],'othersTransactions':[],'extTransactions':[],'checkTransactions':[],'totalTransactions':[]},
           {label: moment(month2).format('MMM'),'directAmount':0,'cashAmount':0,'othersAmount':0,'extAmount':0,'checkAmount':0,'totalAmount':0,'directTransactions':[],'cashTransactions':[],'othersTransactions':[],'extTransactions':[],'checkTransactions':[],'totalTransactions':[]},          
           {'label': moment(month1).format('MMM'),'directAmount':0,'cashAmount':0,'othersAmount':0,'extAmount':0,'checkAmount':0,'totalAmount':0,'directTransactions':[],'cashTransactions':[],'othersTransactions':[],'extTransactions':[],'checkTransactions':[],'totalTransactions':[]}
    ];
    
    params.push({"posted_date":{'$gte':(month6+""), '$lt':(currTime+"")}});
    
    if(req.query != null){        
		if(req.query.customer_id!=null){
			params.push({"customer_id":(req.query.customer_id+"")});
		}
		if(req.query.account_id!=null){
			//params.account_id = req.query.account_id;
            params.push({"account_id":(req.query.account_id+"")});
		}
		//console.log(params);
    }
    
    let directDepositCategories = ["ACH","Billpay","Keep the Change Savings Program","Payroll","Benefits"];
    let cashDepositCategories = ["ATM"];
	let checksCategories = ["Check"];
    let extTransfersCategories = ["Third Party","Venmo","Square Cash","Square","PayPal","Dwolla","Coinbase","Chase QuickPay","Acorns","Digit","Betterment","Plaid"];
    let othersCategories = ["Credit","Debit","Deposit","Save As You Go"];
    
    AtriumMxTransModel.aggregate([
		{
			$match:{"$and":params}

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
		}
	]).exec((err, transactionArr) => {
                    
        if(err){
            console.log('Error occured. :'+ err);
        }else{ 
            
            // Define Categories to Filter out                        
            
            for(var a=0;a<transactionArr.length;a++){
				
				if(transactionArr[a].type == "DEBIT"){
				
					if(firstTime >= parseInt(transactionArr[a].posted_date)){
						firstTime = parseInt(transactionArr[a].posted_date);
					}
					
					if(lastTime <= parseInt(transactionArr[a].posted_date)){
						lastTime = parseInt(transactionArr[a].posted_date);
					}
					
					var transactionDate = new Date(parseInt(transactionArr[a].posted_date)).setHours(0,0,0,0);
					
					// First Month Amounts           
					//console.log([transactionDate,currTime,month1]);
					if((transactionDate <= currTime) && (transactionDate > month1)){
						// Direct Deposit
						if(directDepositCategories.indexOf(transactionArr[a].category) > -1){							
							moneyInflowData[5].directAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[5].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                            moneyInflowData[5].directTransactions.push(transactionArr[a]);
                            moneyInflowData[5].totalTransactions.push(transactionArr[a]);
						}
						// Cash Deposit
						if(cashDepositCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[5].cashAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[5].totalAmount += parseFloat(transactionArr[a].amount); 
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                            moneyInflowData[5].cashTransactions.push(transactionArr[a]);
                            moneyInflowData[5].totalTransactions.push(transactionArr[a]);
						}
						// External Transfers Categories
						if(extTransfersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[5].extAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[5].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                            moneyInflowData[5].extTransactions.push(transactionArr[a]);
                            moneyInflowData[5].totalTransactions.push(transactionArr[a]);
						}
						if(checksCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[5].checkAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[5].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                            moneyInflowData[5].checkTransactions.push(transactionArr[a]);
                            moneyInflowData[5].totalTransactions.push(transactionArr[a]);
						}
						// Others Categories
						if(othersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[5].othersAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[5].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                            moneyInflowData[5].othersTransactions.push(transactionArr[a]);
                            moneyInflowData[5].totalTransactions.push(transactionArr[a]);
						}
					}  
					
					// Second Month Amounts           
					
					if((transactionDate <= month1) && (transactionDate > month2)){
						// Direct Deposit
						if(directDepositCategories.indexOf(transactionArr[a].category) > -1 ){                        
							moneyInflowData[4].directAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[4].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                            moneyInflowData[4].directTransactions.push(transactionArr[a]);
                            moneyInflowData[4].totalTransactions.push(transactionArr[a]);
						}
						// Cash Deposit
						if(cashDepositCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[4].cashAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[4].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                            moneyInflowData[4].cashTransactions.push(transactionArr[a]);
                            moneyInflowData[4].totalTransactions.push(transactionArr[a]);
						}
						// External Transfers Categories
						if(extTransfersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[4].extAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[4].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                            moneyInflowData[4].extTransactions.push(transactionArr[a]);
                            moneyInflowData[4].totalTransactions.push(transactionArr[a]);
						}
						if(checksCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[4].checkAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[4].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                            moneyInflowData[4].checkTransactions.push(transactionArr[a]);
                            moneyInflowData[4].totalTransactions.push(transactionArr[a]);
						}
						// Others Categories
						if(othersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[4].othersAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[4].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                            moneyInflowData[4].othersTransactions.push(transactionArr[a]);
                            moneyInflowData[4].totalTransactions.push(transactionArr[a]);
						}
					}
					
					// Third Month Amounts           
					
					if((transactionDate <= month2) && (transactionDate > month3)){
						// Direct Deposit
						if(directDepositCategories.indexOf(transactionArr[a].category) > -1 ){                        
							moneyInflowData[3].directAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[3].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[3].directTransactions.push(transactionArr[a]);
                            moneyInflowData[3].totalTransactions.push(transactionArr[a]);
						}
						// Cash Deposit
						if(cashDepositCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[3].cashAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[3].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[3].cashTransactions.push(transactionArr[a]);
                            moneyInflowData[3].totalTransactions.push(transactionArr[a]);
						}
						// External Transfers Categories
						if(extTransfersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[3].extAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[3].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[3].extTransactions.push(transactionArr[a]);
                            moneyInflowData[3].totalTransactions.push(transactionArr[a]);
						}
						if(checksCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[3].checkAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[3].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[3].checkTransactions.push(transactionArr[a]);
                            moneyInflowData[3].totalTransactions.push(transactionArr[a]);
						}
						// Others Categories
						if(othersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[3].othersAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[3].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[3].othersTransactions.push(transactionArr[a]);
                            moneyInflowData[3].totalTransactions.push(transactionArr[a]);
						}
					}
					
					// Fourth Month Amounts           
					
					if((transactionDate <= month3) && (transactionDate > month4)){
						// Direct Deposit
						if(directDepositCategories.indexOf(transactionArr[a].category) > -1 ){                        
							moneyInflowData[2].directAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[2].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[2].directTransactions.push(transactionArr[a]);
                            moneyInflowData[2].totalTransactions.push(transactionArr[a]);
						}
						// Cash Deposit
						if(cashDepositCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[2].cashAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[2].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[2].cashTransactions.push(transactionArr[a]);
                            moneyInflowData[2].totalTransactions.push(transactionArr[a]);
						}
						// External Transfers Categories
						if(extTransfersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[2].extAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[2].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[2].extTransactions.push(transactionArr[a]);
                            moneyInflowData[2].totalTransactions.push(transactionArr[a]);
						}
						if(checksCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[2].checkAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[2].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[2].checkTransactions.push(transactionArr[a]);
                            moneyInflowData[2].totalTransactions.push(transactionArr[a]);
						}
						// Others Categories
						if(othersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[2].othersAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[2].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[2].othersTransactions.push(transactionArr[a]);
                            moneyInflowData[2].totalTransactions.push(transactionArr[a]);
						}
					}
					
					// Fifth Month Amounts           
					
					if((transactionDate <= month4) && (transactionDate > month5)){
						// Direct Deposit
						if(directDepositCategories.indexOf(transactionArr[a].category) > -1 ){                        
							moneyInflowData[1].directAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[1].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[1].directTransactions.push(transactionArr[a]);
                            moneyInflowData[1].totalTransactions.push(transactionArr[a]);
						}
						// Cash Deposit
						if(cashDepositCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[1].cashAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[1].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[1].cashTransactions.push(transactionArr[a]);
                            moneyInflowData[1].totalTransactions.push(transactionArr[a]);
						}
						// External Transfers Categories
						if(extTransfersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[1].extAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[1].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[1].extTransactions.push(transactionArr[a]);
                            moneyInflowData[1].totalTransactions.push(transactionArr[a]);
						}
						if(checksCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[1].checkAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[1].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[1].checkTransactions.push(transactionArr[a]);
                            moneyInflowData[1].totalTransactions.push(transactionArr[a]);
						}
						// Others Categories
						if(othersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[1].othersAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[1].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[1].othersTransactions.push(transactionArr[a]);
                            moneyInflowData[1].totalTransactions.push(transactionArr[a]);
						}
					}
					
					// Fifth Month Amounts           
					
					if((transactionDate <= month5) && (transactionDate > month6)){
						// Direct Deposit
						if(directDepositCategories.indexOf(transactionArr[a].category) > -1 ){                        
							moneyInflowData[0].directAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[0].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[0].directTransactions.push(transactionArr[a]);
                            moneyInflowData[0].totalTransactions.push(transactionArr[a]);
						}
						// Cash Deposit
						if(cashDepositCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[0].cashAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[0].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                             moneyInflowData[0].cashTransactions.push(transactionArr[a]);
                            moneyInflowData[0].totalTransactions.push(transactionArr[a]);
						}
						// External Transfers Categories
						if(extTransfersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[0].extAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[0].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                              moneyInflowData[0].extTransactions.push(transactionArr[a]);
                            moneyInflowData[0].totalTransactions.push(transactionArr[a]);
						}
						if(checksCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[0].checkAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[0].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                              moneyInflowData[0].checkTransactions.push(transactionArr[a]);
                            moneyInflowData[0].totalTransactions.push(transactionArr[a]);
						}
						// Others Categories
						if(othersCategories.indexOf(transactionArr[a].category) > -1 ){
							moneyInflowData[0].othersAmount += parseFloat(transactionArr[a].amount);
							moneyInflowData[0].totalAmount += parseFloat(transactionArr[a].amount);
                            transactionArr[a].category = getCatName(transactionArr[a].category);
                              moneyInflowData[0].othersTransactions.push(transactionArr[a]);
                            moneyInflowData[0].totalTransactions.push(transactionArr[a]);
						}
					}
                }
            }
            //console.log(moneyInflowData);
            
            moneyInflowData[0].firstTime = moment(firstTime).format('MMM D');
            moneyInflowData[0].lastTime = moment(lastTime).format('MMM D');            
            res.send(moneyInflowData);
			
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
module.exports = router;

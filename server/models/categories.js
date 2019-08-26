const mongoose = require("mongoose");
var categories = new mongoose.Schema({  
    category_id:{
        type: String,
        required: true
    },
    group:{
        type: String,
        required: true
    },
    hierarchy:{
        type: String,
        required: true
    },
    our_category:{
        type: String,
        required:false
    }
},{
  timestamps: true
});
 
const PlaidCategoriesModel = module.exports = mongoose.model('PlaidCategoriesModel', categories);

const mongoose = require("mongoose");
var reoprtToken = new mongoose.Schema({  
    customer_id:{
        type: String,
        required: true
    },
    asset_report_token:{
        type: String,
        required: true
    },
    asset_report_id:{
        type: String,
        required: true
    },
    last_updated_on:{
        type: String,
        required: true
    }
},{
  timestamps: true
});
 
const PlaidReportTokensModel = module.exports = mongoose.model('PlaidReportTokensModel', reoprtToken);

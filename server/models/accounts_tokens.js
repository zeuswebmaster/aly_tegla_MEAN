const mongoose = require("mongoose");

const PlaidAccountsTokensSchema = mongoose.Schema({
    customer_id:{
        type: String,
        required: true
    },
    access_token:{
        type: String,
        required: true
    },
    item_id:{
        type: String,
        required: true
    },
    added_on:{
        type: String,
        required: true
    }

});

const PlaidAccountsTokensModel = module.exports = mongoose.model('PlaidAccountsTokensModel', PlaidAccountsTokensSchema);
const mongoose = require("mongoose");

const AtriumMxAccountsSchema = mongoose.Schema({
    ac_id:{
        type: String,
        required: true
    },
    ac_number:{
        type: String,
        required: false,
        unique:true
    },
    ac_name:{
        type: String,
        required: true
    },
    official_name:{
        type: String,
        required: true
    },
    balance:{
        type: String,
        required: false
    },
    ac_type:{
        type: String,
        required: false
    },
	ac_sub_type:{
        type: String,
        required: false
    },
    status:{
        type: String,
        required: false
    },
    customer_id:{
        type: String,
        required: true
    },
    institution_id:{
        type: String,
        required: false
    },
	bank_logo:{
        type: String,
        required: false
    },
    balance_date:{
        type: String,
        required: false
    },
    last_update_date:{
        type: String,
        required: false
    },
    currency:{
        type: String,
        required: false
    },
    detail:{
        type: String,
        required: false
    },
    credit_limit:{
        type: String,
        required: false
    },
    available_credit:{
        type: String,
        required: false
    },
	token_id:{
		type: String,
		required: true
	}

});

const AtriumMxAccountsModel = module.exports = mongoose.model('AtriumMxAccountsModel', AtriumMxAccountsSchema);

const mongoose = require("mongoose");

const AtriumMxTransactionsSchema = mongoose.Schema({
	category:{
        type: String,
        required: true
    },
	created_date:{
        type: String,
        required: true
    },
	date:{
        type: String,
        required: true
    },
	original_description:{
        type: String,
        required: false
    },
	status:{
        type: String,
        required: true
    },
	type:{
        type: String,
        required: true
    },
	posted_date:{
        type: String,
        required: true
    },
	top_level_category:{
        type: String,
        required: false
    },
	highest_level_category:{
        type: String,
        required: false
    },
	transacted_at:{
        type: String,
        required: false
    },
	updated_at:{
        type: String,
        required: false
    },
	account_id:{
        type: String,
        required: true
    },
	amount:{
        type: String,
        required: true
    },
	normalized_payee_name:{
        type: String,
        required: true
    },
	trans_id:{
        type: String,
        required: true,
        unique:true
    },
	is_bill_pay:{
        type: Boolean,
        required: false
    },
	is_direct_deposit:{
        type: Boolean,
        required: false
    },
	is_expense:{
        type: Boolean,
        required: false
    },
	is_fee:{
        type: Boolean,
        required: false
    },
	is_income:{
        type: Boolean,
        required: false
    },
	is_overdraft_fee:{
        type: Boolean,
        required: false
    },
	is_payroll_advance:{
        type: Boolean,
        required: false
    },
	member_guid:{
        type: String,
        required: false
    },
	memo: String,
	merchant_guid:{
        type: String,
        required: false
    },
    customer_id:{
        type: String,
        required: true
    },
    our_category_id:{
        type: String,
        required: true
    },
    plaid_category_id:{
        type: String,
        required: true
    }
});

const AtriumMxTransModel = module.exports = mongoose.model('AtriumMxTransModel', AtriumMxTransactionsSchema);

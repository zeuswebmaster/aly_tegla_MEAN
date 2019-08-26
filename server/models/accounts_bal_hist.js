const mongoose = require("mongoose");

const AccountsBalanceHistorySchema = mongoose.Schema({
    
    customer_id:{
        type: String,
        required: true
    },
    account_id:{
        type: String,
        required: true
    },
    account_type:{
        type: String,
        required: true
    },
    balance:{
        type: String,
        required: true
    },
	date:{
		type: String,
		required: true
    }
});

const AccountsBalanceHistoryModel = module.exports = mongoose.model('AccountsBalanceHistoryModel', AccountsBalanceHistorySchema);

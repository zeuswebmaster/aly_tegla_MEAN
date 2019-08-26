const mongoose = require("mongoose");

const AtriumMxTransactionsSchema = mongoose.Schema({
    trans_id:{
        type: String,
        required: true
    },
    account_id:{
        type: String,
        required: true
    },
    customer_id:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    memo: String,
    posted_date:{
        type: String,
        required: true
    },
    created_date:{
        type: String,
        required: true
    },
    normalized_payee_name:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    amount:{
        type: String,
        required: true
    },
    schedule_c: String,
    user_id:{
        type: Number,
        required: false
    }

});

const AtriumMxTransModel = module.exports = mongoose.model('AtriumMxTransModel', AtriumMxTransactionsSchema);
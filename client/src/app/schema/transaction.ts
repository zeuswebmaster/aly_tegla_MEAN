export class Transaction{
    _id: string;
    category: string;
    created_date: string; //created_at
	date: string;
    original_description: string;
    status: string;
	type: string;
	posted_date: string;  //posted_at
	top_level_category: string;
	transacted_at: string;
	updated_at: string;
    account_id: string;  //account_guid
    amount: string;
	normalized_payee_name: string;
	trans_id: string; //guid
	is_bill_pay: boolean;
	is_direct_deposit: boolean;
	is_expense: boolean;
	is_fee: boolean;
	is_income: boolean;
	is_overdraft_fee: boolean;
	is_payroll_advance: boolean;
	member_guid: string;
    memo: string;
	merchant_guid: string;
	customer_id: string;
}
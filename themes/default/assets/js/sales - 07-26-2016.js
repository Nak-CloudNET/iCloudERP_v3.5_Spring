$(document).ready(function (e) {

    var $customer = $('#slcustomer');
    $customer.change(function (e) {
        localStorage.setItem('slcustomer', $(this).val());
        //$('#slcustomer_id').val($(this).val());
    });
    if (slcustomer = localStorage.getItem('slcustomer')) {
        $customer.val(slcustomer).select2({
            minimumInputLength: 1,
            data: [],
            initSelection: function (element, callback) {
                $.ajax({
                    type: "get", async: false,
                    url: site.base_url+"customers/getCustomer/" + $(element).val(),
                    dataType: "json",
                    success: function (data) {
                        callback(data[0]);
                    }
                });
            },
            ajax: {
                url: site.base_url + "customers/suggestions",
                dataType: 'json',
                quietMillis: 15,
                data: function (term, page) {
                    return {
                        term: term,
                        limit: 10
                    };
                },
                results: function (data, page) {
                    if (data.results != null) {
                        return {results: data.results};
                    } else {
                        return {results: [{id: '', text: 'No Match Found'}]};
                    }
                }
            }
        });
    } else {
        nsCustomer();
    }

// Order level shipping and discount localStorage
if (sldiscount = localStorage.getItem('sldiscount')) {
	$('#sldiscount').val(sldiscount);
}
$('#sltax2').change(function (e) {
	localStorage.setItem('sltax2', $(this).val());
    $('#sltax2').val($(this).val());
});
if (sltax2 = localStorage.getItem('sltax2')) {
	$('#sltax2').select2("val", sltax2);
}
$('#slsale_status').change(function (e) {
	localStorage.setItem('slsale_status', $(this).val());
});
if (slsale_status = localStorage.getItem('slsale_status')) {
	$('#slsale_status').select2("val", slsale_status);
}
$('#slpayment_status').change(function (e) {
	var ps = $(this).val();
	localStorage.setItem('slpayment_status', ps);
	if (ps == 'partial' || ps == 'paid') {
		if(ps == 'paid') {
			$('#amount_1').val(formatDecimal(parseFloat(((total + invoice_tax) - order_discount) + shipping)));
			$('#total_balance_1').val(formatDecimal(parseFloat(((total + invoice_tax) - order_discount) + shipping)));
		}
		$('#payments').slideDown();
		$('#pcc_no_1').focus();
	} else {
		$('#amount_1').val('');
		$('#payments').slideUp();
	}
});
if (slpayment_status = localStorage.getItem('slpayment_status')) {
	$('#slpayment_status').select2("val", slpayment_status);
	var ps = slpayment_status;
	if (ps == 'partial' || ps == 'paid') {
		$('#payments').slideDown();
		$('#pcc_no_1').focus();
	} else {
		$('#payments').slideUp();
	}
}

$(document).on('keyup', '#amount_1', function () {
	var us_paid = $('#amount_1').val()-0;
	var deposit_amount = parseFloat($(".deposit_total_amount").text());
	var deposit_balance = parseFloat($(".deposit_total_balance").text());
	deposit_balance = (deposit_amount - us_paid);
	$(".deposit_total_balance").text(deposit_balance);
});

$(document).on('change', '#customer1', function(){
	checkDeposit();
	$('#amount_1').trigger('change');
});

$(document).on('load', function(){
	$(".paid_by").trigger('change');
});

function checkDeposit() {
	var customer_id = $("#customer1").val();
	if (customer_id != '') {
		$.ajax({
			type: "get", async: false,
			url: site.base_url + "sales/validate_deposit/" + customer_id,
			dataType: "json",
			success: function (data) {
				if (data === false) {
					$('#deposit_no_1').parent('.form-group').addClass('has-error');
					bootbox.alert(lang('invalid_customer'));
				} else if (data.id !== null && data.id !== customer_id) {
					$('#deposit_no_1').parent('.form-group').addClass('has-error');
					bootbox.alert(lang('this_customer_has_no_deposit'));
				} else {
					var amount = $("#amount_1").val();
					var deposit_amount =  (data.deposit_amount==null?0: data.deposit_amount);
					var deposit_balance = (data.deposit_amount - amount);
					$('#dp_details').html('<small>Customer Name: ' + data.name + '<br>Amount: <span class="deposit_total_amount">' + deposit_amount + '</span> - Balance: <span class="deposit_total_balance">' + deposit_balance + '</span></small>');
					$('#deposit_no').parent('.form-group').removeClass('has-error');
					//calculateTotals();
					//$('#amount_1').val(data.deposit_amount - amount).focus();
				}
			}
		});
	}
}

$(document).on('change', '.paid_by', function () {
	var p_val = $(this).val();
	localStorage.setItem('paid_by', p_val);
	$('#rpaidby').val(p_val);
	if (p_val == 'cash' ||  p_val == 'other') {
		$('.pcheque_1').hide();
		$('.pcc_1').hide();
		$('.depreciation_1').hide();
		$('.pcash_1').show();
		$('#payment_note_1').focus();
	} else if (p_val == 'CC') {
		$('.pcheque_1').hide();
		$('.pcash_1').hide();
		$('.depreciation_1').hide();
		$('.pcc_1').show();
		$('#pcc_no_1').focus();
	} else if (p_val == 'Cheque') {
		$('.pcc_1').hide();
		$('.pcash_1').hide();
		$('.depreciation_1').hide();
		$('.pcheque_1').show();
		$('#cheque_no_1').focus();
	} else if (p_val == 'depreciation') {
		$('.pcheque_1').hide();
		$('.pcash_1').hide();
		$('.pcc_1').hide();
		$('.depreciation_1').show();
		$('#rate_1').focus();
	} else {
		$('.pcheque_1').hide();
		$('.depreciation_1').hide();
		$('.pcc_1').hide();
		$('.pcash_1').hide();
	}
	if (p_val == 'gift_card') {
		$('.gc').show();
		$('.ngc').hide();
		$('#gift_card_no').focus();
	} else {
		$('.ngc').show();
		$('.gc').hide();
		$('#gc_details').html('');
	}
	if(p_val == 'deposit') {
		$('.dp').show();
		$('#customer1').trigger('change');
	}else{
		$('.dp').hide();
		$('#dp_details').html('');
	}
}).trigger('change');

if (paid_by = localStorage.getItem('paid_by')) {
	var p_val = paid_by;
	$('.paid_by').select2("val", paid_by);
	$('#rpaidby').val(p_val);
	if (p_val == 'cash' ||  p_val == 'other') {
		$('.pcheque_1').hide();
		$('.pcc_1').hide();
		$('.depreciation_1').hide();
		$('.pcash_1').show();
		$('#payment_note_1').focus();
	} else if (p_val == 'CC') {
		$('.pcheque_1').hide();
		$('.pcash_1').hide();
		$('.depreciation_1').hide();
		$('.pcc_1').show();
		$('#pcc_no_1').focus();
	} else if (p_val == 'Cheque') {
		$('.pcc_1').hide();
		$('.pcash_1').hide();
		$('.depreciation_1').hide();
		$('.pcheque_1').show();
		$('#cheque_no_1').focus();
	} else if (p_val == 'depreciation'){
		$('.pcheque_1').hide();
		$('.pcash_1').hide();
		$('.pcc_1').hide();
		$('.depreciation_1').show();
		$('#rate_1').focus();
	} else {
		$('.pcheque_1').hide();
		$('.pcc_1').hide();
		$('.depreciation_1').hide();
		$('.pcash_1').hide();
	}
	if (p_val == 'gift_card') {
		$('.gc').show();
		$('.ngc').hide();
		$('#gift_card_no').focus();
	} else {
		$('.ngc').show();
		$('.gc').hide();
		$('#gc_details').html('');
	}
}

$(document).on('click', '#add_sale', function(){
	var us_paid = $('#amount_1').val()-0;
	var deposit_amount = parseFloat($(".deposit_total_amount").text());
	var deposit_balance = parseFloat($(".deposit_total_balance").text());
	deposit_balance = (deposit_amount - Math.abs(us_paid));
	$(".deposit_total_balance").text(deposit_balance);

	if(deposit_balance > deposit_amount || deposit_balance < 0 || deposit_amount == 0){
		bootbox.alert('Your Deposit Limited: ' + deposit_amount);
		$('#amount_1').val(deposit_amount);
		$(".deposit_total_balance").text(deposit_amount - $('#amount_1').val()-0);
		return false;
	}
});

//==============================loan add by chin=========================
$(document).on('change','#depreciation_type_1, #depreciation_rate_1, #depreciation_term_1',function() {
	var p_type = $('#depreciation_type_1').val();
	var rate = $('#depreciation_rate_1').val()-0;
	var term = $('#depreciation_term_1').val()-0;
	var total_amount = $('#total_balance').val()-0;
	var us_down = $('#amount_1').val()-0;
	var down_pay = us_down;
	var loan_amount = total_amount - down_pay;
	depreciation(loan_amount,rate,term,p_type,total_amount);
});

function depreciation(amount,rate,term,p_type,total_amount){
	var dateline = '';
	var d = new Date();
	if(p_type == ''){
		$('#print_').hide();
		return false;
	}else{
		$('#print_').show();
		if(rate == '' || rate < 0) {
			if(term == '' || term <= 0) {
				$('.dep_tbl').hide();
				alert("Please choose Rate and Term again!");
				return false;
			}else{
				$('.dep_tbl').hide();
				alert("Please choose Rate again!"); 
				return false;
			}
		}else{
			if(term == '' || term <= 0) {
				$('.dep_tbl').hide();
				alert("Please choose Term again!"); 
				return false;
			}else{
				var tr = '';
				if(p_type == 1 || p_type == 3){
					tr += '<tr>';
					tr += '<th> Pmt No. </th>';
					tr += '<th> Interest </th>';
					tr += '<th> Principal </th>';
					tr += '<th> Total Payment </th>';
					tr += '<th> Balance </th>';
					tr += '<th> Note </th>';
					tr += '<th> Payment Date </th>';
					tr += '</tr>';
				}else if(p_type == 2){
					tr += '<tr>';
					tr += '<th> PERIOD </th>';
					tr += '<th> RATE </th>';
					tr += '<th> PERCENTAGE </th>';
					tr += '<th> PYMENT </th>';
					tr += '<th> TOTAL PAYMENT </th>';
					tr += '<th> BALANCE </th>';
					tr += '<th> NOTE </th>';
					tr += '<th> DATELINE </th>';
					tr += '</tr>';
				}
				if(p_type == 1){
					var principle = amount/term;
					var interest = 0;
					var balance = amount;
					var payment = 0;
					var i=0;
					var k=1;
					var total_principle = 0;
					var total_payment = 0;
					for(i=0;i<term;i++){
						if(i== 0){
							interest = amount*((rate/term)/100);
							dateline = $('.current_date').val();
						}else{
							interest = balance *((rate/term)/100);
							dateline = moment().add((k-1),'months').calendar();
						}
						balance -= principle;
						if(balance <= 0){
							balance = 0;
						}
						payment = principle + interest;
						tr += '<tr> <td>'+ k +'<input type="hidden" name="no[]" id="no" class="no" value="'+ k +'" /></td> ';
						tr += '<td>'+ formatDecimal(interest) +'<input type="hidden" name="interest[]" id="interest" class="interest" width="90%" value="'+ formatDecimal(interest) +'"/></td>';
						tr += '<td>'+ formatDecimal(principle) +'<input type="hidden" name="principle[]" id="principle" class="principle" width="90%" value="'+ formatDecimal(principle) +'"/></td>';
						tr += '<td>'+ formatDecimal(payment) +'<input type="hidden" name="payment_amt[]" id="payment_amt" class="payment_amt" width="90%" value="'+ formatDecimal(payment) +'"/></td>';
						tr += '<td>'+ formatDecimal(balance) +'<input type="hidden" name="balance[]" id="balance" class="balance" width="90%" value="'+ formatDecimal(balance) +'"/></td>';
						tr += '<td> <input name="note_1[]" class="note_1 form-control" id="'+i+'" ></input> <input type="hidden" name="note1[]" id="note1" class="note1_'+i+'" width="90%"/></td>';
						tr += '<td>'+ dateline +'<input type="hidden" class="dateline" name="dateline[]" id="dateline" value="'+ dateline +'" /> </td> </tr>';
						total_principle += principle;
						total_payment += payment;
						k++;
					}
					tr += '<tr> <td colspan="2"> Total </td>';
					tr += '<td>'+ formatDecimal(total_principle) +'</td>';
					tr += '<td>'+ formatDecimal(total_payment) +'</td>';
					tr += '<td colspan="3"> &nbsp; </td> </tr>';
				}else if(p_type == 2) {
					var k = 1;
					var inte_rate = amount * ((rate/term)/100);
					var payment = 0;
					var amount_payment = 0;
					var balance = 0;
					for(i=0;i<term;i++){
						if(i== 0){
							dateline = $('.current_date').val();
							amount_payment = inte_rate + payment;
							balance = amount;
							tr += '<tr> <td>'+ k +'<input type="hidden" name="no[]" id="no" class="no" value="'+ k +'" /></td> ';
							tr += '<td><input type="text" name="rate[]" id="rate" class="rate" style="width:60px;" value="'+ formatDecimal(inte_rate) +'"/><input type="hidden" name="rate_[]" id="rate_" class="rate_" style="width:60px;" value="'+ formatDecimal(inte_rate) +'"/></td>';
							tr += '<td><input type="text" name="percentage[]" id="percentage" class="percentage" style="width:60px;" value=""/><input type="hidden" name="percentage_[]" id="percentage_" class="percentage_" style="width:60px;" value=""/></td>';
							tr += '<td><input type="text" name="payment_amt[]" id="payment_amt" class="payment_amt" style="width:60px;" value="" /><input type="hidden" name="payment_amt_[]" id="payment_" class="payment_" style="width:60px;" value="" /></td>';
							tr += '<td><input type="text" name="total_payment[]" id="total_payment" class="total_payment" style="width:60px;" value="'+ formatDecimal(amount_payment) +'" readonly/><input type="hidden" name="total_payment_[]" id="total_payment_" class="total_payment_" style="width:60px;" value="'+ formatDecimal(amount_payment) +'" /></td>';
							tr += '<td><input type="text" name="balance[]" id="balance" class="balance" style="width:60px;" value="'+ balance +'" readonly/><input type="hidden" name="balance_[]" id="balance_" class="balance_" style="width:60px;" value="'+ formatDecimal(balance) +'"/></td>';
							tr += '<td> <input name="note_1[]" class="note_1 form-control" id="'+i+'" ></input> <input type="hidden" name="note1[]" id="note1" class="note1_'+i+'" width="90%"/></td>';
							tr += '<td>'+ dateline +'<input type="hidden" class="dateline" name="dateline[]" id="dateline" value="'+ dateline +'" /></td> </tr>';
						}else{
							dateline = moment().add((k-1),'months').calendar();
							inte_rate = balance * ((rate/term)/100);
							tr += '<tr> <td>'+ k +'<input type="hidden" name="no[]" id="no" class="no" value="'+ k +'" /></td> ';
							tr += '<td><input type="text" name="rate[]" id="rate" class="rate" style="width:60px;" value="'+ formatDecimal(inte_rate) +'"/><input type="hidden" name="rate_[]" id="rate_" class="rate_" style="width:60px;" value=""/></td>';
							tr += '<td><input type="text" name="percentage[]" id="percentage" class="percentage" style="width:60px;" value=""/><input type="hidden" name="percentage_[]" id="percentage_" class="percentage_" style="width:60px;" value="'+ formatDecimal(inte_rate) +'"/></td>';
							tr += '<td><input type="text" name="payment_amt[]" id="payment_amt" class="payment_amt" style="width:60px;" value="" /><input type="hidden" name="payment_[]" id="payment_" class="payment_" style="width:60px;" value="" /></td>';
							tr += '<td><input type="text" name="total_payment[]" id="total_payment" class="total_payment" style="width:60px;" value="" readonly/><input type="hidden" name="total_payment_[]" id="total_payment_" class="total_payment_" style="width:60px;" value="" /></td>';
							tr += '<td><input type="text" name="balance[]" id="balance" class="balance" style="width:60px;" value="" readonly/><input type="hidden" name="balance_[]" id="balance_" class="balance_" style="width:60px;" value=""/></td>';
							tr += '<td> <input name="note_1[]" class="note_1 form-control" id="'+i+'" ></input> <input type="hidden" name="note1[]" id="note1" class="note1_'+i+'" width="90%"/> </td>';
							tr += '<td>'+ dateline +'<input type="hidden" class="dateline" name="dateline[]" id="dateline" value="'+ dateline +'" /></td> </tr>';
						}
						k++;
					}
					tr += '<tr> <td colspan="2"> Total </td>';
					tr += '<td><input type="text" name="total_percen" id="total_percen" class="total_percen" style="width:60px;" value="" readonly/></td>';
					tr += '<td><input type="text" name="total_pay" id="total_pay" class="total_pay" style="width:60px;" value="" readonly/></td>';
					tr += '<td><input type="text" name="total_amount" id="total_amount" class="total_amount" style="width:60px;" value="" readonly/></td>';
					tr += '<td colspan="3"> &nbsp; </td> </tr>';
				}else if(p_type == 3) {
					var principle = 0;
					var interest = 0;
					var balance = amount;
					var rate_amount = ((rate/100)/12);
					var payment = ((amount * rate_amount)*((Math.pow((1+rate_amount),term))/(Math.pow((1+rate_amount),term)-1)));
					var i=0;
					var k=1;
					var total_principle = 0;
					var total_payment = 0;
					for(i=0;i<term;i++){
						if(i== 0){
							interest = amount*((rate/100)/12);
							dateline = $('.current_date').val();
						}else{
							interest = balance *((rate/100)/12);
							dateline = moment().add((k-1),'months').calendar();
						}
						principle = payment - interest;
						balance -= principle;
						if(balance <= 0){
							balance = 0;
						}
						tr += '<tr> <td>'+ k +'<input type="hidden" name="no[]" id="no" class="no" value="'+ k +'" /></td> ';
						tr += '<td>'+ formatDecimal(interest) +'<input type="hidden" name="interest[]" id="interest" class="interest" width="90%" value="'+ formatDecimal(interest) +'"/></td>';
						tr += '<td>'+ formatDecimal(principle) +'<input type="hidden" name="principle[]" id="principle" class="principle" width="90%" value="'+ principle +'"/></td>';
						tr += '<td>'+ formatDecimal(payment) +'<input type="hidden" name="payment_amt[]" id="payment_amt" class="payment_amt" width="90%" value="'+ formatDecimal(payment) +'"/></td>';								
						tr += '<td>'+ formatDecimal(balance) +'<input type="hidden" name="balance[]" id="balance" class="balance" width="90%" value="'+ formatDecimal(balance) +'"/></td>';
						tr += '<td> <input name="note_1[]" class="note_1 form-control" id="'+i+'" ></input> <input type="hidden" name="note1[]" id="note1" class="note1_'+i+'" width="90%"/></td>';
						tr += '<td>'+ dateline +'<input type="hidden" class="dateline" name="dateline[]" id="dateline" value="'+ dateline +'" /></td> </tr>';
						total_principle += principle;
						total_payment += payment;
						k++;
					}
					tr += '<tr> <td colspan="2"> Total </td>';
					tr += '<td>'+ formatDecimal(total_principle) +'</td>';
					tr += '<td>'+ formatDecimal(total_payment) +'</td>';
					tr += '<td colspan="3"> &nbsp; </td> </tr>';
				} else if(p_type == 4){
					var principle = amount/term;
					var interest = (amount * (rate/100))/12;
					var balance = amount;
					var payment = 0;
					var i=0;
					var k=1;
					var total_principle = 0;
					var total_payment = 0;
					for(i=0;i<term;i++){
						if(i== 0){
							dateline = $('.current_date').val();
						}else{
							dateline = moment().add((k-1),'months').calendar();
						}
						payment = principle + interest;
						
						balance -= principle;
						if(balance <= 0){
							balance = 0;
						}
						tr += '<tr> <td>'+ k +'<input type="hidden" name="no[]" id="no" class="no" value="'+ k +'" /></td> ';
						tr += '<td>'+ formatDecimal(interest) +'<input type="hidden" name="interest[]" id="interest" class="interest" width="90%" value="'+ interest +'"/></td>';
						tr += '<td>'+ formatDecimal(principle) +'<input type="hidden" name="principle[]" id="principle" class="principle" width="90%" value="'+ principle +'"/></td>';
						tr += '<td>'+ formatDecimal(payment) +'<input type="hidden" name="payment_amt[]" id="payment_amt" class="payment_amt" width="90%" value="'+ payment +'"/></td>';
						tr += '<td>'+ formatDecimal(balance) +'<input type="hidden" name="balance[]" id="balance" class="balance" width="90%" value="'+ balance +'"/></td>';
						tr += '<td> <input name="note_1[]" class="note_1 form-control" id="'+i+'" ></input> <input type="hidden" name="note1[]" id="note1" class="note1_'+i+'" width="90%"/></td>';
						tr += '<td>'+ dateline +'<input type="hidden" class="dateline" name="dateline[]" id="dateline" value="'+ dateline +'" /> </td> </tr>';
						total_principle += principle;
						total_payment += payment;
						k++;
					}
					tr += '<tr> <td colspan="2"> <?= lang("total"); ?> </td>';
					tr += '<td>'+ formatDecimal(total_principle) +'</td>';
					tr += '<td>'+ formatDecimal(total_payment) +'</td>';
					tr += '<td colspan="3"> &nbsp; </td> </tr>';
				}
				$('.dep_tbl').show();
				$('#tbl_dep').html(tr);
				//$('#tbl_dep1').html(tr);
				$("#loan1").html(tr);
			}
		}
	}
}
$("#depreciation_rate_1").on('change', function(){
	$("#loan_rate").val($(this).val());
});

$("#depreciation_type_1").on('change', function(){
	$("#loan_type").val($(this).val());
});

$("#depreciation_term_1").on('change', function(){
	$("#loan_term").val($(this).val());
});

$("#tbl_dep .note").live('change', function(){
	var id = ($(this).attr('id'));
	var value = $(this).val();
	
	$('.note1_'+id+'').val(value);
});

$(document).on('keyup', '#tbl_dep .percentage', function () {
	var rate_all = $('#depreciation_rate_1').val()-0;
	var amount = 0;
	var payment = 0;
	var amount_payment = 0;
	var rate = 0;
	var balance = 0;
	var per = $(this).val()-0;
	var tr = $(this).parent().parent();
	if(per < 0 || per > 100) {
		alert("sorry you can not input the rate value less than zerro or bigger than 100");
		$(this).val('');
		$(this).focus();
		return false;
	}else {
		amount = tr.find('.balance_').val()-0;
		rate = tr.find('.rate_').val()-0;
		payment = amount *(per/100);
		amount_payment = rate + payment;
		balance = amount - payment;
		tr.find('.payment_amt').val(formatDecimal(payment));
		tr.find('.payment_').val(formatDecimal(payment));
		tr.find('.total_payment').val(formatDecimal(amount_payment));
		tr.find('.total_payment_').val(formatDecimal(amount_payment));
		tr.find('.balance').val(formatDecimal(balance));
		tr.find('.balance_').val(formatDecimal(balance));
		
		var total_percent = 0;
		$('#tbl_dep .percentage').each(function(){
			var parent_ = $(this).parent().parent();
			var per_tage_ = parent_.find('.percentage').val()-0;
			total_percent += per_tage_;
		});
		
		var j = 1;
		var i = 1;
		var balance = 0;
		var amount_percent = 0;
		var amount_pay = 0;
		var amount_total_payment = 0;
		$('#tbl_dep .percentage').each(function(){
			var parent = $(this).parent().parent();
			var per_tage = parent.find('.percentage').val()-0;
			if(per_tage == '' || per_tage == 0) {
				per_tage = 0;
			}
			amount_percent += per_tage;
			var rate = parent.find('.rate').val()-0;
			if(j == 1) {
				var total_amount = $('#total_balance').val()-0;
				var us_down = $('#amount_1').val();
				var down_pay = us_down;
				var loan_amount = total_amount - down_pay;
				balance = loan_amount;
			}else {
				balance = parent.prev().find('.balance_').val()-0;
			}
			var new_rate = balance * (rate_all/100);
			var payment = balance * (per_tage/100);
			amount_pay += payment;
			var total_payment = payment + new_rate;
			amount_total_payment += total_payment;
			var balance = balance - payment;
			
			//alert(total_percent +" | "+ amount_percent);
			//alert(new_rate +" | "+ payment +" | "+ total_payment +" | "+ balance);
			
			if(total_percent != amount_percent) {
				parent.find('.rate').val(formatDecimal(new_rate));
				parent.find('.rate_').val(formatDecimal(new_rate));
				parent.find('.payment_amt').val(formatDecimal(payment));
				parent.find('.payment_').val(formatDecimal(payment));
				parent.find('.total_payment').val(formatDecimal(total_payment));
				parent.find('.total_payment_').val(formatDecimal(total_payment));
				parent.find('.balance').val(formatDecimal(balance));
				parent.find('.balance_').val(formatDecimal(balance));
			}else{
				if(i == 1) {
					parent.find('.rate').val(formatDecimal(new_rate));
					parent.find('.rate_').val(formatDecimal(new_rate));
					parent.find('.payment_amt').val(formatDecimal(payment));
					parent.find('.payment_').val(formatDecimal(payment));
					parent.find('.total_payment').val(formatDecimal(total_payment));
					parent.find('.total_payment_').val(formatDecimal(total_payment));
					parent.find('.balance').val(formatDecimal(balance));
					parent.find('.balance_').val(formatDecimal(balance));
				}else {
					parent.find('.rate').val(formatDecimal(new_rate));
					parent.find('.rate_').val(formatDecimal(new_rate));
					parent.find('.payment_amt').val("");
					parent.find('.payment_').val(formatDecimal(payment));
					parent.find('.total_payment').val("");
					parent.find('.total_payment_').val(formatDecimal(total_payment));
					parent.find('.balance').val("");
					parent.find('.balance_').val(formatDecimal(balance));
				}
				i++;
			}
			j++;
		});
		$('.total_percen').val(formatDecimal(amount_percent));
		$('.total_pay').val(formatDecimal(amount_pay));
		$('.total_amount').val(formatDecimal(amount_total_payment));
	}
});
//==============================end loan=================================

if (gift_card_no = localStorage.getItem('gift_card_no')) {
	$('#gift_card_no').val(gift_card_no);
}
$('#gift_card_no').change(function (e) {
	localStorage.setItem('gift_card_no', $(this).val());
});

if (amount_1 = localStorage.getItem('amount_1')) {
	$('#amount_1').val(amount_1);
}
$('#amount_1').change(function (e) {
	localStorage.setItem('amount_1', $(this).val());
});

if (total_balance_1 = localStorage.getItem('total_balance_1')) {
	$('#total_balance_1').val(total_balance_1);
}
$('#total_balance_1').change(function (e) {
	localStorage.setItem('total_balance_1', $(this).val());
});

if (paid_by_1 = localStorage.getItem('paid_by_1')) {
	$('#paid_by_1').val( paid_by_1);
}
$('#paid_by_1').change(function (e) {
	localStorage.setItem('paid_by_1', $(this).val());
});

if (pcc_holder_1 = localStorage.getItem('pcc_holder_1')) {
	$('#pcc_holder_1').val(pcc_holder_1);
}
$('#pcc_holder_1').change(function (e) {
	localStorage.setItem('pcc_holder_1', $(this).val());
});

if (pcc_type_1 = localStorage.getItem('pcc_type_1')) {
	$('#pcc_type_1').select2("val", pcc_type_1);
}
$('#pcc_type_1').change(function (e) {
	localStorage.setItem('pcc_type_1', $(this).val());
});

if (pcc_month_1 = localStorage.getItem('pcc_month_1')) {
	$('#pcc_month_1').val( pcc_month_1);
}
$('#pcc_month_1').change(function (e) {
	localStorage.setItem('pcc_month_1', $(this).val());
});

if (pcc_year_1 = localStorage.getItem('pcc_year_1')) {
	$('#pcc_year_1').val(pcc_year_1);
}
$('#pcc_year_1').change(function (e) {
	localStorage.setItem('pcc_year_1', $(this).val());
});

if (pcc_no_1 = localStorage.getItem('pcc_no_1')) {
	$('#pcc_no_1').val(pcc_no_1);
}
$('#pcc_no_1').change(function (e) {
	var pcc_no = $(this).val();
	localStorage.setItem('pcc_no_1', pcc_no);
	var CardType = null;
	var ccn1 = pcc_no.charAt(0);
	if(ccn1 == 4)
		CardType = 'Visa';
	else if(ccn1 == 5)
		CardType = 'MasterCard';
	else if(ccn1 == 3)
		CardType = 'Amex';
	else if(ccn1 == 6)
		CardType = 'Discover';
	else
		CardType = 'Visa';

	$('#pcc_type_1').select2("val", CardType);
});

if (cheque_no_1 = localStorage.getItem('cheque_no_1')) {
	$('#cheque_no_1').val(cheque_no_1);
}
$('#cheque_no_1').change(function (e) {
	localStorage.setItem('cheque_no_1', $(this).val());
});

if (payment_note_1 = localStorage.getItem('payment_note_1')) {
	$('#payment_note_1').redactor('set', payment_note_1);
}
$('#payment_note_1').redactor('destroy');
$('#payment_note_1').redactor({
	buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
	formattingTags: ['p', 'pre', 'h3', 'h4'],
	minHeight: 100,
	changeCallback: function (e) {
		var v = this.get();
		localStorage.setItem('payment_note_1', v);
	}
});

var old_payment_term;
$('#slpayment_term').focus(function () {
	old_payment_term = $(this).val();
}).change(function (e) {
	var new_payment_term = $(this).val() ? parseFloat($(this).val()) : 0;
	if (!is_numeric($(this).val())) {
		$(this).val(old_payment_term);
		bootbox.alert(lang.unexpected_value);
		return;
	} else {
		localStorage.setItem('slpayment_term', new_payment_term);
		$('#slpayment_term').val(new_payment_term);
	}
});
if (slpayment_term = localStorage.getItem('slpayment_term')) {
	$('#slpayment_term').val(slpayment_term);
}

var old_shipping;
$('#slshipping').focus(function () {
	old_shipping = $(this).val();
}).change(function () {
	if (!is_numeric($(this).val())) {
		$(this).val(old_shipping);
		//bootbox.alert(lang.unexpected_value);
		//old_shipping = $(this).val(0);
		return;
	} else {
		shipping = $(this).val() ? parseFloat($(this).val()) : '0';
	}
	localStorage.setItem('slshipping', shipping);
	var gtotal = ((total + invoice_tax) - order_discount) + shipping;
	$('#gtotal').text(formatMoney(gtotal));
	$('#tship').text(formatMoney(shipping));
});
if (slshipping = localStorage.getItem('slshipping')) {
	shipping = parseFloat(slshipping);
	$('#slshipping').val(shipping);
} else {
	shipping = 0;
}
$('#add_sale, #edit_sale').attr('disabled', true);
$(document).on('change', '.rserial', function () {
	var item_id = $(this).closest('tr').attr('data-item-id');
	slitems[item_id].row.serial = $(this).val();
	localStorage.setItem('slitems', JSON.stringify(slitems));
});

// If there is any item in localStorage
if (localStorage.getItem('slitems')) {
	loadItems();
}
	// clear localStorage and reload
	$('#reset').click(function (e) {
		bootbox.confirm(lang.r_u_sure, function (result) {
			if (result) {
				if (localStorage.getItem('slitems')) {
					localStorage.removeItem('slitems');
				}
				if (localStorage.getItem('sldiscount')) {
					localStorage.removeItem('sldiscount');
				}
				if (localStorage.getItem('sltax2')) {
					localStorage.removeItem('sltax2');
				}
				if (localStorage.getItem('slshipping')) {
					localStorage.removeItem('slshipping');
				}
				if (localStorage.getItem('slref')) {
					localStorage.removeItem('slref');
				}
				if (localStorage.getItem('slwarehouse')) {
					localStorage.removeItem('slwarehouse');
				}
				if (localStorage.getItem('slnote')) {
					localStorage.removeItem('slnote');
				}
				if (localStorage.getItem('slinnote')) {
					localStorage.removeItem('slinnote');
				}
				if (localStorage.getItem('slcustomer')) {
					localStorage.removeItem('slcustomer');
				}
				if (localStorage.getItem('slcurrency')) {
					localStorage.removeItem('slcurrency');
				}
				if (localStorage.getItem('sldate')) {
					localStorage.removeItem('sldate');
				}
				if (localStorage.getItem('slstatus')) {
					localStorage.removeItem('slstatus');
				}
				if (localStorage.getItem('slbiller')) {
					localStorage.removeItem('slbiller');
				}
				if (localStorage.getItem('gift_card_no')) {
					localStorage.removeItem('gift_card_no');
				}

				$('#modal-loading').show();
				location.reload();
			}
		});
});

// save and load the fields in and/or from localStorage

$('#slref').change(function (e) {
	localStorage.setItem('slref', $(this).val());
});
if (slref = localStorage.getItem('slref')) {
	$('#slref').val(slref);
}

$('#slwarehouse').change(function (e) {
	localStorage.setItem('slwarehouse', $(this).val());
});
if (slwarehouse = localStorage.getItem('slwarehouse')) {
	$('#slwarehouse').select2("val", slwarehouse);
}

	$('#slnote').redactor('destroy');
	$('#slnote').redactor({
		buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
		formattingTags: ['p', 'pre', 'h3', 'h4'],
		minHeight: 100,
		changeCallback: function (e) {
			var v = this.get();
			localStorage.setItem('slnote', v);
		}
	});
	if (slnote = localStorage.getItem('slnote')) {
		$('#slnote').redactor('set', slnote);
	}
	$('#slinnote').redactor('destroy');
	$('#slinnote').redactor({
		buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
		formattingTags: ['p', 'pre', 'h3', 'h4'],
		minHeight: 100,
		changeCallback: function (e) {
			var v = this.get();
			localStorage.setItem('slinnote', v);
		}
	});
	if (slinnote = localStorage.getItem('slinnote')) {
		$('#slinnote').redactor('set', slinnote);
	}

	// prevent default action usln enter
	$('body').bind('keypress', function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;
		}
	});

	// Order tax calculation
	if (site.settings.tax2 != 0) {
		$('#sltax2').change(function () {
			localStorage.setItem('sltax2', $(this).val());
			loadItems();
			return;
		});
	}

	// Order discount calculation
	var old_sldiscount;
	$('#sldiscount').focus(function () {
		old_sldiscount = $(this).val();
	}).change(function () {
		var new_discount = $(this).val() ? $(this).val() : '0';
		if (is_valid_discount(new_discount)) {
			localStorage.removeItem('sldiscount');
			localStorage.setItem('sldiscount', new_discount);
			loadItems();
			return;
		} else {
			$(this).val(old_sldiscount);
			bootbox.alert(lang.unexpected_value);
			return;
		}

	});


	/* ----------------------
	 * Delete Row Method
	 * ---------------------- */
	$(document).on('click', '.sldel', function () {
		var row = $(this).closest('tr');
		var item_id = row.attr('data-item-id');
		var qty = $(this).attr('qty');
		var id = $(this).attr('ids');
		var edit = $('#edit_id').val();
		var ware = $('#warehouse_id').val();
		$.ajax({
			type: "GET",
			url: site.base_url+'sales/sale_edit',
			data: {id:id, qty:qty, edit_id:edit, ware:ware},
			dataType: "text",
			success: function(resultData){
				delete slitems[item_id];
				row.remove();
				if(slitems.hasOwnProperty(item_id)) { } else {
					localStorage.setItem('slitems', JSON.stringify(slitems));
					loadItems();
					return;
				}
			}
		});
	});


	/* -----------------------
	 * Edit Row Modal Hanlder
	 ----------------------- */
	 $(document).on('click', '.edit', function () {
		var row = $(this).closest('tr');
		var row_id = row.attr('id');
		item_id = row.attr('data-item-id');
		item = slitems[item_id];
		var qty = row.children().children('.rquantity').val(),
		product_option = row.children().children('.roption').val(),
		unit_price = formatDecimal(row.children().children('.realuprice').val()),
		discount = row.children().children('.rdiscount').val();
		var net_price = unit_price;
		$('#prModalLabel').text(item.row.name + ' (' + item.row.code + ')');
		if (site.settings.tax1) {
			$('#ptax').select2('val', item.row.tax_rate);
	 		$('#old_tax').val(item.row.tax_rate);
	 		var item_discount = 0, ds = discount ? discount : '0';
	 		if (ds.indexOf("%") !== -1) {
	 			var pds = ds.split("%");
	 			if (!isNaN(pds[0])) {
	 				item_discount = parseFloat(((unit_price) * parseFloat(pds[0])) / 100);
	 			} else {
	 				item_discount = parseFloat(ds);
	 			}
	 		} else {
	 			item_discount = parseFloat(ds);
	 		}

	 		var pr_tax = item.row.tax_rate, pr_tax_val = 0;
 		    if (pr_tax !== null && pr_tax != 0) {
 		        $.each(tax_rates, function () {
 		        	if(this.id == pr_tax){
 			        	if (this.type == 1) {

 			        		if (slitems[item_id].row.tax_method == 0) {
 			        			pr_tax_val = formatDecimal(((unit_price) * parseFloat(this.rate)) / (100 + parseFloat(this.rate)));
 			        			pr_tax_rate = formatDecimal(this.rate) + '%';
 			        			net_price -= pr_tax_val;
 			        		} else {
 			        			pr_tax_val = formatDecimal(((unit_price) * parseFloat(this.rate)) / 100);
 			        			pr_tax_rate = formatDecimal(this.rate) + '%';
 			        		}

 			        	} else if (this.type == 2) {

 			        		pr_tax_val = parseFloat(this.rate);
 			        		pr_tax_rate = this.rate;

 			        	}
 			        }
 			    });
 		    }
		}
		if (site.settings.product_serial !== 0) {
			$('#pserial').val(row.children().children('.rserial').val());
		}
		var opt = '<p style="margin: 12px 0 0 0;">n/a</p>';
		if(item.options !== false) {
			var o = 1;
			opt = $("<select id=\"poption\" name=\"poption\" class=\"form-control select\" />");
			$.each(item.options, function () {
				if(o == 1) {
					if(product_option == '') { product_variant = this.id; } else { product_variant = product_option; }
				}
				$("<option />", {value: this.id, text: this.name}).appendTo(opt);
				o++;
			});
		}

		$('#poptions-div').html(opt);
		$('select.select').select2({minimumResultsForSearch: 6});
		$('#pquantity').val(qty);
		$('#old_qty').val(qty);
		$('#pprice').val(unit_price);
		$('#punit_price').val(formatDecimal(parseFloat(unit_price)+parseFloat(pr_tax_val)));
		$('#poption').select2('val', item.row.option);
		$('#old_price').val(unit_price);
		$('#row_id').val(row_id);
		$('#item_id').val(item_id);
		$('#pserial').val(row.children().children('.rserial').val());
		$('#pdiscount').val(discount);
		$('#net_price').text(formatMoney(net_price));
	    $('#pro_tax').text(formatMoney(pr_tax_val));
		$('#prModal').appendTo("body").modal('show');

	});

	$('#prModal').on('shown.bs.modal', function (e) {
		if($('#poption').select2('val') != '') {
			$('#poption').select2('val', product_variant);
			product_variant = 0;
		}
	});

	$(document).on('change', '#pprice, #ptax, #pdiscount', function () {
	    var row = $('#' + $('#row_id').val());
	    var item_id = row.attr('data-item-id');
	    var unit_price = parseFloat($('#pprice').val());
	    var item = slitems[item_id];
	    var ds = $('#pdiscount').val() ? $('#pdiscount').val() : '0';
	    if (ds.indexOf("%") !== -1) {
	        var pds = ds.split("%");
	        if (!isNaN(pds[0])) {
	            item_discount = parseFloat(((unit_price) * parseFloat(pds[0])) / 100);
	        } else {
	            item_discount = parseFloat(ds);
	        }
	    } else {
	        item_discount = parseFloat(ds);
	    }
	    unit_price -= item_discount;
	    var pr_tax = $('#ptax').val(), item_tax_method = item.row.tax_method;
	    var pr_tax_val = 0, pr_tax_rate = 0;
	    if (pr_tax !== null && pr_tax != 0) {
	        $.each(tax_rates, function () {
	        	if(this.id == pr_tax){
		        	if (this.type == 1) {

		        		if (item_tax_method == 0) {
		        			pr_tax_val = formatDecimal(((unit_price) * parseFloat(this.rate)) / (100 + parseFloat(this.rate)));
		        			pr_tax_rate = formatDecimal(this.rate) + '%';
		        			unit_price -= pr_tax_val;
		        		} else {
		        			pr_tax_val = formatDecimal(((unit_price) * parseFloat(this.rate)) / 100);
		        			pr_tax_rate = formatDecimal(this.rate) + '%';
		        		}

		        	} else if (this.type == 2) {

		        		pr_tax_val = parseFloat(this.rate);
		        		pr_tax_rate = this.rate;

		        	}
		        }
		    });
	    }

	    $('#net_price').text(formatMoney(unit_price));
	    $('#pro_tax').text(formatMoney(pr_tax_val));
	});

	/* -----------------------
	 * Edit Row Method
	 ----------------------- */
	 $(document).on('click', '#editItem', function () {
		var row = $('#' + $('#row_id').val());
		var item_id = row.attr('data-item-id'), new_pr_tax = $('#ptax').val(), new_pr_tax_rate = {};
		if (new_pr_tax) {
			$.each(tax_rates, function () {
				if (this.id == new_pr_tax) {
					new_pr_tax_rate = this;
				}
			});
		} else {
			new_pr_tax_rate = false;
		}
		var price = parseFloat($('#pprice').val());
		if (site.settings.product_discount == 1 && $('#pdiscount').val()) {
			if(!is_valid_discount($('#pdiscount').val()) || $('#pdiscount').val() > price) {
				bootbox.alert(lang.unexpected_value);
				return false;
			}
		}
		slitems[item_id].row.qty = parseFloat($('#pquantity').val()),
		slitems[item_id].row.real_unit_price = price,
		slitems[item_id].row.tax_rate = new_pr_tax,
	 	slitems[item_id].tax_rate = new_pr_tax_rate,
		slitems[item_id].row.discount = $('#pdiscount').val() ? $('#pdiscount').val() : '',
		slitems[item_id].row.option = $('#poption').val() ? $('#poption').val() : '',
		slitems[item_id].row.note = $('#pnote').val() ? $('#pnote').val() : '',
		slitems[item_id].row.serial = $('#pserial').val();
		localStorage.setItem('slitems', JSON.stringify(slitems));
		$('#prModal').modal('hide');

		loadItems();
		return;
	});

	/* -----------------------
	 * Product option change
	 ----------------------- */
	 $(document).on('change', '#poption', function () {
		var row = $('#' + $('#row_id').val()), opt = $(this).val();
		var item_id = row.attr('data-item-id');
		var item = slitems[item_id];
		if(item.options !== false) {
			$.each(item.options, function () {
				if(this.id == opt && this.price != 0 && this.price != '' && this.price != null) {
					$('#pprice').val(this.price);
					$("#net_price").text(formatMoney(this.price));
				}
			});
		}
	});

	 /* ------------------------------
	 * Sell Gift Card modal
	 ------------------------------- */
	 $(document).on('click', '#sellGiftCard', function (e) {
		if (count == 1) {
			slitems = {};
			if ($('#slwarehouse').val() && $('#slcustomer').val()) {
				$('#slcustomer').select2("readonly", true);
				$('#slwarehouse').select2("readonly", true);
			} else {
				bootbox.alert(lang.select_above);
				item = null;
				return false;
			}
		}
		$('#gcModal').appendTo("body").modal('show');
		return false;
	});

	 $(document).on('click', '#addGiftCard', function (e) {
		var mid = (new Date).getTime(),
		gccode = $('#gccard_no').val(),
		gcname = $('#gcname').val(),
		gcvalue = $('#gcvalue').val(),
		gccustomer = $('#gccustomer').val(),
		gcexpiry = $('#gcexpiry').val() ? $('#gcexpiry').val() : '',
		gcprice = parseFloat($('#gcprice').val());
		if(gccode == '' || gcvalue == '' || gcprice == '' || gcvalue == 0 || gcprice == 0) {
			$('#gcerror').text('Please fill the required fields');
			$('.gcerror-con').show();
			return false;
		}

		var gc_data = new Array();
		gc_data[0] = gccode;
		gc_data[1] = gcvalue;
		gc_data[2] = gccustomer;
		gc_data[3] = gcexpiry;
		//if (typeof slitems === "undefined") {
		//    var slitems = {};
		//}

		$.ajax({
			type: 'get',
			url: site.base_url+'sales/sell_gift_card',
			dataType: "json",
			data: { gcdata: gc_data },
			success: function (data) {
				if(data.result === 'success') {
					slitems[mid] = {"id": mid, "item_id": mid, "label": gcname + ' (' + gccode + ')', "row": {"id": mid, "code": gccode, "name": gcname, "quantity": 1, "price": gcprice, "real_unit_price": gcprice, "tax_rate": 0, "qty": 1, "type": "manual", "discount": "0", "serial": "", "option":""}, "tax_rate": false, "options":false};
					localStorage.setItem('slitems', JSON.stringify(slitems));
					loadItems();
					$('#gcModal').modal('hide');
					$('#gccard_no').val('');
					$('#gcvalue').val('');
					$('#gcexpiry').val('');
					$('#gcprice').val('');
				} else {
					$('#gcerror').text(data.message);
					$('.gcerror-con').show();
				}
			}
		});
		return false;
	});

	/* ------------------------------
	 * Show manual item addition modal
	 ------------------------------- */
	 $(document).on('click', '#addManually', function (e) {
		if (count == 1) {
			slitems = {};
			if ($('#slwarehouse').val() && $('#slcustomer').val()) {
				$('#slcustomer').select2("readonly", true);
				$('#slwarehouse').select2("readonly", true);
			} else {
				bootbox.alert(lang.select_above);
				item = null;
				return false;
			}
		}
		$('#mnet_price').text('0.00');
		$('#mpro_tax').text('0.00');
		$('#mModal').appendTo("body").modal('show');
		return false;
	});

	 $(document).on('click', '#addItemManually', function (e) {
		var mid = (new Date).getTime(),
		mcode = $('#mcode').val(),
		mname = $('#mname').val(),
		mtax = parseInt($('#mtax').val()),
		mqty = parseFloat($('#mquantity').val()),
		mdiscount = $('#mdiscount').val() ? $('#mdiscount').val() : '0',
		unit_price = parseFloat($('#mprice').val()),
		mtax_rate = {};
		$.each(tax_rates, function () {
			if (this.id == mtax) {
				mtax_rate = this;
			}
		});

		slitems[mid] = {"id": mid, "item_id": mid, "label": mname + ' (' + mcode + ')', "row": {"id": mid, "code": mcode, "name": mname, "quantity": mqty, "price": unit_price, "unit_price": unit_price, "real_unit_price": unit_price, "tax_rate": mtax, "tax_method": 0, "qty": mqty, "type": "manual", "discount": mdiscount, "serial": "", "option":""}, "tax_rate": mtax_rate, "options":false};
		localStorage.setItem('slitems', JSON.stringify(slitems));
		loadItems();
		$('#mModal').modal('hide');
		$('#mcode').val('');
		$('#mname').val('');
		$('#mtax').val('');
		$('#mquantity').val('');
		$('#mdiscount').val('');
		$('#mprice').val('');
		return false;
	});

	$(document).on('change', '#mprice, #mtax, #mdiscount', function () {
	    var unit_price = parseFloat($('#mprice').val());
	    var ds = $('#mdiscount').val() ? $('#mdiscount').val() : '0';
	    if (ds.indexOf("%") !== -1) {
	        var pds = ds.split("%");
	        if (!isNaN(pds[0])) {
	            item_discount = parseFloat(((unit_price) * parseFloat(pds[0])) / 100);
	        } else {
	            item_discount = parseFloat(ds);
	        }
	    } else {
	        item_discount = parseFloat(ds);
	    }
	    unit_price -= item_discount;
	    var pr_tax = $('#mtax').val(), item_tax_method = 0;
	    var pr_tax_val = 0, pr_tax_rate = 0;
	    if (pr_tax !== null && pr_tax != 0) {
	        $.each(tax_rates, function () {
	        	if(this.id == pr_tax){
		        	if (this.type == 1) {

		        		if (item_tax_method == 0) {
		        			pr_tax_val = formatDecimal(((unit_price) * parseFloat(this.rate)) / (100 + parseFloat(this.rate)));
		        			pr_tax_rate = formatDecimal(this.rate) + '%';
		        			unit_price -= pr_tax_val;
		        		} else {
		        			pr_tax_val = formatDecimal(((unit_price) * parseFloat(this.rate)) / 100);
		        			pr_tax_rate = formatDecimal(this.rate) + '%';
		        		}

		        	} else if (this.type == 2) {

		        		pr_tax_val = parseFloat(this.rate);
		        		pr_tax_rate = this.rate;

		        	}
		        }
		    });
	    }

	    $('#mnet_price').text(formatMoney(unit_price));
	    $('#mpro_tax').text(formatMoney(pr_tax_val));
	});

	/* --------------------------
	 * Edit Row Quantity Method
	 -------------------------- */
	 var old_row_qty;
	 $(document).on("focus", '.rquantity', function () {
		old_row_qty = $(this).val();
	}).on("change", '.rquantity', function () {
		var row = $(this).closest('tr');
		if (!is_numeric($(this).val())) {
			$(this).val(old_row_qty);
			bootbox.alert(lang.unexpected_value);
			return;
		}
		var new_qty = parseFloat($(this).val()),
		item_id = row.attr('data-item-id');
		slitems[item_id].row.qty = new_qty;
		localStorage.setItem('slitems', JSON.stringify(slitems));
		loadItems();
	});

	/* --------------------------
	 * Edit Row Price Method
	 -------------------------- */
	 var old_price;
	 $(document).on("focus", '.rprice', function () {
		old_price = $(this).val();
	}).on("change", '.rprice', function () {
		var row = $(this).closest('tr');
		if (!is_numeric($(this).val())) {
			$(this).val(old_price);
			bootbox.alert(lang.unexpected_value);
			return;
		}
		var new_price = parseFloat($(this).val()),
		item_id = row.attr('data-item-id');
		slitems[item_id].row.price = new_price;
		localStorage.setItem('slitems', JSON.stringify(slitems));
		loadItems();
	});

	$(document).on("click", '#removeReadonly', function () {
		$('#slcustomer').select2('readonly', false);
		//$('#slwarehouse').select2('readonly', false);
		return false;
	});


});
/* -----------------------
 * Misc Actions
 ----------------------- */

// hellper function for customer if no localStorage value
function nsCustomer() {
	$('#slcustomer').select2({
		minimumInputLength: 1,
		ajax: {
			url: site.base_url + "customers/suggestions",
			dataType: 'json',
			quietMillis: 15,
			data: function (term, page) {
				return {
					term: term,
					limit: 10
				};
			},
			results: function (data, page) {
				if (data.results != null) {
					return {results: data.results};
				} else {
					return {results: [{id: '', text: 'No Match Found'}]};
				}
			}
		}
	});
}
//localStorage.clear();
function loadItems() {

	if (localStorage.getItem('slitems')) {
		total = 0;
		count = 1;
		an = 1;
		product_tax = 0;
		invoice_tax = 0;
		product_discount = 0;
		order_discount = 0;
		total_discount = 0;

		$("#slTable tbody").empty();
		slitems = JSON.parse(localStorage.getItem('slitems'));
		$('#add_sale, #edit_sale').attr('disabled', false);
		var no=1;
		$.each(slitems, function () {
			var item = this;
			var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
			slitems[item_id] = item;

			var product_id = item.row.id, item_type = item.row.type, item_promotion = item.row.promotion, item_pro_price = item.row.promo_price, combo_items = item.combo_items, item_price = item.row.price, item_qty = item.row.qty, item_aqty = item.row.quantity, item_tax_method = item.row.tax_method, item_ds = item.row.discount, item_discount = 0, item_option = item.row.option, item_code = item.row.code, item_serial = item.row.serial, item_note = item.row.note, item_name = item.row.name.replace(/"/g, "&#034;").replace(/'/g, "&#039;");
			var unit_price = item.row.real_unit_price;
			var pn = item_note ? item_note : '';
			var ds = item_ds ? item_ds : '0';
			if (ds.indexOf("%") !== -1) {
				var pds = ds.split("%");
				if (!isNaN(pds[0])) {

					//item_discount = formatDecimal(parseFloat(((item_price) * parseFloat(pds[0])) / 100));
                    //number.toFixed(20).slice(0,-18)
					item_discount = (((unit_price) * parseFloat(pds[0])) / 100);
                    //item_discount -= item_discount%.01;
				} else {
					//item_discount = formatDecimal(ds);
					item_discount = (ds);
				}
			} else {
				 item_discount = parseFloat(ds);
			}
			product_discount += parseFloat(item_discount * item_qty);
			
			unit_price = formatDecimal(unit_price);
			var pr_tax = item.tax_rate;
			var pr_tax_val = 0, pr_tax_rate = 0;
			if (site.settings.tax1 == 1) {
				if (pr_tax !== false) {
					if (pr_tax.type == 1) {

						if (item_tax_method == '0') {
							pr_tax_val = formatDecimal(((unit_price) * parseFloat(pr_tax.rate)) / (100 + parseFloat(pr_tax.rate)));
							pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
						} else {
							pr_tax_val = formatDecimal(((unit_price) * parseFloat(pr_tax.rate)) / 100);
							pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
						}

					} else if (pr_tax.type == 2) {

						pr_tax_val = parseFloat(pr_tax.rate);
						pr_tax_rate = pr_tax.rate;

					}
					product_tax += pr_tax_val * item_qty;
				}
			}
			item_price = item_tax_method == 0 ? formatDecimal(unit_price-pr_tax_val) : formatDecimal(unit_price);
			unit_price = formatDecimal(unit_price+item_discount);
			var sel_opt = '';
			$.each(item.options, function () {
				if(this.id == item_option) {
					sel_opt = this.name;
				}
			});
			
			/*
			 var customer_selected_id = localStorage.getItem('slcustomer');
			 var cust_percentage = 0;
			 $.ajax({
				 url: site.base_url + "sales/getMakeupCost/"+ customer_selected_id,
				 async: false,
				 dataType: "json",
				 success: function(data){
					 if(data !== false && data.makeup_cost == 1){
						cust_percentage = data.percent / 100;
					 }
				 }
			 });
			 */
			 
			var row_no = (new Date).getTime();
			var newTr = $('<tr id="row_' + row_no + '" class="row_' + item_id + '" data-item-id="' + item_id + '"></tr>');
			tr_html ='<td class="text-center"><span class="text-center">#'+no+'</span></td>';
			tr_html += '<td><input name="product_id[]" type="hidden" class="rid" value="' + product_id + '"><input name="product_type[]" type="hidden" class="rtype" value="' + item_type + '"><input name="product_code[]" type="hidden" class="rcode" value="' + item_code + '"><input name="product_name[]" type="hidden" class="rname" value="' + item_name + '"><input name="product_option[]" type="hidden" class="roption" value="' + item_option + '"><input name="product_note[]" type="hidden" class="rnote" value="' + pn + '"><span class="sname" id="name_' + row_no + '">' + (item_promotion == 1 ? '<i class="fa fa-check-circle"></i> ' : '') + item_name + ' (' + item_code + ')'+(sel_opt != '' ? ' ('+sel_opt+')' : '') + (pn != '' ? ' (<span id="get_not">' + pn + '</span>)' : '') + '</span> <i class="pull-right fa fa-edit tip pointer edit" id="' + row_no + '" data-item="' + item_id + '" title="Edit" style="cursor:pointer;"></i></td>';
			
			if (site.settings.product_serial == 1) {
				tr_html += '<td class="text-right"><input class="form-control input-sm rserial" name="serial[]" type="text" id="serial_' + row_no + '" value="'+item_serial+'"></td>';
			}
			if (item_promotion == 1){
				tr_html += '<td class="text-right"><input class="form-control input-sm text-right rprice" name="net_price[]" type="hidden" id="price_' + row_no + '" value="' + item_pro_price + '"><input class="ruprice" name="unit_price[]" type="hidden" value="' + item_pro_price + '"><input class="realuprice" name="real_unit_price[]" type="hidden" value="' + item_pro_price + '"><span class="text-right sprice" id="sprice_' + row_no + '">' + formatMoney(item_pro_price) + '</span></td>';
			}else{
				tr_html += '<td class="text-right"><input class="form-control input-sm text-right rprice" name="net_price[]" type="hidden" id="price_' + row_no + '" value="' + item_price + '"><input class="ruprice" name="unit_price[]" type="hidden" value="' + unit_price + '"><input class="realuprice" name="real_unit_price[]" type="hidden" value="' + item.row.real_unit_price + '"><span class="text-right sprice" id="sprice_' + row_no + '">' + formatMoney(item_price) + '</span></td>';
			}
			
			tr_html += '<td><input class="form-control text-center rquantity" name="quantity[]" type="text" value="' + formatDecimal(item_qty) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '" onClick="this.select();"></td>';
			if (site.settings.product_discount == 1) {
				tr_html += '<td class="text-right"><input class="form-control input-sm rdiscount" name="product_discount[]" type="hidden" id="discount_' + row_no + '" value="' + item_ds + '"><span class="text-right sdiscount text-danger" id="sdiscount_' + row_no + '">' + toFixed(item_discount * item_qty, 2) + '</span></td>';
			}
			if (site.settings.tax1 == 1) {
				tr_html += '<td class="text-right"><input class="form-control input-sm text-right rproduct_tax" name="product_tax[]" type="hidden" id="product_tax_' + row_no + '" value="' + pr_tax.id + '"><span class="text-right sproduct_tax" id="sproduct_tax_' + row_no + '">' + (parseFloat(pr_tax_rate) != 0 ? '(' + pr_tax_rate + ')' : '') + ' ' + formatMoney(pr_tax_val * item_qty) + '</span></td>';
			}
			if (item_promotion == 1){
				tr_html += '<td class="text-right"><span class="text-right ssubtotal" id="subtotal_' + row_no + '">' + formatMoney(((parseFloat(item_pro_price-item_discount) + parseFloat(pr_tax_val)) * parseFloat(item_qty))) + '</span><input type="hidden" name="grand_total[]" value="'+ formatDecimal(((parseFloat(item_pro_price-item_discount) + parseFloat(pr_tax_val)) * parseFloat(item_qty))) +'"></td>';
			}else{
				tr_html += '<td class="text-right"><span class="text-right ssubtotal" id="subtotal_' + row_no + '">' + formatMoney(((parseFloat(item_price-item_discount) + parseFloat(pr_tax_val)) * parseFloat(item_qty))) + '</span><input type="hidden" name="grand_total[]" value="'+ formatDecimal(((parseFloat(item_price-item_discount) + parseFloat(pr_tax_val)) * parseFloat(item_qty))) +'"></td>';
			}

			tr_html += '<td class="text-center"><i class="fa fa-times tip pointer sldel" id="' + row_no + '" title="Remove" style="cursor:pointer;" ids="'+ product_id +'" qty="'+item_qty+'"></i></td>';
			newTr.html(tr_html);
			newTr.prependTo("#slTable");
			// total += formatDecimal(item_price * item_qty);
			if (item_promotion == 1){
				total += formatDecimal(((parseFloat(item_pro_price-item_discount) + parseFloat(pr_tax_val)) * parseFloat(item_qty)));
			}else{
				total += formatDecimal(((parseFloat(item_price-item_discount) + parseFloat(pr_tax_val)) * parseFloat(item_qty)));
			}
			count += parseFloat(item_qty);
			an++;

			if (item_type == 'standard' && item.options !== false) {
				$.each(item.options, function () {
					if(this.id == item_option && item_qty > this.quantity) {
						$('#row_' + row_no).addClass('danger');
						if(site.settings.overselling != 1) { $('#add_sale, #edit_sale').attr('disabled', true); }
					}
				});
			} else if(item_type == 'standard' && item_qty > item_aqty) {
				$('#row_' + row_no).addClass('danger');
				if(site.settings.overselling != 1) { $('#add_sale, #edit_sale').attr('disabled', true); }
			} else if (item_type == 'combo') {
				if(combo_items === false) {
					$('#row_' + row_no).addClass('danger');
					if(site.settings.overselling != 1) { $('#add_sale, #edit_sale').attr('disabled', true); }
				} else {
					$.each(combo_items, function() {
					   if(parseFloat(this.quantity) < (parseFloat(this.qty)*item_qty) && this.type == 'standard') {
						   $('#row_' + row_no).addClass('danger');
						   if(site.settings.overselling != 1) { $('#add_sale, #edit_sale').attr('disabled', true); }
					   }
				   });
				}
			}
			no++;
		});

		var col = 3;
        if (site.settings.product_serial == 1) { col++; }
		var tfoot = '<tr id="tfoot" class="tfoot active"><th colspan="'+col+'">Total</th><th class="text-center">' + formatNumber(parseFloat(count) - 1) + '</th>';
		if (site.settings.product_discount == 1) {
			tfoot += '<th class="text-right">'+toFixed(product_discount, 2)+'</th>';
		}
		if (site.settings.tax1 == 1) {
			tfoot += '<th class="text-right">'+formatMoney(product_tax)+'</th>';
		}
		
		tfoot += '<th class="text-right"><input type="hidden" name="total_balance" id="total_balance" class="total_balance" value="'+total+'" />'+formatMoney(total)+'</th><th class="text-center"><i class="fa fa-trash-o" style="opacity:0.5; filter:alpha(opacity=50);"></i></th></tr>';
		
		$('#slTable tfoot').html(tfoot);

		// Order level discount calculations
		if (sldiscount = localStorage.getItem('sldiscount')) {
			var ds = sldiscount;
			if (ds.indexOf("%") !== -1) {
				var pds = ds.split("%");
				if (!isNaN(pds[0])) {
					order_discount = parseFloat(((total) * parseFloat(pds[0])) / 100);
				} else {
					order_discount = parseFloat(ds);
				}
			} else {
				order_discount = parseFloat(ds);
			}
			//total_discount += parseFloat(order_discount);
		}

        // Order level tax calculations
		if (site.settings.tax2 != 0) {
			if (sltax2 = localStorage.getItem('sltax2')) {
				$.each(tax_rates, function () {
					if (this.id == sltax2) {
						if (this.type == 2) {
							invoice_tax = formatDecimal(this.rate);
						}
						if (this.type == 1) {
							invoice_tax = formatDecimal(((total - order_discount) * this.rate) / 100);
						}
					}
				});
			}
		}

		total_discount = parseFloat(order_discount + product_discount);
		// Totals calculations after item addition
		var gtotal = parseFloat(((total + invoice_tax) - order_discount) + shipping);
		$('#total').text(formatMoney(total));
		$('#titems').text((an - 1) + ' (' + formatNumber(parseFloat(count) - 1) + ')');
		$('#total_items').val((parseFloat(count) - 1));
		//$('#tds').text('('+formatMoney(product_discount)+'+'+formatMoney(order_discount)+')'+formatMoney(total_discount));
		$('#tds').text(formatMoney(order_discount));
		if (site.settings.tax2 != 0) {
			$('#ttax2').text(formatMoney(invoice_tax));
		}
		$('#tship').text(formatMoney(shipping));
		$('#gtotal').text(formatMoney(gtotal));
		var pas = $('#slpayment_status').val();
		if(pas == 'paid'){
			$('#amount_1').val(formatMoney(gtotal));
		}
		
		$("input[name='other_amount[]']").each(function() {
			var rate = $(this).attr('rate');
			var valu = rate * gtotal;
			$(this).val(formatMoney(valu));
		});
		
		if (an > site.settings.bc_fix && site.settings.bc_fix != 0) {
			$("html, body").animate({scrollTop: $('#slTable').offset().top - 150}, 500);
			$(window).scrollTop($(window).scrollTop() + 1);
		}
		if (count > 1) {
			$('#slcustomer').select2("readonly", true);
			$('#slwarehouse').select2("readonly", true);
		}
		//audio_success.play();
	}
}

/* -----------------------------
 * Add Sale Order Item Function
 * @param {json} item
 * @returns {Boolean}
 ---------------------------- */
 function add_invoice_item(item) {

	if (count == 1) {
		slitems = {};
		if ($('#slwarehouse').val() && $('#slcustomer').val()) {
			$('#slcustomer').select2("readonly", true);
			$('#slwarehouse').select2("readonly", true);
		} else {
			bootbox.alert(lang.select_above);
			item = null;
			return;
		}
	}
	if (item == null) {
		return;
	}
	var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
	if (slitems[item_id]) {
		slitems[item_id].row.qty = parseFloat(slitems[item_id].row.qty) + 1;
	} else {
		slitems[item_id] = item;
	}
	
	//slitems[makeup_cost] = 0;

	localStorage.setItem('slitems', JSON.stringify(slitems));
	loadItems();
	return true;
}

if (typeof (Storage) === "undefined") {
	$(window).bind('beforeunload', function (e) {
		if (count > 1) {
			var message = "You will loss data!";
			return message;
		}
	});
}

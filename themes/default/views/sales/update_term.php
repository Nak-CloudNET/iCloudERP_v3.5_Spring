
<div class="modal-dialog" style="width:70%;">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="fa fa-2x">&times;</i>
            </button>
            <h4 class="modal-title" id="myModalLabel"><?php echo lang('change_payment_term'); ?></h4>
        </div>
        <?php $attrib = array('data-toggle' => 'validator', 'role' => 'form');
        echo form_open_multipart("sales/changeLoanTerm/". $sale_id, $attrib); ?>
        <div class="modal-body">
            <p><?= lang('enter_info'); ?></p>
			
			<div class="depreciation_1">
				<div class="row">
					<div class="col-md-3">
						<div class="form-group">
							<?= lang('amount', 'amount') ?>
							<input name="amount" type="text" id="amount"
								   class="form-control amount" value="<?= $this->erp->formatMoney($owned_loan->total_principle) ?>"
								   readonly />
						</div>
					</div>
					<div class="col-md-3">
						<div class="form-group">
							<?= lang('depreciation_rate_1', 'depreciation_rate_1') ?>
							<input name="depreciation_rate1" type="text" id="depreciation_rate_1"
								   class="form-control depreciation_rate1" value="<?= $this->erp->formatNumber($loan_rate->rated) ?>"
								   placeholder="<?= lang('rate (%)') ?>"/>
						</div>
					</div>
					<div class="col-md-3">
						<div class="form-group">
							<?= lang('depreciation_term', 'depreciation_term_1') ?>
							<input name="depreciation_term" type="text" id="depreciation_term_1"
								   class="form-control kb-pad" value="<?= $left_term ?>"
								   placeholder="<?= lang('term (month)') ?>"/>
							<input type="hidden" id="current_date" class="current_date" class="current_date[]" value="<?php echo date('m/d/Y'); ?>" />
						</div>
					</div>
					<div class="col-md-3">
						<div class="form-group">
							<?= lang('depreciation_type', 'depreciation_type_1') ?>
							<select name="depreciation_type" id="depreciation_type_1"
									class="form-control depreciation_type"
									placeholder="<?= lang('payment_type') ?>">
								
								<option value="1" <?= (($sale->depreciation_type == '1')? 'selected':'') ?> ><?= lang("Normal"); ?></option>
								<option value="2" <?= (($sale->depreciation_type == '2')? 'selected':'') ?> ><?= lang("Custom"); ?></option>
								<option value="3" <?= (($sale->depreciation_type == '3')? 'selected':'') ?> ><?= lang("Fixed"); ?></option>
								<option value="4" <?= (($sale->depreciation_type == '4')? 'selected':'') ?> ><?= lang("Normal(Fixed)"); ?></option>
							</select>
							<!-- <input type="text" id="pcc_type_1" class="form-control" placeholder="<?= lang('card_type') ?>" />-->
						</div>
					</div>
				</div>
				<div class="form-group">

					<div class="dep_tbl" style="display:none;">
						<table border="1" width="100%" class="table table-bordered table-condensed tbl_dep" id="tbl_dep">
							<tbody>

							</tbody>
						</table>
						<table id="export_tbl" width="70%" style="display:none;">

						</table>
					</div>
				</div>
			</div>
        </div>
        <div class="modal-footer">
			<input type="hidden" name="val" id="val" value="" />
            <?php echo form_submit('save', lang('save'), 'class="btn btn-primary"'); ?>
        </div>
    </div>
    <?php echo form_close(); ?>
</div>
<script type="text/javascript" src="<?= $assets ?>js/custom.js"></script>
<script type="text/javascript" charset="UTF-8">
    $.fn.datetimepicker.dates['erp'] = <?=$dp_lang?>;
</script>
<?= $modal_js ?>
<script type="text/javascript" charset="UTF-8">
    $(document).ready(function () {
		
				
		$("#depreciation_type_1").val('<?=$sale->depreciation_type?>').trigger('change');
	
		//==============================loan add by chin=========================
		$(document).on('change','#depreciation_type_1, #depreciation_rate_1, #depreciation_term_1',function() {
			var p_type = $('#depreciation_type_1').val();
			var rate = $('#depreciation_rate_1').val()-0;
			var term = $('#depreciation_term_1').val()-0;
			var str = $('#amount').val();
			var total_amount = str.replace(',', '');
			var loan_amount = total_amount;
			
			if(loan_amount && rate && term && p_type && total_amount) {
				depreciation(loan_amount,rate,term,p_type,total_amount);
			}
		}).trigger("change");

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
						var str = $('#amount').val();
						var total_amount = str.replace(',', '');
						var loan_amount = total_amount;
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

	});
</script>

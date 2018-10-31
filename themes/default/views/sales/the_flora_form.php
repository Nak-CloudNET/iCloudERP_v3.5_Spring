<!DOCTYPE html>
<html>
<head>
	<title>Contract Home Sale</title>
	<!-- <link rel="stylesheet" type="text/css" href="bootstrap/css/style.css"> -->
	<!-- <link href='https://fonts.googleapis.com/css?family=Moul' rel='stylesheet'> -->
	<!-- <link href='https://fonts.googleapis.com/css?family=Battambang' rel='stylesheet'> -->
	<meta charset="UTF-8">
	<!-- <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet"> -->
	<link href="<?php echo $assets ?>styles/theme.css" rel="stylesheet">
	<style type="text/css">
		body{
			text-align: justify;
			text-justify: inter-word;
		}
		.moul{
			font-family: Khmer OS Muol Light !important;
		}
		.font-kh-bt{
			font-family: Khmer OS Battambang !important;
		}
	</style>
</head>
<body>	
		<div class='container'>
			<div class="col-lg-8 col-lg-offset-2">
			<div class='row text-center col-lg-12'>
				<h4 class="moul">ព្រះរាជាណាចក្រកម្ពុជា</h4>
				<p class="font-kh-bt" style="font-size: 16px;">ជាតិ​  សាសនា  ព្រះមហាក្សត្រ</p>
				<br>
				<p class="moul" style="font-size: 15px;">កិច្ចសន្យាបង់រម្លស់</p>
			</div>
			
			<div class='row col-lg-12 font-kh-bt'>
				<p><b><u>យោង:</u></b>កិច្ចព្រមព្រៀងទិញ-លក់ផ្ទះលេខ <?php if(is_array($rows)){ foreach($rows as $row){ echo $row->cf3.", "; }}?>  ដែលបានធ្វើឡើងនៅភ្នំពេញថ្ងៃទី <?=$date_day;?> ខែ <?=$month_kh;?> ឆ្នាំ​ <?=$date_year?> កិច្ចសន្យានេះធ្វើឡើង
				នៅថ្ងៃទី <?=$date_day;?> ខែ <?=$month_kh;?> ឆ្នាំ​ <?=$date_year?> រវាង:</p>
				<p><b><?php if($saller->gender == 'male'){echo '-	លោក ';}else{echo '-	អ្នកនាង​ ';}?><?php if($saller->saller_kh !=''){echo $saller->saller_kh;}else{echo $saller->saller;}?></b>  ភេទ <?=$saller->gender;?> កើតនៅថ្ងៃទី <?=$db_date;?> ខែ <?=$db_month;?> ឆ្នាំ​ <?=$db_year?> សញ្ជាតិ <?php if($saller->nationality_kh){echo $saller->nationality_kh;}else{echo $saller->nationality;}?> កាន់អត្តសញ្ញាណប័ណ្ណលេខ 010644566433  ជាម្ចាស់ <b><?php if($saller->company_kh){echo $saller->company_kh;}else{echo $saller->company;}?></b> គំរោង <b><?php if($saller->company_kh){echo $saller->company_kh;}else{echo $saller->company;}?></b> មានអាសយដ្ឋាននៅ <?php if($saller->village){?>ភូមិ <?=$saller->village;}?> <?php if($saller->sangkat){?>សង្កាត់ <?=$saller->sangkat;}?> <?php if($saller->district){?>ខ័ណ្ឌ<?=$saller->district;}?> <?php if($saller->city){?><?=$saller->city;}?> <?php if($saller->country){?><?=$saller->country;}?> ជាភាគីអ្នកលក់ ចាប់ពីពេលនេះតទៅហៅថាភាគី”ក”និង</p>

				<p><b><?php if($customer->gender == 'male'){echo '-	លោក ';}else{echo '-	អ្នកនាង​ ';}?></b><?php if($customer->name_kh){echo $customer->name_kh;}else{echo $customer->name;}?> ភេទ <?=$customer->gender;?> កើតនៅថ្ងៃទី <?=$dbcus_date;?> ខែ <?=$dbcus_month;?> ឆ្នាំ​ <?=$dbcus_year?> <?php if(isset($customer->nationality)){?>សញ្ជាតិ <?=$customer->nationality;}?> កាន់អត្តសញ្ញាណប័ណ្ណលេខ dt535765733454 ចុះថ្ងៃទី <?=$date_day;?> ខែ <?=$month_kh;?> ឆ្នាំ​ <?=$date_year?> និងលោកស្រី...................... ភេទ..............  កើតនៅថ្ងៃទី ................................. សញ្ជាតិ..................  កាន់អត្តសញ្ញាណប័ណ្ណលេខ .............................. ចុះថ្ងៃទី ......................... មានអាសយដ្ឋានរួមនៅ ផ្ទះលេខ 68 <?php if($customer->street){?>ផ្លូវ <?=$customer->street;}?> <?php if($customer->village){?>ភូមិ <?=$customer->village;}?> <?php if($customer->sangkat){?>សង្កាត់ <?=$customer->sangkat;}?> <?php if($customer->district){?>ខណ្ឌ <?=$customer->district;}?> <?php if($customer->city){echo $customer->city;}?> <?php if($customer->phone){?>ទូរស័ព្ទលេខ <?=$customer->phone;}?> ជាភាគីអ្នកទិញដែលចាប់ពីពេលនេះតទៅហៅកាត់ថាភាគី”ខ”។</p>
				<p>ភាគី“ខ” បានយល់ព្រមបង់រម្លស់<b>(ថ្លៃទិញ-លក់ផ្ទះ)</b> អោយទៅភាគី“ក” ដោយស្ម័គ្រចិត្តហើយភាគី“ក” ក៏មានឯកភាពអោយ ភាគី“ខ” បង់រម្លស់ដោយស្ម័គ្រចិត្តដូចខាងក្រោម:</p><br>
			</div><br>
			
			<div class="row text-center col-lg-12 font-kh-bt">
				<p><b><u>ភាគីទាំងពីរបានព្រមព្រៀងគ្នាដូចតទៅ :</u></b></p><br>
			</div>
			<div class='row col-lg-12 font-kh-bt'>
				<p><b>ប្រការទី១:រយះពេល និងទឹកប្រាក់ដែលត្រូវបង់រម្លស់</b></p>
				<p>ចាប់ពីចុះហត្ថលេខាលើកិច្ចព្រមព្រៀងនេះភាគី “ខ” មានកាតព្វកិច្ចត្រូវបង់រម្លស់សមតុល្យនៃថ្លៃទិញផ្ទះជាទឹកប្រាក់ចំនួន
				<?=$this->erp->formatMoney($product->subtotal);?>( ........... ដុល្លារអាមេរិក) សម្រាប់រយះពេល <?=round($duration->duration);?> <b>(.......)</b>ឆ្នាំក្នុងអត្រាការប្រាក់<b>12%</b>(ដប់ពីរភាគរយ)ក្នុង១ឆ្នាំ។ភាគី“ខ”ត្រូវសងតាមឥណប្រតិទានប្រចាំខែចំនួន........លើកចំនួនទឹកប្រាក់...............ដុល្លារអាមេរិកដោយបង់រម្លស់ប្រាក់ដើមបូក
				នឹងការប្រាក់ ហើយនឹងត្រូវកែសំរួលនៅឥណប្រតិទានចុងក្រោយ។</p>
				<p><b>ប្រការទី២:ការបំពានកាតព្វកិច្ចរបស់ភាគី “ខ”</b></p>
				<ul style='list-style-type:none'>
					<li><b>២.១.</b>ក្នុងករណីដែលភាគី“ខ”មិនបានបង់ប្រាក់តាមកាលកំណត់ដូចដែលមានចែងក្នុងប្រការ១ខាងលើទេនោះភាគី“ខ”នឹង
					<div style="text-indent: 32px;">ត្រូវមានកាតព្វកិច្ចបង់ប្រាក់ពិន័យដូចខាងក្រោម :</div></li>
					<li style="margin-left: 35px;">• ករណីយឺតយ៉ាវ <b>០៧ ដល់៣០ថ្ងៃ</b>ភាគី “ខ”ត្រូវបង់ប្រាក់ពិន័យឲ្យភាគី“ក” ចំនួន <b>៥%</b> (ប្រាំភាគរយ)ក្នុងមួយខែនៃ <div style="text-indent: 13px;">ទឹកប្រាក់ដែលត្រូវបង់ដោយគិតតាមចំនួនថ្ងៃដែលយឺត។</div></li>
					<li><b>២.២.</b>ករណីភាគី“ខ”ខកខានមិនបានបង់ប្រាក់តាមកាលកំណត់តាមឥណប្រតិទានរបស់ប្រាក់បង់រម្លស់មួយលើកឬច្រើន
					<div style="text-indent: 32px;">លើករួមជាមួយការប្រាក់និងប្រាក់ពិន័យតាមការកំណត់ក្នុងរយះពេល៣១ថ្ងៃកិច្ចសន្យានេះនឹងត្រូវរំលាយជាស្វ័យប្រ</div>
					<div style="text-indent: 32px;">វត្តិ។ក្នុងករណីនេះភាគី“ក”មានសិទ្ធគ្រប់គ្រាន់ទទួលយកប្រាក់ទាំងអស់ដែលភាគី“ខ”បានបង់និងមានសិទ្ធិគ្រប់គ្រាន់</div>
					<div style="text-indent: 32px;">ប្រើប្រាស់អាស្រ័យផលនិងចាត់ចែងអចលនទ្រព្យនេះ។</div"></li>
				</ul>
				<p><b>ប្រការទី៣ : អំពីសិទ្ធភាគី “ខ”</b></p>
				<ul style='list-style-type:none'>
					<li><b>៣.១.</b>ភាគី“ខ”មានសិទ្ធបង់រម្លស់ប្រាក់ដើមអោយភាគី“ក”ខ្លះឬបង់ទាំងអស់មុនកាលកំណត់នៃកិច្ចព្រមព្រៀងនេះដោយពុំ
					<div style="text-indent: 32px;">មានការផាកពិន័យអ្វីឡើយហើយទឹកប្រាក់ដែលត្រូវបង់ប្រចាំខែនឹងមានការប្រែប្រួលទៅតាមតារាងបង់ប្រាក់ដែលភាគី“ក”</div>
					<div style="text-indent: 32px;">ចេញជូនជាថ្មី។ </div></li>
					<li><b>៣.២.</b>បន្ទាប់ពីភាគី “ខ” បានបង់ប្រាក់ថ្លៃទិញផ្ទះគ្រប់ចំនួននោះភាគី “ក”នឹងរៀបចំឯកសារផ្ទេរកម្មសិទ្ធ(ប្លង់រឹង)ជូនទៅភាគី
					<div style="text-indent: 32px;">“ខ”ដែលភាគី“ខ”ជាអ្នកចំណាយលើសេវាកម្មរត់ការឯកសារពន្ធប្រថាប់ត្រា និងសេវាផ្សេងៗទៀត ។</div></li>
					<li><b>៣.៣.</b>ភាគី“ខ”នឹងមិនអនុញ្ញាតិឲ្យមានការដាក់បញ្ចាំឬការធានាផលប្រយោជន៍លើផ្ទះដែលទិញនេះឡើយលុះត្រាតែភាគី
					<div style="text-indent: 32px;">“ខ”បានបង់ប្រាក់ចប់សព្វគ្រប់ឬមានការយល់ព្រមជាលាយលក្ខអក្សរពីភាគី“ក”ជាមុន។</div></li>
				</ul>
				<p><b>ប្រការទី៤ : អវសានប្បញ្ញត្តិ </b></p>
				<ul style='list-style-type:none'>
					<li><b>៤.១.</b>កិច្ចសន្យានេះ នឹងត្រូវគ្របដណ្តប់ដោយច្បាប់នៃព្រះរាជាណាចក្រកម្ពុជា។</li>
					<li><b>៤.២.</b>កិច្ចព្រមព្រៀងនេះនឹងអាចកែប្រែបានលុះត្រាតែមានការព្រមព្រៀងគ្នាជាថ្មីហើយមានសុពលភាព ចាប់ពីពេលចុះ
					<div style="text-indent: 32px;">ហត្ថលេខានេះតទៅ។</div></li>
					<li><b>៤.៣.</b>កិច្ចព្រមព្រៀងនេះធ្វើឡើងជាភាសាខ្មែរចំនួន ០២ ច្បាប់មានតម្លៃស្មើគ្នា ដែលត្រូវតម្កល់ទុកនៅភាគី“ខ” ចំនួនមួយ <div style="text-indent: 32px;">ច្បាប់និង ភាគី “ក” ចំនួនមួយច្បាប់ ។</div> </li>
					<li><b>៤.៤.</b>ដោយបានអាននិងយល់ច្បាស់អំពីខ្លឹមសារទាំងមូលនៃកិច្ចសន្យានេះភាគីទាំងពីរអនុវត្តតាមកិច្ចសន្យានេះដោយផ្តិត
					<div style="text-indent: 32px;">ស្នាមមេដៃនៅចំពោះមុខសាក្សីដូចខាងក្រោម។</div></li>
				</ul>
			</div>
			<div class="row col-lg-12 font-kh-bt">
				<p><span class='pull-right'>រាជធានីភ្នំពេញ ថ្ងៃទី……….ខែ…………….ឆ្នាំ…………….</span></p>
			</div>
			<div class="row col-lg-12 font-kh-bt">
				<p><span class='pull-left'>ស្នាមមេដៃស្តាំ</span> <span class='pull-right'>ស្នាមមេដៃស្តាំ</span></p>
			</div>
			<div class='row col-lg-12 font-kh-bt'>
				<p><span class='pull-left'>ភាគី<b>”ក”</b>អ្នកលក់</span>
				<span style='margin-left: 35%'>សាក្សី</span> 
				 <span class='pull-right'>ភាគី<b>”ខ”</b> អ្នកទិញ</span></p>
			</div>
			
			<div class='row col-lg-12 font-kh-bt'>
				<br>
				<br>
				<br>
				<br>
				<br>
				<p>………………………………………………………………………………………………</p>
				<p>(មានភ្ជាប់ជូននូវតារាងបង់ប្រាក់ ក្នុង<b>ឧបសម្ព័ន្ធ ខ</b>)</p>
			</div>
		</div>
	</div>
	</div>
	 
</body>
</html>
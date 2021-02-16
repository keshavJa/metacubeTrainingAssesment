
function empTextValidation(str) {
	var fnameObj = document.getElementById("fname");
	let fnameValueStr = fnameObj.value;
	// for employee 
	if(str == 'empFnameFun'){
		empFnameFun(fnameValueStr);
	}
	if(str == 'empGenderFun'){
		empGenderFun(fnameValueStr);
	}
	if(str == 'empEmail'){
		empEmailFun(fnameValueStr);
	}
	if(str == 'empPwd'){
		empPasswordFun(fnameValueStr);
	}
	if(str == 'empCnfPwd'){
		empCnfPasswordFun(fnameValueStr);
	}
	if(str == 'empContNumber'){
		empContNumberFun(fnameValueStr);
	}
	
	// For Vehicle
	
	if(str == 'vehicleMakeCompny'){
		vehicleMakeCompnyFun(fnameValueStr);
	}
	if(str == 'vehicleModel'){
		vehicleModelFun(fnameValueStr);
	}
	if(str == 'vehicleType'){
		vehicleTypeFun(fnameValueStr);
	}
	if(str == 'vehicleNumber'){
		vehicleNumberFun(fnameValueStr);
	}
	if(str == 'vehicleEmpId'){
		vehicleEmpIdFun(fnameValueStr);
	}	
	if(str == 'vehicleIdentification'){
		vehicleIdentificationFun(fnameValueStr);
	}
	
	// for Feedback
	if(str == 'givefeedbackName'){
		givefeedbackNameFun(fnameValueStr);
	}
	if(str == 'feedbackEmail'){
		feedbackEmailFun(fnameValueStr);
	}
	if(str == 'feedbackSubject'){
		feedbackSubjectFun(fnameValueStr);
	}
	if(str == 'feedbackMessage'){
		feedbackMessageFun(fnameValueStr);
	}
	
} 

function empFnameFun(fnameValueStr){
	if(fnameValueStr.length >1 && allLetter(fnameValueStr)){
		let labelValue = "Hi "+ fnameValueStr +"! Can I know your gender";
		document.getElementById('empGenderLabel').innerHTML = labelValue;
		document.getElementById('empGenderRow').style.display = 'block';
		document.getElementById('empFnameId').style.display = 'none'; 
	}
	else{
		document.getElementById("fname").value = '';
		alert ("Name should more than 1 character or Please input alphabet characters only. PLease check space at bigging or at end");
	}
}

function allLetter(inputtxt){ 
	//var letters = /^(\w+\s?)*\s*$/;
	let regexForName = /^[a-zA-Z][\sa-zA-Z]+[a-zA-Z]+$/;
	if(inputtxt.match(regexForName))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function empGenderFun(fnameValueStr){
	document.getElementById('empGenderRow').style.display = 'none';
	let labelValue = "Hi "+ fnameValueStr +"! Can I know your Email";
	document.getElementById('empEmailLabel').innerHTML = labelValue;
	document.getElementById('empEmailRow').style.display = 'block';
}

function empEmailFun(fnameValueStr){
	var empEmailObj = document.getElementById("empEmail");
	let empEmailStr = empEmailObj.value;
	if( ValidateEmail(empEmailStr)){
		let labelValue = "Hi "+ fnameValueStr +"! Please enter your password";
		document.getElementById('emppasswordLabel').innerHTML = labelValue;
		document.getElementById('empEmailRow').style.display = 'none';
		document.getElementById('empPasswordRow').style.display = 'block';
	}
	else{
		alert("You have entered an invalid email address!");
	}
}

function ValidateEmail(email) {
	var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	var mailFormatRegex = /^[\w.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z]+.[a-zA-Z]+$/;
	if (email.match(mailFormatRegex))
	{
		return (true);
	}
	return (false);
}


function empPasswordFun(fnameValueStr){
	var empPasswordObj = document.getElementById("empPwd");
	let empPasswordStr = empPasswordObj.value;
	if(CheckPassword(empPasswordStr)){
		if(empPasswordStr.length == 8){
			document.getElementById("empPwd").style.border= '1px solid red';
		}
		if(empPasswordStr.length == 9){
			document.getElementById("empPwd").style.border= '1px solid orange';
		}
		if(empPasswordStr.length >10){
			document.getElementById("empPwd").style.border= '1px solid green';
		}
		let labelValue = "Hi "+ fnameValueStr +"! Please confirm your password";
		document.getElementById('empCnfPasswordLabel').innerHTML = labelValue;
		document.getElementById('empPasswordRow').style.display = 'none';
		document.getElementById('empConfirmPasswordRow').style.display = 'block';
	}
}

function CheckPassword(inputtxt) { 
	//var passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
	var passwordFormat = /^(?=(\w)*[a-z])(?=(\w)*[A-Z])(?=(\w)*[0-9])(\w){8,20}$/;
	if(inputtxt.match(passwordFormat)) 
	{ 
		return true;
	}
	else
	{ 
		alert('Password should contains Uppercase, Lowercase, Numeric, Alphanumeric, and length minimum 8');
		return false;
	}
}
function empCnfPasswordFun(fnameValueStr){
	let passwordObj = document.getElementById("empPwd");
	let cnfPasswordObj = document.getElementById("empCnfPwd");
	if(passwordObj.value == cnfPasswordObj.value){
		
		let labelValue = "Hi "+ fnameValueStr +"! Can I know your Contact Number";
		document.getElementById('empContNumberLabel').innerHTML = labelValue;
		document.getElementById('empConfirmPasswordRow').style.display = 'none';
		document.getElementById('empContactRow').style.display = 'block';
	}
	else{
		alert("Your password is not matched!!!");
	}
}

function empContNumberFun(){
	let empContNumObj = document.getElementById("empContNumber");
	let empContNumObjStr = empContNumObj.value;
	if(isAllNumeric(empContNumObjStr) ){
		document.getElementById('empContactRow').style.display = 'none';
		document.getElementById("divTab1").style.height= 0+'px';
		document.getElementById("divTab2").style.height= 150+'px';
		document.getElementById('empFnameId').style.display = 'block'; 
	}
	else{
		alert("Contact Number should be greater 8 than and leass than 10 and Numeric Only");
	}
}

function isAllNumeric(inputtxt){
      //var numbers = /^[0-9]+$/;
	  var numbers = /^\d{8,10}$/;
	  var contNumStr = inputtxt.toString();
      if(inputtxt.match(numbers))
      {
		  return true;
      }
      else
      {
		  return false;
      } 
} 

function hideNavTab(click){
	if(click == 'divTab1'){
		document.getElementById("divTab1").style.height= 150+'px';
		document.getElementById("divTab2").style.height= 0+'px';
		document.getElementById("divTab3").style.height= 0+'px';
		document.getElementById("divTab4").style.height= 0+'px';
	}
	if(click == 'divTab2'){
		document.getElementById("divTab2").style.height= 150+'px';
		document.getElementById("divTab1").style.height= 0+'px';
		document.getElementById("divTab3").style.height= 0+'px';
		document.getElementById("divTab4").style.height= 0+'px';
	}
	if(click == 'divTab3'){
		document.getElementById("divTab3").style.height= 150+'px';
		document.getElementById("divTab2").style.height= 0+'px';
		document.getElementById("divTab1").style.height= 0+'px';
		document.getElementById("divTab4").style.height= 0+'px';
	}
	if(click == 'divTab4'){
		document.getElementById("divTab4").style.height= 850+'px';
		document.getElementById("divTab2").style.height= 0+'px';
		document.getElementById("divTab3").style.height= 0+'px';
		document.getElementById("divTab1").style.height= 0+'px';
	}
}
/*Start vehicle Validation Functions */
function vehicleMakeCompnyFun(fnameValueStr){
	let labelValue = "Hi "+ fnameValueStr +"! Can I know your Vehicle Model:";
	document.getElementById('vehicleModelLabel').innerHTML = labelValue;
	document.getElementById('vehicleModelRow').style.display = 'block';
	document.getElementById('vehicleMakeRow').style.display = 'none'; 
}

function vehicleModelFun(fnameValueStr){
	let labelValue = "Hi "+ fnameValueStr +"! Can I know your Vehicle Type:";
	document.getElementById('vehicleTypeLabel').innerHTML = labelValue;
	document.getElementById('vehicleModelRow').style.display = 'none';
	document.getElementById('vehicleTypeRow').style.display = 'block'; 
	
}

function vehicleTypeFun(fnameValueStr){
	let labelValue = "Hi "+ fnameValueStr +"! Can I know your Vehicle Number:";
	document.getElementById('vehicleNumberLabel').innerHTML = labelValue;
	document.getElementById('vehicleTypeRow').style.display = 'none';
	document.getElementById('vehicleNumberRow').style.display = 'block'; 
	
	/* price section detail change data */ 
	var vehicleType = document.getElementById('vehicleType');
	let vehicleTypeValue = vehicleType.options[vehicleType.selectedIndex].value;
	
	var currencyType = document.getElementById('currencyType');
	let defaultCurrType = currencyType.options[currencyType.selectedIndex].value; 
	setPriceSectionDetail(vehicleTypeValue,defaultCurrType);
	
}

function vehicleNumberFun(fnameValueStr){
	let labelValue = "Hi "+ fnameValueStr +"! Can I know your Emp Id:";
	document.getElementById('vehicleEmpIdLabel').innerHTML = labelValue;
	document.getElementById('vehicleNumberRow').style.display = 'none';
	document.getElementById('vehicleEmpIdRow').style.display = 'block'; 
}

function vehicleEmpIdFun(fnameValueStr){
	let labelValue = "Hi "+ fnameValueStr +"! share your vehicle identification:";
	document.getElementById('vehicleIdentificationLabel').innerHTML = labelValue;
	document.getElementById('vehicleEmpIdRow').style.display = 'none';
	document.getElementById('vehicleIdentificationRow').style.display = 'block'; 
}

function vehicleIdentificationFun(fnameValueStr){
	document.getElementById('vehicleIdentificationRow').style.display = 'none';	
	document.getElementById("divTab2").style.height= 0+'px';
	document.getElementById("divTab3").style.height= 150+'px';
	document.getElementById('vehicleMakeRow').style.display = 'block'; 
}

/*End vehicle Validation Functions */

/*Start:-  Feedback Validation Functions */

function givefeedbackNameFun(fnameValueStr){
	let labelValue = "Hi "+ fnameValueStr +"! Can I know your Email ID:";
	document.getElementById('feedbackEmailLabel').innerHTML = labelValue;
	document.getElementById('feedbackEmailRow').style.display = 'block';
	document.getElementById('givefeedbackNameRow').style.display = 'none'; 
}

function feedbackEmailFun(fnameValueStr){
	let labelValue = "Hi "+ fnameValueStr +"! Please mention subject:";
	document.getElementById('feedbackSubjectLabel').innerHTML = labelValue;
	document.getElementById('feedbackEmailRow').style.display = 'none';
	document.getElementById('feedbackSubjectRow').style.display = 'block'; 
	
}

function feedbackSubjectFun(fnameValueStr){
	let labelValue = "Hi "+ fnameValueStr +"! Please share your feedback:";
	document.getElementById('feedbackMessageLabel').innerHTML = labelValue;
	document.getElementById('feedbackSubjectRow').style.display = 'none';
	document.getElementById('feedbackMessageRow').style.display = 'block'; 
	
}

function feedbackMessageFun(fnameValueStr){
	document.getElementById('feedbackMessageRow').style.display = 'none'; 
	document.getElementById("divTab3").style.height= 0+'px';
	document.getElementById("divTab4").style.height= 450+'px'; 
	document.getElementById('givefeedbackNameRow').style.display = 'block';
}

/*End:-  Feedback Validation Functions */

/*  Start: validation for Price section */
function setPriceSectionDetail(vehiclType, defaultCurrType){
	
	document.getElementById('vehicleHeader1').innerHTML = vehiclType;
	document.getElementById('vehicleHeader2').innerHTML = vehiclType;
	document.getElementById('vehicleHeader3').innerHTML = vehiclType;
	
	if(vehiclType == 'Cycle'){
		setPriceSectionByCycle(vehiclType,defaultCurrType);
	}
	if(vehiclType == 'MotorCycle'){
		setPriceSectionByMotorCycle(vehiclType ,defaultCurrType);
	}
	if(vehiclType == 'FourWheeler'){
		setPriceSectionByFourWheeler(vehiclType,defaultCurrType);
	}
}

function setPriceSectionByCycle(vehiclType,defaultCurrType){
	
	if(defaultCurrType == 'INR'){ 
		document.getElementById('pricePara11').innerHTML = '5&#8377;';
		document.getElementById('pricePara21').innerHTML = '100&#8377;';
		document.getElementById('pricePara31').innerHTML = '500&#8377;';
	}
	if(defaultCurrType == 'USD'){ 
		document.getElementById('pricePara11').innerHTML = convertINRtoUSD(5);
		document.getElementById('pricePara21').innerHTML = convertINRtoUSD(100);
		document.getElementById('pricePara31').innerHTML = convertINRtoUSD(500);
	}
	
	
	if(defaultCurrType == 'YEN'){ 
		document.getElementById('pricePara11').innerHTML = convertINRtoYen(5);
		document.getElementById('pricePara21').innerHTML = convertINRtoYen(100);
		document.getElementById('pricePara31').innerHTML = convertINRtoYen(500);
	}
	
}


function setPriceSectionByMotorCycle(vehiclType,defaultCurrType){
	
	if(defaultCurrType == 'INR'){ 
		document.getElementById('pricePara11').innerHTML = '10&#8377;';
		document.getElementById('pricePara21').innerHTML = '200&#8377;';
		document.getElementById('pricePara31').innerHTML = '1000&#8377;';
	}
	if(defaultCurrType == 'USD'){ 
		//convertINRinUSD
		document.getElementById('pricePara11').innerHTML = convertINRtoUSD(10);
		document.getElementById('pricePara21').innerHTML = convertINRtoUSD(200);
		document.getElementById('pricePara31').innerHTML = convertINRtoUSD(1000);
	}
	
	
	if(defaultCurrType == 'YEN'){ 
		//convertINRinUSD
		document.getElementById('pricePara11').innerHTML = convertINRtoYen(10);
		document.getElementById('pricePara21').innerHTML = convertINRtoYen(200);
		document.getElementById('pricePara31').innerHTML = convertINRtoYen(1000);
	}
	
}


function setPriceSectionByFourWheeler(vehiclType,defaultCurrType){
	
	if(defaultCurrType == 'INR'){ 
		document.getElementById('pricePara11').innerHTML = '20&#8377;';
		document.getElementById('pricePara22').innerHTML = '500&#8377;';
		document.getElementById('pricePara31').innerHTML = '3500&#8377;';
	}
	if(defaultCurrType == 'USD'){ 
		//convertINRinUSD
		document.getElementById('pricePara11').innerHTML = convertINRtoUSD(20);
		document.getElementById('pricePara21').innerHTML = convertINRtoUSD(500);
		document.getElementById('pricePara31').innerHTML = convertINRtoUSD(3500);
	}
	
	
	if(defaultCurrType == 'YEN'){ 
		//convertINRinUSD
		document.getElementById('pricePara11').innerHTML = convertINRtoYen(20);
		document.getElementById('pricePara21').innerHTML = convertINRtoYen(500);
		document.getElementById('pricePara31').innerHTML = convertINRtoYen(3500);
	}
	
}

function currencyChange(){var vehicleType = document.getElementById('vehicleType');
	var vehicleType = document.getElementById('vehicleType');
	let vehicleTypeValue = vehicleType.options[vehicleType.selectedIndex].value;
	
	var currencyType = document.getElementById('currencyType');
	let defaultCurrType = currencyType.options[currencyType.selectedIndex].value; 
	
	setPriceSectionDetail(vehicleTypeValue,defaultCurrType);
}

function convertINRtoUSD(rupee){
	let val = rupee / 70;
	val = '$' + val.toFixed(2);
	return val;
}

function convertINRtoYen(rupee){
	let val = rupee / .69;
	val = '&#165;' + val.toFixed(2);
	return val;
}

/*  End: validation for Price section */


/* Price set in USD */
function priceSetUp(priceStructure){
	
	var vehicleType = document.getElementById('vehicleType');
	let vehicleTypeValue = vehicleType.options[vehicleType.selectedIndex].value;
	if(priceStructure == 'Daily'){
		document.getElementById('chargesTime').value = 'Daily';
		if(vehicleTypeValue == 'Cycle'){
			document.getElementById('priceINUSD').value = convertINRtoUSD(5);
		}
		if(vehicleTypeValue == 'MotorCycle'){
			document.getElementById('priceINUSD').value = convertINRtoUSD(10);
		}
		if(vehicleTypeValue == 'FourWheeler'){
			document.getElementById('priceINUSD').value = convertINRtoUSD(20);
		}
		
		
	}
	if(priceStructure == 'Monthly'){
		document.getElementById('chargesTime').value = 'Monthly';
		if(vehicleTypeValue == 'Cycle'){
			document.getElementById('priceINUSD').value = convertINRtoUSD(100);
		}
		if(vehicleTypeValue == 'MotorCycle'){
			document.getElementById('priceINUSD').value = convertINRtoUSD(200);
		}
		if(vehicleTypeValue == 'FourWheeler'){
			document.getElementById('priceINUSD').value = convertINRtoUSD(500);
		}
		
	}
	if(priceStructure == 'Yearly'){
		document.getElementById('chargesTime').value = 'Yearly';
		if(vehicleTypeValue == 'Cycle'){
			document.getElementById('priceINUSD').value = convertINRtoUSD(500);
		}
		if(vehicleTypeValue == 'MotorCycle'){
			document.getElementById('priceINUSD').value = convertINRtoUSD(1000);
		}
		if(vehicleTypeValue == 'FourWheeler'){
			document.getElementById('priceINUSD').value = convertINRtoUSD(3500);
		}
		
	}
}
function do_division(){
	
	var first_number = +(document.getElementById('first_number').value);
    var second_number = +(document.getElementById('second_number').value);
	if(first_number > 127){
		alert("Wrong first number!");
		return(null);
	}
	if(second_number > 127){
		alert("Wrong second number!");
		return(null);
	}
	var first_number_binary = "0" + first_number.toString(2);
	var second_number_binary = "0" + second_number.toString(2);
	var second_number_binary_addit = binary_sum(binary_not(second_number_binary), "1");
	
    var number_of_digits_in_first = first_number_binary.length;
    var number_of_digits_in_second = second_number_binary.length;
	var number_of_digits_in_second_addit = second_number_binary_addit.length;
	
	/*for(var number_of_zeros = 0; number_of_zeros < 8 - number_of_digits_in_first; number_of_zeros++){
		first_number_binary = "0" + first_number_binary;
	}
	
	for(var number_of_zeros = 0; number_of_zeros < 8 - number_of_digits_in_second; number_of_zeros++){
		second_number_binary = "0" + second_number_binary;
	}*/
	
    if(number_of_digits_in_first > number_of_digits_in_second){
		var number_of_shifts = number_of_digits_in_first - number_of_digits_in_second;
        second_number_binary = binary_right_add_zeros(second_number_binary, number_of_shifts);
		second_number_binary_addit = binary_right_add_zeros(second_number_binary_addit, number_of_shifts);
    }
    else if(first_number_binary < second_number_binary){
        document.getElementById('result').innerHTML = 0;
		return;
	}
	else
		var number_of_shifts = 0;
	
	var result_number_binary = "0";
	var partial_balance = first_number_binary;
	for(var iteration = 0; iteration < number_of_shifts + 1; iteration++){
		partial_balance = binary_sum(partial_balance, second_number_binary_addit);
		result_number_binary = binary_right_add_zeros(result_number_binary, 1);
		if(partial_balance[0] == "1" && partial_balance.length == number_of_digits_in_first){
			partial_balance = binary_sum(partial_balance, second_number_binary);
			if(partial_balance[0] == "1" && partial_balance.length > number_of_digits_in_first)
				partial_balance = partial_balance.substring(1);
		}
		else if(partial_balance[0] == "0" && partial_balance.length == number_of_digits_in_first){
			result_number_binary = binary_sum(result_number_binary, "1");
		}
		else if(partial_balance[0] == "1" && partial_balance.length > number_of_digits_in_first){
			partial_balance = partial_balance.substring(1);
			result_number_binary = binary_sum(result_number_binary, "1"); 
		}
		partial_balance = binary_left_shift(partial_balance, 1);
	}
	var result_number = parseInt(result_number_binary, 2);
	document.getElementById('result').innerHTML = result_number;
}

document.getElementById('say').addEventListener('click', do_division);
	
function binary_sum(first_term, second_term){
	if(first_term.length < second_term.length)
		first_term = binary_left_add_zeros(first_term, second_term.length - first_term.length);
	if(first_term.length > second_term.length)
		second_term = binary_left_add_zeros(second_term, first_term.length - second_term.length);
	var shift = 0;
	var result = "";
	for(iter = first_term.length - 1; iter >= 0; iter--){
		if(first_term[iter] == "1" && second_term[iter] == "1" && shift == 1){
			result = "1" + result;
			shift = 1;
			continue;
		}
		if((first_term[iter] == "1" && second_term[iter] == "0" && shift == 1) ||
		(first_term[iter] == "0" && second_term[iter] == "1" && shift == 1) ||
		(first_term[iter] == "1" && second_term[iter] == "1" && shift == 0)){
			result = "0" + result;
			shift = 1;
			continue;
		}
		if((first_term[iter] == "0" && second_term[iter] == "0" && shift == 1) ||
		(first_term[iter] == "0" && second_term[iter] == "1" && shift == 0) ||
		(first_term[iter] == "1" && second_term[iter] == "0" && shift == 0)){
			result = "1" + result;
			shift = 0;
			continue;
		}
		if(first_term[iter] == "0" && second_term[iter] == "0" && shift == 0){
			result = "0" + result;
			shift = 0;
			continue;
		}
	}
	if(shift == 1)
		result = "1" + result;
	return result;
} 

function binary_not(operand){
	for(var iter = 0; iter < operand.length; iter++){
		if(iter == 0){
			if(operand[iter] == "1"){
				operand = "0" + operand.substring(iter + 1);
				continue;
			}
			if(operand[iter] == "0"){
				operand = "1" + operand.substring(iter + 1);
				continue;
			}
		}
		else if(iter == operand.length - 1){
			if(operand[iter] == "1"){
				operand = operand.substring(0, iter) + "0";
				continue;
			}
			if(operand[iter] == "0"){
				operand = operand.substring(0, iter) + "1";
				continue;
			}
		}
		else{
			if(operand[iter] == "1"){
				operand = operand.substring(0, iter) + "0" + operand.substring(iter + 1);
				continue;
			}
			if(operand[iter] == "0"){
				operand = operand.substring(0, iter) + "1" + operand.substring(iter + 1);
				continue;
			}
		}
	}
	return operand;
}

function binary_right_add_zeros(operand, number_of_zeros){
	for(var iter = 0; iter < number_of_zeros; iter++){
		operand = operand + "0";
	}
	return operand;
}

function binary_left_shift(operand, number_of_shifts){
	for(var iter = 0; iter < number_of_shifts; iter++){
		operand = operand.substring(1);
		operand = operand + "0";
	}
	return operand;
}

function binary_left_add_zeros(operand, number_of_zeros){
	for(var iter = 0; iter < number_of_zeros; iter++)
		operand = "0" + operand;
	return operand;	
}
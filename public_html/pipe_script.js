/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function do_division(){

	//ввод, преобразование
    var first_number = +(document.getElementById('first_number').value);
    var second_number = +(document.getElementById('second_number').value);
    var first_number_binary = parseInt(first_number.toString(2), 2); //переделать?
	//first_number_binary = parseInt(first_number_binary, 10);
    var second_number_binary = parseInt(second_number.toString(2), 2); //переделать?
	//second_number_binary = parseInt(second_number_binary, 10);
    var second_number_binary_addit = ~second_number_binary + 1;
 //document.getElementById('result').innerHTML = first_number_binary;  
 //document.getElementById('result').innerHTML = second_number_binary;  
 //document.getElementById('result').innerHTML = second_number_binary_addit;  
    
    //вычисляем количество цифр в обоих числах
    var number_of_digits_in_first;
    var residue_of_first = first_number_binary;
	
    //document.write(number_of_digits_in_first + "   ");
    //document.write(number_of_digits_in_second + "   ");
    //document.write(residue_of_first + "   ");
    
	
    for(number_of_digits_in_first = 0b0; residue_of_first > 0b0; number_of_digits_in_first++){
        residue_of_first = residue_of_first >> 1;
    }
    var number_of_digits_in_second;
    var residue_of_second = second_number_binary;
    for(number_of_digits_in_second = 0b0; residue_of_second > 0b0; number_of_digits_in_second++){
        residue_of_second = residue_of_second >> 1;
    }
    

    //делаем все необходимые предварительные сдвиги
    if(first_number_binary > second_number_binary){
		var number_of_shifts = number_of_digits_in_first - number_of_digits_in_second;
        second_number_binary = second_number_binary << number_of_shifts;
		second_number_binary_addit = second_number_binary_addit << number_of_shifts;
    }
    else if(first_number_binary < second_number_binary){
        document.getElementById('result').innerHTML = 0;        
		return;
	}
	
	//деление
    var result_number_binary = 0b0;
	var partial_balance = first_number_binary;
	//var partial_balance = first_number_binary.toString(2);
	//second_number_binary_addit = second_number_binary_addit.toString(2);
    for(var iteration = 0; iteration < number_of_shifts + 1; iteration++){
		partial_balance = partial_balance + second_number_binary_addit; //перепиать сложение!!!!!!!!!!!!!!!!
		result_number_binary = result_number_binary << 1;
		var partial_balance = partial_balance.toString(2);
		if(partial_balance[0] == "-"){
			partial_balance = parseInt(partial_balance, 2);
			partial_balance = partial_balance + second_number_binary; //восстановление остатка
			
		}
		/*if(partial_balance.length - number_of_digits_in_first == 1 || partial_balance.length == number_of_digits_in_first){
			partial_balance = parseInt(partial_balance, 2);
			partial_balance = partial_balance + second_number_binary; //восстановление остатка
		}*/
		//else if(partial_balance.length - number_of_digits_in_first == 2 && partial_balance.substr(0,2) == "10"){ //если появляется "10", то преобразуем их в "0" (удаляем)
		else if(partial_balance.length - number_of_digits_in_first == 2 && partial_balance.substr(0,2) == "10"){	
			partial_balance = partial_balance.substring(2);
			result_number_binary = result_number_binary + 0b1;
			partial_balance = parseInt(partial_balance, 2);
		}
		else if(partial_balance.length <= number_of_digits_in_first ){
			result_number_binary = result_number_binary + 0b1;
			partial_balance = parseInt(partial_balance, 2);
		}
		partial_balance = partial_balance << 1; //строка не сдвигается!!!!!!!!!!!!!!!!!!
    }
	document.getElementById('result').innerHTML = result_number_binary;
}

document.getElementById('say').addEventListener('click', do_division);
function do_division(){

	//ввод, преобразование
    var first_number_binary = +(document.getElementById('first_number').value);
    var second_number_binary = +(document.getElementById('second_number').value);
    var second_number_binary_addit = ~second_number_binary + 1; //переводим второе число в дополнительный код
    
    //вычисляем количество цифр в обоих числах
    var number_of_digits_in_first;
    var residue_of_first = first_number_binary;
    
    for(number_of_digits_in_first = 0b0; residue_of_first > 0b0; number_of_digits_in_first++){
        residue_of_first = residue_of_first >> 1;
    } //выясняем, какое количество сдвигов выдержит наше число. Это и будет искомое количество цифр
    var number_of_digits_in_second;
    var residue_of_second = second_number_binary;
    for(number_of_digits_in_second = 0b0; residue_of_second > 0b0; number_of_digits_in_second++){
        residue_of_second = residue_of_second >> 1;
    }
    
    //делаем все необходимые предварительные сдвиги
    if(first_number_binary > second_number_binary){ //если цифр больше в первом числе
		var number_of_shifts = number_of_digits_in_first - number_of_digits_in_second;
        second_number_binary = second_number_binary << number_of_shifts; //сдвигаем
		second_number_binary_addit = second_number_binary_addit << number_of_shifts;
    }
    else if(first_number_binary < second_number_binary){ //если цифр больше во втором числе
        document.getElementById('result').innerHTML = 0; //сразу записываем 0       
		return;
	}
	else //если поровну
		var number_of_shifts = 0; //не сдвигаем
	
	//деление
    var result_number_binary = 0b0;
	var partial_balance = first_number_binary;
    for(var iteration = 0; iteration < number_of_shifts + 1; iteration++){
		partial_balance = partial_balance + second_number_binary_addit;
		result_number_binary = result_number_binary << 1; //сдвигаем конечное число
		partial_balance = partial_balance.toString(2);
		if(partial_balance[0] === "-"){ //если в знаковом разряде - 1
			partial_balance = parseInt(partial_balance, 2);
			partial_balance = partial_balance + second_number_binary; //восстановливаем остаток
		}
		else if(partial_balance.length <= number_of_digits_in_first ){ //если в знаковом разряде - 0
			result_number_binary = result_number_binary + 0b1; //добавляем единицу
			partial_balance = parseInt(partial_balance, 2);
		}
		partial_balance = partial_balance << 1; //делаем сдвиг частичного остатка перед переходом на следующую итерацию
    }
	document.getElementById('result').innerHTML = result_number_binary;
}

document.getElementById('say').addEventListener('click', do_division);
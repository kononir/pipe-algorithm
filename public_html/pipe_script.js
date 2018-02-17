/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function do_division(){


    var first_number = +(document.getElementById('first_number').value);
    var second_number = +(document.getElementById('second_number').value);
    var first_number_binary = parseInt(first_number.toString(2), 10);
	//first_number_binary = parseInt(first_number_binary, 10);
    var second_number_binary = parseInt(second_number.toString(2), 10);
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
    document.write(residue_of_first + "   ");
    
    for(number_of_digits_in_first = 0; residue_of_first > 0; number_of_digits_in_first++){
        residue_of_first = residue_of_first >> 1;
    }
    var number_of_digits_in_second;
    var residue_of_second = second_number_binary;
    for(number_of_digits_in_second = 0; residue_of_second > 0; number_of_digits_in_second++){
        residue_of_second = residue_of_second << 1;
    }
    

    var number_of_shifts = number_of_digits_in_first - number_of_digits_in_second;
    if(number_of_digits_in_first > number_of_digits_in_second){
        second_number_binary = second_number_binary << number_of_shifts;
        var bigest_number = first_number_binary;
    }
    else if(number_of_digits_in_first < number_of_digits_in_second)
        document.getElementById('result').innerHTML = 0;        
    second_number_binary_addit = second_number_binary_addit << number_of_shifts;
	
	
    var result_number = 0;
    var result_number_binary = result_number.toString(2);
    for(var iteration = 0; iteration < number_of_shifts + 1; iteration++){
		var partial_balance = first_number_binary + second_number_binary_addit;
		result_number_binary = result_number_binary << 1;
		if(partial_balance > bigest_number){
			
		}
    }

}

document.getElementById('say').addEventListener('click', do_division);
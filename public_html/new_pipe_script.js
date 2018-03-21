document.getElementById('run').addEventListener('click', do_operations);

function do_operations(){
	var first_mas_of_numbers = (document.getElementById('first_numbers').value).split(',');
	var second_mas_of_numbers = (document.getElementById('second_numbers').value).split(',');
	var table = document.createElement("table");
	var firstRow = table.insertRow(0);
	firstRow.insertCell(0);
	var maxNumberOfStages = 0;
	var masOfCellNumber = [];
	
	for(var numberOfPair = 1; numberOfPair < 4; numberOfPair++)
		document.getElementById("input" + numberOfPair).innerHTML = "Пара " + numberOfPair + ": <" + first_mas_of_numbers[numberOfPair - 1] + "," + second_mas_of_numbers[numberOfPair - 1] + ">";
	
	for(var curentRow = 1; curentRow < 4; curentRow++){
		var row = table.insertRow(curentRow);

		masOfCellNumber[curentRow] = do_division(first_mas_of_numbers[curentRow - 1], second_mas_of_numbers[curentRow - 1], row, curentRow - 1);
		
		if(masOfCellNumber[curentRow] == null){
			alert("Wrong input number!");
			return;
		}
		
		for(var curentCell = curentRow; curentCell < curentRow + masOfCellNumber[curentRow]; curentCell++){
			var trList = table.getElementsByTagName('tr');
			var tdList = trList[0].getElementsByTagName('td');
			if(tdList[curentCell] == undefined){
				var cellLine = "такт " + curentCell;
				add_new_cell(firstRow, curentCell, cellLine);
			}
		}
		
		masOfCellNumber[curentRow] = masOfCellNumber[curentRow] + curentRow;
		if(masOfCellNumber[curentRow] > maxNumberOfStages)
			maxNumberOfStages = masOfCellNumber[curentRow];
	}
	
	for(var curentRow = 1; curentRow < 4; curentRow++){
		var trList = table.getElementsByTagName('tr');
		var tdList = trList[curentRow].getElementsByTagName('td');
		if(masOfCellNumber[curentRow] < maxNumberOfStages){
			var firstCell = masOfCellNumber[curentRow];
			for(var curentCell = firstCell; curentCell < maxNumberOfStages; curentCell++){	
				var cellLine = " ";
				add_new_cell(trList[curentRow], curentCell, cellLine);
			}
		}
	}
	
	document.getElementById("table").appendChild(table);	
}

function do_division(first_number_string, second_number_string, row, numberOfPair, firstRow){
	
	var first_number = +(first_number_string);
	var second_number = +(second_number_string);
	
	if(first_number > 127)
		return(null);
	if(second_number > 127)
		return(null);
	
	var first_number_binary = "0" + first_number.toString(2);
	var second_number_binary = "0" + second_number.toString(2);
	var second_number_binary_addit = binary_sum(binary_not(second_number_binary), "1");
	
	var cellLine = return_shift_cellLine(first_number_binary, second_number_binary);
	cellLine = "пара " + (numberOfPair + 1) + "\n" + cellLine;
	add_new_cell(row, 0, cellLine);
	for(var numberOfEmptyCell = 1; numberOfEmptyCell < numberOfPair + 1; numberOfEmptyCell++)
		add_new_cell(row, numberOfEmptyCell, "");
	
    var number_of_digits_in_first = first_number_binary.length;
    var number_of_digits_in_second = second_number_binary.length;
	var number_of_digits_in_second_addit = second_number_binary_addit.length;
	
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
	
	var numberOfStages = 0; //количество ячеек с этапами в таблице для данной пары чисел
	
	var result_number_binary = "";
	var partial_balance = first_number_binary;
	for(var iteration = 0; iteration < number_of_shifts + 1; iteration++){
		result_number_binary = binary_right_add_zeros(result_number_binary, 1); //сдвиг текущего результата
		
		numberOfStages++;
		cellLine = return_shift_cellLine(result_number_binary, partial_balance);
		cellLine = cellLine + "\n" + "сдвиг результата";
		add_new_cell(row, numberOfStages + numberOfPair, cellLine);
		
		partial_balance = binary_sum(partial_balance, second_number_binary_addit); //вычитание
		
		numberOfStages++;
		cellLine = return_shift_cellLine(result_number_binary, partial_balance);
		cellLine = cellLine + "\n" + "вычитание";
		add_new_cell(row, numberOfStages + numberOfPair, cellLine);
		
		if(partial_balance[0] == "1" && partial_balance.length == number_of_digits_in_first){  //если получаем единицу в старшем разряде частичного остатка
			result_number_binary = binary_sum(result_number_binary, "0"); 					  //то в текущий разряд результата заносим ноль
			
			numberOfStages++;
			cellLine = return_shift_cellLine(result_number_binary, partial_balance);
			cellLine = cellLine + "\n" + "заносим 0";
			add_new_cell(row, numberOfStages + numberOfPair, cellLine);
			
			partial_balance = binary_sum(partial_balance, second_number_binary); //восстановление частичного остатка
			
			numberOfStages++;
			cellLine = return_shift_cellLine(result_number_binary, partial_balance);
			cellLine = cellLine + "\n" + "восстановление";
			add_new_cell(row, numberOfStages + numberOfPair, cellLine);
			
			if(partial_balance[0] == "1" && partial_balance.length > number_of_digits_in_first)
				partial_balance = partial_balance.substring(1);
		}
		else if(partial_balance[0] == "0" && partial_balance.length == number_of_digits_in_first){ //если получаем ноль в старшем разряде частичного остатка
			result_number_binary = binary_sum(result_number_binary, "1"); 						  //то в текущий разряд результата заносим единицу
			
			numberOfStages++;
			cellLine = return_shift_cellLine(result_number_binary, partial_balance);
			cellLine = cellLine + "\n" + "заносим 1";
			add_new_cell(row, numberOfStages + numberOfPair, cellLine);
		}
		else if(partial_balance[0] == "1" && partial_balance.length > number_of_digits_in_first){ //если получаем два в старшем разряде частичного остатка
			partial_balance = partial_balance.substring(1);										 //то в текущий разряд результата заносим единицу
			result_number_binary = binary_sum(result_number_binary, "1");
			
			numberOfStages++;
			cellLine = return_shift_cellLine(result_number_binary, partial_balance);
			cellLine = cellLine + "\n" + "заносим 1";
			add_new_cell(row, numberOfStages + numberOfPair, cellLine);
		}
		partial_balance = binary_left_shift(partial_balance, 1); //сдвиг частичного остатка
		
		numberOfStages++;
		cellLine = return_shift_cellLine(result_number_binary, partial_balance);
		cellLine = cellLine + "\n" + "сдвиг остатка";
		add_new_cell(row, numberOfStages + numberOfPair, cellLine);
	}
	var result_number = parseInt(result_number_binary, 2);
	resultId = numberOfPair + 1;
	resultFinalStageNumber = numberOfStages + numberOfPair;
	document.getElementById('result' + resultId).innerHTML = "Результат " + resultId + ":" + " Число - " + result_number + "; Конечный такт - " + resultFinalStageNumber;
	return numberOfStages;
}
	
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

function add_new_cell(row, numberOfCell, line){
	var cell = row.insertCell(numberOfCell);
	cell.width = 150;
	cell.innerHTML = line;
}

function return_shift_cellLine(result_number_binary, partial_balance){
	return binary_left_add_zeros(result_number_binary, 8 - result_number_binary.length) + "\n" + binary_left_add_zeros(partial_balance, 8 - partial_balance.length);
}
document.getElementById('run').addEventListener('click', main);

function main(){
	var first_mas_of_numbers = (document.getElementById('first_numbers').value).split(',');
	var second_mas_of_numbers = (document.getElementById('second_numbers').value).split(',');
	
	if(!check_input(first_mas_of_numbers, second_mas_of_numbers))
            return;
	
	show_input(first_mas_of_numbers, second_mas_of_numbers);
	
	var numberOfVectors = first_mas_of_numbers.length;
	var masOfPairsOperations = new Array();
	
	for(var iter = 0; iter < numberOfVectors; iter++){
            masOfPairsOperations.push(do_division(first_mas_of_numbers[iter], second_mas_of_numbers[iter]));
	}
	
	draw_table(masOfPairsOperations);
        
        show_output(masOfPairsOperations);
		
}

function do_division(first_number_string, second_number_string){
    var first_number = +(first_number_string);
    var second_number = +(second_number_string);

    var first_number_binary = "0" + first_number.toString(2);
    var second_number_binary = "0" + second_number.toString(2);
    var second_number_binary_addit = binary_sum(binary_not(second_number_binary), "1");
	
    var number_of_digits_in_first = first_number_binary.length;
    var number_of_digits_in_second = second_number_binary.length;
	
    if(number_of_digits_in_first > number_of_digits_in_second){
        var number_of_shifts = number_of_digits_in_first - number_of_digits_in_second;
        second_number_binary = binary_right_add_zeros(second_number_binary, number_of_shifts);
        second_number_binary_addit = binary_right_add_zeros(second_number_binary_addit, number_of_shifts);
    }
    else if(first_number_binary < second_number_binary){
        var arrayOfOperations = new Array();
        
        var currentStep = new Array();
        
        var shift_result_number_binary = return_8bit_shift_number(result_number_binary);
        var shift_partial_balance = return_8bit_shift_number(partial_balance);
        
        var operation1 = ["Сдвиги", shift_result_number_binary, shift_partial_balance];
        currentStep.push(operation1);
        
        var operation2 = ["Вычитание", shift_result_number_binary, shift_partial_balance];
        currentStep.push(operation2);
        
        var operation3 = ["Заносим 0", shift_result_number_binary, shift_partial_balance];
        currentStep.push(operation3);
            
        var operation4 = ["Восстанавливаем остаток", shift_result_number_binary, shift_partial_balance];
        currentStep.push(operation4);    
        
        arrayOfOperations.push(currentStep);
        
        return arrayOfOperations;
    }
    else
        var number_of_shifts = 0;
	
    var result_number_binary = "";
    var partial_balance = first_number_binary;
    var arrayOfOperations = new Array();
    for(var iteration = 0; iteration < number_of_shifts + 1; iteration++){
        var currentStep = new Array();

        /**
         * Сдвиги
         */
        if(iteration !== 0){
            result_number_binary = binary_right_add_zeros(result_number_binary, 1);
            partial_balance = binary_left_shift(partial_balance, 1);
        }

        var shift_result_number_binary = return_8bit_shift_number(result_number_binary);
        var shift_partial_balance = return_8bit_shift_number(partial_balance);
        var operation1 = ["Сдвиги", shift_result_number_binary, shift_partial_balance];
        currentStep.push(operation1);

        /**
         * Вычитание
         */
        partial_balance = binary_sum(partial_balance, second_number_binary_addit);

        shift_result_number_binary = return_8bit_shift_number(result_number_binary);
        shift_partial_balance = return_8bit_shift_number(partial_balance);
        var operation2 = ["Вычитание", shift_result_number_binary, shift_partial_balance];
        currentStep.push(operation2);

        /**
         * Если получаем единицу в старшем разряде частичного остатка
         * то в текущий разряд результата заносим ноль
         * и восстановливаем частичный остаток
         */
        if(partial_balance[0] === "1" && partial_balance.length === number_of_digits_in_first){
            result_number_binary = binary_sum(result_number_binary, "0"); 					 

            shift_result_number_binary = return_8bit_shift_number(result_number_binary);
            shift_partial_balance = return_8bit_shift_number(partial_balance);
            var operation3 = ["Занесение 0", shift_result_number_binary, shift_partial_balance];
            currentStep.push(operation3);

            partial_balance = binary_sum(partial_balance, second_number_binary);

            shift_result_number_binary = return_8bit_shift_number(result_number_binary);
            shift_partial_balance = return_8bit_shift_number(partial_balance);
            var operation4 = ["Восстанавление остатка", shift_result_number_binary, shift_partial_balance];
            currentStep.push(operation4);

            if(partial_balance[0] === "1" && partial_balance.length > number_of_digits_in_first)
                partial_balance = partial_balance.substring(1);
        }
        /**
         * Если получаем ноль в старшем разряде частичного остатка
         * то в текущий разряд результата заносим единицу
         * и делаем фиктивное восстановление остатка
         */
        else if(partial_balance[0] === "0" && partial_balance.length === number_of_digits_in_first){
            result_number_binary = binary_sum(result_number_binary, "1"); 						 

            shift_result_number_binary = return_8bit_shift_number(result_number_binary);
            shift_partial_balance = return_8bit_shift_number(partial_balance);
            var operation5 = ["Занесение 1", shift_result_number_binary, shift_partial_balance];
            currentStep.push(operation5);

            shift_result_number_binary = return_8bit_shift_number(result_number_binary);
            shift_partial_balance = return_8bit_shift_number(partial_balance);
            var operation4 = ["Восстанавление остатка", shift_result_number_binary, shift_partial_balance];
            currentStep.push(operation4);
        }
        /**
         * Если получаем два в старшем разряде частичного остатка
         * то в текущий разряд результата заносим единицу 
         * и делаем фиктивное восстановление остатка
         */
        else if(partial_balance[0] === "1" && partial_balance.length > number_of_digits_in_first){
            partial_balance = partial_balance.substring(1);										 
            result_number_binary = binary_sum(result_number_binary, "1");

            shift_result_number_binary = return_8bit_shift_number(result_number_binary);
            shift_partial_balance = return_8bit_shift_number(partial_balance);
            var operation6 = ["Занесение 1", shift_result_number_binary, shift_partial_balance];
            currentStep.push(operation6);

            shift_result_number_binary = return_8bit_shift_number(result_number_binary);
            shift_partial_balance = return_8bit_shift_number(partial_balance);
            var operation4 = ["Восстанавление остатка", shift_result_number_binary, shift_partial_balance];
            currentStep.push(operation4);
        }

        arrayOfOperations.push(currentStep);
    }

    return arrayOfOperations;
}
	
function binary_sum(first_term, second_term){
	if(first_term.length < second_term.length)
		first_term = binary_left_add_zeros(first_term, second_term.length - first_term.length);
	if(first_term.length > second_term.length)
		second_term = binary_left_add_zeros(second_term, first_term.length - second_term.length);
	var shift = 0;
	var result = "";
	for(iter = first_term.length - 1; iter >= 0; iter--){
		if(first_term[iter] === "1" && second_term[iter] === "1" && shift === 1){
			result = "1" + result;
			shift = 1;
			continue;
		}
		if((first_term[iter] === "1" && second_term[iter] === "0" && shift === 1) ||
		(first_term[iter] === "0" && second_term[iter] === "1" && shift === 1) ||
		(first_term[iter] === "1" && second_term[iter] === "1" && shift === 0)){
			result = "0" + result;
			shift = 1;
			continue;
		}
		if((first_term[iter] === "0" && second_term[iter] === "0" && shift === 1) ||
		(first_term[iter] === "0" && second_term[iter] === "1" && shift === 0) ||
		(first_term[iter] === "1" && second_term[iter] === "0" && shift === 0)){
			result = "1" + result;
			shift = 0;
			continue;
		}
		if(first_term[iter] === "0" && second_term[iter] === "0" && shift === 0){
			result = "0" + result;
			shift = 0;
			continue;
		}
	}
	if(shift === 1)
		result = "1" + result;
	return result;
} 

function binary_not(operand){
	for(var iter = 0; iter < operand.length; iter++){
		if(iter === 0){
			if(operand[iter] === "1"){
				operand = "0" + operand.substring(iter + 1);
				continue;
			}
			if(operand[iter] === "0"){
				operand = "1" + operand.substring(iter + 1);
				continue;
			}
		}
		else if(iter === operand.length - 1){
			if(operand[iter] === "1"){
				operand = operand.substring(0, iter) + "0";
				continue;
			}
			if(operand[iter] === "0"){
				operand = operand.substring(0, iter) + "1";
				continue;
			}
		}
		else{
			if(operand[iter] === "1"){
				operand = operand.substring(0, iter) + "0" + operand.substring(iter + 1);
				continue;
			}
			if(operand[iter] === "0"){
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

function return_8bit_shift_number(number){
	return binary_left_add_zeros(number, 8 - number.length);
}

function check_input(first_mas_of_numbers, second_mas_of_numbers){
	//не совпадает количество делимых и делителей
	if(first_mas_of_numbers.length !== second_mas_of_numbers.length){
		alert("Wrong count of symbols!");
		return(false);
	}
	
	for(var iter = 0; iter < first_mas_of_numbers.length; iter++){
		//буквы в вводе
		if(first_mas_of_numbers[iter].search(/\D/) > -1){
			alert("Wrong input!");
			return(false);
		}
		if(second_mas_of_numbers[iter].search(/\D/) > -1){
			alert("Wrong input!");
			return(false);
		}
		
		//деление на ноль
		if(second_mas_of_numbers[iter] === 0){
			alert("Division by zero!");
			return(false);
		}
		
		//переполнение
		var first_number = +(first_mas_of_numbers[iter]);
		var second_number = +(second_mas_of_numbers[iter]);
		if(first_number > 127){
			alert("Wrong input number!");
			return(false);
		}
		if(second_number > 127){
			alert("Wrong input number!");
			return(false);
		}
	}
	return true;
}

function show_input(first_mas_of_numbers, second_mas_of_numbers){
    var numberOfVectors = first_mas_of_numbers.length;
    
    var newDiv = document.createElement("div");
    newDiv.innerHTML = "Исходные вектора: ";   
    document.body.appendChild(newDiv);

    for(var numberOfPair = 1; numberOfPair <= numberOfVectors; numberOfPair++){
        var newDiv = document.createElement("div");
        newDiv.innerHTML = "Вектор " + numberOfPair + ": <" + first_mas_of_numbers[numberOfPair - 1] + "," + second_mas_of_numbers[numberOfPair - 1] + ">";
        document.body.appendChild(newDiv);
    }
}

function draw_table(masOfPairsOperations){
    var table = document.createElement("table");
    table = document.createElement("table");
    width = 4000;
    table.setAttribute("width", width);
    table.setAttribute("border", "1");
    table.setAttribute("bordercolor", "black");
    table.setAttribute("align", "center");

    var numberOfVectors = masOfPairsOperations.length;
    var maxNumberOfSteps = find_max_number_of_steps(masOfPairsOperations);
    var maxNumberOfTacts = find_max_number_of_tacts(masOfPairsOperations);
    
    var tableRow = document.createElement("tr");
    var tableHeader = document.createElement("th");
    tableHeader.setAttribute("rowspan", "2");
    var text = document.createTextNode("Такты");
    tableHeader.appendChild(text);
    tableRow.appendChild(tableHeader);
    
    for(var iter = 1; iter <= maxNumberOfSteps; iter++){
        tableHeader = document.createElement('th');
        tableHeader.setAttribute("colspan", "4");
        text = document.createTextNode('Этап ' + (iter));
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader);
    }
    
    table.appendChild(tableRow);
    
    tableRow = document.createElement("tr");
        
    for(var iter = 1; iter <= maxNumberOfSteps; iter++){    
        tableHeader = document.createElement("th");
        text = document.createTextNode("Сдвиг результата и частичного остатка");
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader);
        tableHeader = document.createElement("th");
        text = document.createTextNode("Вычитание");
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader);
        tableHeader = document.createElement("th");
        text = document.createTextNode("Заносим в результат 0/1");
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader);
        tableHeader = document.createElement("th");
        text = document.createTextNode("Восстановление частичного остатка");
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader);
    }
    
    table.appendChild(tableRow);
    
    var height = 50;
    
    for(var rowNum = 1; rowNum <= maxNumberOfTacts; rowNum++){
        var tableRow = document.createElement("tr");
        var tableData = document.createElement("td");
        var text = "Такт " + rowNum;
        tableData.innerHTML = text;      
        tableRow.appendChild(tableData);
        tableData.setAttribute("height", height);
        
        table.appendChild(tableRow);
    }

    var tableRows = table.rows;
    
    /**
     * Добавляем в таблицу ячейки
     */
    for(var rowNum = 2; rowNum < maxNumberOfTacts + 2; rowNum++){
        var tableRow = tableRows[rowNum];
        for(var colNum = 0; colNum < maxNumberOfSteps * 4; colNum++){           
            var tableData = document.createElement("td");
            tableData.setAttribute("height", height);
            tableRow.appendChild(tableData);
            
        }
    }
         
    /**
     * Заносим данные в ячейки
     */
    for(var pairNum = 0; pairNum < numberOfVectors; pairNum++){
        var masOfSteps = masOfPairsOperations[pairNum];
        var numberOfSteps = masOfSteps.length;
        for(var num = pairNum + 2, stepNum = 0; num < numberOfSteps + pairNum + 2 && stepNum < numberOfSteps; num++, stepNum++){ //2 - т.к. уже заполнили две первые строки; pairNum - номер текущей пары, увеличивается припереходе к следующей, а соответственно увеличивается и номер первой заполняемой ячейки для текущего вектора
            var tableRow = tableRows[num];
            var step = masOfSteps[stepNum];
            var tableCells = tableRow.cells;
            for(var operationNum = 0; operationNum < 4; operationNum++){                  
                var operation = step[operationNum]; 
                var tableData = tableCells[(stepNum * 4) + operationNum + 1];
                var text = "<p>Вектор " + (pairNum + 1) + "</p><p>" + operation[0] + ":</p><p>результат - " + operation[1] + ",</p><p>остаток - " + operation[2] + "</p><p>Такт " + (num - 1) + "</p>";
                tableData.innerHTML = text;
            }
        }
        for(var num = numberOfSteps + pairNum + 2, stepNum = numberOfSteps; num < maxNumberOfSteps + 2; num++, stepNum++){ //заполняет оставшиеся ячейки фиктивными опреациями
            var tableRow = tableRows[num];
            var lastStepNum = numberOfSteps - 1;
            var lastStep = masOfSteps[lastStepNum];
            var tableCells = tableRow.cells;
            for(var operationNum = 0; operationNum < 4; operationNum++){                  
                var operation = lastStep[operationNum]; 
                var tableData = tableCells[(stepNum * 4) + operationNum + 1];
                var text = "<p>Вектор " + (pairNum + 1) + "</p><p>" + operation[0] + ":</p><p>результат - " + operation[1] + ",</p><p>остаток - " + operation[2] + "</p><p>Такт " + (num - 1) + "</p>";
                tableData.innerHTML = text;
            }
        }
    }

    document.body.appendChild(table);
}

function find_max_number_of_steps(masOfPairsOperations){
    var numberOfVectors = masOfPairsOperations.length;
    var maxNumberOfSteps = 0;

    for(var iter = 0; iter < numberOfVectors; iter++){ 
        var currentNumbersOfSteps = masOfPairsOperations[iter].length;
        if(currentNumbersOfSteps > maxNumberOfSteps){
           maxNumberOfSteps = currentNumbersOfSteps;
        }
    }

    return maxNumberOfSteps;
}

function find_max_number_of_tacts(masOfPairsOperations){
    var numberOfVectors = masOfPairsOperations.length;
    var maxNumberOfSteps = 0;
    var maxStep = 0;
  
    for(var iter = 0; iter < numberOfVectors; iter++){   
        var currentNumbersOfSteps = masOfPairsOperations[iter].length;
        if(currentNumbersOfSteps >= maxNumberOfSteps){
            maxNumberOfSteps = currentNumbersOfSteps;
            maxStep = iter;
        }
    }

    var maxNumberOfTacts = maxStep + maxNumberOfSteps;	
    return maxNumberOfTacts;
}

function show_output(masOfPairsOperations){
    var numberOfVectors = masOfPairsOperations.length;
    var maxNumberOfSteps = find_max_number_of_steps(masOfPairsOperations);

    var newDiv = document.createElement("div");
    newDiv.innerHTML = "Результат: ";   
    document.body.appendChild(newDiv);
    
    for(var numberOfPair = 0; numberOfPair < numberOfVectors; numberOfPair++){        
        var masOfSteps = masOfPairsOperations[numberOfPair];
        var lastStepNumber = masOfSteps.length - 1;
        var lastStep = masOfSteps[lastStepNumber];
        var lastOperationNumber = lastStep.length - 1;
        var lastOperation = lastStep[lastOperationNumber];
        var result = parseInt(lastOperation[1], 2);
        
        newDiv = document.createElement("div");
        newDiv.innerHTML = "Вектор " + (numberOfPair + 1) + ": " + result + " Число тактов - " + (maxNumberOfSteps + numberOfPair);
        document.body.appendChild(newDiv);
    }
}
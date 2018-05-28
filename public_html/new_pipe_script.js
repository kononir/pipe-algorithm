document.getElementById('run').addEventListener('click', main);

//author - Новицкий В.А. group - 621701
function main(){
	var first_mas_of_numbers = (document.getElementById('first_numbers').value).split(','); //получаем 2 числа из полей ввода
	var second_mas_of_numbers = (document.getElementById('second_numbers').value).split(',');
	
	if(!check_input(first_mas_of_numbers, second_mas_of_numbers)) //проверяем ввод
            return;
	
	show_input(first_mas_of_numbers, second_mas_of_numbers); //показываем вектора в десятичной и двоичных системах
	
	var numberOfVectors = first_mas_of_numbers.length;
	var masOfPairsOperations = new Array();
	
	for(var iter = 0; iter < numberOfVectors; iter++){ //последовательно делим вектора и получаем на выходе массив, включающий этапы, которые в свою очередь включают операции
            masOfPairsOperations.push(do_division(first_mas_of_numbers[iter], second_mas_of_numbers[iter])); // заносим этот массив в массив всех делений
	}
	
	draw_table(masOfPairsOperations); //рисуем таблицу и заносим данные в неё
        
        show_output(masOfPairsOperations); //показываем результаты деления
		
}

//author - Новицкий В.А. group - 621701
function do_division(first_number_string, second_number_string){
    var first_number = +(first_number_string);
    var second_number = +(second_number_string);
    
    var a = return_8bit_shift_number(first_number.toString(2)); //добавляем слева к числу некоторое количество нулей чтобы получить 8 разрядов в итоговом числе (a - делимое b - делитель)
    var b = "0" + return_8bit_shift_number(second_number.toString(2)); //0 обозначает, что число в прямом коде
    
    var b_not = binary_not(b); //делаем логическое отрицание для делителя
    var b_rev = binary_sum(b_not, "1"); //прибавляем 1 и получаем делитель в дополнительном коде
    var b_addit = return_8bit_shift_number(b_rev);
    
    var p = "000000000"; //посмотри алгоритм Restoring Division в файле division_presentV2
    
    var arrayOfSteps = new Array(); //делаем массив для этапов
    
    for(var iteration = 0; iteration < 8; iteration++){ //проходим 8 этапо для того, чтобы заполнить каждый бит результирующего числа
        var currentStep = new Array(); //массив для операций данного этапа
        
        var p_a_union = p + a; //конкатенация p и а
        
        p_a_union = binary_left_shift(p_a_union, 1); //сдвиг влево на 1 разряд
        
        var index = 9; //индекс 1-ого бита числа a
        
        p = p_a_union.substring(0,index); //забираем р
        a = p_a_union.substring(index); //забираем а

        var operation1 = ["Сдвиги", p, a]; //заносим результат операции в массив
        currentStep.push(operation1);

        p = binary_sum(p, b_addit); //складываем число р в прямом коде и число b в дополнительном

        var operation2 = ["Вычитание", p, a];
        currentStep.push(operation2);
        
        var p_overlof = 10; //количество разрядов числа р, при котором происходит переполнение
        var p_no_overlof = 9; //не происходит соответсвенно
        
        if(p[0] === "1" && p.length === p_no_overlof){ //если старший бит числа р - единица и число р не вышло за предел в 9 бит
            a = binary_sum(a, "0"); //заносим в младший бит числа а ноль(т.е. просто прибавляем к нему ноль)					 

            var operation3 = ["Занесение 0", p, a];
            currentStep.push(operation3);

            p = binary_sum(p, b); //делаем восстановление числа р (число при этом складывается с b в прямом коде и становится равно своему предыдущему значению, которое было после первой операции текущего этапа)
            
            if(p[0] === "1" && p.length === p_overlof) //если происходит переполнение
                p = p.substring(1); //то обрезаем старший бит

            var operation4 = ["Восстанавление остатка", p, a];
            currentStep.push(operation4);         
        }
        
        else if(p[0] === "0" && p.length === p_no_overlof){ //если старший бит числа р - ноль и число р не вышло за предел в 9 бит
            a = binary_sum(a, "1"); //заносим в младший бит числа а единицу 			 

            var operation3 = ["Занесение 1", p, a];
            currentStep.push(operation3);

            var operation4 = ["Восстанавление остатка", p, a]; //происходит фиктивное восстановление числа р (как бы прибавляем ноль к р)
            currentStep.push(operation4);
        }
        
        else if(p[0] === "1" && p.length === p_overlof){  //если старший бит числа р - единица и число р стало величиной в 10 бит
            p = p.substring(1);	//обрезаем старший бит
            
            a = binary_sum(a, "1"); //заносим единицу в младший бит

            var operation3 = ["Занесение 1", p, a];
            currentStep.push(operation3);

            var operation4 = ["Восстанавление остатка", p, a];
            currentStep.push(operation4);
        }

        arrayOfSteps.push(currentStep); //заносим текущий этап в массив этапов
    }

    return arrayOfSteps; //возвращаем этот массив
}

//author - Карбанович И.М. group - 621701
function binary_sum(first_term, second_term){
    if(first_term.length < second_term.length)
        first_term = binary_left_add_zeros(first_term, second_term.length - first_term.length);
    if(first_term.length > second_term.length)
        second_term = binary_left_add_zeros(second_term, first_term.length - second_term.length);
    var shift = 0;
    var result = "";
    for(var iter = first_term.length - 1; iter >= 0; iter--){
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

//author - Карбанович И.М. group - 621701
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

//author - Новицкий В.А. group - 621701
function binary_left_shift(operand, number_of_shifts){
    for(var iter = 0; iter < number_of_shifts; iter++){
        operand = operand.substring(1);
        operand = operand + "0";
    }
    return operand;
}

//author - Новицкий В.А. group - 621701
function binary_left_add_zeros(operand, number_of_zeros){
    for(var iter = 0; iter < number_of_zeros; iter++)
        operand = "0" + operand;
    return operand;	
}

//author - Новицкий В.А. group - 621701
function return_8bit_shift_number(number){
    return binary_left_add_zeros(number, 8 - number.length);
}

//author - Карбанович И.М. group - 621701
function check_input(first_mas_of_numbers, second_mas_of_numbers){
	if(first_mas_of_numbers.length !== second_mas_of_numbers.length){
		alert("Не совпадает количество делимых и делителей!");
		return(false);
	}
	
	for(var iter = 0; iter < first_mas_of_numbers.length; iter++){
		if(first_mas_of_numbers[iter].search(/\D/) > -1){
			alert("Присутствие посторонних символов в вводе!");
			return(false);
		}
		if(second_mas_of_numbers[iter].search(/\D/) > -1){
			alert("Присутствие посторонних символов в вводе!");
			return(false);
		}
		
		var first_number = +(first_mas_of_numbers[iter]);
		var second_number = +(second_mas_of_numbers[iter]);
		if(first_number > 255){
			alert("Неверное число в вводе!");
			return(false);
		}
		if(second_number > 255){
			alert("Неверное число в вводе!");
			return(false);
		}
	}
	return true;
}

//author - Новицкий В.А. group - 621701
function show_input(first_mas_of_numbers, second_mas_of_numbers){
    var numberOfVectors = first_mas_of_numbers.length;
    
    var newDiv = document.createElement("div");
    newDiv.innerHTML = "Исходные вектора: ";   
    document.body.appendChild(newDiv);

    for(var numberOfPair = 1; numberOfPair <= numberOfVectors; numberOfPair++){
        var first_number = +(first_mas_of_numbers[numberOfPair - 1]);
        var second_number = +(second_mas_of_numbers[numberOfPair - 1]);
    
        var a = return_8bit_shift_number(first_number.toString(2));
        var b = "0." + return_8bit_shift_number(second_number.toString(2));
        
        var b_not = binary_not(b);
        var b_rev = binary_sum(b_not, "1");
        var b_addit = return_8bit_shift_number(b_rev);
        var b_addit_dot = b_addit.substring(0,1) + "." + b_addit.substring(1);
        
        var newDiv = document.createElement("div");
        newDiv.innerHTML = "Вектор " + numberOfPair + ": <"
                         + first_mas_of_numbers[numberOfPair - 1] + ","
                         + second_mas_of_numbers[numberOfPair - 1] + ">"
                         + " A = " + a + " B = " + b + " ~B+1 = " + b_addit_dot;
        document.body.appendChild(newDiv);
    }
}

//author - Карбанович И.М. group - 621701
function draw_table(masOfPairsOperations){
    var table = document.createElement("table");
    table = document.createElement("table");
    var width = 8000;
    table.setAttribute("width", width);
    table.setAttribute("border", "1");
    table.setAttribute("bordercolor", "black");
    table.setAttribute("align", "center");

    var numberOfVectors = masOfPairsOperations.length;
    var maxNumberOfTacts = find_max_number_of_tacts(numberOfVectors);
    var maxNumberOfSteps = 8;
    
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
    
    for(var rowNum = 2; rowNum < maxNumberOfTacts + 2; rowNum++){
        var tableRow = tableRows[rowNum];
        for(var colNum = 0; colNum < maxNumberOfSteps * 4; colNum++){           
            var tableData = document.createElement("td");
            tableData.setAttribute("height", height);
            tableRow.appendChild(tableData);
            
        }
    }
         
    for(var pairNum = 0; pairNum < numberOfVectors; pairNum++){
        var masOfSteps = masOfPairsOperations[pairNum];
        var numberOfSteps = masOfSteps.length;
        for(var num = pairNum + 2, stepNum = 0; num < numberOfSteps + pairNum + 2 && stepNum < numberOfSteps; num++, stepNum++){
            var tableRow = tableRows[num];
            var step = masOfSteps[stepNum];
            var tableCells = tableRow.cells;
            for(var operationNum = 0; operationNum < 4; operationNum++){                  
                var operation = step[operationNum]; 
                var tableData = tableCells[(stepNum * 4) + operationNum + 1];
                var text = "<p>Вектор " + (pairNum + 1) + "</p><p>" + operation[0]
                         + ":</p><p>P: " + operation[1] + ",</p><p>A: "
                         + operation[2] + "</p><p>Такт " + (num - 1) + "</p>";
                tableData.innerHTML = text;
            }
        }
    }

    document.body.appendChild(table);
}

//author - Карбанович И.М. group - 621701
function find_max_number_of_tacts(numberOfVectors){
    var numberOfSteps = 7;
    var maxNumberOfTacts = numberOfVectors + numberOfSteps;	
    return maxNumberOfTacts;
}

//author - Новицкий В.А. group - 621701
function show_output(masOfPairsOperations){
    var numberOfVectors = masOfPairsOperations.length;
    var maxNumberOfSteps = 8;

    var newDiv = document.createElement("div");
    newDiv.innerHTML = "Результат: ";   
    document.body.appendChild(newDiv);
    
    for(var numberOfPair = 0; numberOfPair < numberOfVectors; numberOfPair++){        
        var masOfSteps = masOfPairsOperations[numberOfPair];
        var lastStepIndex = 7;
        var lastStep = masOfSteps[lastStepIndex];
        var lastOperationIndex = 3;
        var lastOperation = lastStep[lastOperationIndex];
        var p = lastOperation[2];
        var result = parseInt(p, 2);
        
        newDiv = document.createElement("div");
        newDiv.innerHTML = "Вектор " + (numberOfPair + 1) + ": " + result
                         + " Число тактов - " + (maxNumberOfSteps + numberOfPair);
        document.body.appendChild(newDiv);
    }
}
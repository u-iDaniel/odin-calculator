const calculator = document.querySelector("div.calculator");
const calcDisplay = document.querySelector("div.display");
const MAX_DISPLAY_DIGITS = 13;
let numA = numB = operator = displayValue = '';

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Error!";
    }
    return a / b;
}

function operate(a, b, operator) {
    switch (operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
    }
}

function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

function resetCalculator(displayMessage = 0) {
    numA = numB = operator = '';
    displayValue = displayMessage;
}

function cutDigits(num) {
    num = Number(num);
    let numIntegerDigits = +String(Math.floor(num)).length;
    let numFloatDigits = parseInt(num) === num ? 0 : +String(num % 1).length;
    if (numIntegerDigits + numFloatDigits > MAX_DISPLAY_DIGITS
        && numFloatDigits > 1 
        && MAX_DISPLAY_DIGITS - numIntegerDigits > 0) {
        numFloatDigits = MAX_DISPLAY_DIGITS - numIntegerDigits;
        return parseFloat(num.toFixed(numFloatDigits));
    }
    return num;
}

function countDigits(num) {
    const digits = '1234567890'
    return [...String(num)].filter(element => digits.includes(element)).join("").length;
}

function deleteDigit(num) {
    if (String(num).length <= 1) {
        return 0;
    } else {
        new_num = [...String(num)]
        new_num.pop();
        return new_num.join("");
    }
}

function flipSign(num) {
    return String(num) === '0' ? 0 : String(+num * -1);
}

calculator.addEventListener("click", (event) => {

    const target = event.target;

    if (target.tagName !== 'BUTTON') {
        return;
    }

    if (isNumeric(target.innerText) && countDigits(displayValue) <= MAX_DISPLAY_DIGITS) {
        // Reset calculator since new numbers are being entered or numA was completely deleted
        if (typeof numA === 'number' && !operator) { 
            resetCalculator();
            numA += target.innerText;
        // First number has been inputted already
        } else if (typeof numA === 'number' 
        && (numB && countDigits(displayValue) + 1 <= MAX_DISPLAY_DIGITS || !numB)) { 
            if (numB === 0) numB = '';
            numB += target.innerText;
        } else if (countDigits(displayValue) + 1 <= MAX_DISPLAY_DIGITS) {
            numA += target.innerText;
        }
    } else if (target.className === 'operation' && (numB || numB === 0)) {
        numB = +numB;
        numA = operate(numA, numB, operator);
        numB = '';
        operator = target.id === '=' ? '' : target.id;
    // Store first number
    } else if (target.className === 'operation' && target.id !== '=') {
        operator = target.id;
        numA = +numA;
        // Add active display here maybe
    } else if (target.id === 'del') {
        // Make sure numA doesn't appear once numB gets completely deleted
        if ((numB || numB === 0) && operator) {
            numB = deleteDigit(numB);
        } else {
            numA = deleteDigit(numA);
        }
    } else if (target.id === 'sign-flip') {
        if ((numB || numB === 0)) {
            numB = flipSign(numB);
        } else {
            numA = flipSign(numA);
        }
    }

    if (numB || numB === 0) {
        displayValue = numB;
    } else if (numA) {
        displayValue = countDigits(numA) > MAX_DISPLAY_DIGITS ? cutDigits(numA) : numA;
    } else {
        displayValue = 0;
    }

    if (numA === 'Error!') {
        resetCalculator(numA);
    } else if (countDigits(displayValue) > MAX_DISPLAY_DIGITS) {
        resetCalculator('Digits Overflow!');
    }

    if (target.id === 'clr') {
        resetCalculator();
    }
    
    calcDisplay.innerText = displayValue; 
})
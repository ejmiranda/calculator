const output = document.querySelector(`.output`);
const clear = document.querySelector(`.clear`);
const sign = document.querySelector(`.sign`);
const perc = document.querySelector(`.perc`);
const numbers = document.querySelectorAll(`.number`);
const dot = document.querySelector(`.dot`);
const operations = document.querySelectorAll(`.operation`);
const equal = document.querySelector(`.equal`);

let value = `0`;
let num1 = 0;
let num2 = 0;
let operator = ``;
let isAfterOp = false;

function logAll(){
  console.log(`value = ${value}`);
  console.log(`num1 = ${num1}`);
  console.log(`operator = \`${operator}\``);
  console.log(`num2 = ${num2}`);
}

clear.addEventListener(`click`, () => {
  console.log(clear.textContent);
  if (clear.textContent === `AC`) {
    setOperationState(`deselectAll`);
    num1 = 0;
    num2 = 0;
    operator = ``;
  } else {
    setOperationState(`selected`);
    clear.textContent = `AC`;
  }
  value = `0`;
  checkDot();
  showOutput(value);
  logAll();
});

sign.addEventListener(`click`, () => {
  if (isAfterOp) {
    value = `0`;
    isAfterOp = false;
  }
  if (value.startsWith(`-`)) {
    value = value.substring(1);
  } else {
    value = `-${value}`;
  }
  showOutput(value);
  logAll();
});

perc.addEventListener(`click`, () => {
  if (value !== `0`) {
    value = (+value / 100).toString();
  }
  showOutput(value);
});

for (let number of numbers) {
  number.addEventListener(`click`, () => {
    if (isAfterOp) {
      value = (number.textContent === `.`) ? `0` : ``;
      isAfterOp = false;
    } else if (/^-*0$/.test(value) && number.textContent !== `.`) {
      value = /-/.test(value) ? `-` : ``;
    }
    value += number.textContent;
    setClear();
    setOperationState(`deselectAll`);
    checkDot(value);
    showOutput(value);
    logAll();
  });
}

for (let operation of operations) {
  operation.addEventListener(`click`, (event) => {
    num1 = +value;
    operator = event.target.textContent;
    isAfterOp = true;
    setOperationState(`selected`);
    logAll();
    // num1 = +value;
    // value = `0`;
    // operator = event.target.textContent;
    // isAfterOpSelect = true;
    // setOperationState(`selected`);
    // console.log(num1);

  });
  operation.addEventListener(`mouseover`, () => {
    if (operation.classList.value.includes(`selected`)) {
      operation.classList.add(`hover`);
    }
  });
  operation.addEventListener(`mouseout`, () => {
    operation.classList.remove(`hover`);
  });
}

equal.addEventListener(`click`, () => {
  setOperationState(`deselectAll`);
  num2 = +value;
  value = operate(operator, num1, num2).toString();
  showOutput(value);
  console.log(`${num1} ${operator} ${num2} = ${value}`);
});

function setClear() {
  if (value !== `0`) {
    clear.textContent = `C`;
  }
}

function setOperationState(action) {
  switch (action) {
    case `deselectAll`:
      for (let operation of operations) {
        operation.classList.remove(`selected`);
      }   
      break;
    case `selected`:
      setOperationState(`deselectAll`);
      for (let operation of operations) {
        if (operation.textContent === operator) {
          operation.classList.add(`selected`);
        }
      }   
      break;
  }
}

function checkDot(string) {
  if (/\./.test(string)) {
    dot.disabled = true;
  } else {
    dot.disabled = false;
  }
}

function showOutput(string) {
  
  let maxDigits = (string.startsWith(`-`)) ? 10 : 9;
  if (string.includes(`.`)) maxDigits++;
  let strArray = string.split(``);
  strArray.splice(maxDigits);
  string = strArray.join(``);

  strArray = string.split(`.`);
  strArray[0] = strArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
  string = strArray.join(`.`);

  switch (string.length) {
    case 7:
      output.style.fontSize = `77px`;
      break;
    case 9:
      output.style.fontSize = `64px`;
      break;
    case 10:
      output.style.fontSize = `57px`;
      break;
    case 11:
      output.style.fontSize = `51px`;
      break;
    case 12:
      output.style.fontSize = `47px`;
      break;
    default:
      output.style.fontSize = `80px`;
  }

  output.textContent = string;
}

// Regular Expression Explanation: /\B(?=(\d{3})+(?!\d))/g
//
// From Elias Zamaria @ StackOverflow: https://goo.gl/qpfC1r
//
// The regex uses 2 lookahead assertions: a positive one to look for
// any point in the string that has a multiple of 3 digits in a row
// after it, and a negative assertion to make sure that point only
// has exactly a multiple of 3 digits. The replacement expression
// puts a comma there.
//
// For example, if you pass it "123456789.01", the positive assertion
// will match every spot to the left of the 7 (since "789" is a 
// multiple of 3 digits, "678" is a multiple of 3 digits, "567", etc.).
// The negative assertion checks that the multiple of 3 digits does
// not have any digits after it. "789" has a period after it so it is
// exactly a multiple of 3 digits, so a comma goes there. "678" is a
// multiple of 3 digits but it has a "9" after it, so those 3 digits
// are part of a group of 4, and a comma does not go there. Similarly
// for "567". "456789" is 6 digits, which is a multiple of 3, so a
// comma goes before that. "345678" is a multiple of 3, but it has a
// "9" after it, so no comma goes there. And so on. The "\B" keeps
// the regex from putting a comma at the beginning of the string.

function operate(operator, num1, num2) {
  switch (operator) {
    case `+`:
      return add(num1, num2);
    case `−`:
      return substract(num1, num2);
    case `×`:
      return multiply(num1, num2);
    case `÷`:
      return divide(num1, num2);
  }
}

function add(num1, num2) {
  return num1 + num2;
}

function substract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  if (num2 !== 0) {
    return num1 / num2;  
  }
  return `Error`;
}
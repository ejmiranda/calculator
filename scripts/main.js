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
let isAfterOpSelect = false;

clear.addEventListener(`click`, () => {
  value = `0`;
  showOutput(value);
});

sign.addEventListener(`click`, () => {
  if (value.startsWith(`-`)) {
    value = value.substring(1);
  } else {
    value = `-${value}`;
  }
  showOutput(value);
});

perc.addEventListener(`click`, () => {
  if (value !== `0`) {
    value = (+value / 100).toString();
  }
  showOutput(value);
});

for (let number of numbers) {
  number.addEventListener(`click`, () => {
    deselectOperations();
    if ((/-*0$/.test(value) && number.textContent !== `.`) 
        || isAfterOpSelect) {
      value = /-/.test(value) ? `-` : ``;
      isAfterOpSelect = false;
    }
    value += number.textContent;
    checkDot(value);
    showOutput(value);
  });
}

for (let operation of operations) {
  operation.addEventListener(`click`, (event) => {
    deselectOperations();
    operation.classList.add(`selected`);
    operator = event.target.textContent;
    num1 = +value;
    value = `0`;
    isAfterOpSelect = true;
  });
}

equal.addEventListener(`click`, () => {
  deselectOperations();
  num2 = +value;
  value = operate(operator, num1, num2).toString();
  showOutput(value);
  console.log(num1, operator, num2);
});

function deselectOperations() {
  for (let operation of operations) {
    operation.classList.remove(`selected`);
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
  let regexp = /\B(?=(\d{3})+(?!\d))/g;
  let strArray = string.split(`.`);
  strArray[0] = strArray[0].replace(regexp, `,`);
  output.textContent = strArray.join(`.`);
}

// Regular Expression Explanation:
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
  return `ERROR`;
}
const output = document.querySelector(`.output`);
const clear = document.querySelector(`.clear`);
const sign = document.querySelector(`.sign`);
const perc = document.querySelector(`.perc`);
const numbers = document.querySelectorAll(`.number`);
const operations = document.querySelectorAll(`.operation`);
const equal = document.querySelector(`.equal`);

let scrValue = `0`;
let num1 = 0;
let num2 = 0;
let operator = ``;
let isAfterOpSelect = false;

clear.addEventListener(`click`, () => {
  scrValue = `0`;
  showOutput(scrValue);
});

sign.addEventListener(`click`, () => {
  if (scrValue.startsWith(`-`)) {
    scrValue = scrValue.substring(1);
  } else {
    scrValue = `-${scrValue}`;
  }
  showOutput(scrValue);
});

perc.addEventListener(`click`, () => {
  if (scrValue !== `0`) {
    scrValue = +scrValue / 100;
  }
  showOutput(scrValue);
});

for (let number of numbers) {
  number.addEventListener(`click`, () => {
    deselectOperations();
    if ((scrValue === `0` && number.textContent !== `.`) || isAfterOpSelect) {
      scrValue = ``;
      isAfterOpSelect = false;
    }
    scrValue += number.textContent;
    showOutput(scrValue);
  });
}

for (let operation of operations) {
  operation.addEventListener(`click`, (event) => {
    deselectOperations();
    operation.classList.add(`selected`);
    operator = event.target.textContent;
    num1 = +scrValue;
    isAfterOpSelect = true;
  });
}

equal.addEventListener(`click`, () => {
  deselectOperations();
  num2 = +scrValue;
  scrValue = operate(operator, num1, num2).toString();
  showOutput(scrValue);
  console.log(num1, operator, num2);
});

function showOutput(string) {
  output.textContent = string;
}

function deselectOperations() {
  for (let operation of operations) {
    operation.classList.remove(`selected`);
  }
}

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
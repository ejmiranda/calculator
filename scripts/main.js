const output = document.querySelector(`.output`);
const clear = document.querySelector(`.clear`);
const sign = document.querySelector(`.sign`);
const perc = document.querySelector(`.perc`);
const numbers = document.querySelectorAll(`.number`);

clear.addEventListener(`click`, () => {
  output.textContent = `0`;
});

sign.addEventListener(`click`, () => {
  let string = output.textContent;
  if (string.startsWith(`-`)) {
    output.textContent = string.substring(1);
  } else {
    output.textContent = `-${string}`;
  }
});

perc.addEventListener(`click`, () => {
  let number = +output.textContent;
  if (number !== 0) {
    number /= 100;
  }
  output.textContent = number;
});

for (let number of numbers) {
  number.addEventListener(`click`, (event) => {
    if (output.textContent === `0` && number.textContent !== `.`) {
      output.textContent = ``;
    }
    output.textContent += number.textContent;
  });
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
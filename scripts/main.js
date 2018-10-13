const output = document.querySelector(`.output`);
const clear = document.querySelector(`.clear`);
const sign = document.querySelector(`.sign`);
const perc = document.querySelector(`.perc`);
const numbers = document.querySelectorAll(`.number`);
const dot = document.querySelector(`.dot`);
const operations = document.querySelectorAll(`.operation`);
const equal = document.querySelector(`.equal`);

let val = `0`;
let num1 = 0;
let op = ``;
let num2 = 0;
let isChainable = false;
let isAfterOp = false;
let isAfterEq = false;

for (let number of numbers) {
  number.addEventListener(`click`, (event) => {
    if (isAfterOp || isAfterEq) {
      val = (number.textContent === `.`) ? `0` : ``;
      if (isAfterOp) {
        isChainable = true;
      }
      isAfterOp = false;
      isAfterEq = false;
    } else if (/^-*0$/.test(val) && number.textContent !== `.`) {
      val = /-/.test(val) ? `-` : ``;
    }
    val += number.textContent;
    setClear(val);
    showOutput(val);
    checkDot(val);
    setOperationState(`deselectAll`);
    logAll(event.target.textContent);
  });
}

for (let operation of operations) {
  operation.addEventListener(`click`, (event) => {
    if (isChainable) {
      doEqual();
    } else {
      if (!isAfterOp) {
        num1 = +val;
      }
    }
    op = event.target.textContent;
    isAfterOp = true;
    isAfterEq = false;
    checkDot(val);
    setOperationState(`selected`);
    logAll(event.target.textContent);
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

equal.addEventListener(`click`, (event) => {
  doEqual();
  isChainable = false;
  isAfterOp = false;
  isAfterEq = true;
  checkDot(val);
  setOperationState(`deselectAll`);
  logAll(event.target.textContent);
});

function doEqual() {
  if (op !== ``) {
    if (!isAfterEq) {
      num2 = +val;
    }
    val = operate(op, num1, num2);
    if (val !== `Error`) {
      val = val.toPrecision();
      if (val.length > 10) {
        val = (+val).toExponential(4);
      }
    }
    num1 = +val;
  }
  showOutput(val);
}

clear.addEventListener(`click`, (event) => {
  let keyToLog = event.target.textContent;
  if (clear.textContent === `AC`) {
    num1 = 0;
    op = ``;
    num2 = 0;
    isChainable = false;
    isAfterOp = false;
    isAfterEq = false;
    setOperationState(`deselectAll`);
  } else {
    if (isChainable) {
      isChainable = false;
      isAfterOp = true;
      setOperationState(`selected`);
    }
    clear.textContent = `AC`
  }
  val = `0`;
  showOutput(val);
  checkDot(val);
  logAll(keyToLog);
});

sign.addEventListener(`click`, (event) => {
  if (isAfterOp) {
    val = `0`;
    isAfterOp = false;
  }
  if (val.startsWith(`-`)) {
    val = val.substring(1);
  } else {
    val = `-${val}`;
  }
  showOutput(val);
  logAll(event.target.textContent);
});

perc.addEventListener(`click`, (event) => {
  if (val !== `0`) {
    val = (+val / 100).toString();
  }
  showOutput(val);
  logAll(event.target.textContent);
});

function setClear(string) {
  if (string !== `0`) {
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
        if (operation.textContent === op) {
          operation.classList.add(`selected`);
        }
      }   
      break;
  }
}

function checkDot(string) {
  dot.disabled = false;
  if (/\./.test(string) && !isAfterOp && !isAfterEq) {
    dot.disabled = true;
  }
}

function showOutput(string) {
  output.textContent = formatForScr(string);
}

function formatForScr(string) {
  if (string !== `NaN`) {
    
    // The longest string to display will have at most:
    // 9 numbers
    // 2 commas || 1 comma && 1 dot || 1 dot
    // - sign || no sign
    // 
    // Case 1: 2 commas -> Max length = 11 w/o sign & 12 w/ sign
    // Sample:  - 3 3 3 , 3 3 3 , 3  3  3
    // Digits:  1 2 3 4 5 6 7 8 9 10 11 12
    //
    // Case 2: 1 comma && 1 dot -> Max length = 11 w/o sign & 12 w/ sign
    // Sample:  - 3 3 , 3 3 3 . 3 3  3  3
    // Digits:  1 2 3 4 5 6 7 8 9 10 11 12
    //
    // Case 3: 1 dot -> Max length = 10 w/o sign & 11 w/ sign
    // Sample:  - 3 . 3 3 3 3 3 3 3  3 <- Only 9 numbers allowed 
    // Digits:  1 2 3 4 5 6 7 8 9 10 11
    //
    // SPECIAL CASE
    // Case 4: Exponential Syntax -> Max length = 10 w/o sign & 11 w/ sign
    // Sample:  - 3 . 3 3 3 3 e + 3  3 <- doEqual() sets 4 #s after the dot
    // Digits:  1 2 3 4 5 6 7 8 9 10 11
    //
    // This function will add the required commas.
    // The string will come with everything else.
    //
    // There are 3 steps:

    // 1. Shorten the string to the max length before the commas
    let maxDigits = (string.startsWith(`-`)) ? 10 : 9;
    if (string.includes(`.`)) maxDigits++;
    let strArray = string.split(``);
    strArray.splice(maxDigits);
    string = strArray.join(``);

    // 2. Add the required commas to the integer part
    strArray = string.split(`.`);
    strArray[0] = strArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
    string = strArray.join(`.`);

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

    // 3. Set the font size to accomodate all digits on the screen
    if (string.length > 6) {
      let canvas = document.createElement(`canvas`);
      let context = canvas.getContext(`2d`);
      context.font = `80px 'SF-Pro-Display-Light'`;
      let metrics = context.measureText(string);
      let widthToHeightRatio = metrics.width / 80;
      let size = 284 / widthToHeightRatio; // The output is set to 284px;
      output.style.fontSize = `${size}px`;
    } else {
      output.style.fontSize = `80px`;
    }

    return string;
  } else {
    return `Error`;
  }
}

function logAll(key) {
  console.log(`Key Pressed = \`${key}\``);
  console.log(`Screen Value = \`${formatForScr(val)}\``);
  console.log(`val = \`${val}\`, num1 = ${num1}, op = \`${op}\`, num2 = ${num2}`);
  console.log(`isAfterOp = ${isAfterOp}, isAfterEq = ${isAfterEq}, isChainable = ${isChainable}`);
  console.log(`The \`.\` is ${(dot.disabled) ? `disabled` : `enabled`}`);
  console.log(``);
}

function operate(op, num1, num2) {
  switch (op) {
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
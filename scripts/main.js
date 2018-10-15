const output = document.querySelector(`.output`);
const clear = document.querySelector(`.clear`);
const sign = document.querySelector(`.sign`);
const perc = document.querySelector(`.perc`);
const numbers = document.querySelectorAll(`.number`);
const dot = document.querySelector(`.dot`);
const operators= document.querySelectorAll(`.operator`);
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
   numberKey(event.target.textContent); 
  });
}

for (let operator of operators) {
  operator.addEventListener(`click`, (event) => {
    operatorKey(event.target.textContent);
  });
  operator.addEventListener(`mouseover`, () => {
    if (operator.classList.value.includes(`selected`)) {
      operator.classList.add(`selected-hover`);
    }
  });
  operator.addEventListener(`mouseout`, () => {
    operator.classList.remove(`selected-hover`);
  });
}

equal.addEventListener(`click`, () => {
  equalKey();
});

clear.addEventListener(`click`, () => {
  clearKey();
});

sign.addEventListener(`click`, () => {
  signKey();
});

perc.addEventListener(`click`, () => {
  percKey();
});

window.addEventListener(`keydown`, (event) => {
  if (/[\d\.]/.test(event.key)) {
    if (event.key === `.` && dot.disabled) {
      console.log(`The \`.\` is disabled`);
    } else {
      doKeyHover(event.key);
      numberKey(event.key);
    }
  } else if (/[-\/*\+=]|Enter\b/.test(event.key)) {
    if (event.key !== `=` && event.key !== `Enter`) {
      let key;
      switch (event.key) {
        case `/`:
          key = `÷`;
          break;
        case `*`:
          key = `×`;
          break;
        case `-`:
          key = `−`;
          break;
        case `+`:
          key = `+`;
          break;
      }
      operatorKey(key);
    } else {
      doKeyHover(equal.textContent);
      equalKey();
    }
  } else if (/[cC]\b|Backspace\b/u.test(event.key)) {
    doKeyHover(clear.textContent);
    clearKey();
  } else if (event.key === `%`) {
    doKeyHover(perc.textContent);
    percKey();
  }
});

function doKeyHover(keyToHover) {
  let keys = [clear, sign, perc, ...numbers, equal];
  for (let key of keys) {
    if (key.textContent === keyToHover) {
      if (/[\d\.]/.test(keyToHover)) {
        key.classList.add(`number-hover`);
      } else {
        key.classList.add(`others-hover`);
      }
      window.setTimeout(() => {
        key.classList.remove(`number-hover`, `others-hover`);
      }, 200);
    }
  }
}

function numberKey(key) {
  if (isAfterOp || isAfterEq) {
    val = (key === `.`) ? `0` : ``;
    if (isAfterOp) {
      isChainable = true;
    }
    isAfterOp = false;
    isAfterEq = false;
  } else if (/^-?0$/.test(val) && key !== `.`) {
    val = /-/.test(val) ? `-` : ``;
  }
  let maxLength = (val.includes(`-`)? 10 : 9);
  if (val.includes(`.`)) maxLength++;
  if (val.length < maxLength) {
    val += key;
  }
  setClear();
  showOutput();
  checkDot();
  setOperatorState(`deselectAll`);
}

function operatorKey(key) {
  if (isChainable) {
    doEqual();
  } else {
    if (!isAfterOp) {
      num1 = +val;
    }
  }
  op = key;
  isAfterOp = true;
  isAfterEq = false;
  checkDot();
  setOperatorState(`selected`);
}

function equalKey() {
  doEqual();
  isChainable = false;
  isAfterOp = false;
  isAfterEq = true;
  checkDot();
  setOperatorState(`deselectAll`);
}

function clearKey(key) {
  if (clear.textContent === `AC`) {
    num1 = 0;
    op = ``;
    num2 = 0;
    isChainable = false;
    isAfterOp = false;
    isAfterEq = false;
    setOperatorState(`deselectAll`);
  } else {
    if (isChainable) {
      isChainable = false;
      isAfterOp = true;
      setOperatorState(`selected`);
    }
    clear.textContent = `AC`
  }
  val = `0`;
  showOutput();
  checkDot();
}

function signKey() {
  if (isAfterOp || isAfterEq) {
    val = `0`;
    isAfterOp = false;
    isAfterEq = false;
  }
  if (val.startsWith(`-`)) {
    val = val.substring(1);
  } else {
    val = `-${val}`;
  }
  showOutput();
}

function percKey() {
  if (val !== `0`) {
    val = (+val / 100).toString();
  }
  showOutput();
  checkDot();
}

function doEqual() {
  if (op !== ``) {
    if (!isAfterEq) {
      num2 = +val;
    }
    val = operate(op, num1, num2);
    if (val !== `Error`) {
      val = val.toPrecision();
    }
    num1 = +val;
  }
  showOutput();
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

function setClear() {
  if (val !== `0`) {
    clear.textContent = `C`;
  }
}

function showOutput() {
  output.textContent = formatForScr(val);
}

function formatForScr(numStr) {
  if (numStr !== `NaN`) {
    if (/^-?\d{10}/.test(numStr)) {
      numStr = (+numStr).toExponential(4);
    } else {
      let maxLength = (numStr.includes(`-`)) ? 10 : 9;
      if (numStr.includes(`.`)) maxLength++;
      if (numStr.length > maxLength) {
          numStr = (+numStr).toPrecision(9);
      }
      let numParts = numStr.split(`.`);
      numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, `,`)
      // Regular Expression Explanation: https://goo.gl/qpfC1r
      numStr = numParts.join(`.`);
    }
    let canvas = document.createElement(`canvas`);
    let context = canvas.getContext(`2d`);
    context.font = `80px 'SF-Pro-Display-Light'`;
    let metrics = context.measureText(numStr);
    if (metrics.width > 284) { // The output is set to 284px;
      let widthToHeightRatio = metrics.width / 80;
      let size = 284 / widthToHeightRatio;
      output.style.fontSize = `${size}px`;
    } else {
      output.style.fontSize = `80px`;
    }
    return numStr;
  } else {
    return `Error`;
  }
}

function checkDot() {
  dot.disabled = false;
  if (/\./.test(val) && !isAfterOp && !isAfterEq) {
    dot.disabled = true;
  }
}

function setOperatorState(action) {
  switch (action) {
    case `deselectAll`:
      for (let operator of operators) {
        operator.classList.remove(`selected`);
      }   
      break;
    case `selected`:
      setOperatorState(`deselectAll`);
      for (let operator of operators) {
        if (operator.textContent === op) {
          operator.classList.add(`selected`);
        }
      }   
      break;
  }
}
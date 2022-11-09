/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/index.scss */ "./src/styles/index.scss");
/* harmony import */ var _modules_Gui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Gui */ "./src/modules/Gui.js");
/* harmony import */ var _modules_UserInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/UserInput */ "./src/modules/UserInput.js");
/* harmony import */ var _modules_Cell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/Cell */ "./src/modules/Cell.js");




const game = (() => {
  let score = 4;
  let highest = 2;
  let highscore = Number(localStorage.getItem('2048highscore') ?? 4);
  let gameOver = false;
  let lastState = [];
  let cells = Array(16).fill(0).map((n, i) => {
    return (0,_modules_Cell__WEBPACK_IMPORTED_MODULE_3__["default"])(i % 4 * _modules_Gui__WEBPACK_IMPORTED_MODULE_1__["default"].unit, Math.floor(i / 4) * _modules_Gui__WEBPACK_IMPORTED_MODULE_1__["default"].unit, 0);
  });
  const checkIfGameOver = () => {
    let values = cells.map(cell => cell.getValue());
    if (values.some(val => !val)) return;
    values = [values.slice(0, 4), values.slice(4, 8), values.slice(8, 12), values.slice(12)];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      if (j < 3) if (values[i][j] === values[i][j + 1]) return;
      if (i < 3) if (values[i][j] === values[i + 1][j]) return;
    }
    gameOver = true;
    _modules_Gui__WEBPACK_IMPORTED_MODULE_1__["default"].toggleGameOver(true);
  };
  const saveHighscore = () => {
    localStorage.setItem('2048highscore', highscore);
  };
  const updateScore = () => {
    let values = cells.map(cell => cell.getValue());
    score = values.reduce((p, c) => p += c, 0);
    if (score >= highscore) {
      highscore = score;
      saveHighscore();
    }
    highest = Math.max(...values);
    _modules_Gui__WEBPACK_IMPORTED_MODULE_1__["default"].updateScore(score, highscore, highest);
  };
  const spawnCell = () => {
    let emptyCells = cells.filter(cell => !cell.getValue());
    emptyCells[Math.floor(Math.random() * emptyCells.length)].setValue(2);
  };
  const merge = (axis, direction = 1) => {
    let values = [];

    // get cell values as a matrix
    switch (axis) {
      case 'horizontal':
        // each matrix row will be a row of the game grid
        for (let i = 0; i < 16; i += 4) values.push(cells.map(cell => cell.getValue()).slice(i, i + 4));
        break;
      case 'vertical':
        // each matrix row will be a column of the game grid
        values = [[], [], [], []];
        for (let i = 0; i < 16; i++) {
          values[i % 4].push(cells[i].getValue());
        }
        break;
    }

    // move empty cells to the side
    for (let i = 0; i < 4; i++) {
      let notZero = [];
      for (let j = 0; j < 4; j++) if (values[i][j]) notZero.push(values[i][j]);
      values[i] = [0, 0, 0, 0];
      if (notZero.length) for (let j = 0; j < notZero.length; j++) values[i][j] = notZero[j];
    }

    // move the 0's to the other side of the rows if the direction is -1
    if (direction === -1) {
      for (let i = 0; i < 4; i++) {
        let firstZero = values[i].findIndex(val => !val);
        if (firstZero !== -1) values[i] = values[i].slice(firstZero).concat(values[i].slice(0, firstZero));
      }
    }

    // decide the direction to iterate over the values
    let from = direction === -1 ? 3 : 0;
    let to = direction === -1 ? 0 : 3;

    // iterate over the values and merge same-value neighbour cells
    for (let i = 0; i < 4; i++) for (let j = from; j !== to + direction; j += direction) {
      // if the value is 0 break because there are only 0's for the rest of the row
      if (!values[i][j]) break;
      // if the next value is the same as the current one, merge them
      if (values[i][j] === values[i][j + direction]) {
        values[i][j] *= 2;

        // remove the used value and shift next cells in place
        for (let k = j + direction; values[i][k] !== 0 && k >= 0 && k <= 3; k += direction) {
          values[i][k] = values[i][k + direction];
          if (values[i][k] === undefined) values[i][k] = 0;
        }
      }
    }

    // update cells with new values
    values = values.flat();
    let order = [];
    if (axis === 'horizontal') order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];else order = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
    values.forEach((val, i) => cells[order[i]].setValue(val));

    // update board
    update();
  };
  const setup = () => {
    for (let i = 0; i < 2; i++) spawnCell();
    lastState = cells.map(cell => cell.getValue());
  };
  const update = () => {
    if (gameOver) return;

    // check if cells moved
    let madeMove = false;
    for (let i = 0; i < 16; i++) if (cells[i].getValue() !== lastState[i]) madeMove = true;

    // if cells moved, spawn another cell
    if (madeMove) {
      spawnCell();
      lastState = cells.map(cell => cell.getValue());
    }

    // rendering
    _modules_Gui__WEBPACK_IMPORTED_MODULE_1__["default"].clearBoard();
    for (let i = 0; i < cells.length; i++) _modules_Gui__WEBPACK_IMPORTED_MODULE_1__["default"].renderCell(cells[i]);
    updateScore();
    checkIfGameOver();
  };
  setup();
  update();
  const restart = () => {
    if (!gameOver) if (!confirm('Are you sure you want to restart?')) return;
    gameOver = false;
    score = 4;
    highest = 2;
    cells.forEach(cell => cell.setValue(0));
    _modules_Gui__WEBPACK_IMPORTED_MODULE_1__["default"].toggleGameOver(false);
    _modules_Gui__WEBPACK_IMPORTED_MODULE_1__["default"].clearBoard();
    _modules_Gui__WEBPACK_IMPORTED_MODULE_1__["default"].updateScore(4, highscore, 2);
    setup();
    update();
  };
  return {
    merge,
    restart
  };
})();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);

/***/ }),

/***/ "./src/modules/Cell.js":
/*!*****************************!*\
  !*** ./src/modules/Cell.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Cell = (x, y, value) => {
  const getValue = () => value;
  const setValue = newValue => value = newValue;
  return {
    x,
    y,
    getValue,
    setValue
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Cell);

/***/ }),

/***/ "./src/modules/Gui.js":
/*!****************************!*\
  !*** ./src/modules/Gui.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Gui = (() => {
  const canvas = document.querySelector('canvas'),
    inputVisual = document.querySelector('#inputVisual'),
    logDisplay = document.querySelector('#log'),
    keyDisplays = document.querySelectorAll('.keyDisplay'),
    scoreDisplay = document.querySelector('#score'),
    highscoreDisplay = document.querySelector('#highscore'),
    highestDisplay = document.querySelector('#highest'),
    msgDisplay = document.querySelector('#msg'),
    ctx = canvas.getContext('2d');
  let unit = Math.floor((window.innerWidth < 400 ? window.innerWidth - 20 : 400) / 4 + 10);
  canvas.width = canvas.height = unit * 4;
  inputVisual.style.height = logDisplay.style.height = `${unit * 4}px`;
  const cellColorMap = {
    2: '#363006',
    4: '#75690E',
    8: '#B5A216',
    16: '#DBC51A',
    32: '#F5DC1E',
    64: '#36250A',
    128: '#755116',
    256: '#B57D22',
    512: '#DB972A',
    1024: '#F5AA2F',
    2048: '#F5420E'
  };
  const toggleGameOver = onOff => {
    msgDisplay.style.visibility = onOff ? 'visible' : 'hidden';
  };
  const updateScore = (score, highscore, highest) => {
    scoreDisplay.textContent = score;
    highscoreDisplay.textContent = highscore;
    highestDisplay.textContent = highest;
  };
  const highlightKey = index => {
    keyDisplays.forEach(k => k.classList.remove('active'));
    keyDisplays[index].classList.add('active');
    setTimeout(() => keyDisplays[index].classList.remove('active'), 200);
  };
  const renderBoard = () => {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      // vertical lines
      ctx.beginPath();
      ctx.moveTo(i * unit, 0);
      ctx.lineTo(i * unit, unit * 4);
      ctx.closePath();
      ctx.stroke();
      // horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * unit);
      ctx.lineTo(unit * 4, i * unit);
      ctx.closePath();
      ctx.stroke();
    }
  };
  const clearBoard = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderBoard();
  };
  const renderCell = cell => {
    if (!cell.getValue()) return;
    ctx.fillStyle = cellColorMap[cell.getValue()];
    ctx.fillRect(cell.x + 1, cell.y + 1, unit - 2, unit - 2);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Monospace';
    ctx.textAlign = 'center';
    ctx.fillText(cell.getValue(), cell.x + unit / 2, cell.y + unit / 2 + 10);
  };
  renderBoard();
  return {
    unit,
    renderCell,
    clearBoard,
    highlightKey,
    updateScore,
    toggleGameOver
  };
})();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gui);

/***/ }),

/***/ "./src/modules/UserInput.js":
/*!**********************************!*\
  !*** ./src/modules/UserInput.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.js");
/* harmony import */ var _Gui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Gui */ "./src/modules/Gui.js");


const UserInput = (() => {
  const restartBtn = document.querySelector('#restart');
  restartBtn.onclick = () => {
    _index__WEBPACK_IMPORTED_MODULE_0__["default"].restart();
  };
  document.addEventListener('keydown', ev => {
    switch (ev.key) {
      case 'ArrowUp':
        _index__WEBPACK_IMPORTED_MODULE_0__["default"].merge('vertical');
        _Gui__WEBPACK_IMPORTED_MODULE_1__["default"].highlightKey(0);
        break;
      case 'ArrowDown':
        _index__WEBPACK_IMPORTED_MODULE_0__["default"].merge('vertical', -1);
        _Gui__WEBPACK_IMPORTED_MODULE_1__["default"].highlightKey(2);
        break;
      case 'ArrowLeft':
        _index__WEBPACK_IMPORTED_MODULE_0__["default"].merge('horizontal');
        _Gui__WEBPACK_IMPORTED_MODULE_1__["default"].highlightKey(1);
        break;
      case 'ArrowRight':
        _index__WEBPACK_IMPORTED_MODULE_0__["default"].merge('horizontal', -1);
        _Gui__WEBPACK_IMPORTED_MODULE_1__["default"].highlightKey(3);
        break;
      default:
        return;
    }
  });
})();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UserInput);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/index.scss":
/*!************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/index.scss ***!
  \************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Roboto&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  padding: 0;\n  margin: 0;\n  box-sizing: border-box;\n  color: inherit;\n  font-family: \"Roboto\", sans-serif;\n}\n\nbody {\n  width: 100vw;\n  height: 100vh;\n  background: #111;\n  display: grid;\n  grid-template-rows: 30px auto 1fr 30px;\n  grid-template-columns: 30px 1fr 1fr 1fr 30px;\n  gap: 20px;\n}\nbody > div {\n  grid-row: 3/span 1;\n}\nbody > div:nth-of-type(1) {\n  grid-column: calc(1 + 1);\n}\nbody > div:nth-of-type(2) {\n  grid-column: calc(2 + 1);\n}\nbody > div:nth-of-type(3) {\n  grid-column: calc(3 + 1);\n}\n\n#inputVisual {\n  display: grid;\n  place-items: center;\n}\n#inputVisual > div {\n  width: 214px;\n  height: 142px;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 2px;\n}\n#inputVisual > div > div:not(:first-of-type, :nth-of-type(3)) {\n  color: #111;\n  border: 2px inset #fff;\n  color: #fff;\n  font-size: 1.6rem;\n  place-self: center;\n  width: 70px;\n  height: 70px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background 0.2s, color 0.2s;\n}\n#inputVisual > div > div:not(:first-of-type, :nth-of-type(3)).active {\n  background: #fff;\n  color: #111;\n}\n\n#log {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-size: 2rem;\n  position: relative;\n}\n\n#msg {\n  visibility: hidden;\n}\n\n#restart {\n  padding: 10px 20px;\n  border: 2px solid #fff;\n  border-radius: 10px;\n  margin-top: 30px;\n  background: transparent;\n  color: #fff;\n  font-size: 1.2rem;\n  transition: color 0.2s, background 0.2s;\n  cursor: pointer;\n}\n#restart:hover {\n  color: #111;\n  background: #fff;\n}\n\nh1 {\n  font-size: 2.4rem;\n  color: #fff;\n  text-align: center;\n  margin-bottom: 20px;\n  grid-area: 2/3/span 1/span 1;\n}\nh1 sub {\n  font-size: 40%;\n  font-weight: normal;\n  margin-left: 5px;\n}\n\ncanvas {\n  background-color: #222;\n}", "",{"version":3,"sources":["webpack://./src/styles/index.scss"],"names":[],"mappings":"AAEA;EACE,UAAA;EACA,SAAA;EACA,sBAAA;EACA,cAAA;EACA,iCAAA;AAAF;;AAGA;EACE,YAAA;EACA,aAAA;EACA,gBAAA;EACA,aAAA;EACA,sCAAA;EACA,4CAAA;EACA,SAAA;AAAF;AAEE;EACE,kBAAA;AAAJ;AAKI;EACE,wBAAA;AAHN;AAEI;EACE,wBAAA;AAAN;AADI;EACE,wBAAA;AAGN;;AAEA;EACE,aAAA;EACA,mBAAA;AACF;AACE;EACE,YAAA;EACA,aAAA;EACA,aAAA;EACA,kCAAA;EACA,QAAA;AACJ;AACI;EACE,WAAA;EACA,sBAAA;EACA,WAAA;EACA,iBAAA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,uCAAA;AACN;AACM;EACE,gBAAA;EACA,WAAA;AACR;;AAKA;EACE,aAAA;EACA,sBAAA;EACA,mBAAA;EACA,uBAAA;EACA,WAAA;EACA,eAAA;EACA,kBAAA;AAFF;;AAKA;EACE,kBAAA;AAFF;;AAKA;EACE,kBAAA;EACA,sBAAA;EACA,mBAAA;EACA,gBAAA;EACA,uBAAA;EACA,WAAA;EACA,iBAAA;EACA,uCAAA;EACA,eAAA;AAFF;AAIE;EACE,WAAA;EACA,gBAAA;AAFJ;;AAMA;EACE,iBAAA;EACA,WAAA;EACA,kBAAA;EACA,mBAAA;EACA,4BAAA;AAHF;AAKE;EACE,cAAA;EACA,mBAAA;EACA,gBAAA;AAHJ;;AAOA;EACE,sBAAA;AAJF","sourcesContent":["@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');\r\n\r\n* {\r\n  padding: 0;\r\n  margin: 0;\r\n  box-sizing: border-box;\r\n  color: inherit;\r\n  font-family: 'Roboto', sans-serif;\r\n}\r\n\r\nbody {\r\n  width: 100vw;\r\n  height: 100vh;\r\n  background: #111;\r\n  display: grid;\r\n  grid-template-rows: 30px auto 1fr 30px;\r\n  grid-template-columns: 30px 1fr 1fr 1fr 30px;\r\n  gap: 20px;\r\n\r\n  > div {\r\n    grid-row: 3 / span 1;\r\n  }\r\n\r\n  $divs: 1, 2, 3;\r\n  @each $div in $divs {\r\n    > div:nth-of-type(#{$div}) {\r\n      grid-column: calc(#{$div} + 1);\r\n    }\r\n  }\r\n}\r\n\r\n#inputVisual {\r\n  display: grid;\r\n  place-items: center;\r\n\r\n  > div {\r\n    width: 214px;\r\n    height: 142px;\r\n    display: grid;\r\n    grid-template-columns: 1fr 1fr 1fr;\r\n    gap: 2px;\r\n\r\n    > div:not(:first-of-type, :nth-of-type(3)) {\r\n      color: #111;\r\n      border: 2px inset #fff;\r\n      color: #fff;\r\n      font-size: 1.6rem;\r\n      place-self: center;\r\n      width: 70px;\r\n      height: 70px;\r\n      display: flex;\r\n      align-items: center;\r\n      justify-content: center;\r\n      transition: background 0.2s, color 0.2s;\r\n\r\n      &.active {\r\n        background: #fff;\r\n        color: #111;\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\n#log {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n  color: #fff;\r\n  font-size: 2rem;\r\n  position: relative;\r\n}\r\n\r\n#msg {\r\n  visibility: hidden;\r\n}\r\n\r\n#restart {\r\n  padding: 10px 20px;\r\n  border: 2px solid #fff;\r\n  border-radius: 10px;\r\n  margin-top: 30px;\r\n  background: transparent;\r\n  color: #fff;\r\n  font-size: 1.2rem;\r\n  transition: color 0.2s, background 0.2s;\r\n  cursor: pointer;\r\n\r\n  &:hover {\r\n    color: #111;\r\n    background: #fff;\r\n  }\r\n}\r\n\r\nh1 {\r\n  font-size: 2.4rem;\r\n  color: #fff;\r\n  text-align: center;\r\n  margin-bottom: 20px;\r\n  grid-area: 2 / 3 / span 1 / span 1;\r\n\r\n  sub {\r\n    font-size: 40%;\r\n    font-weight: normal;\r\n    margin-left: 5px;\r\n  }\r\n}\r\n\r\ncanvas {\r\n  background-color: #222;\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./index.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/index.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map
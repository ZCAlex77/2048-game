import './styles/index.scss';
import Gui from './modules/Gui';
import UserInput from './modules/UserInput';
import Cell from './modules/Cell';

const game = (() => {
  let lastState = [];
  let cells = [];
  let score = 4;
  let highest = 2;
  let highscore = 4;

  const updateScore = () => {
    let values = cells.map((cell) => cell.getValue());
    score = values.reduce((p, c) => (p += c), 0);
    if (score >= highscore) highscore = score;
    highest = Math.max(...values);

    Gui.updateScore(score, highscore, highest);
  };

  const spawnCell = () => {
    let emptyCells = cells.filter((cell) => !cell.getValue());
    emptyCells[Math.floor(Math.random() * emptyCells.length)].setValue(2);
  };

  const merge = (axis, direction = 1) => {
    let values = [];

    // get cell values as a matrix
    switch (axis) {
      case 'horizontal':
        // each matrix row will be a row of the game grid
        for (let i = 0; i < 16; i += 4)
          values.push(cells.map((cell) => cell.getValue()).slice(i, i + 4));
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
      if (notZero.length)
        for (let j = 0; j < notZero.length; j++) values[i][j] = notZero[j];
    }

    // move the 0's to the other side of the rows if the direction is -1
    if (direction === -1) {
      for (let i = 0; i < 4; i++) {
        let firstZero = values[i].findIndex((val) => !val);
        if (firstZero !== -1)
          values[i] = values[i]
            .slice(firstZero)
            .concat(values[i].slice(0, firstZero));
      }
    }

    // decide the direction to iterate over the values
    let from = direction === -1 ? 3 : 0;
    let to = direction === -1 ? 0 : 3;

    // iterate over the values and merge same-value neighbour cells
    for (let i = 0; i < 4; i++)
      for (let j = from; j !== to + direction; j += direction) {
        // if the value is 0 break because there are only 0's for the rest of the row
        if (!values[i][j]) break;
        // if the next value is the same as the current one, merge them
        if (values[i][j] === values[i][j + direction]) {
          values[i][j] *= 2;

          // remove the used value and shift next cells in place
          for (
            let k = j + direction;
            values[i][k] !== 0 && k >= 0 && k <= 3;
            k += direction
          ) {
            values[i][k] = values[i][k + direction];
            if (values[i][k] === undefined) values[i][k] = 0;
          }
        }
      }

    // update cells with new values
    values = values.flat();
    let order = [];
    if (axis === 'horizontal')
      order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    else order = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
    values.forEach((val, i) => cells[order[i]].setValue(val));

    // update board
    update();
  };

  const setup = () => {
    cells = Array(16)
      .fill(0)
      .map((n, i) => {
        return Cell((i % 4) * Gui.unit, Math.floor(i / 4) * Gui.unit, 0);
      });
    for (let i = 0; i < 2; i++) spawnCell();
    lastState = cells.map((cell) => cell.getValue());
  };

  const update = () => {
    // check if cells moved
    let madeMove = false;
    for (let i = 0; i < 16; i++)
      if (cells[i].getValue() !== lastState[i]) madeMove = true;

    // if cells moved, spawn another cell
    if (madeMove) {
      spawnCell();
      lastState = cells.map((cell) => cell.getValue());
    }

    // rendering
    Gui.clearBoard();
    for (let i = 0; i < cells.length; i++) Gui.renderCell(cells[i]);

    updateScore();
  };

  setup();
  update();

  const restart = () => {};

  return { merge, restart };
})();

export default game;

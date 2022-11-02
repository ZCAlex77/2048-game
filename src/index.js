import './styles/index.scss';
import Gui from './modules/Gui';
import Cell from './modules/Cell';

const game = (() => {
  const cells = Array(16)
    .fill(0)
    .map((n, i) => {
      return Cell((i % 4) * Gui.unit, Math.floor(i / 4) * Gui.unit, 0);
    });

  const spawnCell = () => {
    let emptyCells = cells.filter((cell) => !cell.getValue());
    emptyCells[Math.floor(Math.random() * emptyCells.length)].setValue(2);
  };

  const setup = () => {
    for (let i = 0; i < 2; i++) spawnCell();
  };

  const update = () => {
    for (let i = 0; i < cells.length; i++) Gui.renderCell(cells[i]);
  };

  setup();
  update();

  const restart = () => {};

  return { restart };
})();

export default game;

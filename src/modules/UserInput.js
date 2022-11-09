import game from '../index';
import Gui from './Gui';

const UserInput = (() => {
  const restartBtn = document.querySelector('#restart');

  restartBtn.onclick = () => {
    game.restart();
  };

  document.addEventListener('keydown', (ev) => {
    switch (ev.key) {
      case 'ArrowUp':
        game.merge('vertical');
        Gui.highlightKey(0);
        break;
      case 'ArrowDown':
        game.merge('vertical', -1);
        Gui.highlightKey(2);
        break;
      case 'ArrowLeft':
        game.merge('horizontal');
        Gui.highlightKey(1);
        break;
      case 'ArrowRight':
        game.merge('horizontal', -1);
        Gui.highlightKey(3);
        break;
      default:
        return;
    }
  });
})();

export default UserInput;

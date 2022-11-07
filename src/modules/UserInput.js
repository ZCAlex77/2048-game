import game from '../index';

const UserInput = (() => {
  document.addEventListener('keydown', (ev) => {
    switch (ev.key) {
      case 'ArrowUp':
        game.merge('vertical');
        break;
      case 'ArrowDown':
        game.merge('vertical', -1);
        break;
      case 'ArrowLeft':
        game.merge('horizontal');
        break;
      case 'ArrowRight':
        game.merge('horizontal', -1);
        break;
      default:
        return;
    }
  });
})();

export default UserInput;

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

  let unit = Math.floor(
    (window.innerWidth < 400 ? window.innerWidth - 20 : 400) / 4 + 10
  );
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
    2048: '#F5420E',
  };

  const showGameOver = () => {
    msgDisplay.textContent = 'Game over!';
    msgDisplay.style.display = 'block';
  };

  const updateScore = (score, highscore, highest) => {
    scoreDisplay.textContent = score;
    highscoreDisplay.textContent = highscore;
    highestDisplay.textContent = highest;
  };

  const highlightKey = (index) => {
    keyDisplays.forEach((k) => k.classList.remove('active'));
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

  const renderCell = (cell) => {
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
    showGameOver,
  };
})();

export default Gui;

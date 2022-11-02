const Gui = (() => {
  const canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

  let unit = Math.floor(
    (window.innerWidth < 400 ? window.innerWidth - 20 : 400) / 4 + 10
  );
  canvas.width = canvas.height = unit * 4;

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

  const renderBoard = (() => {
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
  })();

  const renderCell = (cell) => {
    if (!cell.getValue()) return;

    ctx.fillStyle = cellColorMap[cell.getValue()];
    ctx.fillRect(cell.x + 1, cell.y + 1, unit - 2, unit - 2);

    ctx.fillStyle = '#fff';
    ctx.font = '30px Monospace';
    ctx.textAlign = 'center';
    ctx.fillText(cell.getValue(), cell.x + unit / 2, cell.y + unit / 2 + 10);
  };

  return { unit, renderCell };
})();

export default Gui;

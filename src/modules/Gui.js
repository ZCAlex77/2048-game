const Gui = (() => {
  const canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

  let unit = Math.floor(
    (window.innerWidth < 400 ? window.innerWidth - 20 : 400) / 4 + 10
  );
  canvas.width = canvas.height = unit * 4;

  const renderBoard = (() => {
    ctx.strokeStyle = 'gold';
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

  return { unit };
})();

export default Gui;

const Cell = (x, y, value) => {
  const getValue = () => value;
  const setValue = (newValue) => (value = newValue);
  return { x, y, getValue, setValue };
};

export default Cell;

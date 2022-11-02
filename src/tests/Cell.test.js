import Cell from '../modules/Cell';

describe('Cell', () => {
  let cell;
  beforeEach(() => {
    cell = Cell(100, 200, 4);
  });

  it('is created successfully', () => {
    expect(cell.x).toBe(100);
    expect(cell.y).toBe(200);
    expect(cell.getValue()).toBe(4);
  });

  it('changes value correctly', () => {
    cell.setValue(4);
    expect(cell.getValue()).toBe(4);
  });
});

export default class Board {
  constructor(rows, cols, blockVariations, debug = false) {
    this.rows = rows;
    this.cols = cols;
    this.blockVariations = blockVariations;
    this.debug = debug;

    this.grid = [];
    // reserve grid
    this.reserveGrid = [];

    for (let row = 0; row < this.rows; row++ ) {
      this.grid.push([]);
      this.reserveGrid.push([]);
    }

    this.populateGrid();
    this.populateReserveGrid();

    this.consoleLog();
  }

  populateGrid() {
    for (let row = 0; row < this.rows; row++ ) {
      for (let col = 0; col < this.cols; col++ ) {
        const variation = Math.floor(Math.random() * this.blockVariations) + 1;
        this.grid[row][col] = variation;
      }
    }
  }

  populateReserveGrid() {
    for (let row = 0; row < this.rows; row++ ) {
      for (let col = 0; col < this.cols; col++ ) {
        const variation = Math.floor(Math.random() * this.blockVariations) + 1;
        this.reserveGrid[row][col] = variation;
      }
    }
  }

  consoleLog() {
    if (this.debug) {
      let prettyString = '';

      // print reserve grid
      for (let row = 0; row < this.rows; row++ ) {
        prettyString += '\n';
        for (let col = 0; col < this.cols; col++ ) {
          prettyString += ' ' + this.reserveGrid[row][col];
        }
      }
      
      // separate our grids
      prettyString += '\n';
      for (let col = 0; col < this.cols; col++) {
        prettyString += ' -';
      }

      // print our main
      for (let row = 0; row < this.rows; row++) {
        prettyString += '\n';
        for (let col = 0; col < this.cols; col++) {
          prettyString += ' ' + this.grid[row][col];
        }
      }

      console.log(prettyString);
    }
  }

  swap(source, target) {
    const temp = this.grid[target.row][target.col];
    this.grid[target.row][target.col] = this.grid[source.row][source.col]; this.grid[source.row][source.col] = temp;

    const tempPos = {
      row: source.row,
      col: source.col,
    };

    source.row = target.row;
    source.col = target.col;
    target.row = tempPos.row;
    target.col = tempPos.col;
    
    this.consoleLog(); 
  }

  checkAdjacent(source, target) {
    // Absolute value allows us to get a positive answer for
    // either direction ( + is + and - is +) with Math.abs()
    const diffRow = Math.abs(source.row - target.row);
    const diffCol = Math.abs(source.col - target.col);

    // same row; col must only be 1 away
    // same col; row must only be 1 away
    const isAdjacent = (diffRow === 1 && diffCol === 0) || (diffRow === 0 && diffCol === 1);
    return isAdjacent;
  }
}

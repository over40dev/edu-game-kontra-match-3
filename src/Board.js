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
}

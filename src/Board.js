export default class Board {
  constructor(state, rows, cols, blockVariations, debug = false) {
    this.state = state;
    this.rows = rows;
    this.cols = cols;
    this.blockVariations = blockVariations;
    this.debug = debug;

    this.grid = [];
    // reserve grid
    this.reserveGrid = [];

    for (let row = 0; row < this.rows; row++) {
      this.grid.push([]);
      this.reserveGrid.push([]);
    }

    this.populateGrid();
    this.populateReserveGrid();

    this.consoleLog();
  }

  // start with no chains already on game board
  populateGrid() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const variation = Math.floor(Math.random() * this.blockVariations) + 1;
        this.grid[row][col] = variation;
      }
    }

    // setup recursive call (method calling itself)
    // to populateGrid() until no more chains exist
    const chains = this.findAllChains();
    if (chains.length > 0) {
      this.populateGrid();
    }
  }

  populateReserveGrid() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const variation = Math.floor(Math.random() * this.blockVariations) + 1;
        this.reserveGrid[row][col] = variation;
      }
    }
  }

  consoleLog() {
    if (this.debug) {
      let prettyString = '';

      // print reserve grid
      for (let row = 0; row < this.rows; row++) {
        prettyString += '\n';
        for (let col = 0; col < this.cols; col++) {
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

  isChained(block) {
    let isChained = false;
    const variation = this.grid[block.row][block.col];
    const { row, col } = block;

    // left
    if (variation === this.grid[row][col - 1] &&
      variation === this.grid[row][col - 2]) {
      isChained = true;
    }

    // right
    if (variation === this.grid[row][col + 1] &&
      variation === this.grid[row][col + 2]) {
      isChained = true;
    }

    // up -- first IF makes sure [row-2] exists
    // otherwise we will get an error
    if (this.grid[row - 2]) {
      if (variation === this.grid[row - 1][col] &&
        variation === this.grid[row - 2][col]) {
        isChained = true;
      }
    }

    // down -- first IF makes sure [row+2] exists
    // otherwise we will get an error
    if (this.grid[row + 2]) {
      if (variation === this.grid[row + 1][col] &&
        variation === this.grid[row + 2][col]) {
        isChained = true;
      }
    }

    // center - horizontal
    if (variation === this.grid[row][col - 1] &&
      variation === this.grid[row][col + 1]) {
      isChained = true;
    }

    // center - vertical
    // First IF makes sure both [row +/- 1] exist
    // otherwise we will get an error
    if (this.grid[row - 1] && this.grid[row + 1]) {
      if (variation === this.grid[row - 1][col] &&
        variation === this.grid[row + 1][col]) {
        isChained = true;
      }
    }

    return isChained;

  }

  findAllChains() {
    const chained = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.isChained({ row, col })) {
          chained.push({ row, col });
        }
      }
    }

    return chained;
  }

  clearChains() {
    const chainedBlocks = this.findAllChains();

    chainedBlocks.forEach((block) => {
      this.grid[block.row][block.col] = 0;
      // add this method call to destroy block object
      this.state.getBlockFromColRow(block).kill();
      // - this - refers to Board class we are in now
      // - .state - refers to Game class (passed to Board)
      // - .getBlockFromColRow() - created in Game class
      // - .kill() - created in Block class
    });
  }

  dropBlock(sourceRow, targetRow, col) {
    this.grid[targetRow][col] = this.grid[sourceRow][col];
    this.grid[sourceRow][col] = 0;

    this.state.dropBlock(sourceRow, targetRow, col)
  }

  dropReserveBlock(sourceRow, targetRow, col) {
    this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
    this.reserveGrid[sourceRow][col] = 0;

    this.state.dropReserveBlock(sourceRow, targetRow, col);
  }

  updateGrid() {
    // loop backward through main grid rows
    for (let row = this.rows - 1; row >= 0; row--) {
      // loop forward through cols
      for (let col = 0; col < this.cols; col++) {
        // check if we found empty cell
        if (this.grid[row][col] === 0) {
          let foundBlock = false;
          // if cell empty look to row above for a block
          for (let rowAbove = row - 1; rowAbove >= 0; rowAbove--) {
            // check if a block is found (value > 0)
            if (this.grid[rowAbove][col] > 0) {
              foundBlock = true;
              // block found above so drop it down one row
              this.dropBlock(rowAbove, row, col);
              // stop looping through for-loop
              break;
            }
          }
          // if no block found in main grid col 
          if (!foundBlock) {
            // check reserve grid col from bottom row up
            for (let rowAbove = this.rows - 1; rowAbove >= 0; rowAbove--) {
              // check if a block is found (value > 0)
              if (this.reserveGrid[rowAbove][col] > 0) {
                // drop reserve block down to main grid top row
                this.dropReserveBlock(rowAbove, row, col);
                // stop looping through for-loop
                break;
              }

            }
          }
        }
      }
    }
    // re-populate reserve grid
    this.populateReserveGrid();
  }
}

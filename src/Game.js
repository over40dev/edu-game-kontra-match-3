import Grid from './Grid.js';
import Board from './Board.js';
import Block from './Block.js';

const {
  init, GameLoop, Sprite,
  initPointer, track,
  load, on, Pool
} = kontra;

export default class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.numberOfRows = 8;
    this.numberOfCols = 8;
    // matches bean image size
    this.blockSize = 35;
    // add padding so image don't touch cell sides
    this.cellPadding = 4;

    this.init();
  }

  init() {
    const { canvas, context } = init();
    this.canvas = canvas;
    this.context = context;

    initPointer();

    // create game loop
    this.gameLoop = GameLoop({
      update: this.update.bind(this),
      render: this.render.bind(this),
    });

    // create grid
    this.createGrid();

    // create board
    this.createBoard();

    // load game assets
    this.load();
  }

  render() {
    this.grid.render();

    if (this.blockPool) {

      this.blockPool
        .getAliveObjects()
        .forEach((block) => {
          if (block.selected) {
            block.context.globalAlpha = 0.6;
          } else {
            block.context.globalAlpha = 1;
          }

          block.render();
          // ensure alpha for all game objects is set back to 1 (fully visible)
          block.context.globalAlpha = 1;
        });
    }
  }

  update() {
    if (this.blockPool) {
      this.blockPool.update();
    }
  }

  load() {
    on('assetLoaded', (asset, url) => {
      asset.id = url;
    });

    // load our game assets 
    // with kontra load method
    load(
      'assets/images/bean_blue.png',
      'assets/images/bean_green.png',
      'assets/images/bean_orange.png',
      'assets/images/bean_pink.png',
      'assets/images/bean_purple.png',
      'assets/images/bean_red.png',
      'assets/images/bean_white.png',
      'assets/images/bean_yellow.png',
      'assets/images/bean_dead.png',
    ).then((assets) => {
      this.assets = assets;
      // start the game loop
      this.start();

    }).catch((error) => {
      console.log(error);
    });

  }

  start() {
    this.gameLoop.start();
    this.drawBoard();
  }

  createGrid() {
    this.grid = new Grid({
      numberOfRows: this.numberOfRows,
      numberOfCols: this.numberOfCols,
      cellSize: this.blockSize + this.cellPadding,
      x: 25,
      y: 100,
      color: 'lavender',
    });
  }

  createBoard() {
    this.board = new Board(
      this,
      this.numberOfRows,
      this.numberOfRows,
      6,
      false,
    );

    this.blockPool = Pool({
      create: () => {
        return new Block();
      }
    });
  }

  drawBoard() {
    for (let row = 0; row < this.numberOfRows; row++) {
      for (let col = 0; col < this.numberOfCols; col++) {
        // calculate x and y position
        const x = (25 + this.cellPadding) + col * (this.blockSize + this.cellPadding);
        const y = (100 + this.cellPadding) + row * (this.blockSize + this.cellPadding);

        const block = this.blockPool.get({
          x,
          y,
          row,
          col,
          image: this.assets[this.board.grid[row][col]],
          ttl: Infinity,
        });

        block.onDown = () => {
          this.pickBlock(block);
        };

        track(block);
      }
    }
  }

  pickBlock(block) {
    if (this.isBoardBlocked) {
      return;
    }

    // if this is the first block that was picked
    if (!this.selectedBlock) {
      block.selected = true;
      this.selectedBlock = block;
    } else {
      // second block player selected is our target block
      this.targetBlock = block;

      // check is valid move
      if (this.board.checkAdjacent(this.selectedBlock, this.targetBlock)) {
        this.isBoardBlocked = true;

        // swap blocks
        this.swapBlocks(this.selectedBlock, this.targetBlock);
      } else {
        // not valid so clear and player try another selection
        this.clearSelection();
      }

    }
  }

  swapBlocks(block1, block2) {
    // swap the location of the two blocks
    const tempX = block1.x;
    const tempY = block1.y;
    block1.x = block2.x;
    block1.y = block2.y;
    block2.x = tempX;
    block2.y = tempY;

    this.board.swap(block1, block2);

    // check for chains unless reverse swap
    if (!this.isReversingSwap) {
      const chains = this.board.findAllChains();
      if (chains.length > 0) {
        this.updateBoard();
      } else {
        this.isReversingSwap = true;
        this.swapBlocks(block1, block2);
      }
    } else {
      this.isReversingSwap = false;
      this.clearSelection();
    }

  }

  clearSelection() {
    this.isBoardBlocked = false;
    this.selectedBlock.selected = false;
    this.selectedBlock = null;
  }

  updateBoard() {
    this.board.clearChains();
    this.board.updateGrid();

    const chains = this.board.findAllChains();

    if (chains.length > 0) {
      this.updateBoard();
    } else {
      this.clearSelection();
    }
  }

  getBlockFromColRow(position) {

    let foundBlock;

    this.blockPool.getAliveObjects().some((block) => {
      if (block.row === position.row &&
        block.col === position.col) {
        foundBlock = block;
        return true;
      }
      return false;
    });

    return foundBlock;

  }

  dropBlock(sourceRow, targetRow, col) {
    const block = this.getBlockFromColRow({ col, row: sourceRow, });
    const targetY = (100 + this.cellPadding) + targetRow * (this.blockSize + this.cellPadding);
    block.row = targetRow;
    block.y = targetY;
  }
  
  dropReserveBlock(sourceRow, targetRow, col) {
    const x = (25 + this.cellPadding) + col * (this.blockSize + this.cellPadding);
    const y = (100 + this.cellPadding) + targetRow * (this.blockSize + this.cellPadding);
    const block = this.blockPool.get({
      x,
      y,
      col,
      row: targetRow,
      image: this.assets[this.board.grid[targetRow][col]],
      ttl: Infinity,
    });

    block.onDown = () => {
      this.pickBlock(block);
    };

    track(block);
  }
}

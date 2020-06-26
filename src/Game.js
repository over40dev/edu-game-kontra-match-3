import Grid from './Grid.js';

const { init, GameLoop, Sprite, initPointer, track } = kontra;
export default class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;

    this.numberOfRows = 8;
    this.numberOfCols = 8;
    // matches bean image size
    this.cellSize = 35; 
    // add padding so image don't touch cell sides
    this.cellPadding = 4;


    this.init();
  }

  init() {
    // intialize kontra
    console.log('initializing our game');
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

    // load game assets
    this.load();
  }
   
  render() {
    // render sprites with kontra
    console.log('render');
  }
  
  update() {
    // update our sprites with kontra
    console.log('update');
  }
  
  load() {
    // load our game assets with kontra
    console.log('loading assets for our game');

    // when assets have been loaded
    // start the game loop
    this.start();
  }
  
  start() {
    // start our game loop
    console.log('starting our game');
    // this.gameLoop.start();
  }

  createGrid() {
    this.grid = new Grid({
      numberOfRows: this.numberOfRows,
      numberOfCols: this.numberOfCols,
      cellSize: this.cellSize + this.cellPadding,
      x: 25,
      y: 100,
      color: 'lavender',
    });
  }
}

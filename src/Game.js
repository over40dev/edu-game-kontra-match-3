const { init, GameLoop, Sprite, initPointer, track } = kontra;
export default class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;

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
}

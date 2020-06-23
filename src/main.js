const { init, GameLoop, Sprite, initPointer, track } = kontra;
const { canvas, context } = init();

// This function must be called before
// pointer interactions will work
initPointer();

let sprite = null;
const image = new Image();
image.src = 'assets/images/bean_blue.png';

image.onload = () => {
  sprite = Sprite({
    x: 200,
    y: 200,
    // dx: 2,
    image: image,
    // handle down events on sprite
    onDown: () => {
      console.log('onDown');
    },
    // handle up events on sprite
    onUp: () => {
      console.log('onUp');
    },
    // handle over events on sprite
    onOver: () => {
      console.log('onOver');
    },
  });
  // track must be called before
  // interactions will occur on
  // the game object passed to it
  track(sprite);
}

// create main game loop
const loop = GameLoop({
  // update the game state
  update: () => { 
    if (sprite) {
      sprite.update();
      if (sprite.x > canvas.width) {
        sprite.x = -sprite.width;
      }
    }
  },
  // render the game state
  render: () => { 
    if (sprite) {
      sprite.render();
    }
  },
});

loop.start();

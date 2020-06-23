const { init, GameLoop, Sprite } = kontra;
const { canvas, context } = init();

let sprite = null;
const image = new Image();
image.src = 'assets/images/bean_blue.png';

image.onload = () => {
  sprite = Sprite({
    x: 200,
    y: 200,
    dx: 2,
    image: image,
  });
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

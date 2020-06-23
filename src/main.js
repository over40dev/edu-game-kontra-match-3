const { init, GameLoop, Sprite } = kontra;
const { canvas, context } = init();

const sprite = Sprite({
  x: 200,
  y: 200,
  color: 'blue',
  width: 50,
  height: 20,
  dx: 2,
});

// create main game loop
const loop = GameLoop({
  // update the game state
  update: () => { 
    sprite.update();
    if (sprite.x > canvas.width) {
      sprite.x = -sprite.width;
    }
  },
  // render the game state
  render: () => { 
    sprite.render();
  },
});

loop.start();

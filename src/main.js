import Game from './Game.js';
import { resize } from './resize.js';

const HEIGHT = 640;
const WIDTH = 360;

const game = new Game(HEIGHT, WIDTH);

resize(WIDTH, HEIGHT);
window.addEventListener('resize', () => {
  resize(WIDTH, HEIGHT);
}, false);

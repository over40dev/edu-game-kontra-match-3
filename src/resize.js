export function resize(gameWidth, gameHeight) {
  const canvas = document.getElementById('canvas');
  const width = window.innerWidth;
  const height = window.innerHeight;
  const windowRatio = width / height;
  const gameRatio = gameWidth / gameHeight;

  if (gameRatio < windowRatio) {
    // scale game up
    canvas.style.width = `${height * gameRatio}px`;
    canvas.style.height = `${height}px`;
  } else {
    // scale game down
    canvas.style.width = `${width}px`;
    canvas.style.height = `${width / gameRatio}px`;
  }
}

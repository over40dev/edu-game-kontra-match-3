const { Sprite } = kontra;

export default class Grid {
  constructor(config) {
    this.numberOfRows = config.numberOfRows;
    this.numberOfCols = config.numberOfCols;
    this.cellSize = config.cellSize;
    this.color = config.color;
    this.x = config.x;
    this.y = config.y;

    this.backgroundSprite = null;
    this.width = this.numberOfCols * this.cellSize;
    this.height = this.numberOfRows * this.cellSize;

    this.gridSprites = [];

    this.init();
  }

  init() {
    this.backgroundSprite = Sprite({
      x: this.x,
      y: this.y,
      color: 'grey',
      width: this.width,
      height: this.height,
    });

    // vertical grid lines
    for (let i = 0; i < this.width + this.cellSize; i += this.cellSize) {
      const sprite = Sprite({
        x: this.x + i,
        y: this.y,
        color: this.color,
        width: 1,
        height: this.height,
      });
      this.gridSprites.push(sprite);
    }

    // horizontal grid lines
    for (let i = 0; i < this.height + this.cellSize; i += this.cellSize) {
      const sprite = Sprite({
        x: this.x,
        y: this.y + i,
        color: this.color,
        width: this.width,
        height: 1,
      });
      this.gridSprites.push(sprite);
    }
  }

  render() {
    if (this.backgroundSprite) {
      this.backgroundSprite.render();
    }
    this.gridSprites.forEach(s => { s.render(); });
  }
}

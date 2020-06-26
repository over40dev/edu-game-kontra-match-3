export default class Grid {
  constructor(config) {
    this.numberOfRows = config.numberOfRows;
    this.numberOfCols = config.numberOfCols;
    this.cellSize = config.cellSize;
    this.color = config.color;
    this.x = config.x;
    this.y = config.y;
    this.height = config.height;
    this.width = config.width;
  }
}

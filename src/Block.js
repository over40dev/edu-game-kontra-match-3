const { Sprite } = kontra;

export default class Block extends Sprite.class {
  constructor() {
    // add call to super() to call Sprite.class
    super();
    this.row = 0;
    this.col = 0;
    this.selected = false;
  }
}

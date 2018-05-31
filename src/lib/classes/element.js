const shortid = require('shortid');
const InputHandler = require('./../decorators/input-handler');
const Shape = require('./shape');

@InputHandler()
class Element {

  constructor(lines = [], x = 0, y = 0) {
    this.id = shortid();
    this.shape = new Shape(lines);
    this.positionX = x;
    this.positionY = y;
    this.ui = null;
  }

  get position() {
    return [this.positionX, this.positionY];
  }

  set position([x, y]) {
    this.positionX = x;
    this.positionY = y;
  }

  setPosition(x, y) {
    this.position = [x, y];
    return this;
  }

  translateX(val) {
    this.positionX += val;
    return this;
  }

  translateY(val) {
    this.positionY += val;
    return this;
  }

  translate(x, y) {
    return this.translateX(x).translateY(y);
  }

  setShape(...args) {
    this.shape.setShape(...args);
    return this;
  }

}

module.exports = Element;

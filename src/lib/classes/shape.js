class Shape {

  constructor(lines = []) {
    this.offsetX = 0;
    this.offsetY = 0;
    this.lines = [];
    this.width = 0;
    this.setShape(lines);
  }

  get height() {
    return this.lines.length;
  }

  get offset() {
    return [this.offsetX, this.offsetY];
  }

  set offset([x, y]) {
    this.offsetX = x;
    this.offsetY = y;
  }

  setOffset(x, y) {
    this.offset = [x, y];
    return this;
  }

  get originX() {
    return this.offsetX - Math.floor(this.width / 2);
  }

  get originY() {
    return this.offsetY - Math.floor(this.height / 2)
  }

  get origin() {
    return [this.originX, this.originY];
  }

  setShape(lines) {
    this.lines = lines.filter(line => typeof line === 'string');
    if (!lines.length) {
      this.width = 0;
    } else {
      this.width = lines.slice(0).sort((a, b) => {
        if (a.length > b.length) return -1;
        if (a.length < b.length) return 1;
        else return 0;
      })[0].length;
    }
    return this;
  }

}

module.exports = Shape;

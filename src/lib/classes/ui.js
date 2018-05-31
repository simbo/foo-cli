const chalk = require('chalk');
const TTY = require('./tty');

class UI extends TTY {

  constructor(...args) {
    super(...args);
    this.elements = new Map();
    this.loopFn = null;
    this.loopTimeoutReference = null;
    this.setFPS(20);
    this.clearScreen().hideCursor();
  }

  registerElement(element) {
    element.ui = this;
    this.elements.set(element.id, element);
    for (let handler of element.inputHandlers) {
      this.onInput(handler.data, handler.fn);
    }
    return this;
  }

  registerElements(...elements) {
    for (let element of elements) {
      this.registerElement(element);
    }
    return this;
  }

  unregisterElement(element) {
    element.ui = null;
    this.elements.delete(element.id);
    for (let handler of element.inputHandlers) {
      this.offInput(handler.data, handler.fn);
    }
    return this;
  }

  renderElement(element) {
    const [x, y] = element.shape.origin;
    for (let i = 0; i < element.shape.lines.length; i++) {
      const y = element.positionY + element.shape.originY + i
      if (y < 0 || y >= this.height) {
        continue;
      }
      const x = element.positionX + element.shape.originX;
      const line = element.shape.lines[i];
      const content = x < 0 ?
        line.substr(0 - x, Math.max(0, line.length + x)) :
        line.substr(0, Math.max(0, Math.min(line.length, this.width - x)));
      this.to(Math.max(0, x), y).write(
        chalk`{${this.style} ${content}}`
      );
    }
    return this;
  }

  renderElements() {
    for (let element of Array.from(this.elements.values())) {
      this.renderElement(element);
    }
    return this;
  }

  setFPS(val) {
    this.loopTimeoutDuration = Math.round(1000 / val);
    return this;
  }

  setLoop(loopFn) {
    this.loopFn = loopFn;
    const loop = () => {
      if (this.loopTimeoutReference) {
        clearTimeout(this.loopTimeoutReference);
      }
      if (typeof loopFn === 'function') {
        this.loopTimeoutReference = setTimeout(() => {
          this.loopFn() !== false && loop();
        }, this.loopTimeoutDuration);
      }
    };
    loop();
    return this;
  }

}

module.exports = UI;

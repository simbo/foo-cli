const chalk = require('chalk');
const escapes = require('./../ansi-escapes');
const InputHandler = require('./../decorators/input-handler');

const { stdin, stdout } = process;

@InputHandler()
class TTY {

  constructor(input = stdin, output = stdout) {

    this.input = input;
    this.output = output;
    this.cursorVisible = true;
    this.exitReason = null;
    this.style = 'bgBlack.white';

    process.on('SIGINT', () => this.exit('SIGINT'));
    process.on('SIGUSR1', () => this.exit('SIGUSR1'));
    process.on('SIGUSR2', () => this.exit('SIGUSR2'));
    process.on('uncaughtException', (err) => this.exit(err));

    process.on('exit', () => {
      this.clearScreen().showCursor();
      if (this.exitReason) {
        console.log(this.exitReason);
      }
    });

    if (!this.input.isTTY || !this.output.isTTY) {
      throw new Error('not a tty');
    }

    this.input.resume();
    this.input.setRawMode(true);
    this.input.setEncoding('utf8');

    this.input.on('data', (data) => {
      if (data === '\u0003') { // CTRL-C
        return this.exit('Goodbye!');
      }
      for (let handler of this.inputHandlers) {
        if (handler.data === data || handler.data === 'any') {
          handler.fn();
        }
      }
    });

  }

  get width() {
    return this.output.columns;
  }

  get height() {
    return this.output.rows;
  }

  get dimensions() {
    return [this.width, this.height];
  }

  get centerX() {
    return Math.floor((this.width - 1) / 2);
  }

  get centerY() {
    return Math.floor((this.height - 1) / 2);
  }

  get center() {
    return [this.centerX, this.centerY];
  }

  exit(reason = null) {
    this.exitReason = reason;
    process.exit();
  }

  write(...parts) {
    for (let part of parts) {
      this.output.write(part);
    }
    if (!this.cursorVisible) {
      this.output.write(escapes.cursorHide);
    }
    return this;
  }

  showCursor() {
    this.cursorVisible = true;
    this.output.write(escapes.cursorShow);
    return this;
  }

  hideCursor() {
    this.cursorVisible = false;
    this.output.write(escapes.cursorHide);
    return this;
  }

  to(x, y) {
    this.output.write(escapes.cursorTo(x, y));
    return this;
  }

  clearScreen() {
    return this.write(escapes.clearScreen);
  }

  setStyle(style) {
    this.style = style;
    return this;
  }

  fill(char = ' ') {
    return this.to(0, this.height).write(
      chalk`{${this.style} ${escapes.eraseLines(this.height)}}`
    );
  }

}

module.exports = TTY;

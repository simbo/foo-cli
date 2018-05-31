const decorateClass = require('./../functions/decorate-class');
const stringToAnsi = require('./../functions/string-to-ansi');

function InputHandler() {
  return decorateClass({

    inputHandlers: [],

    onInput(data, fn) {
      if (typeof data === 'object') {
        for (let handler of Object.entries(data)) {
          this.onInput(...handler);
        }
      } else {
        data = stringToAnsi(data);
        if (typeof data === 'string' && typeof fn === 'function') {
          this.inputHandlers.push({ data, fn });
        }
      }
      return this;
    },

    offInput(data, fn = null) {
      if (typeof data === 'object') {
        for (let handler of Object.entries(data)) {
          this.offInput(...handler);
        }
      } else {
        data = stringToAnsi(data);
        if (typeof data === 'string') {
          this.inputHandlers = this.inputHandlers.filter(handler => {
            if (typeof fn === 'function') {
              return !(handler.data === data && handler.fn === fn);
            }
            return handler.data !== data;
          });
        }
      }
      return this;
    }

  });
}

module.exports = InputHandler;

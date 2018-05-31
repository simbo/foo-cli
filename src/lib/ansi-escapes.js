const escapes = require('ansi-escapes');

const ESC = '\u001B[';

const ansiEscapes = {

  ...escapes,

  up: `${ESC}A`,
  down: `${ESC}B`,
  right: `${ESC}C`,
  left: `${ESC}D`

};

module.exports = ansiEscapes;

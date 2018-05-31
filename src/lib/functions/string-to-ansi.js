const escapes = require('./../ansi-escapes');

function stringToAnsi(str) {
  return escapes.hasOwnProperty(str) && typeof escapes[str] === 'string' ?
    escapes[str] : str;
}

module.exports = stringToAnsi;

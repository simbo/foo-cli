#!/usr/bin/env node

const UI = require('./lib/classes/ui');
const Element = require('./lib/classes/element');

const ui = new UI();

const foo = new Element([
  'FFFFFF',
  'FF',
  'FFFF  OOOO   OOOO',
  'FF   OO  OO OO  OO',
  'FF    OOOO   OOOO'
], ...ui.center);

foo.onInput({
  up: () => foo.translateY(-1),
  right: () => foo.translateX(1),
  down: () => foo.translateY(1),
  left: () => foo.translateX(-1),
});

const text1 = new Element([
  'Use arrow keys to move around.',
], ui.centerX, ui.height - 2);

const text2 = new Element([
  'Press C to center and CTRL-C to quit.'
], ui.centerX, ui.height - 1);

ui.setStyle('bgBlue.yellow')
  .registerElements(
    foo,
    text1,
    text2
  )
  .onInput('c', () => foo.setPosition(...ui.center))
  .setLoop(() => {
    ui.fill()
      .renderElements();
  });

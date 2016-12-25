const blessed = require('blessed');

var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'tconv';

var mainContent = blessed.box({
  top: 'center',
  left: 'center',
  width: '95%',
  height: '95%',
  align: 'center',
  valign: 'middle',
  content: 'Starting up tconv session [setting up] ..... \n\nPlease enter your username',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: '#2f2f2f',
    border: {
      fg: '#f0f0f0'
    }
  }
});


// Append our box to the screen.
screen.append(mainContent);

var text = blessed.textbox({
  parent: mainContent,
  keys: true,
  style: {
    bg: 'blue'
  },
  height: 1,
  width: 20,
  left: 'center',
  bottom: 3,
  name: 'text'
});

text.on('focus', function() {
  text.readInput();
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

text.focus();

screen.render();

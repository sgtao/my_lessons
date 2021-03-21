(function() {
  'use strict';

  // var SIZE = 2;
  var SIZE = 3;
  // var SIZE = 4;
  var NUMBER_LIMIT = SIZE * SIZE;
  var currentNum = 1;
  var PANEL_WIDTH = 50;
  var BOARD_PADDING = 10;
  var startTime;
  var timerId;
  var sizes = document.getElementsByClassName('size');

  function createPanel(num) {
    var panel;
    panel = document.createElement('div');
    panel.className = 'panel hidden';
    panel.textContent = num + 1;
    panel.addEventListener('click', function() {
      if ((this.textContent - 0) === currentNum) {
        this.className = 'panel flipped';
        currentNum++;
      }
      if (currentNum > NUMBER_LIMIT) {
        clearTimeout(timerId);
      }
    });
    return panel;
  }

  function initBoard() {
    var board = document.getElementById('board');
    var i;
    var panels = [];
    var panel;

    document.getElementById('container').style.width = PANEL_WIDTH * SIZE + BOARD_PADDING * 2 + 'px';

    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }

    for (i = 0; i < NUMBER_LIMIT; i++) {
      // board.appendChild(createPanel(i));
      panels.push(createPanel(i));
    }

    while (panels.length) {
      panel = panels.splice(Math.floor(Math.random() * panels.length), 1);
      board.appendChild(panel[0]);
    }
    currentNum = 1; // init expected number;
  }

  function runTimer() {
    document.getElementById('score').textContent = ((Date.now() - startTime) / 1000).toFixed(2);
    timerId = setTimeout(function() {
      runTimer();
    }, 10);
  }

  initBoard();

  document.getElementById('btn').addEventListener('click', function() {
    var panels = document.getElementsByClassName('panel');
    var i;
    if (typeof timerId !== 'undefined') {
      clearTimeout(timerId);
    }
    initBoard();
    if (this.className === 'start') {
      for (i = 0; i < panels.length; i++) {
        panels[i].className = 'panel';
      }
      this.textContent = 'RESTART?';
      this.className = 'restart';
      startTime = Date.now();
      runTimer();
    } else {
      this.textContent = 'START';
      this.className = 'start';
      document.getElementById('score').textContent = "0.0";
    }
  });

  for(let i = 0; i < sizes.length; i++) {
    sizes[i].addEventListener('click', function(){
      let size = sizes[i].textContent;
      console.log(size);
      if (document.getElementById('btn').className === 'start') {
        console.log("Change size");
        SIZE = size;
        NUMBER_LIMIT = SIZE * SIZE;
        initBoard();
      } else {
        console.log("Now is running");
      }
    });
  }

})();

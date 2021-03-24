'use strict';

var panel;
var LEVEL=5;
var NUMBER = LEVEL **2;
var sts_game="preGame"; // status:{preGame, isGaming, complete}

// timer
const score = document.querySelector('#score');
var   startTime, nowTime;
var   timerId;
function runTimer() {
  nowTime = ((Date.now() - startTime) / 1000).toFixed(2);
  score.textContent = nowTime;
  timerId = setTimeout(function() {   runTimer();   }, 10); // 10ms毎に更新
}

// board 
const board = document.querySelector('#board');

function createPanel(num) {
  let _el;
  _el = document.createElement(`div`);
  _el.className = "panel hidden";
  _el.textContent = num;  // パネル番号
  return _el;
}

var panels = []
function init_board(parent_el) {
  score.textContent = "0.00";
	while (board.firstChild) {
	    board.removeChild(board.firstChild);
	}

  let _panels = [];
  for (let i=0; i < NUMBER ; i++) {
    _panels.push( createPanel(i+1));
  }
  while(_panels.length) {
    let panel = _panels.splice(Math.floor(Math.random() * _panels.length), 1);
    parent_el.appendChild(panel[0]);
    panels.push(panel[0]);
  } 
}

// イベントを追加する
function active_panels(els) {
  let current = 1;
  els.forEach(_el => {
    _el.addEventListener ('click', function() {
      if (current == _el.textContent) {
        this.classList.add('flipped');
        if (current >= NUMBER) {
          // console.log('COMPLETE!!');
          sts_game = "complete";
      		clearTimeout(timerId);
          start_btn.textContent = "COMPLETE!!";
          start_btn.className = "complete";
          let _dd = new Date();
          let _result_msg = `time : ${nowTime} sec. at ${_dd.toLocaleString("ja")}`;
          console.log(_result_msg);
          append_result(_result_msg);
        } else {
          current++;
        }
      }
    });
  });
}

function release_hidden(els) {
  els.forEach(_el => {
    _el.classList.remove('hidden');
  });
  active_panels(els);
}

// start button
const start_btn = document.querySelector('#btn');
start_btn.addEventListener('click', function() {
  if (sts_game === "preGame") {
    sts_game = "isGaming";
    this.classList.add('restart');
    this.textContent = 'RESTART?';
    release_hidden(panels);
    startTime = Date.now();
    runTimer();
  } else if (sts_game === "isGaming") { // 
    sts_game = "preGame";
    if (typeof timerId !== 'undefined') { 
        clearTimeout(timerId);
    }
    this.classList.remove('restart');
    this.textContent = 'START';
    init_board(board);
  } else if (sts_game === "complete") { // click after complete
    sts_game = "preGame";
    this.classList.remove('restart');
    this.classList.remove('complete');
    this.textContent = 'START';
    init_board(board);
  } else {
    alert('wrong state. please reload page');
  }
});

// result of scores
const result = document.querySelector('#result');
function append_result(msg) {
  let _append_msg = document.createElement(`div`);
  _append_msg.textContent = msg;  
  _append_msg.className = "score";
  result.appendChild(_append_msg);
}



// main
init_board(board);


'use strict';

// ## step of Heron's making
let ncol = 5, nrow = 5, nbomb = 5;
let firstClick = true, isGaming = false;
let tile_w = 60, tile_h = 60, hosei = 8;

// 1. setup position of bumbs.(M)
let M = [];


// 2. add function to calc. number of bumbs around point.
function idx(x, y) {
  if (x<0 || x>=nrow) return ncol * nrow;
  if (y<0 || y>=ncol) return ncol * nrow;
  return x + y * nrow;
}
function nbombs(m, x, y) {
  if (m[idx(x, y)] >= 1) {return 9;}
  let _c = 0;
  for (let i=(y-1); i<=(y+1); i++) {
    for (let j=(x-1); j<=(x+1); j++){
      _c += m[idx(j, i)];
    }
  }
  return _c;
}
// 3. add debug function viewer.(V)
function viewer(m) {
  let s = '\n';
  let c = 0;
  for (let _m of m) {
    s += `${_m} `;
    c++
    if ((c % nrow) == 0) s += '\n';
  }
  return s;
}
// 4. shower function for number of sorounded bumbs. (o)
function ommit(m) {
  let _o = [...m];
  for (let i=0; i<=nrow; i++) {
    for (let j=0; j<=ncol; j++){
      _o[idx(j, i)] += nbombs(m, j, i);
    }
  }
  return _o;
}
// 5. add title.(G), and drawer and styling tiles.
let G = [];

// 7. change title initial value to found clicked.
//   --> ??

// 9. add checker of win and lose
function lose(g) {
  for (let _g of g) {
    if (_g >= 9) return true;
  }
  return false;
}
function win(g, m) {
  let _nclose = 0, _nbombs = 0;
  for (let _g of g) {
    if (_g === -1) { _nclose++}
  }
  for (let _m of m) {
    if (_m >= 1) { _nbombs++}
  }
  return (_nclose === _nbombs);
}

// 10. random position of bumbs.
function show_setting () {
  console.log(`nrow : ${nrow} , ncol : ${nrow}, nbomb : ${nbomb}`);
}
function initGame() {
  show_setting();
  tile_w = floor((320 - 20) / nrow);
  tile_h = tile_w;

  // for (let _g of G) { _g = -1; }
  // for (let _m of M) { _m = 0; }
  M = []; G = [];
  for (let i = 0; i <= nrow * ncol; i++){ 
    M.push(0);
    G.push(-1);
   }
  G[nrow * ncol] = 0;
  for(let c=0; c<nbomb; c++) {
    let x = floor(random(0,ncol));
    let y = floor(random(0,nrow));
    if (M[idx(x,y)] === 1) {
      c--;
    } else {
      M[idx(x,y)] = 1;
    }
  }
}

function setup() {
  createCanvas(320, 350);
  initGame();
}
// show short message
let msg_area_h = 30;
function show_message(msg, color) {
  fill(color); // black
  textAlign(LEFT,TOP);
  textSize(18);
  text(msg, 10, 10);
}
// draw Game Title
let startTime, nowTime;
// x, yの位置にテキストを表示
function drawWords(s, x, y){
  fill(255);
  text(s, x, y);
}
function drawMainMessage(s) {
  fill(160);
  rect(10, 110, 300, 140);
  textSize(36);
  strokeWeight(2);
  textAlign(CENTER);
  drawWords(s, 160, 140);
}
function drawSubMessage(s) {
  fill(180);
  textSize(16);
  textAlign(LEFT);
  drawWords(s, 80, 200);
}
function drawGameTitle() {
  // ゲームタイトル
  drawMainMessage('MineSweeper');
  drawSubMessage('-click start, and open tile-');
}

function draw() {
  let _msg = `num. of bomb : ${nbomb} (↑↓)`;
  let _msg_c = 'black';
  // 9. change background at win and lose
  if (lose(G)) {
    isGaming = false;
    background('red');
    _msg = "GAME OVER";
    _msg_c = 'white';
  }
  else if (win(G, M)) {
    let _timer = (nowTime - startTime) / 1000;
    isGaming = false; 
    background('blue'); 
    _msg = `COMPLETE!! (${_timer} sec.)`;
    _msg_c = 'white';
  }
  else {
    background(180);
    if (isGaming == false) {
      startTime = Date.now();
    } else {
      nowTime = Date.now();
      let _timer = (nowTime - startTime) / 1000; // 秒でカウント
      _msg = `time : ${_timer.toFixed(2)}`;
    }
  }
  // show short message
  show_message (_msg, _msg_c);

  // 3. add viewer of tiles and bomb
  textAlign(CENTER,CENTER);
  if (nrow <= 7) { 
    textSize(32);
  } else if (nrow <= 9) {
    textSize(24);
  } else {
    textSize(16);
  }

  for (let y=0; y<nrow; y++) {
    for (let x=0; x<ncol; x++) {
      fill(240);
      rect(x*tile_w + 2 * hosei, y*tile_h + 2 * hosei + msg_area_h, tile_w - hosei, tile_h - hosei);
      // show number of bombs
      let _nbomb = G[idx(x,y)];
      if (_nbomb >= 0) {
        let _tile_s = (_nbomb >= 9) ? '💣' : nbombs(M, x, y);
        fill(255);
        rect(x*tile_w + 2 * hosei, y*tile_h + 2 * hosei + msg_area_h, tile_w - hosei, tile_h - hosei);
        fill(0);
        text(_tile_s, x*tile_w + tile_w/2 + hosei, y*tile_h + tile_h/2 + hosei + msg_area_h);
      }
    }
  }
  if (firstClick == true) {
    drawGameTitle();
    return;
  }
}

// 6. add click action
// this function fires with any click anywhere

function mousePressed() {
  if (firstClick == true) {
    firstClick = false;
    isGaming = true;
    initGame();
    return;
  }
  if (lose(G) || win(G, M)) { return; }
  let _x = mouseX, _y = mouseY - msg_area_h;
  let idx_x, idx_y;
  idx_x = floor((_x - hosei)/tile_w);
  idx_y = floor((_y - hosei)/tile_h);
  // 8. add bumb flag of G by '9' 
  G[idx(idx_x, idx_y)] = nbombs(M, idx_x, idx_y);
}
// (extend) 10. increase tile function
function keyPressed() {
  if (isGaming == true) { return ; }
  let _nrow = nrow;
  if (keyCode === UP_ARROW) {
    _nrow = (_nrow < 10) ? (_nrow + 1) : (_nrow);
  } else if (keyCode === DOWN_ARROW) {
    _nrow = (_nrow > 3) ? (_nrow -1) : (_nrow);
  }
  nrow = _nrow; ncol = _nrow; nbomb = _nrow;　
  show_setting();
  initGame();
}
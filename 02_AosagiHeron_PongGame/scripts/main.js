'use stricts';
// class definition
/** 速度の定義 */
class Vec2 {
  constructor(_x, _y){
    this.x = _x;
    this.y = _y;
  }
  // このベクトルと引数b のベクトルの和を計算する
  add(b) {
    let a = this;
    return new Vec2(a.x + b.x, a.y + b.y);
   }
  // このベクトルを引数s で倍にしたベクトルを計算する
  mul(s) {
    let a = this;
    return new Vec2(s * a.x, s * a.y);
   }
  // このベクトルの大きさを求める
  mag() {
    let a = this;
    return sqrt(a.x ** 2 + a.y ** 2);
  }
  // このベクトルと引数bのベクトルとの差を計算する
  sub(b) {
    let a = this;
    return new Vec2(a.x - b.x, a.y - b.y);
  }
  // このベクトルを式化したベクトルを求める
  norm() {
    let a = this;
    return a.mul(1 / a.mag());
  }
  // このベクトルと引数のベクトルbとのドット績（内積）を求める
  dot(b) {
    let a = this;
    return ((a.x * b.x) + (a.y * b.y));
  }
  // このベクトルの反射ベクトルを求める。
  // w は法線ベクトルを定義（大きさは不問）
  reflect(w) {
      let v = this;
      let cosTheta = v.mul(-1).dot(w) / (v.mul(-1).mag() * w.mag());
      let n = w.norm().mul(v.mag() * cosTheta );
      let r = v.add(n.mul(2));
      return r;
  }
}
/** ボールの定義 */
class Ball {
  constructor(_p, _v, _r) {
    this.p = _p; // 位置
    this.v = _v; // 速度
    this.r = _r; // 半径
  }
  set (_p, _v, _r) {
    this.p = _p; // 位置
    this.v = _v; // 速度
    this.r = _r; // 半径
  }
}
/** ブロックの定義 */
class Block {
  constructor(_p, _r) {
    this.p = _p; // 位置
    this.r = _r; // 半径
  }
}
/** パドル（自機）の定義 */
class Paddle {
  constructor(_p, _l) {
    this.p = _p; // パドルの左上の位置ベクトル
    this.l = _l; // パドルの幅
  }
}
/** Game全体の定義 */
class Game {
  constructor() {
    this.isGaming   = false;
    this.isGameOver = false;
    this.isComplete = false;
    this.score = 0;
    this.level = 1;
  }
  init () {
    this.isGaming   = false;
    this.isGameOver = false;
    this.isComplete = false;
    this.score = 0;
    this.level = 1;
  }
}
// 関数定義
// load font file
let font, fontsize = 16;
function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('assets/SourceSansPro-Regular.ttf');
}
// x, yの位置にテキストを表示
function drawWords(s, x, y){
  fill(255);
  text(s, x, y);
}
// 描画領域の大きさ
let Dcanvas;
let gameState;
// ボールを作る
let ball = new Ball(
  new Vec2(200, 300), // 位置
  new Vec2(200, -200), // 速度
  10, // ボール半径
);
// ブロックを作る
let blocks = [];
function setInitial() {
  // ブロックの初期は位置を決める
  blocks = [];
  let nblk_column = 4;
  let blk_dist = (Dcanvas.x - (40 * 2))/ (nblk_column - 1);
  for (let i=0; i<12; i++) {
    let p = new Vec2(blk_dist*(i%nblk_column)+40, 50*floor(i/nblk_column)+40);
    blocks.push(new Block(p, (20 - 4 * (gameState.level - 1) )));
  }
  // Ballの位置をセット
  ball.set(
    new Vec2(200, 300), // 位置
    new Vec2(random(-100, 100), -200), // 速度
    (10 - 2 * (gameState.level - 1)) // ボール半径
  )
}
function setup() {
  // ゲーム初期化
  gameState = new Game();
  // 描画領域
  Dcanvas = new Vec2(320, 320);
  createCanvas(Dcanvas.x, Dcanvas.y);
  // Set text characteristics
  textFont(font);
  // ブロックを作る。ボールを初期値位置に戻す
  setInitial();
}
// 自機（Paddle）を作る(長方形にする)
let paddle = new Paddle(new Vec2(100, 300), 50);

function drawInGame() {
  ball.p = ball.p.add(ball.v.mul(1/60));
  // ボールと壁の衝突判定
  if ((ball.p.x < ball.r) || (ball.p.x > Dcanvas.x - ball.r)) {
    ball.v.x = -1 * ball.v.x;
    ball.p.x = (ball.p.x < ball.r) ? ball.r : (Dcanvas.x - ball.r);
  }
  if ((ball.p.y < ball.r) || (ball.p.y > Dcanvas.y - ball.r)) {
    ball.v.y = -1 * ball.v.y;
    ball.p.y = (ball.p.y < ball.r) ? ball.r : (Dcanvas.y - ball.r);
  }
  // ボールとブロックの衝突判定
  for (let block of blocks) {
    let d = block.p.sub(ball.p).mag(); // 距離
    if (d < (ball.r + block.r)) {
      // ボールの反射を求める
      let w = ball.p.sub(block.p); // 法線ベクトルを求める
      let r = ball.v.reflect(w); // ボールの速度ベクトルの反射ベクトルを求める
      ball.v = r;
      // ブロックを消す
      gameState.score = gameState.score + 1; // update score 
      blocks.splice(blocks.indexOf(block),1);
    }
  }
  // ブロックを全て消したときの処理
  if (blocks.length <= 0) {
    if (gameState.level >= 5) {
      gameState.isComplete = true;
    } else {
      // レベルを１つあげる
      gameState.level++;
      // ブロックを作る。ボールを初期値位置に戻す
      setInitial();
    }
  }
  // paddle の位置
  let prev_paddle_x = paddle.p.x;
  paddle.p.x = (mouseX < 0)? 0 : 
               (mouseX > (Dcanvas.x - paddle.l))?(Dcanvas.x - paddle.l) : mouseX;
  // paddleの速度を求める
  let paddle_v_x = paddle.p.x - prev_paddle_x;
  // パドルとボールの衝突判定
  let d = paddle.p.sub(ball.p).mag();
  if (ball.p.y + ball.r >= paddle.p.y) {
      if ((ball.p.x >= paddle.p.x)&&(ball.p.x <= (paddle.p.x + paddle.l))){
        // ボールの速度はy方向を反転、ボールの位置をパドルの上端に移動
        ball.v.y = -1 * ball.v.y;
        ball.p.y = paddle.p.y - ball.r;
        // ボールのX方向の速度をパドル速度から変更する
        ball.v.x = ball.v.x + paddle_v_x;
      }
  }
  // ボールと底面の衝突判定
  if (ball.p.y + ball.r >= Dcanvas.y) {
    gameState.isGameOver = true;
  }
  // block を描画
  for (let block of blocks) {
    circle(block.p.x, block.p.y, block.r * 2);
  }
  // ball を描画
  circle(ball.p.x, ball.p.y, ball.r * 2);
  // paddle を描画
  // circle(paddle.p.x, paddle.p.y, paddle.r * 2);
  rect(paddle.p.x, paddle.p.y, paddle.l, 10);
} 
function drawBackGround() {
  // draw canvas
  if (gameState.isGameOver) {
    background(color(255, 0, 0));
  } else if (gameState.isComplete) {
    background(color(0, 0, 255));
  } else {
    background(20);
  }
  // メッセージを表示する
  textSize(fontsize);
  textAlign(LEFT, CENTER);
  drawWords('score : ' + gameState.score, 10, 10);
  textAlign(RIGHT, CENTER);
  drawWords('level : ' + gameState.level, Dcanvas.x - 10, 10);
}
function drawMainMessage(s) {
  textSize(fontsize * 2);
  textAlign(CENTER);
  drawWords(s, Dcanvas.x / 2, Dcanvas.y / 2 - 50);
}
function drawSubMessage(s) {
  textSize(fontsize);
  textAlign(LEFT);
  drawWords(s, Dcanvas.x / 2, (Dcanvas.y / 2) + 50);
}
// draw Game Title
function drawGameTitle() {
  // ゲームタイトル
  drawMainMessage('Pong Game');
  drawSubMessage('--click start--');
}
function drawGameComplete() {
  // メッセージを表示する
  drawMainMessage('Game Complete !!');
  drawSubMessage('--click reset--');
}
function drawGameOver() {
  // メッセージを表示する
  // メッセージを表示する
  drawMainMessage('Game Over');
  drawSubMessage('--click reset--');
}
function draw() {
  drawBackGround();
  if (gameState.isGaming == false) {
    drawGameTitle();
  } else {
    if (gameState.isComplete) {
      drawGameComplete();
    } else if (gameState.isGameOver) {
      drawGameOver();
    } else {
      drawInGame();
    }
  }
}
function mouseClicked() {
  if (gameState.isGaming == false) {
    setInitial();
    gameState.isGaming = true;
  } 
  if (gameState.isGameOver == true || gameState.isComplete == true) {
    gameState.init();
  }
}
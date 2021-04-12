'use strict';
/**
 * 直交座標系における2次元ベクトルのクラス
 */
class Vec2 {
  /**
   * @param {number} x成分
   * @param {number} y成分
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * @param {Vec2} b 足したいベクトル
   */
  add(b) {
    let a = this;
    return new Vec2(a.x + b.x, a.y + b.y);
  }
  /**
   * @param {Vec2} b 引きたいベクトル
   */
  sub(b) {
    let a = this;
    return new Vec2(a.x - b.x, a.y - b.y);
  }
  /**
   * @param {number} s ベクトルにかけたい実数
   */
  mul(s) {
    return new Vec2(s * this.x, s * this.y);
  }
  /**
   * @returns ベクトルの大きさ
   */
  mag() {
    return sqrt(this.x ** 2 + this.y ** 2);
  }
  /**
   * @param {number} s 大きさをsとしたベクトルを返す
   */
  magSet(s) {
    return this.mul(s / this.mag());
  }
  /**
   * @param {number} s 大きさにsを足したベクトルを返す
   */
  magAdded(s) {
    return this.mul(1 + s / this.mag());
  }
  /**
   * @param {number} rad 回転させたい角度。単位はラジアン。
   */
  rotated(rad) {
    return new Vec2(
      this.x * cos(rad) - this.y * sin(rad),
      this.x * sin(rad) + this.y * cos(rad)
    );
  }
  /**
   * @returns 正規化されたベクトル
   */
  normalized() {
    return this.mul(1 / this.mag());
  }
  copy() {
    return new Vec2(this.x, this.y);
  }
  /**
   * @param {Vec2} b このベクトルと成分が等しいか否かを返す
   */
  equals(b) {
    let a = this;
    return a.x === b.x && a.y === b.y;
  }
}

class Util {
  /**
   * 矢印を描画する
   * @param {Vec2} begin 始点の位置ベクトル
   * @param {Vec2} way 矢印の方向ベクトル
   */
  static drawArrow(begin, way) {
    let end = begin.add(way);
    let b1 = way.normalized().mul(-30).rotated(PI / 6);
    let b2 = b1.rotated(-2 * PI / 6);
    [b1, b2].forEach(brim => line(end.x, end.y, end.add(brim).x, end.add(brim).y));
    line(begin.x, begin.y, end.x, end.y);
  }
}

class Bullet {
  /**
   * @param {Vec2} pos 位置ベクトル
   * @param {Vec2} velSec 速度/秒
   */
  constructor(pos, velSec) {
    this.pos = pos;
    this.velSec = velSec;
  }
}

class Game {
  constructor() {
    this.play = false;
    this.win  = false;
    this.lose = false;
    this.lose_rsv = false;
    this.enemyPos = new Vec2(window.innerWidth / 2, 100);
    this.playerPos = new Vec2(window.innerWidth / 2, window.innerHeight - 100);
    this.enemyDeg = 30;
    this.playerDeg = 20;
    this.level = 1;
    this.score = 0;
    /** @type {Array} */
    this.bullets = [];

    this.init();
  }
  // 初期化／リセット処理
  init () {
    console.log('init game.');
    this.play = false;
    this.win = false;
    this.lose = false;
    this.lose_rsv = false;
    this.enemyPos = new Vec2(window.innerWidth / 2, 100);
    this.playerPos = new Vec2(window.innerWidth / 2, window.innerHeight - 100);
    this.level = 1;
    this.score = 0;

    /** @type {Array} */
    this.bullets = [];
  }
  startGame() {
    // console.log(this);
    if (~this.play) {
      console.log('start game...');
      this.play = true;
    }
  }
  inPlay() {
    return (this.play == true);
  }
  // 毎フレームの処理
  update() {
    if (this.lose || this.win || game.play == false) return;
    // if (this.lose) return;

    this.keyDecode();
    // console.log(frameCount);
    if (frameCount % (22 - this.level) == 1) {
      // let bulletVel = this.playerPos.sub(this.enemyPos);
      let bulletVel = this.playerPos.sub(this.enemyPos).normalized().mul(100);
      this.bullets.push(new Bullet(this.enemyPos, bulletVel));
      this.score++;
      // atan2関数で生成するモード
      let rad1 = atan2(bulletVel.y, bulletVel.x) + PI / 12;
      let rad2 = rad1 - 2 * PI / 12;
      let ways = [rad1, rad2].map(rad => new Vec2(cos(rad), sin(rad)).mul(bulletVel.mag()));
      for (let way of ways) {
        game.bullets.push(new Bullet(this.enemyPos, way));
      }
      //弾が増えすぎるのを回避
      if (game.bullets.length > 100) game.bullets.shift();
      // update level 
      if (this.score % 50 === 49) {
        if (this.level >= 20) {
          this.win = true;
        } else {
          this.level++;
        }
      }
    }

    let deltaSec = deltaTime / 1000; //前回のフレームから何秒経過したか
    for (let bullet of game.bullets) {
      bullet.pos = bullet.pos.add(bullet.velSec.mul(deltaSec));
      // 弾と自機の衝突判定
      // console.log(bullet.pos)
      let d = this.playerPos.sub(bullet.pos).mag();
      if (d < this.playerDeg / 2) { 
        // console.log('degree is ', d);
        this.lose_rsv = true;
      }
    }
  }
  drawPlayer() {
    strokeWeight(2);
    stroke('black');
    fill('cyan');
    circle(this.playerPos.x, this.playerPos.y, this.playerDeg);
  }
  drawEnemy() {
    strokeWeight(2);
    stroke('black');
    fill('orange');
    circle(this.enemyPos.x, this.enemyPos.y, this.enemyDeg);
  }
  drawBullet() {
    strokeWeight(4);
    stroke('white');
    for (let bullet of this.bullets) {
      point(bullet.pos.x, bullet.pos.y);
    }
  }
  drawScore() {
    let s = "score: " + ('000' + this.score).slice(-3) + 
            "   Lv."  + ('00'  + this.level).slice(-2);
    drawTopMessage(s);
  }
  drawWin() {
    push();
    background(color(0, 0, 255));
    drawMainMessage('You Win!!');
    drawSubMessage('double click or press SPACE, restart.')
    pop();
  }
  drawLose() {
    push();
    background(color(255, 0, 0));
    drawMainMessage('You Lose...');
    drawSubMessage('double click or press SPACE, restart.')
    pop();
  }
  keyDecode() {
    if (keyIsPressed) {
      // console.log('key is pressed')
      // xy軸の移動
// keycode reference : https://keycode.info/
      let ix = 0, iy = 0;
      if (keyIsDown(RIGHT_ARROW))ix = 1; 
      if (keyIsDown(LEFT_ARROW)) ix = -1; 
      if (keyIsDown(UP_ARROW))   iy = -1; 
      if (keyIsDown(DOWN_ARROW)) iy = 1; 
      // 移動量の計算
      let dist = new Vec2(ix, iy);
      this.playerPos = this.playerPos.add(dist.mul(2));
      // console.log("player Position:");
      // console.log(this.playerPos);
      let x_lmt_lo = this.playerDeg;
      let x_lmt_hi = window.innerWidth - this.playerDeg;
      let y_lmt_lo = this.enemyPos.y + this.enemyDeg + this.playerDeg;
      let y_lmt_hi = window.innerHeight - this.playerDeg;
      if (this.playerPos.x < x_lmt_lo) { this.playerPos.x = x_lmt_lo; }
      if (this.playerPos.x > x_lmt_hi) { this.playerPos.x = x_lmt_hi; }
      if (this.playerPos.y < y_lmt_lo) { this.playerPos.y = y_lmt_lo; }
      if (this.playerPos.y > y_lmt_hi) { this.playerPos.x = y_lmt_hi; }
    }
  }
}
let game = new Game;

let fontsize = 20;
function drawMainMessage(s) {
  // console.log(s);
  fill(255);
  textSize(fontsize * 2);
  textAlign(LEFT, CENTER);
  text(s, 50, 200);
}
function drawSubMessage(s) {
  // console.log(s);
  fill(240);
  textSize(fontsize);
  textAlign(LEFT, CENTER);
  text(s, 50, 250);
}
function drawTopMessage(s) {
  fill(255);
  textSize(fontsize);
  textAlign(LEFT, TOP);
  text(s, width / 2, 20);
}
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // createCanvas(400, 400);
  // background(80);
}
function draw() {
  //----- 毎フレーム行う処理
  game.update();
  
  //----- 描画
  // 背景色で塗りつぶす
  if (game.lose) {
    game.drawLose();
  } else if (game.win) {
    game.drawWin();
  } else {
    background(80);
    if (!game.inPlay()) {  // drawTitle
      drawMainMessage('Touch or Press ARROW.');
      drawSubMessage('leave bullets from sniper(orange).')
    } else {
      drawMainMessage('');
      drawSubMessage('');
    }
  }

  // 敵とプレイヤーの描画
  push();
  game.drawPlayer();
  game.drawEnemy();
  pop();

  // 弾の描画
  push();
  game.drawBullet();
  pop();
  // 点数の描画
  push();
  game.drawScore();
  pop();

  if (game.lose_rsv) game.lose = true;
}
function touchMoved(event) {
  if (game.lose || game.win) return;
  if (!game.inPlay()) { game.startGame(); }
  // console.log(event);
  // console.log(touches[0]);
  // 画面をタッチしたら、プレイヤーをその場所へ動かす
  game.playerPos = new Vec2(mouseX, mouseY - 50);
  let x_lmt_lo = game.playerDeg;
  let x_lmt_hi = window.innerWidth - game.playerDeg;
  let y_lmt_lo = game.enemyPos.y + game.enemyDeg + game.playerDeg;
  let y_lmt_hi = window.innerHeight - game.playerDeg;
  if (game.playerPos.x < x_lmt_lo) { game.playerPos.x = x_lmt_lo; }
  if (game.playerPos.x > x_lmt_hi) { game.playerPos.x = x_lmt_hi; }
  if (game.playerPos.y < y_lmt_lo) { game.playerPos.y = y_lmt_lo; }
  if (game.playerPos.y > y_lmt_hi) { game.playerPos.x = y_lmt_hi; }
  return;
}
function doubleClicked() {
  if (game.lose || game.win) { game.init(); }
}
function touchStarted() {
  if (game.lose || game.win) { game.init(); }
}
function mouseClicked() {
  if (!game.inPlay()) { game.startGame(); }
}
// keycode reference : https://keycode.info/
function keyPressed() {
  if (keyCode === 32) { // SPACE
    if (game.lose || game.win) { game.init(); return; }
    if (!game.inPlay()){ game.startGame(); }
  }
}

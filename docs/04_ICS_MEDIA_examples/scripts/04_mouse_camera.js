import * as THREE from './vendors/three.module.js';

// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // console.log('initializing...');
  let container = document.querySelector('#container');
  let _canvas = document.createElement('canvas');
  container.appendChild(_canvas);

  // サイズを指定
  const width = window.innerWidth;
  const height = window.innerHeight;
  // カメラ位置の調整用
  let rotX = 0; // 角度
  let mouseX = 0; // マウス座標
  let rotY = 0; // 角度
  let mouseY = 0; // マウス座標

  // レンダラーを作成
  // 画面のサイズの設定
  const renderer = new THREE.WebGLRenderer({ canvas: _canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(0, 0, +1000);

  // 球体を作成
  const geometry = new THREE.SphereGeometry(300, 30, 30);
  // 画像を読み込む
  const loader = new THREE.TextureLoader();
  const texture = loader.load('images/earthmap1k.jpg');
  // マテリアルにテクスチャーを設定
  const material = new THREE.MeshStandardMaterial({
    map: texture
  });
  // メッシュを作成
  const mesh = new THREE.Mesh(geometry, material);
  // 3D空間にメッシュを追加
  scene.add(mesh);

  // 星屑を作成します (カメラの動きをわかりやすくするため)
  createStarField();

  function createStarField() {
    // 形状データを作成
    const geometry = new THREE.Geometry();
    for (let i = 0; i < 1000; i++) {
      geometry.vertices.push(
        new THREE.Vector3(
          3000 * (Math.random() - 0.5),
          3000 * (Math.random() - 0.5),
          3000 * (Math.random() - 0.5)
        )
      );
    }
    // マテリアルを作成
    const material = new THREE.PointsMaterial({
      size: 10,
      color: 0xffffff
    });

    // 物体を作成
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
  }

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight.position.set(1, 1, 1);
  // シーンに追加
  scene.add(directionalLight);

  // マウス座標はマウスが動いた時のみ取得できる
  document.addEventListener('mousemove', event => {
    mouseX = event.pageX;
    mouseY = event.pageY;
  });

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    // メッシュを回転させる
    mesh.rotation.y += 0.01;

    // マウスの位置に応じて角度を設定
    // マウスのX座標がステージの幅の何%の位置にあるか調べてそれを360度で乗算する
    const targetRotX = (mouseX / window.innerWidth) * 360;
    const targetRotY = (mouseY / window.innerHeight) * 360;
    // イージングの公式を用いて滑らかにする
    // 値 += (目標値 - 現在の値) * 減速値
    rotX += (targetRotX - rotX) * 0.02;
    rotY += (targetRotY - rotY) * 0.02;

    // ラジアンに変換する
    const radianX = (rotX * Math.PI) / 180;
    const radianY = (rotY * Math.PI) / 180;
    // 角度に応じてカメラの位置を設定
    camera.position.x = 1000 * Math.sin(radianX);
    camera.position.z = 1000 * Math.cos(radianX);
    camera.position.y = 1000 * Math.sin(radianY);
    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }
}

import * as THREE from './vendors/three.module.js';

// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // console.log('initializing...');
  let container = document.querySelector('#container');
  let _canvas   = document.createElement('canvas');
  container.appendChild(_canvas);

  // サイズを指定
  const width = window.innerWidth ;
  const height = window.innerHeight ;

  // レンダラーを作成
  // 画面のサイズの設定
  const renderer = new THREE.WebGLRenderer({ canvas: _canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, +50, +1000);

  // 箱を作成
  const geometry = new THREE.BoxGeometry(400, 400, 400);
  const material = new THREE.MeshNormalMaterial();
  const box = new THREE.Mesh(geometry, material);
  scene.add(box);

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    box.rotation.y += 0.01;
    // box.rotation.x += 0.01;
    // camera.rotation.x += 0.01;
    renderer.render(scene, camera); // レンダリング
    requestAnimationFrame(tick);
  }
}


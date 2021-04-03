// 05_use_OrbitControls.js
import * as THREE from './vendors/three.module.js';
import { OrbitControls } from './vendors/OrbitControls.module.js';

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

  // レンダラーを作成
  // 画面のサイズの設定
  const renderer = new THREE.WebGLRenderer({ canvas: _canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  // カメラコントローラーを作成
  // const controls = new THREE.OrbitControls(camera);
  const controls = new OrbitControls(camera, renderer.domElement );
  camera.position.set(0, 0, +1000);

  // 形状とマテリアルからメッシュを作成します
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(300, 300, 300),
    new THREE.MeshNormalMaterial());
  scene.add(mesh);

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight.position.set(1, 1, 1);
  // シーンに追加
  scene.add(directionalLight);

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }
}

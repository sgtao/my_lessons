// 21_fog_effect.js
import * as THREE from './vendors/three.module.js';
import { OrbitControls } from './vendors/OrbitControls.module.js';
import Stats from './vendors/stats.module.js';

let controls, stats, gui;

// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // console.log('initializing...');
  const container = document.querySelector('#container');
  let _canvas = document.createElement('canvas');
  _canvas.style.position = "absolute";
  _canvas.style.top = "0";
  _canvas.style.left = "0";
  container.appendChild(_canvas);

  // サイズを指定
  const width = window.innerWidth;
  const height = window.innerHeight;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({ canvas: _canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // フォグを設定
  scene.fog = new THREE.Fog(0x000000, 50, 2000);

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +1000);
  // カメラコントローラーを作成
  controls = new OrbitControls(camera, renderer.domElement);

  // グループを作成
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.BoxBufferGeometry(50, 50, 50);
  const material = new THREE.MeshStandardMaterial();

  for (let i = 0; i < 1000; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 2000;
    mesh.position.y = (Math.random() - 0.5) * 2000;
    mesh.position.z = (Math.random() - 0.5) * 2000;
    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random() * 2 * Math.PI;
    // グループに格納する
    group.add(mesh);
  }

  // 光源
  scene.add(new THREE.DirectionalLight(0xff0000, 2)); // 平行光源
  scene.add(new THREE.AmbientLight(0x00ffff)); // 環境光源

  // stats view
  addStateView();

  // 毎フレーム時に実行されるループイベントです
  tick();

  function tick() {
    // グループを回す
    group.rotateY(0.01);
    stats.update();
    renderer.render(scene, camera); // レンダリング
    requestAnimationFrame(tick);
  }

  // at window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 再描画
    tick();
  });

  // fps/memory view
  function addStateView() {
    stats = new Stats();
    stats.dom.style.position = "absolute";
    stats.dom.style.margin = "0";
    container.appendChild(stats.dom);
  }
}

// 13_light_shadowmove.js
import * as THREE from './vendors/three.module.js';
import { OrbitControls } from './vendors/OrbitControls.module.js';
import { GUI } from './vendors/dat.gui.module.js';

let camera, scene, renderer;
let controls, gui;
let ambientLight, spotLight;
let ambientlightStrong = 1.0;
let spotlightStrong = 1.0;

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
  renderer = new THREE.WebGLRenderer({ canvas: _canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // レンダラー：シャドウを有効にする
  renderer.shadowMap.enabled = true;

  // シーンを作成
  scene = new THREE.Scene();

  // カメラを作成
  camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(80, 80, 80);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  // カメラコントローラーを作成
  controls = new OrbitControls(camera, renderer.domElement);

  // 床を作成
  const meshFloor = new THREE.Mesh(
    new THREE.BoxGeometry(2000, 0.1, 2000),
    new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.0 })
  );
  // 影を受け付ける
  meshFloor.receiveShadow = true;
  // meshFloor.receiveShadow = false;
  scene.add(meshFloor);

  // オブジェクトを作成
  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const meshKnot = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: 0xaa0000, roughness: 0.0 })
  );
  meshKnot.position.set(0, 20, 0);
  // 影を落とす
  meshKnot.castShadow = true;
  // meshKnot.castShadow = false;
  scene.add(meshKnot);

  // 環境光源を作成
  // new THREE.AmbientLight(色, 光の強さ)
  ambientLight = new THREE.AmbientLight(0x303030, ambientlightStrong);
  scene.add(ambientLight);

  // 照明を作成
  // new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
  spotLight = new THREE.SpotLight(0xffffff, spotlightStrong, 100, Math.PI / 4, 1);
  spotLight.position.set(40, 80, 0);
  // ライトに影を有効にする
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  scene.add(spotLight);

  buildGui(); // GUI controller
  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    // レンダリング
    renderer.render(scene, camera);

    // 照明の位置を更新
    const t = Date.now() / 500;
    const r = 40.0;
    const lx = r * Math.cos(t);
    const lz = r * Math.sin(t);
    const ly = 80.0 + 5.0 * Math.sin(t / 3.0);
    spotLight.position.set(lx, ly, lz);

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

  // GUI controller
  function buildGui() {
    gui = new GUI();
    const params = {
      AmbientLight: 1,
      SpotLight: 1,
    };
    gui.add(params, 'AmbientLight', 0, 5).step(0.1).name('AmbientLight').onChange(function (value) {
      ambientLight.intensity = value;
      tick();
    });
    gui.add(params, 'SpotLight', 0, 5).step(0.1).name('SpotLight').onChange(function (value) {
      spotLight.intensity = value;
      tick();
    });
    gui.open();
  }
}

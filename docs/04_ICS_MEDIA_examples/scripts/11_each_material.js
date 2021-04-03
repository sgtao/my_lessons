// 11_each_material.js
import * as THREE from './vendors/three.module.js';
import { OrbitControls } from './vendors/OrbitControls.module.js';

// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // console.log('initializing...');
  const container = document.querySelector('#container');
  container.style.position = "relative";
  let _canvas = document.createElement('canvas');
  _canvas.style.position = "absolute";
  container.appendChild(_canvas);
  let _nav = document.createElement('div');
  _nav.innerHTML = "<div>For change material, press 1 - 5</div>";
  _nav.style.position = "absolute";
  _nav.style.color = "white";
  container.appendChild(_nav);

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
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 0, +1000);

  // ドーナツを作成
  const geometry = new THREE.TorusGeometry(300, 100, 64, 100);

  // マテリアルを作成
  const material1 = new THREE.MeshStandardMaterial({ color: 0x6699FF, roughness: 0.5 });
  const material2 = new THREE.MeshBasicMaterial({ color: 0x6699FF });
  const material3 = new THREE.MeshLambertMaterial({ color: 0x6699FF });
  const material4 = new THREE.MeshPhongMaterial({ color: 0x6699FF });
  const material5 = new THREE.MeshToonMaterial({ color: 0x6699FF });
  setMaterial('2');

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

  // マテリアルの指定
  function setMaterial(number) {
    let mesh;
    switch (number) {
      case '1' : 
        mesh = new THREE.Mesh(geometry, material1);
        break;
      case '2' : 
        mesh = new THREE.Mesh(geometry, material2);
        break;
      case '3' : 
        mesh = new THREE.Mesh(geometry, material3);
        break;
      case '4' : 
        mesh = new THREE.Mesh(geometry, material4);
        break;
      case '5' : 
        mesh = new THREE.Mesh(geometry, material5);
        break;
      default  : 
        return;
    }
    // メッシュを作成
    // 3D空間にメッシュを追加
    scene.add(mesh);
  }

  document.addEventListener('keydown', event => {
    if ((event.key >= 1) && (event.key <= 5)) {
      setMaterial(event.key);
    } else {
      console.log(`${event.key} is out of range for set material`);
    }
  });

}


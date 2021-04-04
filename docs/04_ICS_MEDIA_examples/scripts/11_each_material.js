// 11_each_material.js
import * as THREE from './vendors/three.module.js';
import { OrbitControls } from './vendors/OrbitControls.module.js';

let camera, scene, renderer, directionalLight;
let controls;

// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // console.log('initializing...');
  const container = document.querySelector('#container');
  let _canvas = document.createElement('canvas');
  _canvas.style.position = "absolute";
  container.appendChild(_canvas);


  // サイズを指定
  const width = window.innerWidth;
  const height = window.innerHeight;

  // レンダラーを作成
  // 画面のサイズの設定
  renderer = new THREE.WebGLRenderer({ canvas: _canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  scene = new THREE.Scene();

  // カメラを作成
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  // カメラコントローラーを作成
  // const controls = new THREE.OrbitControls(camera);
  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 500, +1000);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // コンテナーを作成
  const containerGeomeotry = new THREE.Object3D();
  scene.add(containerGeomeotry);

  // 物体を作成
  // ジオメトリを作成
  const geometryList = [
    new THREE.SphereGeometry(50), // 球体
    new THREE.TetrahedronGeometry(100, 0), // カプセル形状
    new THREE.ConeGeometry(100, 100, 32), // 三角錐
    new THREE.CylinderGeometry(50, 50, 100, 32), // 円柱
    new THREE.TorusGeometry(50, 30, 16, 100) // ドーナツ形状
  ];

  // マテリアルを作成
  const material1 = new THREE.MeshStandardMaterial({ color: 0x6699FF, roughness: 0.5 });
  const material2 = new THREE.MeshBasicMaterial({ color: 0x6699FF });
  const material3 = new THREE.MeshLambertMaterial({ color: 0x6699FF });
  const material4 = new THREE.MeshPhongMaterial({ color: 0x6699FF });
  const material5 = new THREE.MeshToonMaterial({ color: 0x6699FF });

  for (let i=0; i < 5; i++) {
    setMaterial(geometryList[i], i);

  }

  // 平行光源
  directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight.position.set(1, 1, 1);
  // シーンに追加
  scene.add(directionalLight);

  // at window resize
  window.addEventListener('resize', onWindowResize);

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    // コンテナ―を回転させる
    containerGeomeotry.rotation.y += 0.01;
    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }

  // マテリアルの指定
  function setMaterial(geometry, number) {
    let mesh;
    switch (number) {
      case 0 : 
        mesh = new THREE.Mesh(geometry, material1);
        break;
      case 1 : 
        mesh = new THREE.Mesh(geometry, material2);
        break;
      case 2 : 
        mesh = new THREE.Mesh(geometry, material3);
        break;
      case 3 : 
        mesh = new THREE.Mesh(geometry, material4);
        break;
      case 4 : 
        mesh = new THREE.Mesh(geometry, material5);
        break;
      default  : 
        return;
    }
    // メッシュを作成
    // 3D空間にメッシュを追加
    containerGeomeotry.add(mesh);

    // 円周上に配置
    mesh.position.x = 400 * Math.sin((number / 6) * Math.PI * 2);
    mesh.position.z = 400 * Math.cos((number / 6) * Math.PI * 2);
  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    tick();

  }
}


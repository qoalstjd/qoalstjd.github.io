import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* 렌더러 */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("webgl-wrap").appendChild(renderer.domElement);

/* 배경색 */
renderer.setClearColor(0xa3a3a3);

/* 장면 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

/* OrbitControl 추가 */
const orbit = new OrbitControls(camera, renderer.domElement);

/* 카메라 위치 */
camera.position.set(6, 8, 20);
orbit.update();

/* 그리드Helper */
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

/* 빛 */
const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 7);

/* GUI옵션 */
const gui = new dat.GUI();
const options = {
  Main: 0x2f3130,
  Main_light: 0x7c7c7c,
  Main_dark: 0x0a0a0a,
  Hooves: 0x0f0b0d,
  Hair: 0x0a0a0a,
  Muzzle: 0x0b0804,
  Eye_dark: 0x020202,
  Eye_white: 0xbebebe,
};

/* 오브젝트 */
const assetLoader = new GLTFLoader();
const model = "img/gltf/Alpaca.gltf";
assetLoader.load(model, function (gltf) {
  const model = gltf.scene;
  scene.add(model);
  gui.addColor(options, "Main").onChange(function (e) {
    model.getObjectByName("Cube").material.color.setHex(e);
  });
  gui.addColor(options, "Main_light").onChange(function (e) {
    model.getObjectByName("Cube_1").material.color.setHex(e);
  });
  gui.addColor(options, "Main_dark").onChange(function (e) {
    model.getObjectByName("Cube_2").material.color.setHex(e);
  });
  gui.addColor(options, "Hooves").onChange(function (e) {
    model.getObjectByName("Cube_3").material.color.setHex(e);
  });
  gui.addColor(options, "Hair").onChange(function (e) {
    model.getObjectByName("Cube_4").material.color.setHex(e);
  });
  gui.addColor(options, "Muzzle").onChange(function (e) {
    model.getObjectByName("Cube_5").material.color.setHex(e);
  });
  gui.addColor(options, "Eye_dark").onChange(function (e) {
    model.getObjectByName("Cube_6").material.color.setHex(e);
  });
});

/* 렌더링 */
function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

/* 반응형 */
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

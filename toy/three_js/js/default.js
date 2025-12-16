import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* 렌더러 */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("webgl-wrap").appendChild(renderer.domElement);

/* 배경색 */
renderer.setClearColor(0xfefefe);

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
camera.position.set(6, 8, 14);
orbit.update();

/* 그리드Helper */
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

/* 각Helper */
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

/* 빛 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0);

/* 오브젝트 */

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

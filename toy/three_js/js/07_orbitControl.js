import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 장면
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xcccccc);

// 카메라
const fov = 100;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 1, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// 렌더러
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("webgl-wrap").appendChild(renderer.domElement);

// OrbitControls 추가
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 6;
controls.maxPolarAngle = Math.PI / 2;
controls.update();

// 빛
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionLight = new THREE.DirectionalLight(0xffffff, 1);
directionLight.position.set(-1.5, 2, 1);
directionLight.castShadow = true;
directionLight.shadow.mapSize.width = 2048;
directionLight.shadow.mapSize.height = 2048;
directionLight.shadow.radius = 8;
const dlHelper = new THREE.DirectionalLightHelper(
  directionLight,
  0.2,
  0x0000ff
);
scene.add(directionLight);
scene.add(dlHelper);

// 도형 추가
const geometry01 = new THREE.IcosahedronGeometry(0.5, 0);
const geometry02 = new THREE.IcosahedronGeometry(0.4, 0);
const geometry03 = new THREE.IcosahedronGeometry(0.3, 0);
const material01 = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.7,
});
const material02 = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 1,
  roughness: 0.7,
});
const material03 = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  metalness: 1,
  roughness: 0.7,
});

const obj01 = new THREE.Mesh(geometry01, material01);
obj01.castShadow = true;
obj01.position.x = -1;
obj01.position.y = 1;
scene.add(obj01);
const obj02 = new THREE.Mesh(geometry02, material02);
obj02.castShadow = true;
obj02.receiveShadow = true;
obj02.position.y = 0.5;
scene.add(obj02);
const obj03 = new THREE.Mesh(geometry03, material03);
obj03.castShadow = true;
obj03.position.x = 1;
obj03.receiveShadow = true;
scene.add(obj03);

// 바닥 추가
const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xeeeeee,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.y = -0.5;
plane.receiveShadow = true;
scene.add(plane);

// 애니메이트
function animate() {
  requestAnimationFrame(animate);

  obj01.rotation.y += 0.01;
  obj02.rotation.y += 0.01;
  obj03.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}
animate();

// 반응형
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", () => {
  onWindowResize();
});

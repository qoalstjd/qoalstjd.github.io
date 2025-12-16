import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const FogColor = 0x00aaff;
const objColor = 0xffffff;
const FloorColor = 0x555555;

// 장면
const scene = new THREE.Scene();
scene.background = new THREE.Color(FogColor);
scene.fog = new THREE.Fog(FogColor, 1, 12);
// scene.fog = new THREE.FogExp2(FogColor, 0.07);

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
const geometry = new THREE.TorusGeometry(0.7, 0.3, 12, 80);
const material = new THREE.MeshStandardMaterial({
  color: objColor,
  metalness: 1,
  roughness: 0.7,
});

const obj = new THREE.Mesh(geometry, material);
obj.castShadow = true;
obj.position.y = 0.5;
scene.add(obj);

// 바닥 추가
const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: FloorColor,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.y = -0.5;
plane.receiveShadow = true;
scene.add(plane);

// 애니메이트
function animate() {
  requestAnimationFrame(animate);

  obj.rotation.y += 0.1;

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

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm";

/* 렌더러 */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("webgl-wrap").appendChild(renderer.domElement);

/* 배경색 */
// renderer.setClearColor(0xfefefe);

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
camera.position.set(0, 20, -50);
orbit.update();

/* 오브젝트 */
// 땅
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  wireframe: true,
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);
// 상자
const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
  color: 0xff9900,
  wireframe: true,
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);
// 구
const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0x00ff99,
  wireframe: true,
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphereMesh);

/* Cannon */
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});
const timeStep = 1 / 60;
// 땅
const groundPhysMat = new CANNON.Material();
const groundBody = new CANNON.Body({
  // shape: new CANNON.Plane(),
  shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)), // geo의 반
  // mass: 0, // default
  type: CANNON.Body.STATIC, // 정적
  material: groundPhysMat,
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
// 상자
const boxPhysMat = new CANNON.Material();
const boxBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), // geo의 반
  position: new CANNON.Vec3(1, 20, 0),
  material: boxPhysMat,
});
world.addBody(boxBody);
boxBody.angularVelocity.set(0, 10, 0);
boxBody.angularDamping = 0.5;
// 구
const spherePhysMat = new CANNON.Material();
const sphereBody = new CANNON.Body({
  mass: 4,
  shape: new CANNON.Sphere(2), // geo와 동일
  position: new CANNON.Vec3(0, 15, 0),
  material: spherePhysMat,
});
world.addBody(sphereBody);
sphereBody.linearDamping = 0.31;
// 땅 + 박스 접촉
const groundBoxContactMat = new CANNON.ContactMaterial(
  groundPhysMat,
  boxPhysMat,
  { friction: 0.4 }
);
world.addContactMaterial(groundBoxContactMat);
// 땅 + 구 접촉
const groundSphereContactMat = new CANNON.ContactMaterial(
  groundPhysMat,
  spherePhysMat,
  { restitution: 0.9 }
);
world.addContactMaterial(groundSphereContactMat);

/* 렌더링 */
function animate() {
  world.step(timeStep);

  groundMesh.position.copy(groundBody.position);
  groundMesh.quaternion.copy(groundBody.quaternion);
  boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);
  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

/* 반응형 */
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

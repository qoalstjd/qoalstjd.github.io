import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const starsTexture = "img/solar_system/stars.jpg";
const sunTexture = "img/solar_system/sun.jpg";
const mercuryTexture = "img/solar_system/mercury.jpg";
const venusTexture = "img/solar_system/venus.jpg";
const earthTexture = "img/solar_system/earth.jpg";
const marsTexture = "img/solar_system/mars.jpg";
const jupiterTexture = "img/solar_system/jupiter.jpg";
const saturnTexture = "img/solar_system/saturn.jpg";
const saturnRingTexture = "img/solar_system/saturn ring.png";
const uranusTexture = "img/solar_system/uranus.jpg";
const uranusRingTexture = "img/solar_system/uranus ring.png";
const neptuneTexture = "img/solar_system/neptune.jpg";
const plutoTexture = "img/solar_system/pluto.jpg";

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
camera.position.set(-200, 140, 140);
orbit.update();

/* 오브젝트 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// 빛
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 15000);
scene.add(pointLight);

// 별
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

// 해
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanete(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);
  scene.add(obj);
  mesh.position.x = position;
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  return { mesh: mesh, obj };
}

const mercury = createPlanete(3.2, mercuryTexture, 28); // 수성
const venus = createPlanete(5.8, venusTexture, 44); // 금성
const earth = createPlanete(6, earthTexture, 62); // 지구
const mars = createPlanete(4, marsTexture, 78); // 화성
const jupiter = createPlanete(12, jupiterTexture, 100); // 목성
const saturn = createPlanete(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
}); // 토성
const uranus = createPlanete(7, uranusTexture, 176, {
  // 천왕성
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});
const neptune = createPlanete(7, neptuneTexture, 200); // 해왕성
const pluto = createPlanete(2.8, plutoTexture, 216); // 명왕성

/* 렌더링 */
function animate() {
  // 자전
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  // 공전
  mercury.obj.rotateY(0.04);
  venus.obj.rotateY(0.015);
  earth.obj.rotateY(0.01);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.002);
  saturn.obj.rotateY(0.0009);
  uranus.obj.rotateY(0.0004);
  neptune.obj.rotateY(0.0001);
  pluto.obj.rotateY(0.00007);

  renderer.render(scene, camera);
  orbit.update();
}
renderer.setAnimationLoop(animate);

/* 반응형 */
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

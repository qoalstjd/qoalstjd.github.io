import * as THREE from "three";

// 장면
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xcccccc);

// 카메라
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 3;

// 렌더러
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("webgl-wrap").appendChild(renderer.domElement);

// 빛
const pointLight = new THREE.PointLight(0xffffff, 500);
pointLight.position.set(1, 0, 12);
scene.add(pointLight);

// 도형 추가
const geometry = new THREE.TorusGeometry(0.3, 0.15, 16, 40);
const material01 = new THREE.MeshBasicMaterial({
  color: 0xff7f00,
});
const material02 = new THREE.MeshStandardMaterial({
  color: 0xff7f00,
  metalness: 1,
  roughness: 0.5,
  // wireframe: true,
  // transparent: true,
  // opacity: 0.5,
});
const material03 = new THREE.MeshPhysicalMaterial({
  color: 0xff7f00,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
});
const material04 = new THREE.MeshLambertMaterial({
  color: 0xff7f00,
});
const material05 = new THREE.MeshPhongMaterial({
  color: 0xff7f00,
  shininess: 120,
  // specular: 0x004ff,
});

const obj01 = new THREE.Mesh(geometry, material01);
obj01.position.x = -2;
scene.add(obj01);
const obj02 = new THREE.Mesh(geometry, material02);
obj02.position.x = -1;
scene.add(obj02);
const obj03 = new THREE.Mesh(geometry, material03);
obj03.position.x = 0;
scene.add(obj03);
const obj04 = new THREE.Mesh(geometry, material04);
obj04.position.x = 1;
scene.add(obj04);
const obj05 = new THREE.Mesh(geometry, material05);
obj05.position.x = 2;
scene.add(obj05);

function render(time) {
  time *= 0.0005;

  obj01.rotation.y = time;
  obj02.rotation.y = time;
  obj03.rotation.y = time;
  obj04.rotation.y = time;
  obj05.rotation.y = time;

  renderer.render(scene, camera);

  requestAnimationFrame(render);

  // 반응형
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", () => {
    onWindowResize();
  });
}
requestAnimationFrame(render);

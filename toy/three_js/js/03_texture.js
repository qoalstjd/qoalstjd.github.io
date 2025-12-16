import * as THREE from "three";

// 장면
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xcccccc);

// 카메라
const camera = new THREE.PerspectiveCamera(
  75,
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
const pointLight = new THREE.PointLight(0xffffff, 200);
pointLight.position.set(1, 0, 12);
scene.add(pointLight);

// 텍스처 추가
const textureLoader = new THREE.TextureLoader();
const textureBaseColor = textureLoader.load(
  "img/basic/Stone_Path_008_basecolor.jpg"
);
const textureNormalMap = textureLoader.load(
  "img/basic/Stone_Path_008_normal.jpg"
);
const textureHeightMap = textureLoader.load(
  "img/basic/Stone_Path_008_height.png"
);
const textureRoughness = textureLoader.load(
  "img/basic/Stone_Path_008_roughness.jpg"
);

// 도형 추가
const geometry = new THREE.SphereGeometry(0.3, 32, 16);
const material01 = new THREE.MeshStandardMaterial({
  map: textureBaseColor,
});
const material02 = new THREE.MeshStandardMaterial({
  map: textureBaseColor,
  normalMap: textureNormalMap,
});
const material03 = new THREE.MeshStandardMaterial({
  map: textureBaseColor,
  normalMap: textureNormalMap,
  displacementMap: textureHeightMap,
  displacementScale: 0.02,
});
const material04 = new THREE.MeshStandardMaterial({
  map: textureBaseColor,
  normalMap: textureNormalMap,
  displacementMap: textureHeightMap,
  displacementScale: 0.02,
  roughnessMap: textureRoughness,
  roughness: 0.8,
});

const obj01 = new THREE.Mesh(geometry, material01);
obj01.position.x = -1.5;
scene.add(obj01);
const obj02 = new THREE.Mesh(geometry, material02);
obj02.position.x = -0.5;
scene.add(obj02);
const obj03 = new THREE.Mesh(geometry, material03);
obj03.position.x = 0.5;
scene.add(obj03);
const obj04 = new THREE.Mesh(geometry, material04);
obj04.position.x = 1.5;
scene.add(obj04);

function render(time) {
  time *= 0.0005;

  obj01.rotation.y = time;
  obj02.rotation.y = time;
  obj03.rotation.y = time;
  obj04.rotation.y = time;

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

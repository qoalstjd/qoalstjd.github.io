import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 장면
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const axesHlper = new THREE.AxesHelper(5);
scene.add(axesHlper);

// 카메라
const fov = 100;
const aspect = window.innerWidth / window.innerHeight;
const near = 1;
const far = 2400;
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
controls.minDistance = 20;
controls.maxDistance = 600;
controls.update();

// 빛
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);

// 배경
const skyMaterialArray = [];
const texture_ft = new THREE.TextureLoader().load("img/basic/dusk_ft.jpg");
const texture_bk = new THREE.TextureLoader().load("img/basic/dusk_bk.jpg");
const texture_up = new THREE.TextureLoader().load("img/basic/dusk_up.jpg");
const texture_dn = new THREE.TextureLoader().load("img/basic/dusk_dn.jpg");
const texture_rt = new THREE.TextureLoader().load("img/basic/dusk_rt.jpg");
const texture_lf = new THREE.TextureLoader().load("img/basic/dusk_lf.jpg");
skyMaterialArray.push(
  new THREE.MeshStandardMaterial({
    map: texture_ft,
  })
);
skyMaterialArray.push(
  new THREE.MeshStandardMaterial({
    map: texture_bk,
  })
);
skyMaterialArray.push(
  new THREE.MeshStandardMaterial({
    map: texture_up,
  })
);
skyMaterialArray.push(
  new THREE.MeshStandardMaterial({
    map: texture_dn,
  })
);
skyMaterialArray.push(
  new THREE.MeshStandardMaterial({
    map: texture_rt,
  })
);
skyMaterialArray.push(
  new THREE.MeshStandardMaterial({
    map: texture_lf,
  })
);

for (let i = 0; i < 6; i++) {
  skyMaterialArray[i].side = THREE.BackSide;
}

// 도형 추가
const skyGeometry = new THREE.BoxGeometry(2000, 2000, 2000);
const sky = new THREE.Mesh(skyGeometry, skyMaterialArray);
scene.add(sky);

// 애니메이트
function animate() {
  requestAnimationFrame(animate);

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

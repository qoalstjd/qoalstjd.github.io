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
camera.position.set(10, 10, 10);
orbit.update();

/* 그리드Helper */
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

/* 오브젝트 */
const monkeyUrl = new URL("../img/doggo2.glb", import.meta.url);
const assetLoader = new GLTFLoader();
let mixer;
assetLoader.load(
  monkeyUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    clips.forEach(function (clip) {
      const action = mixer.clipAction(clip);
      action.play();
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const clock = new THREE.Clock();

/* 렌더링 */
function animate() {
  if (mixer) mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

/* 반응형 */
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

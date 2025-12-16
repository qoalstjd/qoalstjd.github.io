import * as THREE from "three";

// 장면
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xcccccc);

// 카메라
const fov = 80;
// 표준 화각은 47도
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 2, 1);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// 렌더러
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("webgl-wrap").appendChild(renderer.domElement);

// 빛
const pointLight = new THREE.PointLight(0xffffff, 500);
pointLight.position.set(0, 2, 12);
scene.add(pointLight);

// 도형 추가
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshStandardMaterial({ color: 0xff7f00 });

const cube = new THREE.Mesh(geometry, material);
cube.rotation.y = 0.5;
scene.add(cube);

// 바닥 추가
const planeGeometry = new THREE.PlaneGeometry(5, 5, 1, 1);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.y = -0.5;
scene.add(plane);
function render(time) {
  time *= 0.0005;

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

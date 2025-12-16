import * as THREE from "three";

// 장면
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xcccccc);

// 카메라
const fov = 80;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 1, 3);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// 렌더러
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("webgl-wrap").appendChild(renderer.domElement);

// 빛
/* 주변광 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

/* 직사광 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
const dlHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.5,
  0x0000ff
);
// scene.add(directionalLight);
// scene.add(dlHelper);

/* 반구광 */
const hemisphereLight = new THREE.HemisphereLight(0x0000fff, 0xff0000, 50);
// scene.add(hemisphereLight);

/* 점광원 */
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(-2, 0.5, 0.5);
const plHelper = new THREE.PointLightHelper(pointLight, 0.5, 0xff0000);
// scene.add(pointLight);
// scene.add(plHelper);

const pointLight2 = new THREE.PointLight(0xffffff, 1);
pointLight2.position.set(2, 0.5, 0.5);
const plHelper2 = new THREE.PointLightHelper(pointLight2, 0.5, 0xff0000);
// scene.add(pointLight2);
// scene.add(plHelper2);

/* 직사각형 영역 광원 */
const rectAreaLight = new THREE.RectAreaLight(0xffffff, 2, 1, 1);
rectAreaLight.position.set(0.5, 0.5, 1);
rectAreaLight.lookAt(0, 0, 0);
// scene.add(rectAreaLight);

/* 집중광 */
const spotLight = new THREE.SpotLight(0xffffff, 0.5);
spotLight.position.set(0.5, 0.5, 1);
spotLight.lookAt(0, 0, 0);
scene.add(spotLight);

// 도형 추가
const geometry = new THREE.SphereGeometry(0.5, 32, 16);
const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });

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

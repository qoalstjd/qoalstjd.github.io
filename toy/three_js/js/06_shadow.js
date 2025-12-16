import * as THREE from "three";

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

// 빛
/* 주변광 (그림자 X) */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// ambientLight.castShadow = true; // 그림자 불가
// scene.add(ambientLight);

/* 직사광 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(-0.5, 1.5, 0.5);
const dlHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.5,
  0x0000ff
);
directionalLight.castShadow = true; // 그림자 가능
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
// scene.add(directionalLight);
// scene.add(dlHelper);

/* 반구광 */
const hemisphereLight = new THREE.HemisphereLight(0x0000fff, 0xff0000, 50);
// scene.add(hemisphereLight);

/* 점광원 */
const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.set(-3, 3, 1);
const plHelper = new THREE.PointLightHelper(pointLight, 0.5, 0xff0000);
pointLight.castShadow = true; // 그림자 가능
pointLight.shadow.radius = 6;
scene.add(pointLight);
scene.add(plHelper);

/* 직사각형 영역 광원 */
const rectAreaLight = new THREE.RectAreaLight(0xffffff, 2, 1, 1);
rectAreaLight.position.set(0.5, 0.5, 1);
rectAreaLight.lookAt(0, 0, 0);
rectAreaLight.castShadow = true; // 그림자 불가
// scene.add(rectAreaLight);

/* 집중광 */
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(1, 1, 1);
spotLight.lookAt(0, 0, 0);
spotLight.castShadow = true; // 그림자 가능
// scene.add(spotLight);

// 도형 추가
const geometry01 = new THREE.SphereGeometry(0.5, 32, 16);
const geometry02 = new THREE.IcosahedronGeometry(0.5, 0);
const geometry03 = new THREE.ConeGeometry(0.4, 0.7, 6);
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});

const obj01 = new THREE.Mesh(geometry01, material);
obj01.castShadow = true;
obj01.position.x = -1;
obj01.position.y = 1;
scene.add(obj01);
const obj02 = new THREE.Mesh(geometry02, material);
obj02.castShadow = true;
obj02.receiveShadow = true;
obj02.position.y = 0.5;
scene.add(obj02);
const obj03 = new THREE.Mesh(geometry03, material);
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

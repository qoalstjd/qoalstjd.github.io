import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* 렌더러 */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("webgl-wrap").appendChild(renderer.domElement);

/* 배경색 */

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
camera.position.set(10, 15, -22);
orbit.update();

/* 빛 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0);

/* 오브젝트 */
const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    visible: false,
  })
);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.name = "ground";
scene.add(planeMesh);

const highlightMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
  })
);
highlightMesh.position.set(0.5, 0, 0.5);
highlightMesh.rotateX(-Math.PI / 2);
scene.add(highlightMesh);

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 4, 2),
  new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xff9900,
  })
);

/* RayCast */
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mousePosition, camera);
  intersects = raycaster.intersectObject(planeMesh);
  intersects.forEach(function (intersect) {
    if (intersect.object.name === "ground") {
      const highlightPos = new THREE.Vector3()
        .copy(intersect.point)
        .floor()
        .addScalar(0.5);
      highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);

      const objectExist = objects.find(function (object) {
        return (
          object.position.x === highlightMesh.position.x &&
          object.position.z === highlightMesh.position.z
        );
      });

      if (!objectExist) highlightMesh.material.color.setHex(0xffffff);
      else highlightMesh.material.color.setHex(0xff0000);
    }
  });
});

const objects = [];

window.addEventListener("mousedown", function () {
  const objectExist = objects.find(function (object) {
    return (
      object.position.x === highlightMesh.position.x &&
      object.position.z === highlightMesh.position.z
    );
  });

  if (!objectExist) {
    if (intersects.length > 0) {
      const sphereClone = sphereMesh.clone();
      sphereClone.position.copy(highlightMesh.position);
      scene.add(sphereClone);
      objects.push(sphereClone);
      highlightMesh.material.color.setHex(0xff0000);
    }
  }
});

/* 렌더링 */
function animate(time) {
  highlightMesh.material.opacity = 1 + Math.sin(time / 120);
  objects.forEach(function (object) {
    object.rotation.x = time / 1000;
    object.rotation.z = time / 1000;
    object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
  });

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

/* 반응형 */
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

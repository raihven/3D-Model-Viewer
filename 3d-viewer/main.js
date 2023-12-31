import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { configureScene } from "./sceneConfig.js";

const webglCanvas = document.querySelector("#webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: webglCanvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.LinearEncoding = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
configureScene(scene);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight
);
camera.position.set(1, 1, 1);

// Stores the initial position
const initialPosition = new THREE.Vector3(1, 1, 1);

// Add event listener for middle mouse button
webglCanvas.addEventListener("mousedown", function (event) {
  // Middle mouse button was clicked
  if (event.button === 1) {
    camera.position.copy(initialPosition);
  }
});

const loader = new GLTFLoader();

const loadModel = () => {
  const selectedModelPath = document.getElementById("modelSelector").value;
  loader.load(selectedModelPath, function (gltf) {
    // Remove the previous model from the scene if there is one
    scene.children.forEach((child) => {
      if (child.isMesh || child.isGroup) {
        scene.remove(child);
      }
    });
    scene.add(gltf.scene); // Add the new model to the scene
  });
};

// Initial load of model
loadModel();

// Add an event listener to the dropdown
document.getElementById("modelSelector").addEventListener("change", loadModel);

const hemiLight1 = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
scene.add(hemiLight1);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const controls = new OrbitControls(camera, webglCanvas);
controls.autoRotate = false;
controls.autoRotateSpeed = 0.15;
controls.enableDamping = true;
controls.rotationSpeed = 0.5;
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  // MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN,
};
const toggleAutoRotate = () => {
  controls.autoRotate = !controls.autoRotate;
};

// Add an event listener to the button
document
  .getElementById("toggleRotation")
  .addEventListener("click", toggleAutoRotate);

// Function to update and render the scene
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();

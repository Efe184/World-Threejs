import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getFresnelMat } from "./getFresnelMat.js";
import { getStarfield } from "./getStarfield.js";

// ==========================================
// SCENE SETUP
// ==========================================

const w = window.innerWidth;
const h = window.innerHeight;

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

// Create renderer
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true 
});
renderer.setSize(w, h);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// Append renderer to DOM
const container = document.getElementById('canvas-container');
container.appendChild(renderer.domElement);

// ==========================================
// ORBIT CONTROLS
// ==========================================

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 15;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.5;

// ==========================================
// EARTH GROUP
// ==========================================

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180; // Earth's axial tilt
scene.add(earthGroup);

// ==========================================
// GEOMETRY & LOADER
// ==========================================

const detail = 12; // Higher = smoother sphere
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);

// ==========================================
// LAYER 1: EARTH SURFACE
// ==========================================

const earthMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("/textures/00_earthmap1k.jpg"),
  specularMap: loader.load("/textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("/textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});

const earthMesh = new THREE.Mesh(geometry, earthMaterial);
earthGroup.add(earthMesh);

// ==========================================
// LAYER 2: NIGHT LIGHTS
// ==========================================

const lightsMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("/textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});

const lightsMesh = new THREE.Mesh(geometry, lightsMaterial);
earthGroup.add(lightsMesh);

// ==========================================
// LAYER 3: CLOUDS
// ==========================================

const cloudsMaterial = new THREE.MeshStandardMaterial({
  map: loader.load("/textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("/textures/05_earthcloudmaptrans.jpg"),
});

const cloudsMesh = new THREE.Mesh(geometry, cloudsMaterial);
cloudsMesh.scale.setScalar(1.003); // Slightly larger than Earth
earthGroup.add(cloudsMesh);

// ==========================================
// LAYER 4: ATMOSPHERIC GLOW
// ==========================================

const fresnelMat = getFresnelMat({
  rimHex: 0x0088ff,
  facingHex: 0x000000,
});

const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

// ==========================================
// STARFIELD BACKGROUND
// ==========================================

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

// ==========================================
// LIGHTING
// ==========================================

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// Ambient light for general illumination
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// ==========================================
// LOADING SCREEN
// ==========================================

// Hide loading screen after textures load
let loadedTextures = 0;
const totalTextures = 5;

loader.load("/textures/00_earthmap1k.jpg", () => checkAllLoaded());
loader.load("/textures/01_earthbump1k.jpg", () => checkAllLoaded());
loader.load("/textures/02_earthspec1k.jpg", () => checkAllLoaded());
loader.load("/textures/03_earthlights1k.jpg", () => checkAllLoaded());
loader.load("/textures/04_earthcloudmap.jpg", () => checkAllLoaded());

function checkAllLoaded() {
  loadedTextures++;
  if (loadedTextures >= totalTextures) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.opacity = '0';
      setTimeout(() => {
        loadingElement.style.display = 'none';
      }, 500);
    }
  }
}

// ==========================================
// ANIMATION LOOP
// ==========================================

function animate() {
  requestAnimationFrame(animate);

  // Rotate Earth layers at different speeds
  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023; // Clouds move slightly faster
  glowMesh.rotation.y += 0.002;
  
  // Slowly rotate stars in opposite direction
  stars.rotation.y -= 0.0002;

  // Update controls
  controls.update();

  // Render scene
  renderer.render(scene, camera);
}

animate();

// ==========================================
// WINDOW RESIZE HANDLER
// ==========================================

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize, false);

// ==========================================
// KEYBOARD CONTROLS (OPTIONAL)
// ==========================================

window.addEventListener('keydown', (event) => {
  switch(event.key) {
    case 'a':
      controls.autoRotate = !controls.autoRotate;
      console.log('Auto-rotate:', controls.autoRotate);
      break;
    case 'r':
      // Reset camera position
      camera.position.set(0, 0, 5);
      controls.reset();
      break;
  }
});

console.log('🌍 Planet Viewer loaded!');
console.log('Press "a" to toggle auto-rotate');
console.log('Press "r" to reset camera');


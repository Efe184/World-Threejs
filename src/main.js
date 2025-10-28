import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getFresnelMat } from "./getFresnelMat.js";
import { getStarfield } from "./getStarfield.js";

// ==========================================
// SCENE SETUP
// ==========================================

const w = window.innerWidth;
const h = window.innerHeight;

// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = isMobile ? 6 : 5; // Slightly further back on mobile

// Create renderer with mobile optimizations
const renderer = new THREE.WebGLRenderer({ 
  antialias: !isMobile, // Disable antialiasing on mobile for better performance
  alpha: true,
  powerPreference: isMobile ? 'low-power' : 'high-performance'
});
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 2 : 3)); // Limit pixel ratio on mobile
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

// Mobile-specific control adjustments
if (isMobile) {
  controls.rotateSpeed = 0.7; // Slower rotation on mobile
  controls.zoomSpeed = 0.8;
  controls.enablePan = false; // Disable panning on mobile (can be confusing)
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };
}

// ==========================================
// EARTH GROUP
// ==========================================

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180; // Earth's axial tilt
scene.add(earthGroup);

// ==========================================
// GEOMETRY & LOADER
// ==========================================

// Adjust detail level based on device capability
const detail = isMobile ? 10 : 12; // Lower detail on mobile for better performance
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);

// ==========================================
// LAYER 1: EARTH SURFACE
// ==========================================

const earthMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});

const earthMesh = new THREE.Mesh(geometry, earthMaterial);
earthGroup.add(earthMesh);

// ==========================================
// LAYER 2: NIGHT LIGHTS
// ==========================================

const lightsMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});

const lightsMesh = new THREE.Mesh(geometry, lightsMaterial);
earthGroup.add(lightsMesh);

// ==========================================
// LAYER 3: CLOUDS
// ==========================================

const cloudsMaterial = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
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

// Reduce star count on mobile for better performance
const stars = getStarfield({ numStars: isMobile ? 1000 : 2000 });
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

loader.load("./textures/00_earthmap1k.jpg", () => checkAllLoaded());
loader.load("./textures/01_earthbump1k.jpg", () => checkAllLoaded());
loader.load("./textures/02_earthspec1k.jpg", () => checkAllLoaded());
loader.load("./textures/03_earthlights1k.jpg", () => checkAllLoaded());
loader.load("./textures/04_earthcloudmap.jpg", () => checkAllLoaded());

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
// UI CONTROLS & UTILITIES
// ==========================================

// Toast notification system
function showToast(message, duration = 2000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Info panel toggle
let infoVisible = true;
const infoPanel = document.getElementById('info');
const toggleButton = document.getElementById('toggle-info');
const toggleIcon = document.getElementById('toggle-icon');

function toggleInfo() {
  infoVisible = !infoVisible;
  if (infoPanel) {
    infoPanel.classList.toggle('hidden', !infoVisible);
  }
  if (toggleIcon) {
    toggleIcon.textContent = infoVisible ? '👁️' : '👁️‍🗨️';
  }
  showToast(infoVisible ? 'Controls shown' : 'Controls hidden', 1500);
}

// Toggle button click handler
if (toggleButton) {
  toggleButton.addEventListener('click', toggleInfo);
}

// Control panel click handlers for mobile
document.querySelectorAll('.control-item.clickable').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    const action = item.getAttribute('data-action');
    
    switch(action) {
      case 'auto-rotate':
        controls.autoRotate = !controls.autoRotate;
        showToast(controls.autoRotate ? 'Auto-rotate: ON' : 'Auto-rotate: OFF', 1500);
        break;
      case 'reset-camera':
        camera.position.set(0, 0, isMobile ? 6 : 5);
        controls.reset();
        showToast('Camera reset', 1500);
        break;
      case 'toggle-info':
        toggleInfo();
        break;
      case 'fullscreen':
        toggleFullscreen();
        break;
    }
  });
  
  // Add touch feedback for mobile
  item.addEventListener('touchstart', () => {
    item.style.opacity = '0.7';
  });
  
  item.addEventListener('touchend', () => {
    item.style.opacity = '1';
  });
});

// Fullscreen toggle
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      showToast('Fullscreen mode', 1500);
    }).catch(err => {
      showToast('Fullscreen not available', 2000);
    });
  } else {
    document.exitFullscreen();
    showToast('Exited fullscreen', 1500);
  }
}

// Screenshot function
function takeScreenshot() {
  try {
    renderer.domElement.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `planet-viewer-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Screenshot saved!', 2000);
    });
  } catch (err) {
    showToast('Screenshot failed', 2000);
  }
}

// ==========================================
// KEYBOARD CONTROLS
// ==========================================

window.addEventListener('keydown', (event) => {
  // Prevent default for our custom keys
  const customKeys = ['a', 'r', 'h', 'f', 's'];
  if (customKeys.includes(event.key.toLowerCase())) {
    event.preventDefault();
  }

  switch(event.key.toLowerCase()) {
    case 'a':
      controls.autoRotate = !controls.autoRotate;
      showToast(controls.autoRotate ? 'Auto-rotate: ON' : 'Auto-rotate: OFF', 1500);
      break;
    case 'r':
      // Reset camera position
      camera.position.set(0, 0, isMobile ? 6 : 5);
      controls.reset();
      showToast('Camera reset', 1500);
      break;
    case 'h':
      toggleInfo();
      break;
    case 'f':
      toggleFullscreen();
      break;
    case 's':
      takeScreenshot();
      break;
  }
});

// Fullscreen change event
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    // Exited fullscreen, resize renderer
    handleWindowResize();
  }
});

console.log('🌍 Planet Viewer loaded!');
console.log('Keyboard shortcuts:');
console.log('  A - Toggle auto-rotate');
console.log('  R - Reset camera');
console.log('  H - Toggle controls');
console.log('  F - Fullscreen mode');
console.log('  S - Take screenshot');


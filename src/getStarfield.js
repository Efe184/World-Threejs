import * as THREE from "three";

/**
 * Creates a starfield with randomly distributed points in a sphere
 * @param {Object} options - Configuration options
 * @param {number} options.numStars - Number of stars to generate (default: 500)
 * @returns {THREE.Points} Points object representing the starfield
 */
export function getStarfield({ numStars = 500 } = {}) {
  /**
   * Generates a random point on a sphere surface
   * Uses spherical coordinates for uniform distribution
   */
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25; // Random radius between 25-50
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u; // Azimuthal angle
    const phi = Math.acos(2 * v - 1); // Polar angle
    
    // Convert spherical to Cartesian coordinates
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6, // Blueish tint
      minDist: radius,
    };
  }

  const verts = [];
  const colors = [];
  const positions = [];

  // Generate star positions and colors
  for (let i = 0; i < numStars; i += 1) {
    const p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);
    
    // Create color with random brightness
    const col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }

  // Create geometry and set attributes
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  // Create material with texture
  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load("/textures/stars/circle.png"),
    transparent: true,
    opacity: 0.8,
  });

  const points = new THREE.Points(geo, mat);
  return points;
}


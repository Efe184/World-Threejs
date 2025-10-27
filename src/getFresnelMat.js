import * as THREE from "three";

/**
 * Creates a Fresnel shader material for atmospheric glow effect
 * @param {Object} options - Configuration options
 * @param {number} options.rimHex - Color of the glow rim (default: 0x0088ff - blue)
 * @param {number} options.facingHex - Color of the facing surface (default: 0x000000 - black)
 * @returns {THREE.ShaderMaterial} Fresnel shader material
 */
export function getFresnelMat({ rimHex = 0x0088ff, facingHex = 0x000000 } = {}) {
  const uniforms = {
    color1: { value: new THREE.Color(rimHex) },
    color2: { value: new THREE.Color(facingHex) },
    fresnelBias: { value: 0.1 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 4.0 },
  };

  // Vertex Shader - calculates the Fresnel factor based on view angle
  const vertexShader = `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    
    varying float vReflectionFactor;
    
    void main() {
      // Transform vertex to view space
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    
      // Calculate world space normal
      vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
    
      // Calculate view direction
      vec3 I = worldPosition.xyz - cameraPosition;
    
      // Calculate Fresnel reflection factor
      vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(I), worldNormal), fresnelPower);
    
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Fragment Shader - mixes colors based on Fresnel factor
  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    
    varying float vReflectionFactor;
    
    void main() {
      float f = clamp(vReflectionFactor, 0.0, 1.0);
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
    }
  `;

  const fresnelMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  return fresnelMat;
}


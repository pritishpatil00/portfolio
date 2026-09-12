'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Image from 'next/image';

const ShaderImage = ({ src, alt, width, height, className }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const planeMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  
  const currentStateRef = useRef({ mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 });
  const targetStateRef = useRef({ mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 });
  
  const ANIMATION_CONFIG = {
    transitionSpeed: 0.03,
    baseIntensity: 0.005,
    hoverIntensity: 0.009
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_intensity;
    uniform sampler2D u_texture;
    varying vec2 vUv;

    void main() {
        vec2 uv = vUv;
        float wave1 = sin(uv.x * 10.0 + u_time * 0.5 + u_mouse.x * 5.0) * u_intensity;
        float wave2 = sin(uv.y * 12.0 + u_time * 0.8 + u_mouse.y * 4.0) * u_intensity;
        float wave3 = cos(uv.x * 8.0 + u_time * 0.5 + u_mouse.x * 3.0) * u_intensity;
        float wave4 = cos(uv.y * 9.0 + u_time * 0.7 + u_mouse.y * 3.5) * u_intensity;

        uv.y += wave1 + wave2;
        uv.x += wave3 + wave4;
        
        gl_FragColor = texture2D(u_texture, uv);
    }
  `;

  const initializeScene = (texture) => {
    if (!containerRef.current || !imageRef.current) return;
    
    const container = containerRef.current;
    const imageElement = imageRef.current;
    
    // Camera setup
    cameraRef.current = new THREE.PerspectiveCamera(
      80,
      imageElement.offsetWidth / imageElement.offsetHeight,
      0.01,
      10
    );
    cameraRef.current.position.z = 1;

    // Scene creation
    sceneRef.current = new THREE.Scene();

    // Uniforms
    const shaderUniforms = {
      u_time: { type: "f", value: 1.0 },
      u_mouse: { type: "v2", value: new THREE.Vector2() },
      u_intensity: { type: "f", value: currentStateRef.current.waveIntensity },
      u_texture: { type: "t", value: texture }
    };

    // Create a plane mesh with materials
    planeMeshRef.current = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader,
        fragmentShader
      })
    );

    // Add mesh to the scene
    sceneRef.current.add(planeMeshRef.current);

    // Render
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current.setSize(container.offsetWidth, container.offsetHeight);

    // Clear any existing canvas and add new one
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas?.parentNode === container) {
      container.removeChild(existingCanvas);
    }
    
    // Style the canvas to match the container
    rendererRef.current.domElement.style.position = 'absolute';
    rendererRef.current.domElement.style.top = '0';
    rendererRef.current.domElement.style.left = '0';
    rendererRef.current.domElement.style.width = '100%';
    rendererRef.current.domElement.style.height = '100%';
    rendererRef.current.domElement.style.objectFit = 'cover';
    
    container.appendChild(rendererRef.current.domElement);
    
    // Hide original image once shader is ready
    imageElement.style.opacity = '0';
    
    // Add event listeners
    container.addEventListener("mousemove", handleMouseMove, false);
    container.addEventListener("mouseover", handleMouseOver, false);
    container.addEventListener("mouseout", handleMouseOut, false);
    
    animateScene();
  };

  const animateScene = () => {
    if (!planeMeshRef.current || !rendererRef.current || !sceneRef.current) return;
    
    animationRef.current = requestAnimationFrame(animateScene);

    currentStateRef.current.mousePosition.x = updateValue(
      targetStateRef.current.mousePosition.x,
      currentStateRef.current.mousePosition.x,
      ANIMATION_CONFIG.transitionSpeed
    );

    currentStateRef.current.mousePosition.y = updateValue(
      targetStateRef.current.mousePosition.y,
      currentStateRef.current.mousePosition.y,
      ANIMATION_CONFIG.transitionSpeed
    );

    currentStateRef.current.waveIntensity = updateValue(
      targetStateRef.current.waveIntensity,
      currentStateRef.current.waveIntensity,
      ANIMATION_CONFIG.transitionSpeed
    );

    const uniforms = planeMeshRef.current.material.uniforms;

    uniforms.u_intensity.value = currentStateRef.current.waveIntensity;
    uniforms.u_time.value += 0.005;
    uniforms.u_mouse.value.set(currentStateRef.current.mousePosition.x, currentStateRef.current.mousePosition.y);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const updateValue = (targetState, current, transitionSpeed) => {
    return current + (targetState - current) * transitionSpeed;
  };

  const handleMouseMove = (event) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetStateRef.current.mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    targetStateRef.current.mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const handleMouseOver = () => {
    targetStateRef.current.waveIntensity = ANIMATION_CONFIG.hoverIntensity;
  };

  const handleMouseOut = () => {
    targetStateRef.current.waveIntensity = ANIMATION_CONFIG.baseIntensity;
    targetStateRef.current.mousePosition = { x: 0, y: 0 };
  };

  useEffect(() => {
    let cancelled = false
    if (isLoaded && imageRef.current) {
      const texture = new THREE.TextureLoader().load(src, () => {
        if (!cancelled) initializeScene(texture);
      });
    }

    return () => {
      cancelled = true
      // Cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (planeMeshRef.current) {
        planeMeshRef.current.geometry.dispose();
        planeMeshRef.current.material.dispose();
      }
      if (containerRef.current) {
        const container = containerRef.current;
        container.removeEventListener("mousemove", handleMouseMove, false);
        container.removeEventListener("mouseover", handleMouseOver, false);
        container.removeEventListener("mouseout", handleMouseOut, false);
      }
    };
  }, [isLoaded, src]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ 
        position: 'relative',
        width: '100%',
        height: 'auto',
        display: 'block',
        overflow: 'hidden',
        borderRadius: '10px',
        filter: 'saturate(70%)',
        transition: 'filter 0.5s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = 'saturate(100%)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = 'saturate(70%)';
      }}
    >
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          transition: 'opacity 0.3s ease'
        }}
        priority
      />
    </div>
  );
};

export default ShaderImage;
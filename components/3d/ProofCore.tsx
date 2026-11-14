'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ProofCore() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    // 2. Renderer setup with adaptive DPR (capped at 2 for 4K performance)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // 3. Central Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 3a. Metallic Inner Core (Icosahedron)
    const innerGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x050a14,
      metalness: 0.95,
      roughness: 0.18,
      flatShading: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 3b. Glowing Wireframe Shell
    const wireGeo = new THREE.IcosahedronGeometry(0.88, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5a8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // 3c. Outer Glass Sphere Shell
    const glassGeo = new THREE.SphereGeometry(1.25, 48, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x101b2d,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.5,
      reflectivity: 0.9,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    coreGroup.add(glassMesh);

    // 4. Luminous Orbital Rings (Emerald & Cyan)
    const ringsGroup = new THREE.Group();
    coreGroup.add(ringsGroup);

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00e5a8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const ringGeo1 = new THREE.TorusGeometry(1.65, 0.015, 16, 120);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ringsGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x36cfff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const ringGeo2 = new THREE.TorusGeometry(1.95, 0.012, 16, 120);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 4;
    ringsGroup.add(ring2);

    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x8667ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const ringGeo3 = new THREE.TorusGeometry(2.25, 0.01, 16, 120);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.z = Math.PI / 5;
    ringsGroup.add(ring3);

    // 5. Orbiting Verification Nodes
    const nodesGroup = new THREE.Group();
    coreGroup.add(nodesGroup);

    const nodeCount = 8;
    const nodeGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00e5a8 });
    const nodeMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 1.65;
      node.position.set(Math.cos(angle) * radius, (Math.sin(angle) * radius) * 0.4, Math.sin(angle) * radius);
      nodesGroup.add(node);
      nodeMeshes.push(node);
    }

    // 6. Particle Cloud (Proof Particles)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorEmerald = new THREE.Color(0x00e5a8);
    const colorCyan = new THREE.Color(0x36cfff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.4 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = Math.random() > 0.5 ? colorEmerald : colorCyan;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x00e5a8, 2.5, 8);
    emeraldLight.position.set(2, 3, 2);
    scene.add(emeraldLight);

    const cyanLight = new THREE.PointLight(0x36cfff, 2.0, 8);
    cyanLight.position.set(-2, -2, 2);
    scene.add(cyanLight);

    // 8. Pointer Interaction & Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // 9. Scroll Interaction
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 10. Resize handler
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth pointer interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Idle Rotation + Pointer response
      coreGroup.rotation.y = elapsedTime * 0.25 + mouseX;
      coreGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1 + mouseY;

      // Individual ring counter-rotations
      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.z = -elapsedTime * 0.4;
      ring3.rotation.y = elapsedTime * 0.2;

      // Pulse inner core slightly
      const pulse = 1 + Math.sin(elapsedTime * 2) * 0.03;
      innerMesh.scale.set(pulse, pulse, pulse);
      wireMesh.scale.set(pulse, pulse, pulse);

      // Rotate particle cloud
      particles.rotation.y = -elapsedTime * 0.15;

      // Subtle scroll response
      const scrollFactor = Math.min(scrollY / 1000, 1.5);
      coreGroup.position.y = -scrollFactor * 0.3;
      coreGroup.rotation.z = scrollFactor * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringGeo3.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  if (!webGlSupported) {
    // Elegant SVG / CSS Fallback
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="relative w-72 h-72 rounded-full border border-emerald-500/30 flex items-center justify-center animate-pulse">
          <div className="absolute inset-4 rounded-full border border-cyan-500/20 animate-spin" />
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500/30 to-cyan-500/30 blur-xl" />
          <div className="w-20 h-20 rounded-full bg-slate-900 border border-emerald-400 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs shadow-lg shadow-emerald-500/40">
            PROOF CORE
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[460px] lg:min-h-[580px] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
      title="THE PROOF CORE — Interactive Verification Engine (Drag mouse to inspect)"
    />
  );
}


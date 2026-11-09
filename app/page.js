"use client";

import * as THREE from "three";

import { useEffect, useRef } from "react";

const photos = {
  portrait: "https://raw.githubusercontent.com/VoidKii/Somewhere/main/Contemplative%20Low-Angle%20Indoor%20Portrait.png",
  first: "https://raw.githubusercontent.com/VoidKii/Somewhere/main/20261027_183525.jpg",
  second: "https://raw.githubusercontent.com/VoidKii/Somewhere/main/IMG_3733.JPG"
};


function BrainArtwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer;
    let frame = 0;
    let observer;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.04, 5.25);

    const brain = new THREE.Group();
    scene.add(brain);

    const foldAt = (theta, phi, seed = 0) => {
      const broad = Math.sin(phi * 10.5 + Math.sin(theta * 6.2 + seed) * 1.35 + seed);
      const cross = Math.sin(theta * 12.5 + Math.sin(phi * 5.4 - seed) * 0.8);
      const fine = Math.sin(phi * 21 + theta * 8.5 + seed * 2);
      const ridges = Math.pow(Math.abs(broad), 2.2) * 0.022
        + Math.pow(Math.abs(cross), 2.5) * 0.012
        + Math.sin(fine) * 0.004;
      const envelope = Math.sin(theta) * (0.72 + 0.28 * Math.sin(theta * 2));
      return (ridges - 0.018) * envelope;
    };

    const surfacePoint = (theta, phi, side, seed = 0) => {
      const fold = foldAt(theta, phi, seed);
      const radius = 1 + fold;
      return new THREE.Vector3(
        side * 0.405 + side * 0.765 * Math.sin(theta) * Math.cos(phi) * radius,
        1.015 * Math.cos(theta) * (1 + fold * 0.8),
        0.65 * Math.sin(theta) * Math.sin(phi) * radius
      );
    };

    const grooveMaterial = new THREE.MeshStandardMaterial({
      color: 0x503129,
      roughness: 0.92,
      transparent: true,
      opacity: 0.56
    });

    const makeHemisphere = (side) => {
      const seed = side * 1.7;
      const geometry = new THREE.SphereGeometry(1, 144, 112);
      const position = geometry.attributes.position;

      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);
        const theta = Math.acos(Math.max(-1, Math.min(1, y)));
        const phi = Math.atan2(z, x);
        const fold = foldAt(theta, phi, seed);
        const radius = 1 + fold;
        position.setXYZ(
          i,
          x * radius,
          y * (1 + fold * 0.8),
          z * radius
        );
      }

      geometry.computeVertexNormals();

      const material = new THREE.MeshPhysicalMaterial({
        color: 0xb97853,
        roughness: 0.68,
        metalness: 0.015,
        clearcoat: 0.28,
        clearcoatRoughness: 0.62
      });

      const hemisphere = new THREE.Mesh(geometry, material);
      hemisphere.scale.set(0.765, 1.015, 0.65);
      hemisphere.position.x = side * 0.405;
      brain.add(hemisphere);

      // Long, branching sulci follow the curved surface rather than sitting as flat stripes.
      for (let line = 0; line < 17; line++) {
        const points = [];
        const basePhi = -1.42 + line * 0.177;
        const steps = 54;

        for (let step = 0; step <= steps; step++) {
          const theta = 0.24 + (step / steps) * 2.62;
          const phi = basePhi
            + Math.sin(theta * 4.4 + line * 1.31) * 0.12
            + Math.sin(theta * 10.2 - line * 0.72) * 0.035;
          points.push(surfacePoint(theta, phi, side, seed).multiplyScalar(1.006));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const groove = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 72, line % 3 === 0 ? 0.008 : 0.0055, 5, false),
          grooveMaterial
        );
        brain.add(groove);
      }

      // Short secondary folds break up the larger cortical ridges.
      for (let branch = 0; branch < 13; branch++) {
        const thetaStart = 0.48 + (branch % 5) * 0.43;
        const phiStart = -1.22 + branch * 0.19;
        const points = [];

        for (let step = 0; step <= 15; step++) {
          const t = step / 15;
          const theta = thetaStart + t * (0.28 + (branch % 3) * 0.08);
          const phi = phiStart + Math.sin(t * Math.PI) * (branch % 2 ? 0.13 : -0.13);
          points.push(surfacePoint(theta, phi, side, seed).multiplyScalar(1.007));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        brain.add(new THREE.Mesh(
          new THREE.TubeGeometry(curve, 24, 0.0042, 4, false),
          grooveMaterial
        ));
      }
    };

    makeHemisphere(-1);
    makeHemisphere(1);

    // Cerebellum: smaller, densely folded structure tucked behind the lower cortex.
    const cerebellumGeometry = new THREE.SphereGeometry(1, 112, 80);
    const cerebellumPosition = cerebellumGeometry.attributes.position;
    for (let i = 0; i < cerebellumPosition.count; i++) {
      const x = cerebellumPosition.getX(i);
      const y = cerebellumPosition.getY(i);
      const z = cerebellumPosition.getZ(i);
      const theta = Math.acos(Math.max(-1, Math.min(1, y)));
      const phi = Math.atan2(z, x);
      const folia = Math.sin(theta * 31 + Math.sin(phi * 7) * 1.7) * 0.018
        + Math.sin(theta * 18 - phi * 9) * 0.009;
      const radius = 1 + folia;
      cerebellumPosition.setXYZ(x * radius, y * radius, z * radius);
    }
    cerebellumGeometry.computeVertexNormals();

    const cerebellum = new THREE.Mesh(
      cerebellumGeometry,
      new THREE.MeshPhysicalMaterial({
        color: 0x986047,
        roughness: 0.76,
        metalness: 0.01,
        clearcoat: 0.18
      })
    );
    cerebellum.scale.set(0.43, 0.285, 0.29);
    cerebellum.position.set(0, -0.72, -0.39);
    brain.add(cerebellum);

    // Fine folia on the visible rear-lower surface of the cerebellum.
    const foliaMaterial = new THREE.MeshStandardMaterial({
      color: 0x57382f,
      roughness: 0.9,
      transparent: true,
      opacity: 0.58
    });
    for (let line = 0; line < 17; line++) {
      const points = [];
      const y = -0.91 + line * 0.023;
      for (let step = 0; step <= 30; step++) {
        const t = -1 + (step / 30) * 2;
        const x = t * 0.405;
        const z = -0.39 + Math.sqrt(Math.max(0.04, 1 - (x / 0.43) ** 2 - ((y + 0.72) / 0.285) ** 2)) * 0.292;
        points.push(new THREE.Vector3(x, y + Math.sin(t * 5 + line) * 0.009, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      brain.add(new THREE.Mesh(
        new THREE.TubeGeometry(curve, 36, 0.0045, 4, false),
        foliaMaterial
      ));
    }

    // Tapered brainstem, visible below the cerebrum.
    const stemProfile = [
      new THREE.Vector2(0.13, -0.02),
      new THREE.Vector2(0.16, -0.13),
      new THREE.Vector2(0.145, -0.28),
      new THREE.Vector2(0.12, -0.43),
      new THREE.Vector2(0.105, -0.58),
      new THREE.Vector2(0.085, -0.72)
    ];
    const stemGeometry = new THREE.LatheGeometry(stemProfile, 48);
    const stem = new THREE.Mesh(
      stemGeometry,
      new THREE.MeshPhysicalMaterial({
        color: 0x956047,
        roughness: 0.7,
        clearcoat: 0.2
      })
    );
    stem.position.set(0, -0.78, -0.13);
    stem.rotation.x = -0.12;
    brain.add(stem);

    // A restrained central fissure makes the two hemispheres read as separate structures.
    const fissurePoints = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      fissurePoints.push(new THREE.Vector3(
        Math.sin(t * Math.PI * 2) * 0.008,
        0.91 - t * 1.64,
        0.618 - Math.sin(t * Math.PI) * 0.025
      ));
    }
    brain.add(new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fissurePoints), 48, 0.009, 5, false),
      grooveMaterial
    ));

    const ambient = new THREE.HemisphereLight(0xffe8d5, 0x241714, 2.15);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffe2c6, 3.25);
    keyLight.position.set(-3.5, 4.2, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xf2b38a, 9, 8);
    fillLight.position.set(3.2, 1.2, 3.5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xa95e43, 17, 9);
    rimLight.position.set(2.5, -1.2, -2.5);
    scene.add(rimLight);

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
    } catch {
      return;
    }

    const resize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const onPointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      targetY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.42;
      targetX = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.2;
    };
    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!reducedMotion) {
        pointerX += (targetX - pointerX) * 0.035;
        pointerY += (targetY - pointerY) * 0.035;
        brain.rotation.y += (0.12 + pointerY - brain.rotation.y) * 0.008;
        brain.rotation.x += (pointerX - brain.rotation.x) * 0.025;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      brain.traverse((object) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material?.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="brain-art"
      aria-label="Interactive three-dimensional brain illustration with folded hemispheres, cerebellum and brainstem"
    />
  );
}
export default function Home() {
  return (
    <main>
      <nav className="nav">
        <a className="wordmark" href="#top">SOMEWHERE<span>®</span></a>
        <div className="nav-links"><a href="#about">ABOUT</a><a href="#work">SELECTED WORK</a><a href="#contact">CONTACT</a></div>
        <a className="nav-ai" href="https://biscuit-ytbellsroast-8207.vercel.app">OPEN BISCUIT <span>↗</span></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-topline"><span>AN OPEN TAB IN THE UNIVERSE</span><span>POKHARA, NEPAL · 2026</span></div>
        <div className="hero-copy">
          <p className="eyebrow">A PERSONAL SPACE BY SANDIP CHAPAGAIN</p>
          <h1>Somewhere<br/><em>between</em> ideas<br/>and <span>what’s next.</span></h1>
          <p className="hero-description">I’m Sandip — an aspiring developer and creator, exploring the space where technology, curiosity, and imagination meet.</p>
          <div className="hero-actions"><a className="text-link" href="#work">EXPLORE MY WORLD <span>↓</span></a><a className="text-link" href="https://biscuit-ytbellsroast-8207.vercel.app">MEET BISCUIT <span>↗</span></a></div>
        </div>
        <div className="hero-image-wrap">
          <img className="hero-image" src={photos.portrait} alt="Portrait of Sandip" />
          <span className="image-note">A WORK IN PROGRESS, LIKE EVERYTHING ELSE.</span>
        </div>
        <div className="hero-foot"><span>SCROLL TO WANDER</span><span>01 / 04</span></div>
      </section>

      <section className="manifesto" id="about">
        <div className="section-index">01 — A LITTLE ABOUT ME</div>
        <div className="manifesto-grid">
          <h2>Not here to have it all figured out. <em>Here to figure things out.</em></h2>
          <div className="manifesto-side"><p>I like turning “what if?” into something real. Some days that means building software. Other days it means experimenting with AI, making videos, or following an idea just to see where it goes.</p><p>This space is a snapshot of that process — unfinished in the best way.</p><a className="round-link" href="https://biscuit-ytbellsroast-8207.vercel.app">ASK BISCUIT <span>↗</span></a></div>
        </div>
        <div className="photo-ribbon">
          <figure className="ribbon-large"><img src={photos.first} alt="A personal photograph from Sandip's collection" /><figcaption>01 / THE IN-BETWEEN</figcaption></figure>
          <figure className="ribbon-small"><img src={photos.second} alt="A second personal photograph from Sandip's collection" /><figcaption>02 / OUTSIDE THE FRAME</figcaption></figure>
        </div>
      </section>

      <section className="work" id="work">
        <div className="section-index">02 — THINGS I’VE BEEN MAKING</div>
        <div className="work-heading"><h2>Curiosity,<br/><em>made tangible.</em></h2><p>A few corners of the internet and imagination I’ve been exploring. Projects evolve; this list is a starting point, not a finish line.</p></div>
        <div className="project-list">
          <article className="project"><span className="project-no">01</span><div><h3>BISCUIT</h3><p>A personal AI assistant experiment — a little space for big thoughts.</p></div><span className="project-type">AI / PRODUCT</span><a href="https://biscuit-ytbellsroast-8207.vercel.app" target="_blank" rel="noreferrer" aria-label="Open BISCUIT AI">↗</a></article>
          <article className="project"><span className="project-no">02</span><div><h3>VELNOR STUDIO</h3><p>Exploring tools and workflows for creators and video makers.</p></div><span className="project-type">CREATOR TOOLS</span><a href="https://github.com/VoidKii" target="_blank" rel="noreferrer" aria-label="Explore projects on GitHub">↗</a></article>
          <article className="project"><span className="project-no">03</span><div><h3>SMALL EXPERIMENTS</h3><p>Interfaces, prototypes, and ideas that start with a question.</p></div><span className="project-type">EXPLORATIONS</span><a href="https://github.com/VoidKii" target="_blank" rel="noreferrer" aria-label="Explore GitHub">↗</a></article>
        </div>
      </section>

      <section className="brain-section">
        <div className="section-index">03 — A DIFFERENT WAY TO EXPLORE</div>
        <div className="brain-layout">
          <div className="brain-copy"><p className="eyebrow">A MIND OF ITS OWN (SORT OF)</p><h2>Curiosity has<br/>a <em>destination.</em></h2><p>This is the doorway to BISCUIT — my separate AI assistant. One click takes you straight into its own space.</p><span className="brain-caption">SOMEWHERE × BISCUIT</span></div>
          <a className="brain-button" href="https://biscuit-ytbellsroast-8207.vercel.app" aria-label="Open BISCUIT AI"><BrainArtwork /><span className="brain-orbit-label">ENTER BISCUIT ↗</span></a>
        </div>
      </section>

      <section className="contact" id="contact"><div className="section-index">04 — THE NEXT CHAPTER</div><p className="eyebrow">GOOD THINGS START SOMEWHERE.</p><h2>Have a thought?<br/><em>Let’s start there.</em></h2><div className="contact-bottom"><span>SANDIP CHAPAGAIN · NEPAL</span><a href="https://github.com/VoidKii" target="_blank" rel="noreferrer">GITHUB ↗</a><span>© 2026 SOMEWHERE</span></div></section>

      <footer><a className="wordmark" href="#top">SOMEWHERE<span>®</span></a><span>STILL BECOMING.</span><a href="#top">BACK TO TOP ↑</a></footer>


    </main>
  );
}

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
    let model = null;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.04, 5.25);

    const brain = new THREE.Group();
    scene.add(brain);

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
      const isSmallScreen = window.matchMedia("(max-width: 760px)").matches;
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isSmallScreen,
        powerPreference: isSmallScreen ? "low-power" : "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.15 : 1.6));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
    } catch {
      return;
    }

    const resize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      const isSmallScreen = window.matchMedia("(max-width: 760px)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.15 : 1.6));
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

    // Load the OBJ model and its extracted texture maps from the repository.
    let disposed = false;
    import("three/addons/loaders/OBJLoader.js").then(async ({ OBJLoader }) => {
      if (disposed) return;
      const loader = new OBJLoader();
      loader.load(
        "https://raw.githubusercontent.com/VoidKii/Somewhere/main/Brain.obj",
        async (object) => {
          if (disposed) {
            object.traverse((child) => child.geometry?.dispose());
            return;
          }

          const textureLoader = new THREE.TextureLoader();
          const textureRoot = "https://raw.githubusercontent.com/VoidKii/Somewhere/main/Brain_Textures/";
          const loadTexture = (filename) => textureLoader.loadAsync(textureRoot + filename);

          let diffuseMap;
          let normalMap;
          let displacementMap;
          let specularMap;

          try {
            [diffuseMap, normalMap, displacementMap, specularMap] = await Promise.all([
              loadTexture("BrainDiff03.png"),
              loadTexture("BrainNormals.png"),
              loadTexture("BrainDisp.png"),
              loadTexture("BrainSpec.png")
            ]);
          } catch (error) {
            console.error("SOMEWHERE brain textures could not all be loaded:", error);
          }

          if (disposed) {
            [diffuseMap, normalMap, displacementMap, specularMap].forEach((texture) => texture?.dispose());
            object.traverse((child) => child.geometry?.dispose());
            return;
          }

          if (diffuseMap) diffuseMap.colorSpace = THREE.SRGBColorSpace;
          [normalMap, displacementMap, specularMap].forEach((texture) => {
            if (texture) texture.colorSpace = THREE.NoColorSpace;
          });

          const bounds = new THREE.Box3().setFromObject(object);
          const center = bounds.getCenter(new THREE.Vector3());
          const size = bounds.getSize(new THREE.Vector3());
          const largestDimension = Math.max(size.x, size.y, size.z);
          const scaleFactor = 2.2 / largestDimension;
          object.scale.setScalar(scaleFactor);
          object.position.copy(center).multiplyScalar(-scaleFactor);

          const brainMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            map: diffuseMap || null,
            normalMap: normalMap || null,
            normalScale: new THREE.Vector2(0.8, 0.8),
            displacementMap: displacementMap || null,
            displacementScale: displacementMap ? 0.006 : 0,
            displacementBias: -0.003,
            specularColorMap: specularMap || null,
            specularColor: 0xffffff,
            specularIntensity: specularMap ? 0.8 : 0.35,
            roughness: 0.78,
            metalness: 0.02,
            clearcoat: 0.12,
            clearcoatRoughness: 0.72
          });

          object.traverse((child) => {
            if (!child.isMesh) return;
            child.material = brainMaterial;
            child.geometry.computeVertexNormals();
            child.castShadow = false;
            child.receiveShadow = false;
          });

          model = object;
          brain.add(model);
        },
        undefined,
        (error) => {
          console.error("SOMEWHERE brain model could not be loaded:", error);
        }
      );
    }).catch((error) => {
      console.error("SOMEWHERE brain loader could not be initialized:", error);
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !frame) animate();
      if (!isVisible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { threshold: 0.01 });
    visibilityObserver.observe(canvas);

    const animate = () => {
      if (!isVisible) return;
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
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      visibilityObserver.disconnect();
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
      aria-label="Interactive three-dimensional brain model"
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

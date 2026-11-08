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
    let renderer, frame = 0, observer;
    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 5.4);
    const brain = new THREE.Group();
    scene.add(brain);

    const makeHemisphere = (side) => {
      const geometry = new THREE.SphereGeometry(1, 72, 56);
      const position = geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
        const theta = Math.acos(Math.max(-1, Math.min(1, y)));
        const phi = Math.atan2(z, x);
        const fold = Math.sin(phi * 9 + Math.cos(theta * 5) * 1.8) * Math.sin(theta * 7) * 0.026 + Math.sin(phi * 15 - theta * 4) * 0.012;
        position.setXYZ(i, x * (1 + fold), y * (1 + fold), z * (1 + fold));
      }
      geometry.computeVertexNormals();
      const material = new THREE.MeshPhysicalMaterial({ color: 0xc98255, roughness: 0.57, metalness: 0.02, clearcoat: 0.24, clearcoatRoughness: 0.6 });
      const lobe = new THREE.Mesh(geometry, material);
      lobe.scale.set(0.79, 1.02, 0.66);
      lobe.position.x = side * 0.405;
      brain.add(lobe);

      const grooveMaterial = new THREE.MeshStandardMaterial({ color: 0x603b32, roughness: 0.8, transparent: true, opacity: 0.72 });
      for (let line = 0; line < 9; line++) {
        const points = [];
        const basePhi = -1.15 + line * 0.285;
        for (let step = 0; step <= 34; step++) {
          const theta = 0.28 + (step / 34) * 2.48;
          const phi = basePhi + Math.sin(theta * 5.2 + line) * 0.105;
          const ripple = 1 + Math.sin(phi * 9 + Math.cos(theta * 5) * 1.8) * Math.sin(theta * 7) * 0.026;
          points.push(new THREE.Vector3(
            side * 0.405 + side * 0.797 * Math.sin(theta) * Math.cos(phi) * ripple,
            1.025 * Math.cos(theta) * ripple,
            0.667 * Math.sin(theta) * Math.sin(phi) * ripple
          ));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        brain.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 54, 0.009, 5, false), grooveMaterial));
      }
    };

    makeHemisphere(-1);
    makeHemisphere(1);
    scene.add(new THREE.AmbientLight(0xffe7d0, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffe1c2, 3.2);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xb76c4d, 18, 9);
    rimLight.position.set(3, -1, -2);
    scene.add(rimLight);

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    } catch { return; }

    const resize = () => {
      const width = Math.max(1, canvas.clientWidth), height = Math.max(1, canvas.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const onPointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      targetY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.5;
      targetX = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.22;
    };
    canvas.addEventListener("pointermove", onPointer);
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
      brain.traverse(object => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) object.material.forEach(material => material.dispose());
        else object.material?.dispose();
      });
      renderer.dispose();
    };
  }, []);
  return <canvas ref={canvasRef} className="brain-art" aria-label="Interactive three-dimensional brain illustration" />;
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

      {open && <div className="assistant-shell" role="dialog" aria-modal="true" aria-label="BISCUIT AI assistant">
        <button className="assistant-backdrop" onClick={() => setOpen(false)} aria-label="Close assistant" />
        <section className="assistant-panel">
          <header className="assistant-header"><div><span className="live-dot" /> BISCUIT <small>THE AI INSIDE SOMEWHERE</small></div><button onClick={() => setOpen(false)} aria-label="Close">×</button></header>
          <div className="assistant-intro"><div className="mini-brain"><BrainArtwork /></div><p className="eyebrow">A CONVERSATION STARTS HERE</p><h2>{mode === "about" ? "Curious about me?" : "What’s on your mind?"}</h2><p>{mode === "about" ? "Ask about the person, the projects, or the thinking behind this space." : "A general-purpose AI space for questions, ideas, and exploration."}</p></div>
          <div className="mode-switch"><button className={mode === "about" ? "active" : ""} onClick={() => setMode("about")}>ABOUT SANDIP</button><button className={mode === "general" ? "active" : ""} onClick={() => setMode("general")}>ASK ANYTHING</button></div>
          <div className="chat-scroll">
            {messages.length === 0 && <div className="suggestions"><button onClick={() => setInput("What is SOMEWHERE?")}>What is this place? <span>↗</span></button><button onClick={() => setInput("Tell me about Sandip's projects.")}>Tell me about the projects <span>↗</span></button><button onClick={() => {setMode("general");setInput("Give me an interesting idea to explore.");}}>Give me an idea to explore <span>↗</span></button></div>}
            {messages.map((item, index) => <div className={"message " + item.role} key={index}><span>{item.role === "user" ? "YOU" : "BISCUIT"}</span><p>{item.content}</p></div>)}
            {busy && <div className="message assistant"><span>BISCUIT</span><p className="typing">Thinking<span>.</span><span>.</span><span>.</span></p></div>}
            {error && <p className="chat-error">{error}</p>}<div ref={bottomRef} />
          </div>
          <form className="chat-form" onSubmit={sendMessage}><input value={input} onChange={e => setInput(e.target.value)} placeholder="Leave a thought here…" maxLength={8000} /><button disabled={busy || !input.trim()} aria-label="Send message">↑</button></form>
          <p className="privacy-note">Chats are saved in this browser. Avoid sharing sensitive personal information.</p>
        </section>
      </div>}
    </main>
  );
}

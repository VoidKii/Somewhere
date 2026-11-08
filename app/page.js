"use client";

import { useEffect, useRef, useState } from "react";

const photos = {
  portrait: "https://raw.githubusercontent.com/VoidKii/Somewhere/main/Contemplative%20Low-Angle%20Indoor%20Portrait.png",
  first: "https://raw.githubusercontent.com/VoidKii/Somewhere/main/20261027_183525.jpg",
  second: "https://raw.githubusercontent.com/VoidKii/Somewhere/main/IMG_3733.JPG"
};

const profileContext = [
  "The person behind this portfolio is Sandip Chapagain.",
  "SOMEWHERE is Sandip's personal portfolio and creative home. The name is the brand; his name remains Sandip Chapagain.",
  "Sandip describes himself as an aspiring developer and creator.",
  "He explores software, AI assistants, web experiences, creative experiments, and video projects.",
  "His projects have included BISCUIT, Crispy, Velnor Studio, and personal AI experiments. Do not invent features, launch status, metrics, clients, or professional experience.",
  "If asked about a specific skill, achievement, project detail, or contact information not provided in this context, say you do not have confirmed information and invite the visitor to ask Sandip.",
  "Be thoughtful, concise, curious, and honest. Never fabricate personal facts."
];

function BrainArtwork() {
  return (
    <svg className="brain-art" viewBox="0 0 640 520" role="img" aria-label="An intricate illustrated brain suspended in a field of light">
      <defs>
        <radialGradient id="brainFill" cx="48%" cy="38%" r="68%">
          <stop offset="0" stopColor="#f4c99c" />
          <stop offset=".55" stopColor="#c98255" />
          <stop offset="1" stopColor="#633b32" />
        </radialGradient>
        <linearGradient id="brainStroke" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe4c5" />
          <stop offset="1" stopColor="#8b4d3d" />
        </linearGradient>
        <filter id="brainGlow"><feGaussianBlur stdDeviation="15" /></filter>
      </defs>
      <ellipse cx="320" cy="265" rx="205" ry="174" fill="#d58b60" opacity=".13" filter="url(#brainGlow)" />
      <g className="brain-float">
        <path d="M316 111 C281 72 224 83 205 119 C160 113 130 152 144 190 C105 218 119 270 151 290 C132 335 164 374 207 370 C228 411 278 413 311 383 C321 400 328 399 336 382 C371 411 419 400 434 364 C480 369 507 330 485 291 C521 260 507 212 474 192 C486 148 449 117 410 123 C387 83 342 78 316 111Z" fill="url(#brainFill)" stroke="url(#brainStroke)" strokeWidth="3" />
        <path d="M320 112 C308 158 330 178 316 213 C304 250 329 275 315 310 C305 337 321 360 319 388" fill="none" stroke="#4e302d" strokeWidth="5" opacity=".9" />
        <g fill="none" stroke="#f9d8b7" strokeWidth="3" strokeLinecap="round" opacity=".83">
          <path d="M205 120 C190 144 218 151 205 174 C192 196 163 183 160 208 C157 230 187 238 181 261 C175 284 149 278 154 305" />
          <path d="M241 99 C222 122 242 139 229 160 C214 182 235 195 224 216 C212 237 190 228 195 253 C200 277 228 277 219 303 C212 325 192 332 207 365" />
          <path d="M278 104 C259 126 283 144 268 167 C253 190 275 204 259 226 C245 247 268 265 253 286 C240 305 255 332 278 351" />
          <path d="M164 237 C188 222 204 242 202 261 C200 280 180 291 191 310" />
          <path d="M210 157 C231 146 248 160 243 181 C239 201 258 211 275 202" />
          <path d="M344 103 C365 123 345 143 362 161 C381 181 358 199 378 218 C398 237 374 253 390 273" />
          <path d="M392 119 C413 140 393 157 413 177 C435 199 411 218 432 235 C450 250 432 272 451 289" />
          <path d="M453 151 C470 175 445 188 463 209 C482 231 459 248 477 268" />
          <path d="M346 240 C365 222 390 232 388 254 C386 276 412 284 405 305 C400 325 378 327 382 352" />
          <path d="M350 299 C369 282 389 299 382 318 C376 337 401 351 418 348" />
          <path d="M268 362 C285 343 301 356 298 374" />
          <path d="M425 361 C439 338 459 344 464 323" />
        </g>
        <g fill="none" stroke="#633b32" strokeWidth="2" opacity=".75">
          <path d="M185 204 C210 190 214 211 208 226" />
          <path d="M245 126 C263 139 254 155 247 165" />
          <path d="M282 235 C300 221 299 204 289 190" />
          <path d="M366 135 C349 151 360 171 373 178" />
          <path d="M430 204 C412 192 403 211 412 225" />
          <path d="M448 300 C425 289 416 309 425 326" />
          <path d="M231 327 C248 309 267 320 262 341" />
        </g>
        <g fill="#ffe2bd">
          <circle cx="207" cy="174" r="4"/><circle cx="243" cy="181" r="3"/><circle cx="268" cy="167" r="3"/>
          <circle cx="413" cy="177" r="4"/><circle cx="432" cy="235" r="3"/><circle cx="382" cy="318" r="4"/>
        </g>
      </g>
      <g fill="none" stroke="#d69a70" opacity=".42">
        <ellipse cx="320" cy="258" rx="250" ry="205" strokeDasharray="2 12" />
        <ellipse cx="320" cy="258" rx="280" ry="230" strokeDasharray="1 18" />
      </g>
      <g fill="#f3c9a3">
        <circle cx="76" cy="232" r="2"/><circle cx="554" cy="170" r="2"/><circle cx="500" cy="405" r="2"/><circle cx="126" cy="390" r="2"/>
      </g>
    </svg>
  );
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("about");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("somewhere-chat") || "[]");
      if (Array.isArray(saved)) setMessages(saved.slice(-30));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("somewhere-chat", JSON.stringify(messages.slice(-30)));
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, ready, open]);

  async function sendMessage(event) {
    event?.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    const next = [...messages, { role: "user", content: message, mode }];
    setMessages(next);
    setInput("");
    setError("");
    setBusy(true);
    try {
      const history = next.slice(-17, -1).map(({ role, content }) => ({ role, content }));
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history,
          mode,
          memories: mode === "about" ? profileContext.map(content => ({ content })) : []
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The assistant couldn't respond.");
      setMessages(current => [...current, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function enterAssistant(selectedMode = "about") {
    setMode(selectedMode);
    setOpen(true);
    setError("");
  }

  return (
    <main>
      <nav className="nav">
        <a className="wordmark" href="#top">SOMEWHERE<span>®</span></a>
        <div className="nav-links"><a href="#about">ABOUT</a><a href="#work">SELECTED WORK</a><a href="#contact">CONTACT</a></div>
        <button className="nav-ai" onClick={() => enterAssistant("about")}>TALK TO THE AI <span>↗</span></button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-topline"><span>AN OPEN TAB IN THE UNIVERSE</span><span>POKHARA, NEPAL · 2026</span></div>
        <div className="hero-copy">
          <p className="eyebrow">A PERSONAL SPACE BY SANDIP CHAPAGAIN</p>
          <h1>Somewhere<br/><em>between</em> ideas<br/>and <span>what’s next.</span></h1>
          <p className="hero-description">I’m Sandip — an aspiring developer and creator, exploring the space where technology, curiosity, and imagination meet.</p>
          <div className="hero-actions"><a className="text-link" href="#work">EXPLORE MY WORLD <span>↓</span></a><button className="text-link" onClick={() => enterAssistant("about")}>MEET MY AI <span>↗</span></button></div>
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
          <div className="manifesto-side"><p>I like turning “what if?” into something real. Some days that means building software. Other days it means experimenting with AI, making videos, or following an idea just to see where it goes.</p><p>This space is a snapshot of that process — unfinished in the best way.</p><button className="round-link" onClick={() => enterAssistant("about")}>ASK ABOUT ME <span>↗</span></button></div>
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
          <article className="project"><span className="project-no">01</span><div><h3>BISCUIT</h3><p>A personal AI assistant experiment — a little space for big thoughts.</p></div><span className="project-type">AI / PRODUCT</span><a href="https://github.com/VoidKii/biscuit" target="_blank" rel="noreferrer" aria-label="View BISCUIT on GitHub">↗</a></article>
          <article className="project"><span className="project-no">02</span><div><h3>VELNOR STUDIO</h3><p>Exploring tools and workflows for creators and video makers.</p></div><span className="project-type">CREATOR TOOLS</span><a href="https://github.com/VoidKii" target="_blank" rel="noreferrer" aria-label="Explore projects on GitHub">↗</a></article>
          <article className="project"><span className="project-no">03</span><div><h3>SMALL EXPERIMENTS</h3><p>Interfaces, prototypes, and ideas that start with a question.</p></div><span className="project-type">EXPLORATIONS</span><a href="https://github.com/VoidKii" target="_blank" rel="noreferrer" aria-label="Explore GitHub">↗</a></article>
        </div>
      </section>

      <section className="brain-section">
        <div className="section-index">03 — A DIFFERENT WAY TO EXPLORE</div>
        <div className="brain-layout">
          <div className="brain-copy"><p className="eyebrow">A MIND OF ITS OWN (SORT OF)</p><h2>There’s more<br/>behind the <em>surface.</em></h2><p>Meet the little intelligence living in this corner of the internet. Ask it about my projects, how things work, or just give it a thought to explore.</p><button className="brain-cta" onClick={() => enterAssistant("about")}>OPEN THE CONVERSATION <span>↗</span></button><span className="brain-caption">AN INTERACTIVE WINDOW INTO SOMEWHERE</span></div>
          <button className="brain-button" onClick={() => enterAssistant("about")} aria-label="Open the AI assistant"><BrainArtwork /><span className="brain-orbit-label">TAP TO THINK ↗</span></button>
        </div>
      </section>

      <section className="contact" id="contact"><div className="section-index">04 — THE NEXT CHAPTER</div><p className="eyebrow">GOOD THINGS START SOMEWHERE.</p><h2>Have a thought?<br/><em>Let’s start there.</em></h2><div className="contact-bottom"><span>SANDIP CHAPAGAIN · NEPAL</span><a href="https://github.com/VoidKii" target="_blank" rel="noreferrer">GITHUB ↗</a><span>© 2026 SOMEWHERE</span></div></section>

      <footer><a className="wordmark" href="#top">SOMEWHERE<span>®</span></a><span>STILL BECOMING.</span><a href="#top">BACK TO TOP ↑</a></footer>

      {open && <div className="assistant-shell" role="dialog" aria-modal="true" aria-label="Somewhere AI assistant">
        <button className="assistant-backdrop" onClick={() => setOpen(false)} aria-label="Close assistant" />
        <section className="assistant-panel">
          <header className="assistant-header"><div><span className="live-dot" /> SOMEWHERE INTELLIGENCE <small>POWERED BY BISCUIT</small></div><button onClick={() => setOpen(false)} aria-label="Close">×</button></header>
          <div className="assistant-intro"><div className="mini-brain"><BrainArtwork /></div><p className="eyebrow">A CONVERSATION STARTS HERE</p><h2>{mode === "about" ? "Curious about me?" : "What’s on your mind?"}</h2><p>{mode === "about" ? "Ask about the person, the projects, or the thinking behind this space." : "A general-purpose AI space for questions, ideas, and exploration."}</p></div>
          <div className="mode-switch"><button className={mode === "about" ? "active" : ""} onClick={() => setMode("about")}>ABOUT SANDIP</button><button className={mode === "general" ? "active" : ""} onClick={() => setMode("general")}>ASK ANYTHING</button></div>
          <div className="chat-scroll">
            {messages.length === 0 && <div className="suggestions"><button onClick={() => setInput("What is SOMEWHERE?")}>What is this place? <span>↗</span></button><button onClick={() => setInput("Tell me about Sandip's projects.")}>Tell me about the projects <span>↗</span></button><button onClick={() => {setMode("general");setInput("Give me an interesting idea to explore.");}}>Give me an idea to explore <span>↗</span></button></div>}
            {messages.map((item, index) => <div className={"message " + item.role} key={index}><span>{item.role === "user" ? "YOU" : "SOMEWHERE"}</span><p>{item.content}</p></div>)}
            {busy && <div className="message assistant"><span>SOMEWHERE</span><p className="typing">Thinking<span>.</span><span>.</span><span>.</span></p></div>}
            {error && <p className="chat-error">{error}</p>}<div ref={bottomRef} />
          </div>
          <form className="chat-form" onSubmit={sendMessage}><input value={input} onChange={e => setInput(e.target.value)} placeholder="Leave a thought here…" maxLength={8000} /><button disabled={busy || !input.trim()} aria-label="Send message">↑</button></form>
          <p className="privacy-note">Chats are saved in this browser. Avoid sharing sensitive personal information.</p>
        </section>
      </div>}
    </main>
  );
}

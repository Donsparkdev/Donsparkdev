import { useState, useEffect, useRef } from "react";

export const GITHUB_USERNAME = "donsparkdev";
export const GITHUB_API       = `https://api.github.com/users/${GITHUB_USERNAME}`;
export const GITHUB_REPOS_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`;

/* ══════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { background:#050811; color:#e8eaf6; font-family:'Outfit',sans-serif; overflow-x:hidden; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:#050811; }
  ::-webkit-scrollbar-thumb { background:#7b2fff; border-radius:2px; }
  ::selection { background:rgba(0,200,255,.2); color:#00c8ff; }
  body::before { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E"); opacity:.022; pointer-events:none; z-index:9999; }

  @keyframes orbFloat   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }
  @keyframes heroIn     { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes badgeIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse      { 0%,100%{opacity:1;box-shadow:0 0 12px #00c8ff} 50%{opacity:.4;box-shadow:0 0 4px #00c8ff} }
  @keyframes pulseDot   { 0%,100%{opacity:1;box-shadow:0 0 10px #00ff88} 50%{opacity:.5;box-shadow:0 0 4px #00ff88} }
  @keyframes ringCW     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ringCCW    { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes scrollPuls { 0%,100%{transform:scaleY(1);opacity:.5} 50%{transform:scaleY(.6);opacity:1} }
  @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes logoGlow   { 0%,100%{filter:drop-shadow(0 0 5px rgba(0,200,255,.5))} 50%{filter:drop-shadow(0 0 14px rgba(0,200,255,.9))} }
  @keyframes shimmer    { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes loaderSpin { to{transform:rotate(360deg)} }
  @keyframes loaderIn   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes waPulse    { 0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.4)} 70%{box-shadow:0 0 0 12px rgba(37,211,102,0)} }
  @keyframes waWiggle   { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
  @keyframes pageIn     { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .page-enter { animation:pageIn .5s cubic-bezier(.16,1,.3,1) both; }

  .loader-screen { position:fixed; inset:0; background:#050811; z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px; transition:opacity .7s ease,visibility .7s ease; }
  .loader-screen.hide { opacity:0; visibility:hidden; pointer-events:none; }
  .loader-ring { width:54px; height:54px; border-radius:50%; border:2px solid rgba(0,200,255,.1); border-top-color:#00c8ff; animation:loaderSpin .9s linear infinite; }
  .loader-logo { font-family:'DM Mono',monospace; font-size:1.1rem; background:linear-gradient(135deg,#00c8ff,#7b2fff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter:drop-shadow(0 0 10px rgba(0,200,255,.4)); animation:loaderIn .5s ease both; }
  .loader-sub  { font-family:'DM Mono',monospace; font-size:.65rem; color:#2a3550; letter-spacing:3px; text-transform:uppercase; animation:loaderIn .5s .25s ease both; }

  @media(pointer:fine){ body{cursor:none;} a,button,.glass-card,.project-card,.repo-card-live,.blog-card,.pricing-card,.tool-card,.product-card{cursor:none;} }
  .cursor-dot  { position:fixed; width:8px; height:8px; background:#00c8ff; border-radius:50%; pointer-events:none; z-index:99998; transform:translate(-50%,-50%); box-shadow:0 0 10px #00c8ff; transition:background .2s,transform .1s,box-shadow .2s; }
  .cursor-ring { position:fixed; width:36px; height:36px; border:1.5px solid rgba(0,200,255,.5); border-radius:50%; pointer-events:none; z-index:99997; transform:translate(-50%,-50%); transition:width .15s,height .15s,border-color .2s; }
  .cursor-dot.hovering  { transform:translate(-50%,-50%) scale(2.2); background:#7b2fff; box-shadow:0 0 16px #7b2fff; }
  .cursor-ring.hovering { width:54px; height:54px; border-color:rgba(123,47,255,.5); }

  .wa-float { position:fixed; bottom:28px; right:28px; z-index:9000; display:flex; flex-direction:column; align-items:flex-end; gap:10px; }
  .wa-btn { width:58px; height:58px; border-radius:50%; background:linear-gradient(135deg,#25d366,#128c7e); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(37,211,102,.4); animation:waPulse 2.5s ease-in-out infinite; transition:transform .2s; }
  .wa-btn:hover { transform:scale(1.1); }
  .wa-tooltip { background:rgba(8,13,26,.95); border:1px solid rgba(37,211,102,.25); border-radius:10px; padding:8px 14px; font-family:'DM Mono',monospace; font-size:.7rem; color:#25d366; letter-spacing:.5px; white-space:nowrap; backdrop-filter:blur(12px); opacity:0; transform:translateX(8px); transition:all .25s; pointer-events:none; }
  .wa-float:hover .wa-tooltip { opacity:1; transform:translateX(0); }

  .hero-counters { display:flex; gap:32px; flex-wrap:wrap; padding:24px 0 0; border-top:1px solid rgba(255,255,255,.06); margin-top:8px; }
  .hero-counter-item { display:flex; flex-direction:column; gap:3px; }
  .hero-counter-num { font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800; background:linear-gradient(135deg,#00c8ff,#7b2fff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; }
  .hero-counter-label { font-family:'DM Mono',monospace; font-size:.65rem; color:#3a4a6a; letter-spacing:1.5px; text-transform:uppercase; }

  .btn-cv { display:inline-flex; align-items:center; gap:8px; padding:12px 24px; background:rgba(0,200,255,.06); border:1px solid rgba(0,200,255,.2); border-radius:8px; color:#00c8ff; font-family:'DM Mono',monospace; font-size:.78rem; letter-spacing:1px; cursor:pointer; transition:all .25s; text-decoration:none; }
  .btn-cv:hover { background:rgba(0,200,255,.14); transform:translateY(-2px); box-shadow:0 6px 24px rgba(0,200,255,.2); }

  .glass-card { background:rgba(255,255,255,.035); border:1px solid rgba(0,200,255,.12); border-radius:16px; backdrop-filter:blur(12px); transition:transform .3s,border-color .3s,box-shadow .3s; }
  .glass-card:hover { transform:translateY(-4px); border-color:rgba(0,200,255,.25); box-shadow:0 0 30px rgba(0,200,255,.15); }

  .btn-primary  { display:inline-flex; align-items:center; gap:10px; padding:15px 34px; background:linear-gradient(135deg,#00c8ff,#7b2fff); border-radius:8px; color:#fff; font-weight:600; font-size:.95rem; text-decoration:none; border:none; cursor:pointer; transition:all .3s; letter-spacing:.3px; font-family:'Outfit',sans-serif; }
  .btn-primary:hover  { transform:translateY(-2px); box-shadow:0 8px 40px rgba(0,200,255,.35); }
  .btn-secondary{ display:inline-flex; align-items:center; gap:10px; padding:15px 34px; background:transparent; border-radius:8px; color:#e8eaf6; font-weight:600; font-size:.95rem; text-decoration:none; border:1px solid rgba(255,255,255,.12); cursor:pointer; transition:all .3s; letter-spacing:.3px; font-family:'Outfit',sans-serif; }
  .btn-secondary:hover{ border-color:rgba(0,200,255,.4); color:#00c8ff; transform:translateY(-2px); background:rgba(0,200,255,.04); }

  .nav-link-item { color:#a0aec0; text-decoration:none; font-size:.85rem; font-weight:500; letter-spacing:.5px; text-transform:uppercase; transition:color .3s; position:relative; }
  .nav-link-item::after { content:''; position:absolute; bottom:-4px; left:0; right:0; height:1px; background:#00c8ff; transform:scaleX(0); transition:transform .3s; transform-origin:left; }
  .nav-link-item:hover { color:#00c8ff; }
  .nav-link-item:hover::after { transform:scaleX(1); }
  .nav-link-item.active { color:#00c8ff; }
  .nav-link-item.active::after { transform:scaleX(1); }
  .nav-cta-link { padding:8px 22px; border:1px solid #00c8ff; border-radius:6px; color:#00c8ff!important; font-size:.82rem!important; letter-spacing:.8px; transition:background .3s,box-shadow .3s!important; }
  .nav-cta-link:hover { background:rgba(0,200,255,.08); box-shadow:0 0 20px rgba(0,200,255,.2); }

  .contact-item { display:flex; align-items:center; gap:14px; padding:16px; background:rgba(255,255,255,.035); border:1px solid rgba(0,200,255,.12); border-radius:10px; transition:all .3s; text-decoration:none; color:#e8eaf6; }
  .contact-item:hover { border-color:rgba(0,200,255,.3); transform:translateX(4px); }
  .social-link  { width:44px; height:44px; border-radius:10px; background:rgba(255,255,255,.035); border:1px solid rgba(0,200,255,.12); display:flex; align-items:center; justify-content:center; text-decoration:none; transition:all .3s; color:#a0aec0; }
  .social-link:hover { border-color:rgba(0,200,255,.3); color:#00c8ff; transform:translateY(-2px); background:rgba(0,200,255,.06); }

  .project-card { border-radius:16px; overflow:hidden; background:rgba(8,13,26,.8); border:1px solid rgba(0,200,255,.12); transition:transform .3s,box-shadow .3s,border-color .3s; }
  .project-card:hover { transform:translateY(-6px); box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 40px rgba(0,200,255,.08); border-color:rgba(0,200,255,.3); }
  .proj-link-live{ display:inline-flex; align-items:center; gap:6px; font-size:.8rem; text-decoration:none; padding:8px 16px; border-radius:6px; font-weight:500; transition:all .2s; background:rgba(0,200,255,.1); border:1px solid rgba(0,200,255,.2); color:#00c8ff; }
  .proj-link-live:hover { background:rgba(0,200,255,.2); }
  .proj-link-gh  { display:inline-flex; align-items:center; gap:6px; font-size:.8rem; text-decoration:none; padding:8px 16px; border-radius:6px; font-weight:500; transition:all .2s; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:#6b7a99; }
  .proj-link-gh:hover { border-color:rgba(255,255,255,.2); color:#e8eaf6; }

  .repo-card-live { border-radius:12px; background:rgba(8,13,26,.8); border:1px solid rgba(0,200,255,.1); transition:all .3s; text-decoration:none; color:#e8eaf6; display:flex; flex-direction:column; gap:10px; padding:22px; }
  .repo-card-live:hover { border-color:rgba(0,200,255,.3); transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,.4); }

  .blog-card { border-radius:16px; background:rgba(8,13,26,.8); border:1px solid rgba(0,200,255,.1); overflow:hidden; transition:all .3s; text-decoration:none; color:#e8eaf6; display:flex; flex-direction:column; }
  .blog-card:hover { transform:translateY(-6px); border-color:rgba(0,200,255,.3); box-shadow:0 20px 60px rgba(0,0,0,.4); }
  .blog-card h3 { color:#e8eaf6!important; -webkit-text-fill-color:#e8eaf6!important; }
  .blog-card p  { color:#a0aec0!important; -webkit-text-fill-color:#a0aec0!important; }

  .pricing-card { border-radius:20px; padding:36px 32px; display:flex; flex-direction:column; gap:20px; position:relative; overflow:hidden; transition:all .3s; }
  .pricing-card.featured { background:linear-gradient(135deg,rgba(0,200,255,.08),rgba(123,47,255,.08)); border:1px solid rgba(0,200,255,.3)!important; transform:scale(1.03); }
  .pricing-feat { display:flex; align-items:flex-start; gap:10px; font-size:.87rem; color:#a0aec0; line-height:1.5; }
  .pricing-feat::before { content:'✓'; color:#00c8ff; font-weight:700; flex-shrink:0; margin-top:1px; }

  .tool-card { border-radius:14px; padding:24px; background:rgba(8,13,26,.8); border:1px solid rgba(0,200,255,.1); transition:all .3s; text-decoration:none; color:#e8eaf6; display:flex; flex-direction:column; gap:12px; }
  .tool-card:hover { border-color:rgba(0,200,255,.3); transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,.4); }

  .product-card { border-radius:16px; overflow:hidden; background:rgba(8,13,26,.8); border:1px solid rgba(0,200,255,.1); transition:all .3s; }
  .product-card:hover { border-color:rgba(0,200,255,.3); transform:translateY(-4px); box-shadow:0 16px 50px rgba(0,0,0,.4); }

  .form-input { padding:14px 16px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); border-radius:8px; color:#e8eaf6; font-family:'Outfit',sans-serif; font-size:.9rem; outline:none; transition:border-color .3s,box-shadow .3s; resize:vertical; width:100%; }
  .form-input:focus { border-color:rgba(0,200,255,.4); box-shadow:0 0 0 3px rgba(0,200,255,.06); }
  .form-input::placeholder { color:#6b7a99; }
  .form-submit { padding:16px; background:linear-gradient(135deg,#00c8ff,#7b2fff); border:none; border-radius:8px; color:#fff; font-weight:600; font-size:.95rem; cursor:pointer; transition:all .3s; font-family:'Outfit',sans-serif; letter-spacing:.3px; width:100%; }
  .form-submit:hover { transform:translateY(-2px); box-shadow:0 8px 40px rgba(0,200,255,.35); }

  .footer-back { font-family:'DM Mono',monospace; font-size:.75rem; color:#6b7a99; text-decoration:none; display:flex; align-items:center; gap:8px; transition:color .3s; }
  .footer-back:hover { color:#00c8ff; }

  .gh-skeleton { background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:6px; }

  .article-overlay { position:fixed; inset:0; background:#050811; z-index:10000; overflow-y:auto; animation:fadeIn .35s ease; }
  .article-body h2 { font-family:'Syne',sans-serif; font-size:1.35rem; font-weight:800; color:#e8eaf6; margin:40px 0 14px; letter-spacing:-.5px; }
  .article-body h3 { font-family:'Syne',sans-serif; font-size:1.05rem; font-weight:700; color:#c8d0e0; margin:28px 0 10px; }
  .article-body p  { color:#8892a4; line-height:1.95; margin-bottom:18px; font-size:.97rem; }
  .article-body ul,.article-body ol { padding-left:22px; margin-bottom:18px; }
  .article-body li { color:#8892a4; line-height:1.85; font-size:.95rem; margin-bottom:6px; }
  .article-body li::marker { color:#00c8ff; }
  .article-body strong { color:#c8d0e0; font-weight:600; }
  .article-body code { font-family:'DM Mono',monospace; font-size:.82rem; background:rgba(0,200,255,.07); border:1px solid rgba(0,200,255,.15); color:#00c8ff; padding:2px 8px; border-radius:5px; }
  .article-body pre { background:rgba(5,8,17,.9); border:1px solid rgba(0,200,255,.12); border-radius:12px; padding:24px; margin:24px 0; overflow-x:auto; }
  .article-body pre code { background:none; border:none; padding:0; font-size:.82rem; color:#a0aec0; line-height:1.8; }
  .article-body blockquote { border-left:3px solid #00c8ff; padding:14px 20px; background:rgba(0,200,255,.04); border-radius:0 10px 10px 0; margin:24px 0; font-style:italic; color:#6b7a99; }
  .progress-bar { position:fixed; top:0; left:0; height:2px; background:linear-gradient(90deg,#00c8ff,#7b2fff); z-index:10001; transition:width .1s; }

  .reveal { opacity:0; transform:translateY(30px); transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-d1{transition-delay:.1s} .reveal-d2{transition-delay:.2s} .reveal-d3{transition-delay:.3s} .reveal-d4{transition-delay:.4s}
  .skill-bar-fill { transform:scaleX(0); transform-origin:left; transition:transform 1.2s cubic-bezier(.16,1,.3,1); }
  .skill-bar-fill.anim { transform:scaleX(1); }

  @media(max-width:900px){
    .about-grid{grid-template-columns:1fr!important;text-align:center}
    .about-visual{justify-content:center}
    .about-loc{justify-content:center!important}
    .contact-grid{grid-template-columns:1fr!important}
  }
  @media(max-width:768px){
    .nav-desktop{display:none!important}
    .ham-btn{display:flex!important}
    section{padding:70px 5%!important}
    .skills-grid{grid-template-columns:1fr!important}
    .projects-grid{grid-template-columns:1fr!important}
    .repos-grid{grid-template-columns:1fr!important}
    .tools-grid{grid-template-columns:1fr!important}
    .products-grid{grid-template-columns:1fr!important}
    footer{justify-content:center!important;text-align:center}
  }
  @media(max-width:480px){
    .hero-cta{flex-direction:column}
    .btn-primary,.btn-secondary{justify-content:center}
    .about-stats{grid-template-columns:1fr 1fr!important}
  }
`;

/* ══════════════════════════════════════════
   STYLE CONSTANTS
══════════════════════════════════════════ */
export const S = {
  gradText:{ background:"linear-gradient(135deg,#00c8ff,#7b2fff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" },
  mono:    { fontFamily:"'DM Mono',monospace" },
  display: { fontFamily:"'Syne',sans-serif" },
  neon:    { color:"#00c8ff" },
  dim:     { color:"#6b7a99" },
  mid:     { color:"#a0aec0" },
};

export const LANG_COLORS = { JavaScript:"#f7df1e",TypeScript:"#3178c6",Python:"#3572A5",HTML:"#e34c26",CSS:"#563d7c","C++":"#f34b7d",Java:"#b07219",Go:"#00ADD8",Rust:"#dea584",Shell:"#89e051",Vue:"#41b883",Svelte:"#ff3e00" };
export const lc = lang => LANG_COLORS[lang] || "#8b949e";

/* ══════════════════════════════════════════
   HOOKS
══════════════════════════════════════════ */
export function GlobalStyles() {
  useEffect(() => {
    const id = "pf-global";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    const metas = [
      { name:"description",        content:"Uchenna Chidera Onyesom — Full Stack Developer from Abuja, Nigeria. Building scalable web apps with React, Node.js & MongoDB." },
      { name:"keywords",           content:"Full Stack Developer Nigeria, React Developer Abuja, Node.js Developer, MongoDB, Web Developer Nigeria, Donspark" },
      { name:"author",             content:"Uchenna Chidera Onyesom" },
      { property:"og:title",       content:"Uchenna Chidera Onyesom — Full Stack Developer" },
      { property:"og:description", content:"Building scalable, secure & modern web applications. React · Node.js · MongoDB · REST APIs. Based in Abuja, Nigeria." },
      { property:"og:url",         content:"https://donsparkdev.netlify.app" },
      { property:"og:type",        content:"website" },
      { property:"og:image",       content:`https://avatars.githubusercontent.com/${GITHUB_USERNAME}` },
      { name:"twitter:card",       content:"summary_large_image" },
      { name:"twitter:title",      content:"Uchenna Chidera Onyesom — Full Stack Developer" },
      { name:"twitter:description",content:"Building scalable web apps with React, Node.js & MongoDB. Based in Abuja, Nigeria." },
      { name:"twitter:image",      content:`https://avatars.githubusercontent.com/${GITHUB_USERNAME}` },
    ];
    metas.forEach(m => {
      const key = m.property ? "property" : "name";
      const val = m.property || m.name;
      if (!document.querySelector(`meta[${key}="${val}"]`)) {
        const el = document.createElement("meta");
        el.setAttribute(key, val);
        el.content = m.content;
        document.head.appendChild(el);
      }
    });
    document.title = "Uchenna Chidera Onyesom — Full Stack Developer | Abuja, Nigeria";
  }, []);
  return null;
}

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

export function useGitHub() {
  const [profile, setProfile] = useState(null);
  const [repos,   setRepos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const [pR, rR] = await Promise.all([
          fetch(GITHUB_API,       { headers:{ Accept:"application/vnd.github.v3+json" } }),
          fetch(GITHUB_REPOS_API, { headers:{ Accept:"application/vnd.github.v3+json" } }),
        ]);
        if (!pR.ok) throw new Error(`GitHub ${pR.status}`);
        const [p, r] = await Promise.all([pR.json(), rR.json()]);
        setProfile(p);
        setRepos(Array.isArray(r) ? r : []);
      } catch(e) { setError(e.message); }
      finally    { setLoading(false); }
    })();
  }, []);
  return { profile, repos, loading, error };
}

/* ══════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════ */
export function Loader({ done }) {
  return (
    <div className={`loader-screen${done?" hide":""}`}>
      <div className="loader-ring"/>
      <span className="loader-logo">&lt; UCO /&gt;</span>
      <span className="loader-sub">Loading portfolio...</span>
    </div>
  );
}

export function CustomCursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  useEffect(()=>{
    const move = e=>{
      const x=e.clientX, y=e.clientY;
      if(dot.current)  Object.assign(dot.current.style,  {left:x+"px",top:y+"px"});
      if(ring.current) Object.assign(ring.current.style, {left:x+"px",top:y+"px"});
    };
    const over = e=>{
      const t=e.target.closest("a,button,.glass-card,.project-card,.repo-card-live,.blog-card,.pricing-card,.tool-card,.product-card");
      dot.current?.classList.toggle("hovering",!!t);
      ring.current?.classList.toggle("hovering",!!t);
    };
    window.addEventListener("mousemove",move);
    window.addEventListener("mouseover",over);
    return()=>{ window.removeEventListener("mousemove",move); window.removeEventListener("mouseover",over); };
  },[]);
  return (<><div ref={dot} className="cursor-dot"/><div ref={ring} className="cursor-ring"/></>);
}

export function WhatsAppFloat() {
  const phone = "2348113882005";
  const msg   = encodeURIComponent("Hi Uchenna! I saw your portfolio and I'd like to discuss a project with you.");
  const url   = `https://wa.me/${phone}?text=${msg}`;
  return (
    <div className="wa-float">
      <span className="wa-tooltip">Chat on WhatsApp</span>
      <a href={url} target="_blank" rel="noreferrer" className="wa-btn" aria-label="Chat on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}

export function Logo({ size = 36 }) { 
  return (
    <img 
      src="/logo.png" 
      alt="Donsparkdev" 
      style={{ height: size, width: 'auto' }}
    />
  );
}

export function AnimatedCounter({ target, suffix="" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting && !started.current){
        started.current = true;
        const duration = 1800, steps = 60, inc = target/steps;
        let current = 0;
        const timer = setInterval(()=>{
          current = Math.min(current+inc, target);
          setCount(Math.floor(current));
          if(current>=target) clearInterval(timer);
        }, duration/steps);
      }
    },{ threshold:.5 });
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export function Divider() {
  return <div style={{width:"100%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,200,255,.15),transparent)"}}/>;
}

export function SectionHeader({ tag, title, accent, desc }) {
  return (
    <div className="reveal" style={{textAlign:"center",marginBottom:64}}>
      <div style={{display:"inline-block",...S.mono,fontSize:".72rem",...S.neon,letterSpacing:3,textTransform:"uppercase",marginBottom:16,padding:"5px 14px",border:"1px solid rgba(0,200,255,.2)",borderRadius:100}}>{tag}</div>
      <h2 style={{...S.display,fontSize:"clamp(1.8rem,3.5vw,2.8rem)",fontWeight:800,letterSpacing:"-1px",lineHeight:1.1,marginBottom:16}}>
        {title} <span style={S.gradText}>{accent}</span>
      </h2>
      {desc && <p style={{...S.mid,maxWidth:520,margin:"0 auto",fontSize:"1rem"}}>{desc}</p>}
    </div>
  );
}

export function Mockup({ lines }) {
  const cm = {"c-green":"#00c88a","c-blue":"#00c8ff","c-purple":"#7b2fff","c-yellow":"#ffd700"};
  return (
    <div style={{width:"80%",maxWidth:280,background:"rgba(5,8,17,.9)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,padding:20,...S.mono,fontSize:".65rem",color:"#6b7a99",lineHeight:1.9,position:"relative",zIndex:1,boxShadow:"0 20px 60px rgba(0,0,0,.6)"}}>
      <div style={{display:"flex",gap:5,marginBottom:12}}>
        {["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:8,height:8,borderRadius:"50%",background:c,display:"block"}}/>)}
      </div>
      {lines.map((row,ri)=><div key={ri}>{row.map((seg,si)=><span key={si} style={{color:cm[seg.c]||"#6b7a99"}}>{seg.t}</span>)}</div>)}
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{padding:"40px 5%",borderTop:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
      <Logo size={28}/>
      <p style={{fontSize:".8rem",...S.dim}}>© {new Date().getFullYear()} Uchenna Chidera Onyesom · Built with 🖤 in Abuja, Nigeria</p>
      <a href="#" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="footer-back">Back to top ↑</a>
    </footer>
  );
}

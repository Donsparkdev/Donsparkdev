import { useState, useEffect, useRef } from "react";

const GITHUB_USERNAME = "Donsparkdev";
const GITHUB_API       = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_REPOS_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`;

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
  @keyframes codeFloat  { 0%{transform:translateY(100vh) rotate(-5deg);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-100px) rotate(5deg);opacity:0} }
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
  @keyframes cursorBlink  { 0%,100%{opacity:.8} 50%{opacity:0} }
  @keyframes loaderSpin   { to{transform:rotate(360deg)} }
  @keyframes countUp     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes blogIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes waPulse     { 0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.4)} 70%{box-shadow:0 0 0 12px rgba(37,211,102,0)} }
  @keyframes waWiggle    { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }

  /* WhatsApp float */
  .wa-float { position:fixed; bottom:28px; right:28px; z-index:9000; display:flex; flex-direction:column; align-items:flex-end; gap:10px; }
  .wa-btn { width:58px; height:58px; border-radius:50%; background:linear-gradient(135deg,#25d366,#128c7e); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(37,211,102,.4); animation:waPulse 2.5s ease-in-out infinite; transition:transform .2s; }
  .wa-btn:hover { transform:scale(1.1); }
  .wa-btn:hover svg { animation:waWiggle .4s ease; }
  .wa-tooltip { background:rgba(8,13,26,.95); border:1px solid rgba(37,211,102,.25); border-radius:10px; padding:8px 14px; font-family:'DM Mono',monospace; font-size:.7rem; color:#25d366; letter-spacing:.5px; white-space:nowrap; backdrop-filter:blur(12px); opacity:0; transform:translateX(8px); transition:all .25s; pointer-events:none; }
  .wa-float:hover .wa-tooltip { opacity:1; transform:translateX(0); }

  /* Hero counters */
  .hero-counters { display:flex; gap:32px; flex-wrap:wrap; padding:24px 0 0; border-top:1px solid rgba(255,255,255,.06); margin-top:8px; }
  .hero-counter-item { display:flex; flex-direction:column; gap:3px; }
  .hero-counter-num { font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800; background:linear-gradient(135deg,#00c8ff,#7b2fff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; }
  .hero-counter-label { font-family:'DM Mono',monospace; font-size:.65rem; color:#3a4a6a; letter-spacing:1.5px; text-transform:uppercase; }

  /* CV download btn */
  .btn-cv { display:inline-flex; align-items:center; gap:8px; padding:12px 24px; background:rgba(0,200,255,.06); border:1px solid rgba(0,200,255,.2); border-radius:8px; color:#00c8ff; font-family:'DM Mono',monospace; font-size:.78rem; letter-spacing:1px; cursor:pointer; transition:all .25s; text-decoration:none; }
  .btn-cv:hover { background:rgba(0,200,255,.14); transform:translateY(-2px); box-shadow:0 6px 24px rgba(0,200,255,.2); }
  @keyframes loaderFadeOut{ 0%{opacity:1} 100%{opacity:0} }
  @keyframes loaderIn     { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .loader-screen { position:fixed; inset:0; background:#050811; z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px; transition:opacity .7s ease,visibility .7s ease; }
  .loader-screen.hide { opacity:0; visibility:hidden; pointer-events:none; }
  .loader-ring { width:54px; height:54px; border-radius:50%; border:2px solid rgba(0,200,255,.1); border-top-color:#00c8ff; animation:loaderSpin .9s linear infinite; }
  .loader-logo { font-family:'DM Mono',monospace; font-size:1.1rem; background:linear-gradient(135deg,#00c8ff,#7b2fff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter:drop-shadow(0 0 10px rgba(0,200,255,.4)); animation:loaderIn .5s ease both; }
  .loader-sub  { font-family:'DM Mono',monospace; font-size:.65rem; color:#2a3550; letter-spacing:3px; text-transform:uppercase; animation:loaderIn .5s .25s ease both; }

  @media(pointer:fine){ body{cursor:none;} a,button,.glass-card,.project-card,.repo-card-live{cursor:none;} }
  .cursor-dot  { position:fixed; width:8px; height:8px; background:#00c8ff; border-radius:50%; pointer-events:none; z-index:99998; transform:translate(-50%,-50%); box-shadow:0 0 10px #00c8ff; transition:background .2s,transform .1s,box-shadow .2s; }
  .cursor-ring { position:fixed; width:36px; height:36px; border:1.5px solid rgba(0,200,255,.5); border-radius:50%; pointer-events:none; z-index:99997; transform:translate(-50%,-50%); transition:width .15s,height .15s,border-color .2s; }
  .cursor-dot.hovering  { transform:translate(-50%,-50%) scale(2.2); background:#7b2fff; box-shadow:0 0 16px #7b2fff; }
  .cursor-ring.hovering { width:54px; height:54px; border-color:rgba(123,47,255,.5); }

  .blog-card { border-radius:16px; background:rgba(8,13,26,.8); border:1px solid rgba(0,200,255,.1); overflow:hidden; transition:all .3s; text-decoration:none; color:#e8eaf6; display:flex; flex-direction:column; }
  .blog-card h3 { color:#e8eaf6 !important; -webkit-text-fill-color:#e8eaf6 !important; }
  .blog-card p  { color:#a0aec0 !important; -webkit-text-fill-color:#a0aec0 !important; }
  .blog-card span { -webkit-text-fill-color:inherit; }
  .blog-card:hover { transform:translateY(-6px); border-color:rgba(0,200,255,.3); box-shadow:0 20px 60px rgba(0,0,0,.4); }

  .pricing-card { border-radius:20px; padding:36px 32px; display:flex; flex-direction:column; gap:20px; position:relative; overflow:hidden; transition:all .3s; }
  .pricing-card.featured { background:linear-gradient(135deg,rgba(0,200,255,.08),rgba(123,47,255,.08)); border:1px solid rgba(0,200,255,.3)!important; transform:scale(1.03); }
  .pricing-card.featured:hover { transform:scale(1.03) translateY(-4px)!important; }
  .pricing-feat { display:flex; align-items:flex-start; gap:10px; font-size:.87rem; color:#a0aec0; line-height:1.5; }
  .pricing-feat::before { content:'✓'; color:#00c8ff; font-weight:700; flex-shrink:0; margin-top:1px; }

  .hero-content { animation:heroIn .9s cubic-bezier(.16,1,.3,1) both; }
  .badge-anim-1{animation:badgeIn .5s cubic-bezier(.16,1,.3,1) .3s both}
  .badge-anim-2{animation:badgeIn .5s cubic-bezier(.16,1,.3,1) .4s both}
  .badge-anim-3{animation:badgeIn .5s cubic-bezier(.16,1,.3,1) .5s both}
  .badge-anim-4{animation:badgeIn .5s cubic-bezier(.16,1,.3,1) .6s both}
  .badge-anim-5{animation:badgeIn .5s cubic-bezier(.16,1,.3,1) .7s both}
  .badge-anim-6{animation:badgeIn .5s cubic-bezier(.16,1,.3,1) .8s both}
  .scroll-anim  { animation:fadeIn 1s 1.5s both; }
  .logo-svg     { animation:logoGlow 3s ease-in-out infinite; }

  .reveal { opacity:0; transform:translateY(30px); transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-d1{transition-delay:.1s} .reveal-d2{transition-delay:.2s} .reveal-d3{transition-delay:.3s} .reveal-d4{transition-delay:.4s}

  .skill-bar-fill { transform:scaleX(0); transform-origin:left; transition:transform 1.2s cubic-bezier(.16,1,.3,1); }
  .skill-bar-fill.anim { transform:scaleX(1); }

  .nav-link-item { color:#a0aec0; text-decoration:none; font-size:.85rem; font-weight:500; letter-spacing:.5px; text-transform:uppercase; transition:color .3s; position:relative; }
  .nav-link-item::after { content:''; position:absolute; bottom:-4px; left:0; right:0; height:1px; background:#00c8ff; transform:scaleX(0); transition:transform .3s; transform-origin:left; }
  .nav-link-item:hover { color:#00c8ff; }
  .nav-link-item:hover::after { transform:scaleX(1); }
  .nav-cta-link { padding:8px 22px; border:1px solid #00c8ff; border-radius:6px; color:#00c8ff!important; font-size:.82rem!important; letter-spacing:.8px; transition:background .3s,box-shadow .3s!important; }
  .nav-cta-link:hover { background:rgba(0,200,255,.08); box-shadow:0 0 20px rgba(0,200,255,.2); }

  .glass-card { background:rgba(255,255,255,.035); border:1px solid rgba(0,200,255,.12); border-radius:16px; backdrop-filter:blur(12px); transition:transform .3s,border-color .3s,box-shadow .3s; }
  .glass-card:hover { transform:translateY(-4px); border-color:rgba(0,200,255,.25); box-shadow:0 0 30px rgba(0,200,255,.15); }

  .btn-primary  { display:inline-flex; align-items:center; gap:10px; padding:15px 34px; background:linear-gradient(135deg,#00c8ff,#7b2fff); border-radius:8px; color:#fff; font-weight:600; font-size:.95rem; text-decoration:none; border:none; cursor:pointer; transition:all .3s; letter-spacing:.3px; font-family:'Outfit',sans-serif; }
  .btn-primary:hover  { transform:translateY(-2px); box-shadow:0 8px 40px rgba(0,200,255,.35); }
  .btn-secondary{ display:inline-flex; align-items:center; gap:10px; padding:15px 34px; background:transparent; border-radius:8px; color:#e8eaf6; font-weight:600; font-size:.95rem; text-decoration:none; border:1px solid rgba(255,255,255,.12); cursor:pointer; transition:all .3s; letter-spacing:.3px; font-family:'Outfit',sans-serif; }
  .btn-secondary:hover{ border-color:rgba(0,200,255,.4); color:#00c8ff; transform:translateY(-2px); background:rgba(0,200,255,.04); }

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

  .form-input { padding:14px 16px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); border-radius:8px; color:#e8eaf6; font-family:'Outfit',sans-serif; font-size:.9rem; outline:none; transition:border-color .3s,box-shadow .3s; resize:vertical; width:100%; }
  .form-input:focus { border-color:rgba(0,200,255,.4); box-shadow:0 0 0 3px rgba(0,200,255,.06); }
  .form-input::placeholder { color:#6b7a99; }
  .form-submit { padding:16px; background:linear-gradient(135deg,#00c8ff,#7b2fff); border:none; border-radius:8px; color:#fff; font-weight:600; font-size:.95rem; cursor:pointer; transition:all .3s; font-family:'Outfit',sans-serif; letter-spacing:.3px; width:100%; }
  .form-submit:hover { transform:translateY(-2px); box-shadow:0 8px 40px rgba(0,200,255,.35); }

  .footer-back { font-family:'DM Mono',monospace; font-size:.75rem; color:#6b7a99; text-decoration:none; display:flex; align-items:center; gap:8px; transition:color .3s; }
  .footer-back:hover { color:#00c8ff; }

  .gh-skeleton { background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:6px; }

  /* Blog article reader */
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
  .article-body pre code .kw { color:#7b2fff; }
  .article-body pre code .fn { color:#00c8ff; }
  .article-body pre code .st { color:#00c88a; }
  .article-body pre code .cm { color:#3a4a6a; }
  .article-body pre code .nu { color:#ffd700; }
  .article-body blockquote { border-left:3px solid #00c8ff; padding:14px 20px; background:rgba(0,200,255,.04); border-radius:0 10px 10px 0; margin:24px 0; font-style:italic; color:#6b7a99; }
  .progress-bar { position:fixed; top:0; left:0; height:2px; background:linear-gradient(90deg,#00c8ff,#7b2fff); z-index:10001; transition:width .1s; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

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
    footer{justify-content:center!important;text-align:center}
  }
  @media(max-width:480px){
    .hero-cta{flex-direction:column}
    .btn-primary,.btn-secondary{justify-content:center}
    .about-stats{grid-template-columns:1fr 1fr!important}
  }
`;

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function GlobalStyles() {
  useEffect(() => {
    // Inject CSS
    const id = "pf-global";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    // SEO Meta tags
    const metas = [
      { name:"description",       content:"Uchenna Chidera Onyesom — Full Stack Developer from Abuja, Nigeria. Building scalable web apps with React, Node.js & MongoDB. Open for freelance & full-time roles." },
      { name:"keywords",          content:"Full Stack Developer Nigeria, React Developer Abuja, Node.js Developer, MongoDB, Web Developer Nigeria, API Development, Donspark, donsparkdev" },
      { name:"author",            content:"Uchenna Chidera Onyesom (Donsparkdev" },
      { property:"og:title",      content:"Uchenna Chidera Onyesom — Full Stack Developer" },
      { property:"og:description",content:"Building scalable, secure & modern web applications. React · Node.js · MongoDB · REST APIs. Based in Abuja, Nigeria." },
      { property:"og:url",        content:"https://donsparkdev.netlify.app" },
      { property:"og:type",       content:"website" },
      { property:"og:image",      content:`https://avatars.githubusercontent.com/${GITHUB_USERNAME}` },
      { name:"twitter:card",      content:"summary_large_image" },
      { name:"twitter:title",     content:"Uchenna Chidera Onyesom — Full Stack Developer" },
      { name:"twitter:description",content:"Building scalable web apps with React, Node.js & MongoDB. Based in Abuja, Nigeria." },
      { name:"twitter:image",     content:`https://avatars.githubusercontent.com/${GITHUB_USERNAME}` },
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
    // Page title
    document.title = "Uchenna Chidera Onyesom — Full Stack Developer | Abuja, Nigeria";
  }, []);
  return null;
}

function useReveal() {
  useEffect(() => {
    // Small delay so DOM is ready after state changes (e.g. blog expand)
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(".reveal:not(.visible)");
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
        }),
        { threshold: 0.05 }
      );
      els.forEach(el => obs.observe(el));
      // Also immediately mark elements already in viewport
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("visible");
        }
      });
    }, 50);
    return () => clearTimeout(timer);
  });
}

function useGitHub() {
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

const LANG_COLORS = { JavaScript:"#f7df1e",TypeScript:"#3178c6",Python:"#3572A5",HTML:"#e34c26",CSS:"#563d7c","C++":"#f34b7d",Java:"#b07219",Go:"#00ADD8",Rust:"#dea584",Shell:"#89e051",Vue:"#41b883",Svelte:"#ff3e00" };
const lc = lang => LANG_COLORS[lang] || "#8b949e";

const S = {
  gradText:{ background:"linear-gradient(135deg,#00c8ff,#7b2fff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" },
  mono:    { fontFamily:"'DM Mono',monospace" },
  display: { fontFamily:"'Syne',sans-serif" },
  neon:    { color:"#00c8ff" },
  dim:     { color:"#6b7a99" },
  mid:     { color:"#a0aec0" },
};


/* ══════════════════════════════════════════
   LOADER
══════════════════════════════════════════ */
function Loader({ done }) {
  return (
    <div className={`loader-screen${done?" hide":""}`}>
      <div className="loader-ring"/>
      <span className="loader-logo">&lt; UCO /&gt;</span>
      <span className="loader-sub">Loading portfolio...</span>
    </div>
  );
}

/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
function CustomCursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  useEffect(()=>{
    const move = e=>{
      const x=e.clientX, y=e.clientY;
      if(dot.current)  Object.assign(dot.current.style,  {left:x+"px",top:y+"px"});
      if(ring.current) Object.assign(ring.current.style, {left:x+"px",top:y+"px"});
    };
    const over = e=>{
      const t=e.target.closest("a,button,.glass-card,.project-card,.repo-card-live,.blog-card,.pricing-card");
      dot.current?.classList.toggle("hovering",!!t);
      ring.current?.classList.toggle("hovering",!!t);
    };
    window.addEventListener("mousemove",move);
    window.addEventListener("mouseover",over);
    return()=>{ window.removeEventListener("mousemove",move); window.removeEventListener("mouseover",over); };
  },[]);
  return (<><div ref={dot} className="cursor-dot"/><div ref={ring} className="cursor-ring"/></>);
}


/* ══════════════════════════════════════════
   WHATSAPP FLOAT BUTTON
══════════════════════════════════════════ */
function WhatsAppFloat() {
  const phone = "2348113882005"; // replace with your real number
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

/* ══════════════════════════════════════════
   CUSTOM CODE-THEMED LOGO
══════════════════════════════════════════ */
function Logo({ size = 36 }) {
  return (
    <svg className="logo-svg" width={size * 3} height={size} viewBox="0 0 108 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00c8ff"/>
          <stop offset="100%" stopColor="#7b2fff"/>
        </linearGradient>
        <linearGradient id="underlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#00c8ff" stopOpacity=".7"/>
          <stop offset="100%" stopColor="#7b2fff" stopOpacity=".7"/>
        </linearGradient>
        <filter id="logoGlowF" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Left angle bracket */}
      <text x="1"  y="26" fontFamily="'DM Mono',monospace" fontSize="20" fontWeight="500" fill="url(#logoGrad)" filter="url(#logoGlowF)">&lt;</text>
      {/* Monogram */}
      <text x="19" y="25" fontFamily="'Syne',sans-serif"   fontSize="16" fontWeight="800" fill="url(#logoGrad)" letterSpacing="-0.3" filter="url(#logoGlowF)">UCO</text>
      {/* Right slash-bracket */}
      <text x="65" y="26" fontFamily="'DM Mono',monospace" fontSize="20" fontWeight="500" fill="url(#logoGrad)" filter="url(#logoGlowF)">/&gt;</text>
      {/* Blinking cursor */}
      <rect x="95" y="11" width="3" height="15" rx="1" fill="#00c8ff" opacity=".85">
        <animate attributeName="opacity" values="0.85;0;0.85" dur="1.1s" repeatCount="indefinite"/>
      </rect>
      {/* Underline */}
      <rect x="19" y="29" width="46" height="1.5" rx="1" fill="url(#underlineGrad)"/>
    </svg>
  );
}


/* ══════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════ */
function AnimatedCounter({ target, suffix="" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting && !started.current){
        started.current = true;
        const duration = 1800;
        const steps    = 60;
        const inc      = target / steps;
        let current    = 0;
        const timer = setInterval(()=>{
          current = Math.min(current + inc, target);
          setCount(Math.floor(current));
          if(current >= target) clearInterval(timer);
        }, duration / steps);
      }
    },{ threshold:.5 });
    if(ref.current) obs.observe(ref.current);
    return()=>obs.disconnect();
  },[target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ══════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════ */
const TECH_BADGES = [
  {icon:"⚛️",label:"React"},{icon:"🟢",label:"Node.js"},{icon:"⚡",label:"Express"},
  {icon:"🍃",label:"MongoDB"},{icon:"🔀",label:"Git"},{icon:"🔗",label:"REST APIs"},
];
const SKILLS = [
  {icon:"⚛️",title:"Frontend Development",bg:"rgba(0,200,255,.1)",  tags:["React.js","HTML5","CSS3","JavaScript ES6+","Responsive Design","Tailwind CSS"]},
  {icon:"🟢",title:"Backend Development", bg:"rgba(123,47,255,.1)", tags:["Node.js","Express.js","REST APIs","Middleware","Server Architecture"]},
  {icon:"🍃",title:"Database & Storage",  bg:"rgba(0,200,80,.1)",   tags:["MongoDB","Mongoose ODM","Schema Design","File Uploads","Cloudinary"]},
  {icon:"🛠️",title:"Tools & Platforms",   bg:"rgba(255,165,0,.1)",  tags:["Git & GitHub","Postman","Termux","Render","VS Code","npm"]},
  {icon:"🔐",title:"Security & Concepts", bg:"rgba(255,45,120,.1)", tags:["JWT Auth","bcrypt","API Security","CORS","Rate Limiting","Multer"]},
];
const SKILL_BARS = [
  {name:"JavaScript",pct:90},{name:"React.js",pct:85},
  {name:"Node.js",pct:88},{name:"MongoDB",pct:82},{name:"REST APIs",pct:92},
];
const PROJECTS = [
  { label:"Full Stack · Security", title:"Full Stack Auth System",
    desc:"Complete JWT authentication — register, login, protected routes, password hashing, and token refresh. Production-ready.",
    stack:["Node.js","Express","MongoDB","JWT","bcrypt","React"],
    gradient:"linear-gradient(135deg,rgba(0,200,255,.1),rgba(123,47,255,.1))",
    liveUrl:"#", ghUrl:`https://github.com/${GITHUB_USERNAME}`,
    lines:[[{c:"c-green",t:"POST"},{c:"",t:" "},{c:"c-blue",t:"/api/auth/register"}],[{c:"c-purple",t:"→"},{c:"",t:" hash password (bcrypt)"}],[{c:"c-purple",t:"→"},{c:"",t:" save to MongoDB"}],[{c:"c-purple",t:"→"},{c:"",t:" sign JWT token"}],[{c:"c-green",t:"200"},{c:"",t:" "},{c:"c-yellow",t:"{ token, user }"}]]},
  { label:"API · File Management", title:"File Upload API System",
    desc:"Robust upload API — profile pictures, metadata, file type validation, size limits, Cloudinary integration.",
    stack:["Node.js","Express","Multer","Cloudinary","MongoDB"],
    gradient:"linear-gradient(135deg,rgba(123,47,255,.1),rgba(255,45,120,.1))",
    liveUrl:"#", ghUrl:`https://github.com/${GITHUB_USERNAME}`,
    lines:[[{c:"c-green",t:"POST"},{c:"",t:" "},{c:"c-blue",t:"/api/upload/avatar"}],[{c:"c-purple",t:"→"},{c:"",t:" multer.single('file')"}],[{c:"c-purple",t:"→"},{c:"",t:" validate type/size"}],[{c:"c-purple",t:"→"},{c:"",t:" upload Cloudinary"}],[{c:"c-green",t:"200"},{c:"",t:" "},{c:"c-yellow",t:"{ url, metadata }"}]]},
  { label:"Frontend · React", title:"Developer Portfolio",
    desc:"This site — React portfolio with dark theme, glassmorphism, smooth animations, and live GitHub data from the API.",
    stack:["React.js","CSS3","JavaScript","Vite"],
    gradient:"linear-gradient(135deg,rgba(0,200,80,.1),rgba(0,200,255,.1))",
    liveUrl:"#", ghUrl:`https://github.com/${GITHUB_USERNAME}`,
    lines:[[{c:"c-blue",t:"import"},{c:"",t:" { useState } "},{c:"c-blue",t:"from"},{c:"",t:" "},{c:"c-yellow",t:"'react'"}],[{c:"c-purple",t:"const"},{c:"",t:" Portfolio = () => {"}],[{c:"",t:"  "},{c:"c-purple",t:"return"},{c:"",t:" <"},{c:"c-green",t:"App"},{c:"",t:" />"}],[{c:"",t:"}"}],[{c:"c-purple",t:"export default"},{c:"",t:" Portfolio"}]]},
  { label:"Backend API · Deployed", title:"REST API on Render",
    desc:"Production-deployed backend — full CRUD, auth middleware, rate limiting, CORS config, and Postman documentation.",
    stack:["Node.js","Express","MongoDB Atlas","Render","Postman"],
    gradient:"linear-gradient(135deg,rgba(255,165,0,.1),rgba(123,47,255,.1))",
    liveUrl:"#", ghUrl:`https://github.com/${GITHUB_USERNAME}`,
    lines:[[{c:"c-blue",t:"GET"},{c:"",t:"    "},{c:"c-green",t:"/api/products"},{c:"c-yellow",t:" ✓"}],[{c:"c-blue",t:"POST"},{c:"",t:"   "},{c:"c-green",t:"/api/orders"},{c:"c-yellow",t:" ✓"}],[{c:"c-blue",t:"PATCH"},{c:"",t:"  "},{c:"c-green",t:"/api/users/:id"},{c:"c-yellow",t:" ✓"}],[{c:"c-blue",t:"DELETE"},{c:"",t:" "},{c:"c-green",t:"/api/items/:id"},{c:"c-yellow",t:" ✓"}],[{c:"c-purple",t:"Deployed → Render ✓"}]]},
];
const SERVICES = [
  {icon:"🖥️",title:"Full Stack Development",desc:"End-to-end web apps with seamless frontend-backend integration, database design, and deployment."},
  {icon:"🔗",title:"API Development",       desc:"Secure, scalable REST APIs with auth, file handling, validation, and full documentation."},
  {icon:"⚛️",title:"Frontend UI Dev",       desc:"Pixel-perfect, responsive React interfaces with modern UX and smooth animations."},
  {icon:"🗄️",title:"Backend Systems",       desc:"Robust Node.js + MongoDB backends with optimized queries, caching, and secure architecture."},
  {icon:"🎓",title:"Mentorship & Training", desc:"One-on-one coaching and YouTube tutorials to master full stack development fast."},
];
const TESTIMONIALS = [
  {text:"Uchenna built our entire backend from scratch — auth, API, database — in record time. Clean code, great communication, truly understood our requirements.",      name:"Emeka A.",   role:"Startup Founder, Lagos", avatar:"👨🏾‍💼",bg:"rgba(0,200,255,.1)"},
  {text:"His mentoring helped me land my first dev job in 3 months. Chidera breaks down complex concepts with patience and real-world examples that stick.",             name:"Fatima M.", role:"Junior Developer, Abuja", avatar:"👩🏽‍💻",bg:"rgba(123,47,255,.1)"},
  {text:"The file upload API handles thousands of requests flawlessly. Proper error handling, security, and documentation — exactly what a production system needs.",   name:"David K.",  role:"CTO, Tech Agency",        avatar:"👨🏻‍💻",bg:"rgba(255,45,120,.1)"},
];

/* ══════════════════════════════════════════
   SHARED UI
══════════════════════════════════════════ */
function Divider() {
  return <div style={{width:"100%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,200,255,.15),transparent)"}}/>;
}
function SectionHeader({ tag, title, accent, desc }) {
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
function Mockup({ lines }) {
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

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function Navbar({ scrolled, mobileOpen, setMobileOpen }) {
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"0 5%",height:70,display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(5,8,17,.97)":"rgba(5,8,17,.7)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,200,255,.1)",transition:"background .3s"}}>
      <Logo/>
      <ul className="nav-desktop" style={{display:"flex",gap:"2rem",listStyle:"none"}}>
        {["about","skills","projects","services","pricing","blog","github","contact"].map(id=>(
          <li key={id}><a href={`#${id}`} className={`nav-link-item${id==="contact"?" nav-cta-link":""}`}>{id[0].toUpperCase()+id.slice(1)}</a></li>
        ))}
      </ul>
      <div className="ham-btn" onClick={()=>setMobileOpen(!mobileOpen)} style={{cursor:"pointer",flexDirection:"column",gap:5,display:"none"}}>
        {[0,1,2].map(i=><span key={i} style={{display:"block",width:24,height:2,background:"#a0aec0",borderRadius:2}}/>)}
      </div>
      {mobileOpen&&(
        <div style={{position:"fixed",top:70,left:0,right:0,background:"rgba(5,8,17,.98)",padding:"24px 5%",display:"flex",flexDirection:"column",gap:20,borderBottom:"1px solid rgba(0,200,255,.1)",zIndex:999,backdropFilter:"blur(20px)"}}>
          {["about","skills","projects","services","pricing","blog","github","contact"].map(id=>(
            <a key={id} href={`#${id}`} className="nav-link-item" onClick={()=>setMobileOpen(false)}>{id[0].toUpperCase()+id.slice(1)}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero() {
  return (
    <section id="hero" style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"120px 5% 80px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,200,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,.04) 1px,transparent 1px)",backgroundSize:"50px 50px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)"}}/>
      {[{w:500,c:"rgba(0,200,255,.12)",t:"-100px",r:"-50px",d:"0s"},{w:400,c:"rgba(123,47,255,.15)",b:"-80px",l:"-80px",d:"-3s"},{w:300,c:"rgba(255,45,120,.08)",t:"40%",r:"30%",d:"-5s"}].map((o,i)=>(
        <div key={i} style={{position:"absolute",width:o.w,height:o.w,borderRadius:"50%",background:`radial-gradient(circle,${o.c},transparent 70%)`,filter:"blur(80px)",pointerEvents:"none",animation:`orbFloat 8s ease-in-out ${o.d} infinite`,top:o.t,right:o.r,bottom:o.b,left:o.l}}/>
      ))}
      {[{l:"8%",d:"18s",dl:"0s",code:"const auth = jwt.sign(payload, secret);"},{l:"75%",d:"22s",dl:"-8s",code:"db.collection('users').findOne({email})"},{l:"45%",d:"16s",dl:"-4s",code:"router.post('/api/upload', multer.single())"},{l:"20%",d:"20s",dl:"-12s",code:"app.use(cors({ origin: '*' }))"},{l:"60%",d:"24s",dl:"-6s",code:"useState(() => fetchData())"}].map((p,i)=>(
        <div key={i} style={{position:"absolute",left:p.l,...S.mono,fontSize:".7rem",color:"rgba(0,200,255,.15)",pointerEvents:"none",animation:`codeFloat ${p.d} ${p.dl} linear infinite`,whiteSpace:"nowrap"}}>{p.code}</div>
      ))}
      <div className="hero-content" style={{maxWidth:720,position:"relative",zIndex:2}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,...S.mono,fontSize:".78rem",...S.neon,letterSpacing:2,textTransform:"uppercase",marginBottom:24,padding:"8px 16px",background:"rgba(0,200,255,.06)",border:"1px solid rgba(0,200,255,.15)",borderRadius:100}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:"#00c8ff",boxShadow:"0 0 12px #00c8ff",animation:"pulse 2s ease-in-out infinite"}}/>
          Available for Projects
        </div>
        <h1 style={{...S.display,fontSize:"clamp(2.8rem,6vw,5rem)",fontWeight:800,lineHeight:1.05,letterSpacing:"-2px",marginBottom:10}}>
          <div style={{color:"#e8eaf6"}}>Full Stack</div>
          <div style={S.gradText}>Web Developer</div>
        </h1>
        <p style={{fontSize:"1.15rem",...S.mid,margin:"20px 0 36px",maxWidth:560,fontWeight:300,lineHeight:1.8}}>Building Scalable, Secure &amp; Modern Web Applications — from pixel-perfect frontends to bulletproof backend APIs.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:44}}>
          {TECH_BADGES.map((b,i)=>(
            <span key={i} className={`badge-anim-${i+1}`} style={{...S.mono,fontSize:".72rem",padding:"6px 14px",borderRadius:6,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"#6b7a99",cursor:"default",transition:"all .3s"}}
              onMouseEnter={e=>Object.assign(e.currentTarget.style,{background:"rgba(0,200,255,.08)",borderColor:"rgba(0,200,255,.3)",color:"#00c8ff",transform:"translateY(-2px)"})}
              onMouseLeave={e=>Object.assign(e.currentTarget.style,{background:"rgba(255,255,255,.04)",borderColor:"rgba(255,255,255,.08)",color:"#6b7a99",transform:""})}>
              {b.icon} {b.label}
            </span>
          ))}
        </div>
        <div className="hero-cta" style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          <a href="#projects" className="btn-primary">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            View Projects
          </a>
          <a href="#contact" className="btn-secondary">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><polyline points="16,3 12,7 8,3"/></svg>
            Hire Me
          </a>
          <a href="https://drive.google.com/uc?export=download&id=16dgO03jC0fxfFEkIGS1xx-b-uAOzVLPL" target="_blank" rel="noreferrer" className="btn-cv">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download CV
          </a>
        </div>
        <div className="hero-counters">
          {[{target:20,suffix:"+",label:"Projects Built"},{target:2,suffix:"+",label:"Years Coding"},{target:100,suffix:"%",label:"Client Satisfaction"},{target:15,suffix:"+",label:"Happy Clients"}].map((c,i)=>(
            <div key={i} className="hero-counter-item">
              <span className="hero-counter-num"><AnimatedCounter target={c.target} suffix={c.suffix}/></span>
              <span className="hero-counter-label">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-anim" style={{position:"absolute",bottom:40,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,...S.dim,fontSize:".72rem",letterSpacing:2,textTransform:"uppercase",...S.mono,zIndex:2}}>
        <span>scroll</span>
        <div style={{width:1,height:50,background:"linear-gradient(to bottom,#00c8ff,transparent)",animation:"scrollPuls 2s ease-in-out infinite"}}/>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   ABOUT
══════════════════════════════════════════ */
function About() {
  return (
    <section id="about" style={{padding:"100px 5%",background:"#080d1a"}}>
      <div className="about-grid" style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:60,alignItems:"center",maxWidth:1100,margin:"0 auto"}}>
        <div className="about-visual reveal" style={{display:"flex",justifyContent:"center"}}>
          <div style={{position:"relative",width:280,height:280}}>
            <div style={{width:"100%",height:"100%",borderRadius:24,border:"2px solid rgba(0,200,255,.2)",overflow:"hidden",position:"relative"}}>
              <img src={`https://avatars.githubusercontent.com/${GITHUB_USERNAME}`} alt="Uchenna Chidera Onyesom" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>{e.target.style.display="none";}}/>
            </div>
            {[{in:-20,dur:"20s",cw:true,dot:{top:0,left:"50%",transform:"translate(-50%,-50%)"},dc:"#00c8ff"},{in:-40,dur:"30s",cw:false,dot:{bottom:0,right:0,transform:"translate(50%,50%)"},dc:"#7b2fff",bc:"rgba(123,47,255,.1)"}].map((r,i)=>(
              <div key={i} style={{position:"absolute",borderRadius:"50%",border:`1px solid ${r.bc||"rgba(0,200,255,.15)"}`,inset:r.in,animation:`${r.cw?"ringCW":"ringCCW"} ${r.dur} linear infinite`}}>
                <div style={{position:"absolute",width:10,height:10,borderRadius:"50%",background:r.dc,boxShadow:`0 0 12px ${r.dc}`,animation:"pulseDot 2s infinite",...r.dot}}/>
              </div>
            ))}
            <div style={{position:"absolute",bottom:-16,right:-16,background:"#080d1a",border:"1px solid rgba(0,200,255,.12)",borderRadius:10,padding:"10px 16px",fontSize:".78rem",display:"flex",alignItems:"center",gap:8,backdropFilter:"blur(12px)",whiteSpace:"nowrap"}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"#00ff88",boxShadow:"0 0 10px #00ff88",animation:"pulseDot 2s infinite"}}/>
              Open to Work — Abuja, NG 🇳🇬
            </div>
          </div>
        </div>
        <div className="reveal reveal-d1">
          <div style={{display:"inline-block",...S.mono,fontSize:".72rem",...S.neon,letterSpacing:3,textTransform:"uppercase",marginBottom:12,padding:"5px 14px",border:"1px solid rgba(0,200,255,.2)",borderRadius:100}}>About Me</div>
          <h2 style={{...S.display,fontSize:"2rem",fontWeight:800,letterSpacing:"-.5px",marginBottom:4}}>Uchenna Chidera<br/>Onyesom</h2>
          <p style={{...S.neon,...S.mono,fontSize:".85rem",marginBottom:20,letterSpacing:1}}>$ full-stack-developer --location="Abuja, Nigeria"</p>
          <p className="about-loc" style={{...S.dim,fontSize:".85rem",display:"flex",alignItems:"center",gap:6,marginBottom:24}}>📍 Abuja, Nigeria &nbsp;·&nbsp; 🕐 WAT (UTC+1)</p>
          <p style={{...S.mid,lineHeight:1.9,marginBottom:28,fontSize:".97rem"}}>I'm a disciplined, self-driven full stack developer who builds complete, production-ready systems — from crafting modern React interfaces to engineering secure Node.js backends and REST APIs.<br/><br/>Beyond writing code, I share knowledge through YouTube tutorials and one-on-one mentoring, helping the next generation of Nigerian developers break into tech.</p>
          <div className="about-stats" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:32}}>
            {[["20+","Projects Built"],["2+","Years Coding"],["100%","Dedication"]].map(([n,l])=>(
              <div key={l} style={{background:"rgba(255,255,255,.035)",border:"1px solid rgba(0,200,255,.12)",borderRadius:12,padding:16,textAlign:"center"}}>
                <div style={{...S.display,fontSize:"1.6rem",fontWeight:800,...S.gradText}}>{n}</div>
                <div style={{fontSize:".72rem",...S.dim,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
            <a href="#contact" className="btn-primary" style={{width:"fit-content"}}>Let's Build Something →</a>
            <a href="https://drive.google.com/uc?export=download&id=16dgO03jC0fxfFEkIGS1xx-b-uAOzVLPL" target="_blank" rel="noreferrer" className="btn-cv">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SKILLS
══════════════════════════════════════════ */
function Skills() {
  const barsRef = useRef([]);
  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("anim");obs.unobserve(e.target);}}),{threshold:.5});
    barsRef.current.forEach(b=>b&&obs.observe(b));
    return()=>obs.disconnect();
  },[]);
  return (
    <section id="skills" style={{padding:"100px 5%"}}>
      <SectionHeader tag="Expertise" title="My" accent="Tech Stack" desc="A curated arsenal of tools and technologies I wield to build complete, high-performance systems."/>
      <div className="skills-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,maxWidth:1100,margin:"0 auto"}}>
        {SKILLS.map((s,i)=>(
          <div key={i} className={`glass-card reveal reveal-d${i%4+1}`} style={{padding:30}}>
            <div style={{width:50,height:50,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",marginBottom:20}}>{s.icon}</div>
            <div style={{...S.display,fontSize:"1rem",fontWeight:700,marginBottom:16}}>{s.title}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {s.tags.map(t=><span key={t} style={{...S.mono,fontSize:".7rem",padding:"4px 12px",borderRadius:5,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",...S.dim}}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{maxWidth:1100,margin:"48px auto 0"}}>
        {SKILL_BARS.map((b,i)=>(
          <div key={b.name} className={`reveal reveal-d${i%4+1}`} style={{display:"flex",alignItems:"center",gap:16,marginBottom:18}}>
            <span style={{...S.mono,fontSize:".78rem",...S.mid,width:120,flexShrink:0}}>{b.name}</span>
            <div style={{flex:1,height:4,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}>
              <div ref={el=>barsRef.current[i]=el} className="skill-bar-fill" style={{height:"100%",borderRadius:2,background:"linear-gradient(90deg,#00c8ff,#7b2fff)",width:`${b.pct}%`}}/>
            </div>
            <span style={{...S.mono,fontSize:".72rem",...S.neon,width:36,textAlign:"right"}}>{b.pct}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════ */
function Projects() {
  return (
    <section id="projects" style={{padding:"100px 5%",background:"#080d1a"}}>
      <SectionHeader tag="Portfolio" title="Featured" accent="Projects" desc="Real-world systems built with production-grade architecture, security, and scalability in mind."/>
      <div className="projects-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:28,maxWidth:1200,margin:"0 auto"}}>
        {PROJECTS.map((p,i)=>(
          <div key={i} className={`project-card reveal reveal-d${i%4+1}`}>
            <div style={{height:200,background:p.gradient,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}><Mockup lines={p.lines}/></div>
            <div style={{padding:24}}>
              <div style={{...S.mono,fontSize:".68rem",...S.neon,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{p.label}</div>
              <h3 style={{...S.display,fontSize:"1.1rem",fontWeight:700,marginBottom:10}}>{p.title}</h3>
              <p style={{...S.mid,fontSize:".88rem",lineHeight:1.7,marginBottom:20}}>{p.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
                {p.stack.map(s=><span key={s} style={{...S.mono,fontSize:".66rem",padding:"3px 10px",borderRadius:4,background:"rgba(0,200,255,.07)",border:"1px solid rgba(0,200,255,.15)",...S.neon}}>{s}</span>)}
              </div>
              <div style={{display:"flex",gap:12}}>
                <a href={p.liveUrl} className="proj-link-live">↗ Live Demo</a>
                <a href={p.ghUrl} target="_blank" rel="noreferrer" className="proj-link-gh">⌥ GitHub</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SERVICES
══════════════════════════════════════════ */
function Services() {
  return (
    <section id="services" style={{padding:"100px 5%"}}>
      <SectionHeader tag="What I Offer" title="My" accent="Services" desc="From idea to deployment — I handle the full product lifecycle with precision and professionalism."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20,maxWidth:1100,margin:"0 auto"}}>
        {SERVICES.map((s,i)=>(
          <div key={i} className={`glass-card reveal reveal-d${i%4+1}`} style={{padding:"32px 24px",textAlign:"center"}}>
            <span style={{fontSize:"2rem",marginBottom:16,display:"block"}}>{s.icon}</span>
            <div style={{...S.display,fontSize:".95rem",fontWeight:700,marginBottom:10}}>{s.title}</div>
            <p style={{fontSize:".82rem",...S.dim,lineHeight:1.7}}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════
   BLOG DATA — full articles
══════════════════════════════════════════ */
const BLOG_POSTS = [
  {
    id:1, tag:"Authentication", color:"rgba(0,200,255,.1)", border:"rgba(0,200,255,.2)",
    date:"Apr 2025", readTime:"5 min read",
    title:"How JWT Authentication Really Works",
    desc:"A deep dive into JSON Web Tokens — how to sign, verify, and secure your Node.js APIs with access and refresh token patterns.",
    content:[
      {type:"p", text:"If you've built any kind of API, you've heard of JWT. But most tutorials skip the 'why' and jump straight to the code. In this article, we're going to fix that — you'll understand exactly what a JWT is, how it protects your routes, and how to implement a proper access + refresh token system in Node.js."},
      {type:"h2",text:"What Is a JWT?"},
      {type:"p", text:"JWT stands for JSON Web Token. It's a compact, URL-safe string that encodes a payload of data and signs it with a secret key. The result looks like this:"},
      {type:"code",text:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDNhYmMiLCJpYXQiOjE2ODB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"},
      {type:"p", text:"It has 3 parts separated by dots: the Header (algorithm used), the Payload (your data), and the Signature (proof it hasn't been tampered with). The key insight: the server doesn't store the token. It just verifies the signature every time."},
      {type:"h2",text:"Why Use JWT Over Sessions?"},
      {type:"p", text:"Traditional sessions store user data server-side and give the client a session ID cookie. This works, but it means your server needs to maintain state — a problem when you scale horizontally across multiple servers."},
      {type:"p", text:"JWTs are stateless. The token itself contains the user info. Any server that knows the secret key can verify it. This makes JWTs perfect for REST APIs and microservices."},
      {type:"h2",text:"Implementing JWT in Node.js"},
      {type:"p", text:"First, install the library:"},
      {type:"code",text:"npm install jsonwebtoken bcryptjs"},
      {type:"p", text:"Here's a clean login route:"},
      {type:"code",text:"const jwt = require('jsonwebtoken');\nconst bcrypt = require('bcryptjs');\n\n// POST /api/auth/login\nrouter.post('/login', async (req, res) => {\n  const { email, password } = req.body;\n\n  // 1. Find user\n  const user = await User.findOne({ email });\n  if (!user) return res.status(401).json({ error: 'Invalid credentials' });\n\n  // 2. Verify password\n  const valid = await bcrypt.compare(password, user.password);\n  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });\n\n  // 3. Sign token\n  const token = jwt.sign(\n    { userId: user._id, email: user.email },\n    process.env.JWT_SECRET,\n    { expiresIn: '15m' }\n  );\n\n  res.json({ token });\n});"},
      {type:"h2",text:"The Access + Refresh Token Pattern"},
      {type:"p", text:"Short-lived access tokens (15 min) + long-lived refresh tokens (7 days) is the gold standard. When the access token expires, the client uses the refresh token to get a new one — silently, without logging the user out."},
      {type:"blockquote",text:"Never store sensitive data in the JWT payload. It's encoded, not encrypted. Anyone can decode it. Keep it to userId and role only."},
      {type:"h2",text:"Protecting Routes with Middleware"},
      {type:"code",text:"function authMiddleware(req, res, next) {\n  const auth = req.headers.authorization;\n  if (!auth?.startsWith('Bearer '))\n    return res.status(401).json({ error: 'No token' });\n\n  try {\n    const token = auth.split(' ')[1];\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch {\n    res.status(401).json({ error: 'Invalid token' });\n  }\n}\n\n// Usage\nrouter.get('/profile', authMiddleware, (req, res) => {\n  res.json({ userId: req.user.userId });\n});"},
      {type:"p", text:"And that's it — a clean, secure JWT authentication system. Store your JWT_SECRET in .env, never hardcode it, and always use HTTPS in production."},
    ]
  },
  {
    id:2, tag:"File Uploads", color:"rgba(123,47,255,.1)", border:"rgba(123,47,255,.2)",
    date:"Mar 2025", readTime:"7 min read",
    title:"Building a File Upload API with Multer & Cloudinary",
    desc:"Step-by-step guide to accepting, validating and storing file uploads in a Node.js/Express backend with Cloudinary integration.",
    content:[
      {type:"p", text:"File uploads are one of those features that sound simple but hide a dozen edge cases. Wrong file type? File too large? What happens if Cloudinary is down? In this guide we'll build a bulletproof upload API from scratch."},
      {type:"h2",text:"Setting Up Multer"},
      {type:"p", text:"Multer is the standard Node.js middleware for handling multipart/form-data. Install it alongside the Cloudinary SDK:"},
      {type:"code",text:"npm install multer cloudinary multer-storage-cloudinary"},
      {type:"h2",text:"Configuring Cloudinary Storage"},
      {type:"code",text:"const cloudinary = require('cloudinary').v2;\nconst { CloudinaryStorage } = require('multer-storage-cloudinary');\n\ncloudinary.config({\n  cloud_name: process.env.CLOUD_NAME,\n  api_key:    process.env.CLOUD_KEY,\n  api_secret: process.env.CLOUD_SECRET,\n});\n\nconst storage = new CloudinaryStorage({\n  cloudinary,\n  params: {\n    folder: 'avatars',\n    allowed_formats: ['jpg','jpeg','png','webp'],\n    transformation: [{ width:400, height:400, crop:'fill' }],\n  },\n});\n\nconst upload = multer({\n  storage,\n  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB\n  fileFilter: (req, file, cb) => {\n    const allowed = ['image/jpeg','image/png','image/webp'];\n    if (allowed.includes(file.mimetype)) cb(null, true);\n    else cb(new Error('Only images allowed'), false);\n  },\n});"},
      {type:"h2",text:"The Upload Route"},
      {type:"code",text:"router.post('/upload/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {\n  try {\n    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });\n\n    // Save URL to user profile\n    await User.findByIdAndUpdate(req.user.userId, {\n      avatar: req.file.path,\n      avatarPublicId: req.file.filename,\n    });\n\n    res.json({\n      success: true,\n      url: req.file.path,\n      message: 'Avatar updated successfully',\n    });\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n});"},
      {type:"h2",text:"Deleting Old Images"},
      {type:"p", text:"Always delete the old Cloudinary image before uploading a new one — otherwise you'll accumulate storage costs:"},
      {type:"code",text:"if (user.avatarPublicId) {\n  await cloudinary.uploader.destroy(user.avatarPublicId);\n}"},
      {type:"blockquote",text:"Tip: Always validate on both frontend AND backend. Never trust client-side validation alone."},
      {type:"p", text:"With this setup you get automatic image resizing, format conversion, CDN delivery, and all file management handled by Cloudinary — your server just orchestrates the process."},
    ]
  },
  {
    id:3, tag:"React", color:"rgba(0,200,80,.1)", border:"rgba(0,200,80,.2)",
    date:"Mar 2025", readTime:"6 min read",
    title:"5 React Patterns Every Developer Should Know",
    desc:"From compound components to custom hooks — practical React patterns that make your components cleaner, reusable, and maintainable.",
    content:[
      {type:"p", text:"React gives you the freedom to structure your code however you want. That freedom is also a trap. After working on multiple projects, I've settled on 5 patterns that consistently produce cleaner, more maintainable code."},
      {type:"h2",text:"1. Custom Hooks for Logic Separation"},
      {type:"p", text:"The single best thing you can do for your components is move logic into custom hooks. Your component should only care about rendering."},
      {type:"code",text:"// Before — logic mixed with UI\nfunction UserProfile() {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  useEffect(() => {\n    fetch('/api/user').then(r => r.json()).then(setUser).finally(() => setLoading(false));\n  }, []);\n  // ... 50 more lines of render\n}\n\n// After — clean separation\nfunction useUser() {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  useEffect(() => {\n    fetch('/api/user').then(r => r.json()).then(setUser).finally(() => setLoading(false));\n  }, []);\n  return { user, loading };\n}\n\nfunction UserProfile() {\n  const { user, loading } = useUser();\n  if (loading) return <Spinner />;\n  return <div>{user.name}</div>;\n}"},
      {type:"h2",text:"2. Compound Components"},
      {type:"p", text:"Compound components let you build flexible, expressive APIs for complex UI components — like a custom Select or Modal that feels native."},
      {type:"h2",text:"3. Render Props for Shared Behavior"},
      {type:"p", text:"When you need to share stateful behavior between components without forcing a specific UI, render props (or the modern hook equivalent) are your friend."},
      {type:"h2",text:"4. Component Composition Over Props Drilling"},
      {type:"p", text:"Before you reach for Context or Redux, try composition. Pass components as children or props instead of drilling data five levels deep."},
      {type:"code",text:"// Instead of prop drilling\n<Layout user={user} theme={theme} onLogout={handleLogout}>\n  <Dashboard user={user} />\n</Layout>\n\n// Use composition\n<Layout>\n  <Layout.Header>\n    <UserMenu user={user} onLogout={handleLogout} />\n  </Layout.Header>\n  <Dashboard user={user} />\n</Layout>"},
      {type:"h2",text:"5. Lazy Loading with Suspense"},
      {type:"code",text:"const BlogPost = React.lazy(() => import('./BlogPost'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <BlogPost />\n    </Suspense>\n  );\n}"},
      {type:"p", text:"These 5 patterns alone will make your React code dramatically easier to read, test, and scale. Pick one and apply it to your next component."},
    ]
  },
  {
    id:4, tag:"MongoDB", color:"rgba(255,165,0,.1)", border:"rgba(255,165,0,.2)",
    date:"Feb 2025", readTime:"8 min read",
    title:"MongoDB Schema Design for Beginners",
    desc:"How to design MongoDB schemas that scale — embedding vs referencing, indexing strategies, and real-world examples with Mongoose.",
    content:[
      {type:"p", text:"The most common mistake new MongoDB developers make is treating it like a relational database — normalizing everything into separate collections and joining them with populate(). Sometimes that's right. Often it's not. Let's break it down."},
      {type:"h2",text:"Embedding vs Referencing"},
      {type:"p", text:"The core decision in MongoDB schema design is: should I embed this data inside the document, or store it in a separate collection and reference it?"},
      {type:"p", text:"Embed when: the data is always accessed together, the embedded data is small, and it won't grow unboundedly. Reference when: the data is large, shared across many documents, or updated frequently on its own."},
      {type:"code",text:"// Embedding — good for small, stable data\nconst userSchema = new Schema({\n  name: String,\n  email: String,\n  address: {          // embedded\n    street: String,\n    city: String,\n    country: String,\n  },\n});\n\n// Referencing — good for large or shared data\nconst postSchema = new Schema({\n  title: String,\n  content: String,\n  author: { type: Schema.Types.ObjectId, ref: 'User' }, // referenced\n  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],\n});"},
      {type:"h2",text:"Indexing for Performance"},
      {type:"p", text:"Without indexes, MongoDB scans every document in a collection for every query. That's fine at 100 documents. At 100,000 it's a disaster."},
      {type:"code",text:"// Always index fields you query frequently\nuserSchema.index({ email: 1 }, { unique: true });\npostSchema.index({ author: 1, createdAt: -1 }); // compound index\npostSchema.index({ title: 'text', content: 'text' }); // full-text search"},
      {type:"h2",text:"Real-World Example: Blog Platform"},
      {type:"code",text:"const postSchema = new Schema({\n  title:     { type: String, required: true, maxlength: 100 },\n  slug:      { type: String, unique: true },\n  content:   { type: String, required: true },\n  author:    { type: ObjectId, ref: 'User', required: true },\n  tags:      [String],\n  views:     { type: Number, default: 0 },\n  published: { type: Boolean, default: false },\n  createdAt: { type: Date, default: Date.now },\n}, { timestamps: true });\n\n// Auto-generate slug before saving\npostSchema.pre('save', function(next) {\n  if (this.isModified('title')) {\n    this.slug = this.title.toLowerCase().replace(/\s+/g, '-');\n  }\n  next();\n});"},
      {type:"blockquote",text:"Design your schema around your queries, not your data. Ask: how will this data be read? That determines how it should be stored."},
      {type:"p", text:"Good schema design is the difference between a MongoDB app that flies and one that crawls. Get the fundamentals right early and scaling becomes a non-issue."},
    ]
  },
  {
    id:5, tag:"Node.js", color:"rgba(255,45,120,.1)", border:"rgba(255,45,120,.2)",
    date:"Jan 2025", readTime:"9 min read",
    title:"Building REST APIs with Express — Best Practices",
    desc:"Error handling, validation, rate limiting, CORS, and project structure — everything you need to ship production-grade APIs.",
    content:[
      {type:"p", text:"Anyone can get an Express server running in 10 minutes. Shipping a production-grade API is a different story. Here are the practices that separate hobby projects from professional backends."},
      {type:"h2",text:"Project Structure That Scales"},
      {type:"code",text:"src/\n├── controllers/     # request handlers\n├── middleware/      # auth, validation, errors\n├── models/          # Mongoose schemas\n├── routes/          # Express routers\n├── services/        # business logic\n├── utils/           # helpers\n├── config/          # env, db connection\n└── app.js           # Express setup"},
      {type:"h2",text:"Centralised Error Handling"},
      {type:"p", text:"Never handle errors in individual route handlers. Create one error middleware that catches everything:"},
      {type:"code",text:"// middleware/errorHandler.js\nfunction errorHandler(err, req, res, next) {\n  const status = err.statusCode || 500;\n  const message = err.message || 'Internal server error';\n\n  console.error(`[${new Date().toISOString()}] ${status}: ${message}`);\n\n  res.status(status).json({\n    success: false,\n    error: message,\n    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),\n  });\n}\n\n// In app.js — must be last\napp.use(errorHandler);"},
      {type:"h2",text:"Input Validation with express-validator"},
      {type:"code",text:"const { body, validationResult } = require('express-validator');\n\nconst registerRules = [\n  body('email').isEmail().normalizeEmail(),\n  body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/),\n  body('name').trim().isLength({ min: 2, max: 50 }),\n];\n\nrouter.post('/register', registerRules, (req, res) => {\n  const errors = validationResult(req);\n  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });\n  // proceed with valid data\n});"},
      {type:"h2",text:"Rate Limiting"},
      {type:"code",text:"const rateLimit = require('express-rate-limit');\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100,\n  message: { error: 'Too many requests, slow down.' },\n});\n\nconst authLimiter = rateLimit({\n  windowMs: 60 * 60 * 1000, // 1 hour\n  max: 5, // only 5 login attempts\n});\n\napp.use('/api', limiter);\napp.use('/api/auth/login', authLimiter);"},
      {type:"h2",text:"CORS Configuration"},
      {type:"code",text:"const cors = require('cors');\n\napp.use(cors({\n  origin: process.env.CLIENT_URL || 'http://localhost:3000',\n  methods: ['GET','POST','PUT','PATCH','DELETE'],\n  allowedHeaders: ['Content-Type','Authorization'],\n  credentials: true,\n}));"},
      {type:"blockquote",text:"Security is not optional. Rate limiting, input validation, and proper error handling should be in every API you ship — no exceptions."},
    ]
  },
  {
    id:6, tag:"Career", color:"rgba(0,200,255,.1)", border:"rgba(0,200,255,.2)",
    date:"Dec 2024", readTime:"10 min read",
    title:"From Zero to Full Stack Developer in Nigeria",
    desc:"My honest journey learning web development in Abuja — the resources, struggles, and breakthroughs that made the difference.",
    content:[
      {type:"p", text:"I'm writing this for the developer in Abuja, Lagos, Port Harcourt — anywhere in Nigeria — who is staring at a screen, wondering if this tech thing is actually possible for them. Not as a theoretical question, but as the real, daily doubt that hits at 2am when a bug won't resolve and the NEPA has taken light. It's possible. Here's my honest account."},
      {type:"h2",text:"Starting With Nothing But a Phone"},
      {type:"p", text:"I didn't start with a laptop. I started with an Android phone, Termux, and a stubborn refusal to accept that was a limitation. The constraints forced creativity — I had to understand what I was doing because there was no GUI to hide behind. Every installation was manual. Every error was educational."},
      {type:"blockquote",text:"The tools don't make the developer. The discipline does. I've seen people with MacBooks produce nothing. I built production APIs on a phone."},
      {type:"h2",text:"The Learning Stack That Worked"},
      {type:"p", text:"I tried everything. Bootcamps, YouTube courses, documentation deep-dives. Here's what actually stuck:"},
      {type:"ul",items:["The Odin Project for HTML/CSS/JavaScript fundamentals — free and brutal in the best way","JavaScript.info for truly understanding the language, not just copying code","The official React docs (the new beta ones) for React","Fireship on YouTube for quick, dense, no-fluff technical concepts","Building real projects immediately — not toy apps, actual things with real APIs"]},
      {type:"h2",text:"The Moment Everything Clicked"},
      {type:"p", text:"It wasn't one moment — it was when I shipped my first JWT authentication system and a real user logged in with it. Not localhost. A deployed URL. A real person. That's when the abstract became concrete and I understood: I could build things people actually use."},
      {type:"h2",text:"What Nigerian Developers Need to Hear"},
      {type:"p", text:"The market is global. Your client doesn't care that you're in Abuja if your code is clean and you communicate well. I've spoken to developers in the US who charge $100/hr for work I can match. The gap is confidence and portfolio, not skill."},
      {type:"ul",items:["Build publicly. GitHub is your CV before your CV.","Write about what you learn. It compounds your understanding AND your visibility.","Price in USD, even for local clients. Your work has international market value.","The Nigerian developer community is growing fast — find your people online.","Consistency over intensity. 2 hours daily beats 14 hours on weekends."]},
      {type:"h2",text:"Where I Am Now"},
      {type:"p", text:"I build full stack applications, teach other developers through YouTube and one-on-one mentoring, and actively pursue international clients. The phone in Termux is still part of my setup. The mindset that started there — resourceful, disciplined, relentless — that's what actually got me here."},
      {type:"blockquote",text:"You don't need better tools. You need to ship something real today, then tomorrow, then the day after. The compound interest on consistent work is extraordinary."},
    ]
  },
];

/* ══════════════════════════════════════════
   ARTICLE READER
══════════════════════════════════════════ */
function ArticleReader({ post, onClose }) {
  const [progress, setProgress] = useState(0);
  const contentRef = useRef(null);

  useEffect(()=>{
    document.body.style.overflow = "hidden";
    const el = document.querySelector(".article-overlay");
    const onScroll = ()=>{
      if(!el) return;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setProgress(Math.min(pct,100));
    };
    el?.addEventListener("scroll", onScroll);
    return ()=>{ document.body.style.overflow=""; el?.removeEventListener("scroll",onScroll); };
  },[]);

  function renderBlock(block, i) {
    if(block.type==="h2")        return <h2 key={i}>{block.text}</h2>;
    if(block.type==="h3")        return <h3 key={i}>{block.text}</h3>;
    if(block.type==="p")         return <p key={i}>{block.text}</p>;
    if(block.type==="blockquote")return <blockquote key={i}>{block.text}</blockquote>;
    if(block.type==="ul")        return <ul key={i}>{block.items.map((it,j)=><li key={j}>{it}</li>)}</ul>;
    if(block.type==="ol")        return <ol key={i}>{block.items.map((it,j)=><li key={j}>{it}</li>)}</ol>;
    if(block.type==="code")      return (
      <pre key={i}><code>{block.text}</code></pre>
    );
    return null;
  }

  return (
    <div className="article-overlay">
      <div className="progress-bar" style={{width:`${progress}%`}}/>

      {/* Nav */}
      <div style={{position:"sticky",top:0,zIndex:10,background:"rgba(5,8,17,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,200,255,.1)",padding:"16px 5%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={onClose} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:"#a0aec0",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:".78rem",letterSpacing:1}} className="btn-back-link">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Blog
        </button>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#3a4a6a",letterSpacing:2,textTransform:"uppercase"}}>{post.readTime}</span>
      </div>

      {/* Content */}
      <div style={{maxWidth:720,margin:"0 auto",padding:"52px 5% 100px"}}>
        {/* Tag + meta */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",padding:"5px 14px",borderRadius:100,background:post.color,border:`1px solid ${post.border}`,color:"#00c8ff",letterSpacing:2,textTransform:"uppercase"}}>{post.tag}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:".7rem",color:"#3a4a6a"}}>{post.date}</span>
        </div>

        {/* Title */}
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,5vw,2.8rem)",fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.1,marginBottom:24,background:"linear-gradient(135deg,#e8eaf6,#a0aec0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{post.title}</h1>

        {/* Author */}
        <div style={{display:"flex",alignItems:"center",gap:14,paddingBottom:32,marginBottom:40,borderBottom:"1px solid rgba(255,255,255,.05)"}}>
          <img src={`https://avatars.githubusercontent.com/${GITHUB_USERNAME}`} alt="author" style={{width:44,height:44,borderRadius:"50%",border:"2px solid rgba(0,200,255,.2)",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:".9rem",color:"#c8d0e0"}}>Uchenna Chidera Onyesom</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#3a4a6a",marginTop:2}}>Full Stack Developer · @Donspark23</div>
          </div>
        </div>

        {/* Body */}
        <div className="article-body" ref={contentRef}>
          {post.content.map((block,i)=>renderBlock(block,i))}
        </div>

        {/* Footer */}
        <div style={{marginTop:64,paddingTop:32,borderTop:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
          <button onClick={onClose} className="btn-secondary" style={{padding:"12px 24px",fontSize:".85rem"}}>← Back to Blog</button>
          <a href="#contact" onClick={onClose} className="btn-primary" style={{padding:"12px 24px",fontSize:".85rem"}}>Work With Me →</a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   BLOG SECTION
══════════════════════════════════════════ */
function Blog() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive]     = useState(null);
  const visible = expanded ? BLOG_POSTS : BLOG_POSTS.slice(0,3);

  return (
    <>
      {active && <ArticleReader post={active} onClose={()=>setActive(null)}/>}
      <section id="blog" style={{padding:"100px 5%",background:"#080d1a",color:"#e8eaf6"}}>
        <SectionHeader tag="Articles" title="Dev" accent="Blog" desc="Practical guides, tutorials and insights from real-world full stack development experience."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24,maxWidth:1100,margin:"0 auto"}}>
          {visible.map((p,i)=>(
            <div key={p.id} onClick={()=>setActive(p)} className="blog-card" style={{cursor:"pointer",opacity:1,transform:"translateY(0)",animation:`blogIn .4s ease ${i*0.08}s both`}}>
              <div style={{padding:"18px 24px 14px",background:p.color,borderBottom:`1px solid ${p.border}`}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:".66rem",color:"#00c8ff",WebkitTextFillColor:"#00c8ff",letterSpacing:2,textTransform:"uppercase"}}>{p.tag}</span>
              </div>
              <div style={{padding:24,display:"flex",flexDirection:"column",gap:12,flex:1,background:"rgba(8,13,26,.85)"}}>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:700,lineHeight:1.4,color:"#e8eaf6 !important"}}>{p.title}</h3>
                <p style={{color:"#a0aec0",fontSize:".85rem",lineHeight:1.7,flex:1,WebkitTextFillColor:"#a0aec0"}}>{p.desc}</p>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,borderTop:"1px solid rgba(255,255,255,.05)"}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#6b7a99",WebkitTextFillColor:"#6b7a99"}}>{p.date}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#00c8ff",WebkitTextFillColor:"#00c8ff",display:"flex",alignItems:"center",gap:6}}>
                    {p.readTime}
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal" style={{textAlign:"center",marginTop:40}}>
          <button onClick={()=>setExpanded(e=>!e)} className="btn-secondary" style={{color:"#e8eaf6",WebkitTextFillColor:"#e8eaf6"}}>
            {expanded?"Show Less ↑":"View All Articles →"}
          </button>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════
   PRICING SECTION
══════════════════════════════════════════ */
/* ══════════════════════════════════════════
   PRICING SECTION
══════════════════════════════════════════ */
const PLANS = [
  {
    name:"Starter", price:"₦80,000", usd:"~$50", badge:null,
    desc:"Perfect for small businesses needing a clean online presence.",
    features:["Landing page (up to 5 sections)","Responsive mobile design","Contact form integration","Basic SEO setup","1 round of revisions","Delivery in 5–7 days"],
    cta:"Get Started", ctaStyle:"btn-secondary",
  },
  {
    name:"Professional", price:"₦200,000", usd:"~$130", badge:"Most Popular",
    desc:"Full stack web application for serious businesses and startups.",
    features:["Full stack web app (React + Node.js)","User authentication (JWT)","MongoDB database setup","REST API development","Admin dashboard","3 rounds of revisions","Deployment on Render/Netlify","Delivery in 2–3 weeks"],
    cta:"Hire Me Now", ctaStyle:"btn-primary",
  },
  {
    name:"Enterprise", price:"Custom", usd:"Let's talk", badge:null,
    desc:"Complex systems, teams, and long-term partnerships.",
    features:["Custom full stack architecture","File upload & storage systems","Third-party API integrations","Performance optimization","Ongoing maintenance","Priority support","NDA available","Timeline based on scope"],
    cta:"Book a Call", ctaStyle:"btn-secondary",
  },
];

function Pricing() {
  return (
    <section id="pricing" style={{padding:"100px 5%"}}>
      <SectionHeader tag="Hire Me" title="Transparent" accent="Pricing" desc="No hidden fees. No surprises. Just clean code delivered on time."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,maxWidth:1100,margin:"0 auto",alignItems:"start"}}>
        {PLANS.map((p,i)=>(
          <div key={i} className={`glass-card pricing-card reveal reveal-d${i+1}${p.badge?" featured":""}`}>
            {p.badge && (
              <div style={{position:"absolute",top:20,right:20,...S.mono,fontSize:".62rem",padding:"4px 12px",borderRadius:100,background:"linear-gradient(135deg,#00c8ff,#7b2fff)",color:"#fff",letterSpacing:1}}>{p.badge}</div>
            )}
            <div>
              <div style={{...S.mono,fontSize:".72rem",...S.dim,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{p.name}</div>
              <div style={{...S.display,fontSize:"2rem",fontWeight:800,...S.gradText,lineHeight:1}}>{p.price}</div>
              <div style={{...S.mono,fontSize:".72rem",...S.dim,marginTop:4}}>{p.usd}</div>
            </div>
            <p style={{...S.mid,fontSize:".87rem",lineHeight:1.7,paddingBottom:20,borderBottom:"1px solid rgba(255,255,255,.05)"}}>{p.desc}</p>
            <div style={{display:"flex",flexDirection:"column",gap:12,flex:1}}>
              {p.features.map((f,j)=><div key={j} className="pricing-feat">{f}</div>)}
            </div>
            <a href="#contact" className={p.ctaStyle} style={{textAlign:"center",justifyContent:"center",marginTop:8}}>{p.cta} →</a>
          </div>
        ))}
      </div>
      <div className="reveal" style={{textAlign:"center",marginTop:48,padding:"24px 32px",background:"rgba(0,200,255,.04)",border:"1px solid rgba(0,200,255,.1)",borderRadius:16,maxWidth:600,margin:"48px auto 0"}}>
        <p style={{...S.mid,fontSize:".92rem",lineHeight:1.8}}>
          🇳🇬 <strong style={{color:"#e8eaf6"}}>Based in Nigeria, working globally.</strong><br/>
          All prices negotiable for long-term contracts. International payments accepted via <strong style={{color:"#e8eaf6"}}>Payoneer, Wise & Crypto</strong>.
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   GITHUB — LIVE API DATA
══════════════════════════════════════════ */
function GitHubSection() {
  const { profile, repos, loading, error } = useGitHub();

  const langMap = {};
  repos.forEach(r=>{ if(r.language) langMap[r.language]=(langMap[r.language]||0)+1; });
  const total = Object.values(langMap).reduce((a,b)=>a+b,0)||1;
  const langs = Object.entries(langMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const stats = [
    {label:"Public Repos", val:loading?"…":error?"—":(profile?.public_repos??"—")},
    {label:"Followers",    val:loading?"…":error?"—":(profile?.followers??"—")},
    {label:"Following",    val:loading?"…":error?"—":(profile?.following??"—")},
    {label:"Member Since", val:loading?"…":error?"—":(profile?.created_at?new Date(profile.created_at).getFullYear():"—")},
  ];

  return (
    <section id="github" style={{padding:"100px 5%",background:"#080d1a"}}>
      <SectionHeader tag="Open Source" title="GitHub" accent="Activity" desc={`Live data fetched directly from @${GITHUB_USERNAME} via the GitHub REST API.`}/>
      <div style={{maxWidth:1100,margin:"0 auto"}}>

        {/* Profile card */}
        {!loading && !error && profile && (
          <div className="glass-card reveal" style={{padding:28,marginBottom:36,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
            <img src={profile.avatar_url} alt="avatar" style={{width:72,height:72,borderRadius:"50%",border:"2px solid rgba(0,200,255,.3)",flexShrink:0}} onError={e=>e.target.style.display="none"}/>
            <div style={{flex:1,minWidth:200}}>
              <div style={{...S.display,fontSize:"1.1rem",fontWeight:700,marginBottom:4}}>{profile.name||profile.login}</div>
              <div style={{...S.mono,fontSize:".8rem",...S.neon,marginBottom:6}}>@{profile.login}</div>
              {profile.bio && <p style={{...S.mid,fontSize:".85rem",lineHeight:1.6}}>{profile.bio}</p>}
              {profile.location && <p style={{...S.dim,fontSize:".8rem",marginTop:6}}>📍 {profile.location}</p>}
            </div>
            <a href={profile.html_url} target="_blank" rel="noreferrer" className="btn-secondary" style={{padding:"10px 22px",fontSize:".85rem"}}>View Profile →</a>
          </div>
        )}

        {error && <div style={{textAlign:"center",padding:32,color:"#ff6b6b",...S.mono,fontSize:".85rem",marginBottom:32}}>⚠ Could not load GitHub data: {error}</div>}

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:20,marginBottom:40}}>
          {stats.map((s,i)=>(
            <div key={s.label} className={`glass-card reveal reveal-d${i%4+1}`} style={{padding:28,textAlign:"center"}}>
              {loading
                ? <div className="gh-skeleton" style={{height:36,marginBottom:8}}/>
                : <div style={{...S.display,fontSize:"2.2rem",fontWeight:800,...S.gradText}}>{s.val}</div>
              }
              <div style={{fontSize:".8rem",...S.dim,marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Repos grid */}
        <div className="repos-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:40}}>
          {loading && [0,1,2,3].map(i=>(
            <div key={i} style={{padding:22,borderRadius:12,background:"rgba(8,13,26,.8)",border:"1px solid rgba(0,200,255,.1)"}}>
              <div className="gh-skeleton" style={{height:14,marginBottom:12,width:"60%"}}/>
              <div className="gh-skeleton" style={{height:12,marginBottom:8}}/>
              <div className="gh-skeleton" style={{height:12,width:"80%"}}/>
            </div>
          ))}
          {!loading && repos.map((r,i)=>(
            <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer" className={`repo-card-live reveal reveal-d${i%4+1}`}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="#6b7a99"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/></svg>
                <span style={{...S.mono,fontSize:".85rem",...S.neon}}>{r.name}</span>
                {r.fork && <span style={{...S.mono,fontSize:".6rem",padding:"2px 7px",borderRadius:100,background:"rgba(123,47,255,.1)",border:"1px solid rgba(123,47,255,.2)",color:"#7b2fff"}}>fork</span>}
              </div>
              <p style={{fontSize:".82rem",...S.dim,lineHeight:1.6,flex:1}}>{r.description||"No description provided."}</p>
              <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                {r.language && (
                  <span style={{display:"flex",alignItems:"center",gap:6,fontSize:".75rem",...S.dim,...S.mono}}>
                    <span style={{width:10,height:10,borderRadius:"50%",background:lc(r.language),display:"block"}}/>{r.language}
                  </span>
                )}
                <span style={{fontSize:".75rem",...S.dim,...S.mono}}>⭐ {r.stargazers_count}</span>
                <span style={{fontSize:".75rem",...S.dim,...S.mono}}>🍴 {r.forks_count}</span>
                {r.updated_at && <span style={{fontSize:".7rem",...S.dim,...S.mono,marginLeft:"auto"}}>Updated {new Date(r.updated_at).toLocaleDateString("en-GB",{month:"short",year:"numeric"})}</span>}
              </div>
            </a>
          ))}
        </div>

        {/* Language bar */}
        {!loading && langs.length > 0 && (
          <div className="reveal">
            <div style={{...S.display,fontSize:"1rem",fontWeight:700,marginBottom:16}}>Language Breakdown</div>
            <div style={{height:10,borderRadius:5,overflow:"hidden",display:"flex",marginBottom:16}}>
              {langs.map(([lang,count])=>(
                <div key={lang} style={{width:`${(count/total*100).toFixed(1)}%`,background:lc(lang)}}/>
              ))}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:16}}>
              {langs.map(([lang,count])=>(
                <span key={lang} style={{display:"flex",alignItems:"center",gap:8,fontSize:".78rem",...S.dim,...S.mono}}>
                  <span style={{width:10,height:10,borderRadius:"50%",background:lc(lang),display:"block"}}/>{lang} {(count/total*100).toFixed(0)}%
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="reveal" style={{textAlign:"center",marginTop:40}}>
          <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer" className="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            View All Repositories
          </a>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════ */
function Testimonials() {
  return (
    <section id="testimonials" style={{padding:"100px 5%"}}>
      <SectionHeader tag="Social Proof" title="What People" accent="Say" desc="Feedback from clients, mentees, and collaborators across Nigeria and beyond."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,maxWidth:1100,margin:"0 auto"}}>
        {TESTIMONIALS.map((t,i)=>(
          <div key={i} className={`glass-card reveal reveal-d${i%3+1}`} style={{padding:30}}>
            <div style={{fontSize:"2.5rem",lineHeight:1,color:"#00c8ff",opacity:.4,fontFamily:"Georgia,serif",marginBottom:16}}>"</div>
            <div style={{color:"#ffd700",fontSize:".8rem",marginBottom:4}}>★★★★★</div>
            <p style={{...S.mid,fontSize:".9rem",lineHeight:1.8,marginBottom:24}}>{t.text}</p>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:t.bg,border:"2px solid rgba(0,200,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>{t.avatar}</div>
              <div>
                <div style={{...S.display,fontSize:".9rem",fontWeight:700}}>{t.name}</div>
                <div style={{fontSize:".75rem",...S.dim,marginTop:2}}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CONTACT  — powered by EmailJS
══════════════════════════════════════════ */
const EMAILJS_SERVICE_ID  = "service_n3s1od4";
const EMAILJS_TEMPLATE_ID = "template_udsckjq";
const EMAILJS_PUBLIC_KEY  = "uLGJAKbB7qRHVE43V";

function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [form, setForm]     = useState({name:"",email:"",subject:"",message:""});

  /* Inject EmailJS SDK once */
  useEffect(() => {
    const id = "emailjs-sdk";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id  = id;
      s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      s.onload = () => window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      document.head.appendChild(s);
    } else if (window.emailjs) {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
  }, []);

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in Name, Email and Message.");
      return;
    }
    setStatus("sending");
    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  form.name,
        from_email: form.email,
        subject:    form.subject || "Portfolio Contact",
        message:    form.message,
        reply_to:   form.email,
      });
      setStatus("sent");
      setForm({name:"",email:"",subject:"",message:""});
      setTimeout(() => setStatus("idle"), 4000);
    } catch(err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }
  return (
    <section id="contact" style={{padding:"100px 5%",background:"#080d1a"}}>
      <SectionHeader tag="Get In Touch" title="Let's" accent="Work Together" desc="Ready to build something exceptional? Let's connect and bring your idea to life."/>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:60,alignItems:"start"}}>
          <div className="reveal">
            <h3 style={{...S.display,fontSize:"1.4rem",fontWeight:800,marginBottom:16}}>Start a Conversation</h3>
            <p style={{...S.mid,fontSize:".9rem",lineHeight:1.8,marginBottom:32}}>Whether you need a full stack application, a secure API, or a skilled developer to join your team — I'm available and ready to deliver excellence.</p>
            <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:32}}>
              {[
                {icon:"📧",label:"Email",   value:"onyuchennachidera@gmail.com",     href:"mailto:onyuchennachidera@gmail.com"},
                {icon:"📱",label:"WhatsApp",value:"+234 811 388 2005",              href:"tel:+2348113882005"},
                {icon:"💼",label:"LinkedIn",value:"Uchenna Chidera Onyesom",        href:"https://linkedin.com/uchenna-chidera-onyesom-72b973345"},
                {icon:"🐙",label:"GitHub",  value:`github.com/${GITHUB_USERNAME}`, href:`https://github.com/${GITHUB_USERNAME}`},
              ].map(c=>(
                <a key={c.label} href={c.href} className="contact-item" target={c.href.startsWith("http")?"_blank":undefined} rel="noreferrer">
                  <div style={{width:40,height:40,borderRadius:10,background:"rgba(0,200,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{c.icon}</div>
                  <div>
                    <div style={{fontSize:".72rem",...S.dim,marginBottom:2}}>{c.label}</div>
                    <div style={{fontSize:".88rem",fontWeight:500}}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
            <div style={{display:"flex",gap:12}}>
              {[
                {t:"GitHub",   h:`https://github.com/${GITHUB_USERNAME}`,svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>},
                {t:"LinkedIn", h:"https://linkedin.com/uchenna-chidera-onyesom-72b973345",svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>},
                {t:"YouTube",  h:"#",svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>},
                {t:"Twitter",  h:"#",svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>},
              ].map(s=>(
                <a key={s.t} href={s.h} className="social-link" title={s.t} target="_blank" rel="noreferrer">{s.svg}</a>
              ))}
            </div>
          </div>
          <div className="reveal reveal-d1">
            <div className="glass-card" style={{padding:32}}>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {[{label:"Your Name",type:"text",k:"name",ph:"John Doe"},{label:"Email Address",type:"email",k:"email",ph:"john@company.com"},{label:"Subject",type:"text",k:"subject",ph:"Project Inquiry"}].map(f=>(
                  <div key={f.k} style={{display:"flex",flexDirection:"column",gap:6}}>
                    <label style={{fontSize:".78rem",...S.dim,...S.mono}}>{f.label}</label>
                    <input type={f.type} className="form-input" placeholder={f.ph} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                  </div>
                ))}
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={{fontSize:".78rem",...S.dim,...S.mono}}>// message</label>
                  <textarea className="form-input" rows={5} placeholder="Tell me about your project..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
                </div>
                <button className="form-submit" onClick={handleSubmit} disabled={status==="sending"} style={status==="sent"?{background:"linear-gradient(135deg,#00c88a,#00a87a)"}:status==="error"?{background:"linear-gradient(135deg,#ff4d4d,#c00)"}:{}}>
                  {status==="idle"?"Send Message →":status==="sending"?"Sending…":status==="sent"?"✓ Message Sent!":"✗ Failed — Try Again"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{padding:"40px 5%",borderTop:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
      <Logo size={28}/>
      <p style={{fontSize:".8rem",...S.dim}}>© {new Date().getFullYear()} Uchenna Chidera Onyesom · Built with 🖤 in Abuja, Nigeria</p>
      <a href="#hero" className="footer-back">Back to top ↑</a>
    </footer>
  );
}

/* ══════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════ */
export default function Portfolio() {
  const [scrolled,   setScrolled]  = useState(false);
  const [mobileOpen, setMobileOpen]= useState(false);
  const [loaded,     setLoaded]    = useState(false);

  useEffect(()=>{
    const fn = ()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",fn);
    // Loader: hide after 1.8s
    const t = setTimeout(()=>setLoaded(true), 1800);
    return()=>{ window.removeEventListener("scroll",fn); clearTimeout(t); };
  },[]);

  useReveal();

  return (
    <>
      <GlobalStyles/>
      <Loader done={loaded}/>
      <CustomCursor/>
      <WhatsAppFloat/>
      <Navbar scrolled={scrolled} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
      <Hero/>
      <Divider/>
      <About/>
      <Divider/>
      <Skills/>
      <Divider/>
      <Projects/>
      <Divider/>
      <Services/>
      <Divider/>
      <Pricing/>
      <Divider/>
      <Blog/>
      <Divider/>
      <GitHubSection/>
      <Divider/>
      <Testimonials/>
      <Divider/>
      <Contact/>
      <Footer/>
    </>
  );
}

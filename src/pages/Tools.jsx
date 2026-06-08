import { S, SectionHeader, useReveal, Footer } from "../shared";

/* Tools I Use */
/*  Affiliate Links
══════════════════════════════════════════ */
const TOOL_CATEGORIES = [
  {
    category:"Hosting & Deployment",
    icon:"🚀",
    tools:[
      { name:"Netlify",      desc:"The easiest way to deploy React apps. Free tier is incredibly generous.",            url:"https://netlify.com",      tag:"Free tier", badge:"I use this" },
      { name:"Render",       desc:"Deploy Node.js backends for free. Auto-deploys from GitHub.",                       url:"https://render.com",       tag:"Free tier", badge:"I use this" },
      { name:"Hostinger",    desc:"Best affordable hosting for Nigerian developers. cPanel + fast support.",           url:"https://hostinger.com",    tag:"Paid", badge:"Recommended" },
      { name:"DigitalOcean", desc:"$200 free credit for new users. Best VPS for production Node.js apps.",            url:"https://digitalocean.com", tag:"$200 credit", badge:null },
    ]
  },
  {
    category:"Storage & Media",
    icon:"📁",
    tools:[
      { name:"Cloudinary",   desc:"Best free image/video CDN. 25GB free. Perfect for file upload APIs.",              url:"https://cloudinary.com",   tag:"Free tier", badge:"I use this" },
      { name:"MongoDB Atlas", desc:"Free cloud MongoDB database. 512MB free. Zero config setup.",                     url:"https://mongodb.com/atlas", tag:"Free tier", badge:"I use this" },
    ]
  },
  {
    category:"Developer Tools",
    icon:"🛠️",
    tools:[
      { name:"GitHub",       desc:"Version control and portfolio showcase. Essential for every developer.",            url:"https://github.com",       tag:"Free", badge:"Essential" },
      { name:"Postman",      desc:"The best API testing tool. Test every endpoint before shipping.",                  url:"https://postman.com",      tag:"Free tier", badge:"I use this" },
      { name:"VS Code",      desc:"Best free code editor. Lightweight and powerful with extensions.",                 url:"https://code.visualstudio.com", tag:"Free", badge:"I use this" },
    ]
  },
  {
    category:"Forms & Email",
    icon:"📧",
    tools:[
      { name:"EmailJS",      desc:"Send emails from React without a backend. Perfect for contact forms.",             url:"https://emailjs.com",      tag:"Free tier", badge:"I use this" },
      { name:"Formspree",    desc:"Simplest form backend. Works with any static site.",                               url:"https://formspree.io",     tag:"Free tier", badge:null },
    ]
  },
  {
    category:"Domain & DNS",
    icon:"🌐",
    tools:[
      { name:"Namecheap",    desc:"Cheapest .com domains. Great for developer portfolios.",                           url:"https://namecheap.com",    tag:"Paid", badge:"Recommended" },
      { name:"is-a.dev",     desc:"Free .is-a.dev subdomain for developers. No credit card needed.",                 url:"https://is-a.dev",         tag:"Free", badge:"Free domain" },
    ]
  },
  {
    category:"Analytics & SEO",
    icon:"📊",
    tools:[
      { name:"Google Analytics", desc:"Free visitor tracking. See who visits, from where, and for how long.",        url:"https://analytics.google.com", tag:"Free", badge:"I use this" },
      { name:"Google Search Console", desc:"Monitor your site's Google ranking and indexing status.",                url:"https://search.google.com/search-console", tag:"Free", badge:"I use this" },
    ]
  },
];

function Tools() {
  useReveal();
  return (
    <>
      <section style={{padding:"80px 5% 100px"}}>
        <SectionHeader tag="Resources" title="Tools" accent="I Use" desc="Every tool I actually use to build, deploy and grow. Affiliate links help support my content — always free to use without clicking them."/>

        {/* Disclaimer */}
        <div className="reveal" style={{maxWidth:1100,margin:"0 auto 48px",padding:"16px 24px",background:"rgba(255,215,0,.05)",border:"1px solid rgba(255,215,0,.15)",borderRadius:12,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:"1.2rem"}}>💡</span>
          <p style={{fontSize:".85rem",color:"#a0aec0",lineHeight:1.6}}>Some links below are affiliate links — I earn a small commission if you sign up. I only recommend tools I genuinely use and trust.</p>
        </div>

        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:"column",gap:48}}>
          {TOOL_CATEGORIES.map((cat,ci)=>(
            <div key={ci} className="reveal">
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
                <span style={{fontSize:"1.5rem"}}>{cat.icon}</span>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.1rem",fontWeight:800}}>{cat.category}</h2>
              </div>
              <div className="tools-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
                {cat.tools.map((t,ti)=>(
                  <a key={ti} href={t.url} target="_blank" rel="noreferrer noopener" className="tool-card">
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span style={{fontFamily:"'Syne',sans-serif",fontSize:".95rem",fontWeight:700}}>{t.name}</span>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:".6rem",padding:"3px 9px",borderRadius:100,background:"rgba(0,200,255,.06)",border:"1px solid rgba(0,200,255,.12)",color:"#6b7a99"}}>{t.tag}</span>
                        {t.badge && <span style={{fontFamily:"'DM Mono',monospace",fontSize:".6rem",padding:"3px 9px",borderRadius:100,background:"rgba(0,200,255,.12)",border:"1px solid rgba(0,200,255,.25)",color:"#00c8ff"}}>{t.badge}</span>}
                      </div>
                    </div>
                    <p style={{fontSize:".83rem",color:"#6b7a99",lineHeight:1.7,WebkitTextFillColor:"#6b7a99"}}>{t.desc}</p>
                    <div style={{display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Mono',monospace",fontSize:".72rem",color:"#00c8ff"}}>
                      Visit {t.name} 
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Suggest a tool */}
        <div className="reveal" style={{maxWidth:600,margin:"64px auto 0",textAlign:"center",padding:"36px",background:"rgba(8,13,26,.8)",border:"1px solid rgba(0,200,255,.12)",borderRadius:20}}>
          <div style={{fontSize:"1.8rem",marginBottom:12}}>🔧</div>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.2rem",fontWeight:800,marginBottom:10}}>Missing a Tool?</h3>
          <p style={{color:"#a0aec0",lineHeight:1.8,marginBottom:24,fontSize:".88rem"}}>Got a tool you swear by? Send me a message and I might add it to the list.</p>
          <a href="/contact" className="btn-secondary">Suggest a Tool →</a>
        </div>
      </section>
      <Footer/>
    </>
  );
}

export default Tools;

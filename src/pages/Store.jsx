import { S, SectionHeader, useReveal, Divider, Footer, GITHUB_USERNAME } from "../shared";

/* ══════════════════════════════════════════
   STORE PAGE — Gumroad Digital Products
══════════════════════════════════════════ */
const PRODUCTS = [
  {
    emoji:"🔐", tag:"Authentication", title:"JWT Auth Starter Kit",
    desc:"Production-ready Node.js + Express authentication boilerplate. Includes register, login, refresh tokens, protected routes, password reset, and full Postman collection.",
    price:"$12", originalPrice:"$20",
    stack:["Node.js","Express","MongoDB","JWT","bcrypt"],
    features:["Full register/login flow","Refresh token rotation","Password reset via email","Protected route middleware","Postman collection included","Clean project structure","README with setup guide"],
    gumroadUrl:"https://donsparkdev.gumroad.com/l/kajja",
    badge:"Best Seller",
    badgeColor:"rgba(0,200,255,.15)",
  },
  {
    emoji:"📁", tag:"File Management", title:"File Upload API Boilerplate",
    desc:"Complete file upload system with Multer + Cloudinary. Handles images, PDFs, validation, size limits, user-scoped storage, and cleanup of old files.",
    price:"$10", originalPrice:"$18",
    stack:["Node.js","Express","Multer","Cloudinary","MongoDB"],
    features:["Image & file upload","File type validation","Size limit enforcement","Cloudinary integration","Auto-delete old files","User-scoped uploads","Error handling included"],
    gumroadUrl:"https://gumroad.com/donsparkdev",
    badge:null,
  },
  {
    emoji:"⚛️", tag:"React", title:"Dark Portfolio Template",
    desc:"The exact portfolio template this site is built on. Dark futuristic design, glassmorphism, live GitHub API, blog system, pricing page, and contact form.",
    price:"$15", originalPrice:"$25",
    stack:["React","Vite","CSS3","EmailJS","GitHub API"],
    features:["Dark futuristic design","Live GitHub data","Full blog system","Pricing page","EmailJS contact form","Loading screen","Custom cursor","Mobile responsive"],
    gumroadUrl:"https://gumroad.com/donsparkdev",
    badge:"New",
    badgeColor:"rgba(123,47,255,.15)",
  },
  {
    emoji:"🚀", tag:"Full Stack", title:"Full Stack App Starter",
    desc:"Complete React + Node.js + MongoDB starter. Auth, file uploads, protected routes, CRUD API, and deployment config for Render + Netlify. Ship in hours not days.",
    price:"$25", originalPrice:"$40",
    stack:["React","Node.js","MongoDB","JWT","Cloudinary","Render"],
    features:["React frontend + Node backend","Full authentication","File upload system","CRUD REST API","Deployment config","Environment setup guide","1 week email support"],
    gumroadUrl:"https://gumroad.com/donsparkdev",
    badge:"Most Popular",
    badgeColor:"linear-gradient(135deg,rgba(0,200,255,.15),rgba(123,47,255,.15))",
  },
  {
    emoji:"📚", tag:"eBook", title:"From Zero to Full Stack in Nigeria",
    desc:"My complete guide to becoming a full stack developer from scratch — resources, roadmap, freelancing tips, pricing in USD, and how to find international clients from Nigeria.",
    price:"$8", originalPrice:"$15",
    stack:["PDF","40+ pages","Practical","Nigeria-focused"],
    features:["Complete learning roadmap","Best free resources","Freelancing from Nigeria","Pricing your services in USD","Finding international clients","Building in public strategy","Real tools and workflows"],
    gumroadUrl:"https://gumroad.com/donsparkdev",
    badge:null,
  },
  {
    emoji:"🛡️", tag:"Security", title:"Node.js API Security Checklist",
    desc:"Everything you need to secure a production Node.js API — rate limiting, CORS, validation, JWT best practices, Helmet.js config, and a pre-deploy security audit template.",
    price:"$6", originalPrice:"$12",
    stack:["PDF","Checklist","Node.js","Express"],
    features:["Pre-deploy checklist","Rate limiting setup","CORS configuration","JWT security guide","Input validation rules","Error handling patterns","Helmet.js config"],
    gumroadUrl:"https://gumroad.com/donsparkdev",
    badge:null,
  },
];

export function Store() {
  useReveal();
  return (
    <>
      <section style={{padding:"80px 5% 100px"}}>
        <SectionHeader tag="Digital Products" title="Developer" accent="Store" desc="Production-ready templates, boilerplates and guides. Ship faster, learn deeper."/>
        
        {/* Banner */}
        <div className="reveal" style={{maxWidth:1100,margin:"0 auto 48px",padding:"20px 28px",background:"rgba(0,200,255,.05)",border:"1px solid rgba(0,200,255,.15)",borderRadius:14,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <span style={{fontSize:"1.5rem"}}>🛒</span>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:4}}>All products on Gumroad</div>
            <p style={{fontSize:".85rem",color:"#6b7a99"}}>Secure payments · Instant download · 30-day refund policy</p>
          </div>
          <a href="https://gumroad.com/donsparkdev" target="_blank" rel="noreferrer" className="btn-secondary" style={{marginLeft:"auto",padding:"10px 22px",fontSize:".85rem"}}>View All on Gumroad →</a>
        </div>

        <div className="products-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:28,maxWidth:1100,margin:"0 auto"}}>
          {PRODUCTS.map((p,i)=>(
            <div key={i} className={`product-card reveal reveal-d${i%4+1}`}>
              {/* Header */}
              <div style={{padding:"20px 24px 16px",background:`linear-gradient(135deg,rgba(0,200,255,.06),rgba(123,47,255,.06))`,borderBottom:"1px solid rgba(0,200,255,.1)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:"1.8rem"}}>{p.emoji}</span>
                  <div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:".62rem",color:"#00c8ff",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>{p.tag}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:".95rem",fontWeight:700}}>{p.title}</div>
                  </div>
                </div>
                {p.badge && <span style={{fontFamily:"'DM Mono',monospace",fontSize:".6rem",padding:"4px 10px",borderRadius:100,background:p.badgeColor||"rgba(0,200,255,.1)",border:"1px solid rgba(0,200,255,.2)",color:"#00c8ff",whiteSpace:"nowrap"}}>{p.badge}</span>}
              </div>

              {/* Body */}
              <div style={{padding:24,display:"flex",flexDirection:"column",gap:16,flex:1}}>
                <p style={{fontSize:".88rem",color:"#a0aec0",lineHeight:1.7}}>{p.desc}</p>

                {/* Stack */}
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {p.stack.map(s=><span key={s} style={{fontFamily:"'DM Mono',monospace",fontSize:".62rem",padding:"3px 10px",borderRadius:4,background:"rgba(0,200,255,.06)",border:"1px solid rgba(0,200,255,.12)",color:"#00c8ff"}}>{s}</span>)}
                </div>

                {/* Features */}
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {p.features.map((f,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:".82rem",color:"#a0aec0"}}>
                      <span style={{color:"#00c8ff",flexShrink:0,marginTop:1}}>✓</span>{f}
                    </div>
                  ))}
                </div>

                {/* Price + CTA */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"auto",paddingTop:16,borderTop:"1px solid rgba(255,255,255,.05)"}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontSize:"1.4rem",fontWeight:800,...S.gradText}}>{p.price}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:".75rem",color:"#3a4a6a",textDecoration:"line-through"}}>{p.originalPrice}</span>
                  </div>
                  <a href={p.gumroadUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{padding:"10px 22px",fontSize:".82rem"}}>
                    Buy Now →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom work CTA */}
        <div className="reveal" style={{maxWidth:600,margin:"64px auto 0",textAlign:"center",padding:"40px",background:"rgba(8,13,26,.8)",border:"1px solid rgba(0,200,255,.12)",borderRadius:20}}>
          <div style={{fontSize:"2rem",marginBottom:16}}>💼</div>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.3rem",fontWeight:800,marginBottom:12}}>Need Something Custom?</h3>
          <p style={{color:"#a0aec0",lineHeight:1.8,marginBottom:24,fontSize:".92rem"}}>These templates don't fit? I build custom full stack applications from scratch — tailored to your exact requirements.</p>
          <a href="/contact" className="btn-primary">Discuss Your Project →</a>
        </div>
      </section>
      <Footer/>
    </>
  );
}

export default Store;

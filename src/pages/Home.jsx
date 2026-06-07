import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { S, AnimatedCounter, useReveal, Divider, SectionHeader, Footer } from "../shared";

const TECH_BADGES = [
  {icon:"⚛️",label:"React"},{icon:"🟢",label:"Node.js"},{icon:"⚡",label:"Express"},
  {icon:"🍃",label:"MongoDB"},{icon:"🔀",label:"Git"},{icon:"🔗",label:"REST APIs"},
];

const SERVICES_PREVIEW = [
  {icon:"🖥️",title:"Full Stack Development",desc:"End-to-end web applications built to scale."},
  {icon:"🔗",title:"API Development",       desc:"Secure, documented REST APIs."},
  {icon:"⚛️",title:"Frontend UI Dev",       desc:"Pixel-perfect React interfaces."},
  {icon:"🗄️",title:"Backend Systems",       desc:"Robust Node.js + MongoDB backends."},
  {icon:"🎓",title:"Mentorship & Training", desc:"One-on-one developer coaching."},
];

export default function Home() {
  useReveal();

  return (
    <>
      {/* ── HERO ── */}
      <section style={{minHeight:"calc(100vh - 70px)",display:"flex",alignItems:"center",padding:"80px 5% 80px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,200,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,.04) 1px,transparent 1px)",backgroundSize:"50px 50px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)"}}/>
        {[{w:500,c:"rgba(0,200,255,.12)",t:"-100px",r:"-50px",d:"0s"},{w:400,c:"rgba(123,47,255,.15)",b:"-80px",l:"-80px",d:"-3s"},{w:300,c:"rgba(255,45,120,.08)",t:"40%",r:"30%",d:"-5s"}].map((o,i)=>(
          <div key={i} style={{position:"absolute",width:o.w,height:o.w,borderRadius:"50%",background:`radial-gradient(circle,${o.c},transparent 70%)`,filter:"blur(80px)",pointerEvents:"none",animation:`orbFloat 8s ease-in-out ${o.d} infinite`,top:o.t,right:o.r,bottom:o.b,left:o.l}}/>
        ))}
        {[{l:"8%",d:"18s",dl:"0s",code:"const auth = jwt.sign(payload, secret);"},{l:"75%",d:"22s",dl:"-8s",code:"db.collection('users').findOne({email})"},{l:"45%",d:"16s",dl:"-4s",code:"router.post('/api/upload', multer.single())"},{l:"20%",d:"20s",dl:"-12s",code:"app.use(cors({ origin: '*' }))"},{l:"60%",d:"24s",dl:"-6s",code:"useState(() => fetchData())"}].map((p,i)=>(
          <div key={i} style={{position:"absolute",left:p.l,fontFamily:"'DM Mono',monospace",fontSize:".7rem",color:"rgba(0,200,255,.15)",pointerEvents:"none",animation:`codeFloat ${p.d} ${p.dl} linear infinite`,whiteSpace:"nowrap"}}>{p.code}</div>
        ))}

        <div className="hero-content" style={{maxWidth:720,position:"relative",zIndex:2}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,fontFamily:"'DM Mono',monospace",fontSize:".78rem",color:"#00c8ff",letterSpacing:2,textTransform:"uppercase",marginBottom:24,padding:"8px 16px",background:"rgba(0,200,255,.06)",border:"1px solid rgba(0,200,255,.15)",borderRadius:100}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:"#00c8ff",boxShadow:"0 0 12px #00c8ff",animation:"pulse 2s ease-in-out infinite"}}/>
            Available for Projects
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(2.8rem,6vw,5rem)",fontWeight:800,lineHeight:1.05,letterSpacing:"-2px",marginBottom:10}}>
            <div style={{color:"#e8eaf6"}}>Full Stack</div>
            <div style={S.gradText}>Web Developer</div>
          </h1>
          <p style={{fontSize:"1.15rem",color:"#a0aec0",margin:"20px 0 36px",maxWidth:560,fontWeight:300,lineHeight:1.8}}>Building Scalable, Secure &amp; Modern Web Applications — from pixel-perfect frontends to bulletproof backend APIs.</p>

          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:44}}>
            {TECH_BADGES.map((b,i)=>(
              <span key={i} className={`badge-anim-${i+1}`} style={{fontFamily:"'DM Mono',monospace",fontSize:".72rem",padding:"6px 14px",borderRadius:6,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"#6b7a99",cursor:"default",transition:"all .3s"}}
                onMouseEnter={e=>Object.assign(e.currentTarget.style,{background:"rgba(0,200,255,.08)",borderColor:"rgba(0,200,255,.3)",color:"#00c8ff",transform:"translateY(-2px)"})}
                onMouseLeave={e=>Object.assign(e.currentTarget.style,{background:"rgba(255,255,255,.04)",borderColor:"rgba(255,255,255,.08)",color:"#6b7a99",transform:""})}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>

          <div className="hero-cta" style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <NavLink to="/projects" className="btn-primary">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              View Projects
            </NavLink>
            <NavLink to="/contact" className="btn-secondary">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><polyline points="16,3 12,7 8,3"/></svg>
              Hire Me
            </NavLink>
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
      </section>

      <Divider/>

      {/* ── SERVICES PREVIEW ── */}
      <section style={{padding:"80px 5%",background:"#080d1a"}}>
        <SectionHeader tag="What I Do" title="My" accent="Services" desc="From idea to deployment — full product lifecycle covered."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:20,maxWidth:1100,margin:"0 auto 48px"}}>
          {SERVICES_PREVIEW.map((s,i)=>(
            <div key={i} className={`glass-card reveal reveal-d${i%4+1}`} style={{padding:"28px 22px",textAlign:"center"}}>
              <span style={{fontSize:"1.8rem",marginBottom:12,display:"block"}}>{s.icon}</span>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:".9rem",fontWeight:700,marginBottom:8}}>{s.title}</div>
              <p style={{fontSize:".8rem",color:"#6b7a99",lineHeight:1.7}}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center"}}>
          <NavLink to="/services" className="btn-secondary">View All Services →</NavLink>
        </div>
      </section>

      <Divider/>

      {/* ── CTA BAND ── */}
      <section style={{padding:"80px 5%",textAlign:"center"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div className="reveal" style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.6rem,3vw,2.4rem)",fontWeight:800,letterSpacing:"-1px",marginBottom:16}}>
            Ready to build something <span style={S.gradText}>extraordinary?</span>
          </div>
          <p className="reveal" style={{color:"#a0aec0",lineHeight:1.8,marginBottom:32}}>Let's turn your idea into a scalable, production-ready web application.</p>
          <div className="reveal" style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <NavLink to="/contact" className="btn-primary">Start a Project →</NavLink>
            <NavLink to="/store"   className="btn-secondary">Browse Store</NavLink>
          </div>
        </div>
      </section>

      <Footer/>
    </>
  );
}

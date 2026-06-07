import { S, useReveal, SectionHeader, Divider, Mockup, Footer, GITHUB_USERNAME } from "../shared";

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

export default function ProjectsPage() {
  useReveal();
  return (
    <>
      <Projects/>
      <Footer/>
    </>
  );
}

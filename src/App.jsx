import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { GlobalStyles, CustomCursor, WhatsAppFloat, Loader, Logo, S } from "./shared";

// Pages
import Home       from "./pages/Home";
import About      from "./pages/About";
import Projects   from "./pages/Projects";
import Blog       from "./pages/Blog";
import Services   from "./pages/Services";
import GitHub     from "./pages/GitHub";
import Store      from "./pages/Store";
import Tools      from "./pages/Tools";
import Contact    from "./pages/Contact";

/* ── Navbar ── */
function Navbar({ scrolled, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const links = [
    { to:"/",         label:"Home"     },
    { to:"/about",    label:"About"    },
    { to:"/projects", label:"Projects" },
    { to:"/blog",     label:"Blog"     },
    { to:"/services", label:"Services" },
    { to:"/github",   label:"GitHub"   },
    { to:"/store",    label:"Store"    },
    { to:"/tools",    label:"Tools"    },
  ];

  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"0 5%",height:70,display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(5,8,17,.97)":"rgba(5,8,17,.7)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,200,255,.1)",transition:"background .3s"}}>
      <NavLink to="/" style={{textDecoration:"none"}}><Logo/></NavLink>
      <ul className="nav-desktop" style={{display:"flex",gap:"1.4rem",listStyle:"none",alignItems:"center"}}>
        {links.map(l=>(
          <li key={l.to}>
            <NavLink to={l.to} className={({isActive})=>`nav-link-item${isActive?" active":""}${l.to==="/contact"?" nav-cta-link":""}`} end={l.to==="/"}>
              {l.label}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink to="/contact" className="nav-link-item nav-cta-link">Hire Me</NavLink>
        </li>
      </ul>
      <div className="ham-btn" onClick={()=>setMobileOpen(!mobileOpen)} style={{cursor:"pointer",flexDirection:"column",gap:5,display:"none"}}>
        {[0,1,2].map(i=><span key={i} style={{display:"block",width:24,height:2,background:"#a0aec0",borderRadius:2}}/>)}
      </div>
      {mobileOpen && (
        <div style={{position:"fixed",top:70,left:0,right:0,background:"rgba(5,8,17,.98)",padding:"24px 5%",display:"flex",flexDirection:"column",gap:20,borderBottom:"1px solid rgba(0,200,255,.1)",zIndex:999,backdropFilter:"blur(20px)"}}>
          {[...links,{to:"/contact",label:"Hire Me"}].map(l=>(
            <NavLink key={l.to} to={l.to} className="nav-link-item" onClick={()=>setMobileOpen(false)} end={l.to==="/"}>{l.label}</NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ── Page transition wrapper ── */
function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter" style={{paddingTop:70}}>
      {children}
    </div>
  );
}

export default function App() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loaded,     setLoaded]     = useState(false);
  const location = useLocation();

  useEffect(()=>{
    const fn = ()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",fn);
    const t = setTimeout(()=>setLoaded(true), 1600);
    return()=>{ window.removeEventListener("scroll",fn); clearTimeout(t); };
  },[]);

  // Close mobile menu on route change
  useEffect(()=>{ setMobileOpen(false); window.scrollTo(0,0); },[location.pathname]);

  return (
    <>
      <GlobalStyles/>
      <Loader done={loaded}/>
      <CustomCursor/>
      <WhatsAppFloat/>
      <Navbar scrolled={scrolled} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
      <PageWrapper>
        <Routes>
          <Route path="/"         element={<Home/>}/>
          <Route path="/about"    element={<About/>}/>
          <Route path="/projects" element={<Projects/>}/>
          <Route path="/blog"     element={<Blog/>}/>
          <Route path="/services" element={<Services/>}/>
          <Route path="/github"   element={<GitHub/>}/>
          <Route path="/store"    element={<Store/>}/>
          <Route path="/tools"    element={<Tools/>}/>
          <Route path="/contact"  element={<Contact/>}/>
          <Route path="*"         element={<NotFound/>}/>
        </Routes>
      </PageWrapper>
    </>
  );
}

function NotFound() {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,padding:"5%",textAlign:"center"}}>
      <div style={{...S.mono,fontSize:"6rem",fontWeight:800,...S.gradText,lineHeight:1}}>404</div>
      <h1 style={{...S.display,fontSize:"1.8rem",fontWeight:800}}>Page Not Found</h1>
      <p style={{...S.mid,maxWidth:400}}>The page you're looking for doesn't exist. Let's get you back on track.</p>
      <NavLink to="/" className="btn-primary">← Back to Home</NavLink>
    </div>
  );
}

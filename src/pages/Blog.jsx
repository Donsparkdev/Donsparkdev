import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { S, useReveal, SectionHeader, Footer, GITHUB_USERNAME } from "../shared";

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/* ══════════════════════════════════════════
   STATIC FALLBACK POSTS
   (used when Supabase is empty or offline)
══════════════════════════════════════════ */
const STATIC_POSTS = [
  {
    id:1, tag:"Authentication", color:"rgba(0,200,255,.1)", border:"rgba(0,200,255,.2)",
    date:"Apr 2025", read_time:"5 min read",
    title:"How JWT Authentication Really Works",
    desc:"A deep dive into JSON Web Tokens — how to sign, verify, and secure your Node.js APIs with access and refresh token patterns.",
    content:[
      {type:"p",text:"If you've built any kind of API, you've heard of JWT. But most tutorials skip the 'why' and jump straight to the code. In this article, we're going to fix that — you'll understand exactly what a JWT is, how it protects your routes, and how to implement a proper access + refresh token system in Node.js."},
      {type:"h2",text:"What Is a JWT?"},
      {type:"p",text:"JWT stands for JSON Web Token. It's a compact, URL-safe string that encodes a payload of data and signs it with a secret key."},
      {type:"code",text:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDNhYmMifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"},
      {type:"h2",text:"Why Use JWT Over Sessions?"},
      {type:"p",text:"JWTs are stateless. The token itself contains the user info. Any server that knows the secret key can verify it. This makes JWTs perfect for REST APIs and microservices."},
      {type:"h2",text:"Implementing JWT in Node.js"},
      {type:"code",text:"const token = jwt.sign(\n  { userId: user._id },\n  process.env.JWT_SECRET,\n  { expiresIn: '15m' }\n);\nres.json({ token });"},
      {type:"blockquote",text:"Never store sensitive data in the JWT payload. It's encoded, not encrypted. Keep it to userId and role only."},
    ]
  },
  {
    id:2, tag:"File Uploads", color:"rgba(123,47,255,.1)", border:"rgba(123,47,255,.2)",
    date:"Mar 2025", read_time:"7 min read",
    title:"Building a File Upload API with Multer & Cloudinary",
    desc:"Step-by-step guide to accepting, validating and storing file uploads in a Node.js/Express backend with Cloudinary integration.",
    content:[
      {type:"p",text:"File uploads are one of those features that sound simple but hide a dozen edge cases. In this guide we'll build a bulletproof upload API from scratch."},
      {type:"h2",text:"Setting Up Multer"},
      {type:"code",text:"npm install multer cloudinary multer-storage-cloudinary"},
      {type:"h2",text:"Configuring Cloudinary Storage"},
      {type:"code",text:"const storage = new CloudinaryStorage({\n  cloudinary,\n  params: {\n    folder: 'avatars',\n    allowed_formats: ['jpg','jpeg','png','webp'],\n    transformation: [{ width:400, height:400, crop:'fill' }],\n  },\n});"},
      {type:"blockquote",text:"Always validate on both frontend AND backend. Never trust client-side validation alone."},
    ]
  },
  {
    id:3, tag:"React", color:"rgba(0,200,80,.1)", border:"rgba(0,200,80,.2)",
    date:"Mar 2025", read_time:"6 min read",
    title:"5 React Patterns Every Developer Should Know",
    desc:"From compound components to custom hooks — practical React patterns that make your components cleaner and maintainable.",
    content:[
      {type:"p",text:"React gives you the freedom to structure your code however you want. That freedom is also a trap. Here are 5 patterns that consistently produce cleaner code."},
      {type:"h2",text:"1. Custom Hooks for Logic Separation"},
      {type:"code",text:"function useUser() {\n  const [user, setUser] = useState(null);\n  useEffect(() => {\n    fetch('/api/user').then(r => r.json()).then(setUser);\n  }, []);\n  return { user };\n}"},
      {type:"h2",text:"2. Lazy Loading with Suspense"},
      {type:"code",text:"const BlogPost = React.lazy(() => import('./BlogPost'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <BlogPost />\n    </Suspense>\n  );\n}"},
    ]
  },
  {
    id:4, tag:"MongoDB", color:"rgba(255,165,0,.1)", border:"rgba(255,165,0,.2)",
    date:"Feb 2025", read_time:"8 min read",
    title:"MongoDB Schema Design for Beginners",
    desc:"How to design MongoDB schemas that scale — embedding vs referencing, indexing strategies, and real-world examples.",
    content:[
      {type:"p",text:"The most common mistake new MongoDB developers make is treating it like a relational database. Let's fix that."},
      {type:"h2",text:"Embedding vs Referencing"},
      {type:"p",text:"Embed when the data is always accessed together. Reference when the data is large, shared, or updated frequently on its own."},
      {type:"h2",text:"Indexing for Performance"},
      {type:"code",text:"userSchema.index({ email: 1 }, { unique: true });\npostSchema.index({ author: 1, createdAt: -1 });"},
      {type:"blockquote",text:"Design your schema around your queries, not your data."},
    ]
  },
  {
    id:5, tag:"Node.js", color:"rgba(255,45,120,.1)", border:"rgba(255,45,120,.2)",
    date:"Jan 2025", read_time:"9 min read",
    title:"Building REST APIs with Express — Best Practices",
    desc:"Error handling, validation, rate limiting, CORS — everything you need to ship production-grade APIs.",
    content:[
      {type:"p",text:"Anyone can get an Express server running in 10 minutes. Shipping a production-grade API is a different story."},
      {type:"h2",text:"Centralised Error Handling"},
      {type:"code",text:"function errorHandler(err, req, res, next) {\n  const status = err.statusCode || 500;\n  res.status(status).json({ success: false, error: err.message });\n}\napp.use(errorHandler);"},
      {type:"h2",text:"Rate Limiting"},
      {type:"code",text:"const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 });\napp.use('/api', limiter);"},
      {type:"blockquote",text:"Security is not optional. Rate limiting and input validation should be in every API you ship."},
    ]
  },
  {
    id:6, tag:"Career", color:"rgba(0,200,255,.1)", border:"rgba(0,200,255,.2)",
    date:"Dec 2024", read_time:"10 min read",
    title:"From Zero to Full Stack Developer in Nigeria",
    desc:"My honest journey learning web development in Abuja — the resources, struggles, and breakthroughs.",
    content:[
      {type:"p",text:"I'm writing this for the developer in Abuja, Lagos, Port Harcourt — anywhere in Nigeria — who is wondering if this tech thing is actually possible for them. It's possible."},
      {type:"h2",text:"Starting With Nothing But a Phone"},
      {type:"p",text:"I didn't start with a laptop. I started with an Android phone, Termux, and a stubborn refusal to accept that was a limitation."},
      {type:"blockquote",text:"The tools don't make the developer. The discipline does."},
      {type:"h2",text:"What Nigerian Developers Need to Hear"},
      {type:"ul",items:["Build publicly. GitHub is your CV before your CV.","Price in USD, even for local clients.","Consistency over intensity. 2 hours daily beats 14 hours on weekends."]},
    ]
  },
];

/* ══════════════════════════════════════════
   ARTICLE READER
══════════════════════════════════════════ */
function ArticleReader({ post, onClose }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const el = document.querySelector(".article-overlay");
    const onScroll = () => {
      if (!el) return;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setProgress(Math.min(pct, 100));
    };
    el?.addEventListener("scroll", onScroll);
    return () => { document.body.style.overflow = ""; el?.removeEventListener("scroll", onScroll); };
  }, []);

  function renderBlock(block, i) {
    if (block.type === "h2")        return <h2 key={i}>{block.text}</h2>;
    if (block.type === "h3")        return <h3 key={i}>{block.text}</h3>;
    if (block.type === "p")         return <p key={i}>{block.text}</p>;
    if (block.type === "blockquote")return <blockquote key={i}>{block.text}</blockquote>;
    if (block.type === "ul")        return <ul key={i}>{block.items.map((it,j)=><li key={j}>{it}</li>)}</ul>;
    if (block.type === "ol")        return <ol key={i}>{block.items.map((it,j)=><li key={j}>{it}</li>)}</ol>;
    if (block.type === "code")      return <pre key={i}><code>{block.text}</code></pre>;
    return null;
  }

  return (
    <div className="article-overlay">
      <div className="progress-bar" style={{width:`${progress}%`}}/>
      <div style={{position:"sticky",top:0,zIndex:10,background:"rgba(5,8,17,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,200,255,.1)",padding:"16px 5%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={onClose} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:"#a0aec0",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:".78rem",letterSpacing:1}}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Blog
        </button>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#3a4a6a",letterSpacing:2,textTransform:"uppercase"}}>{post.read_time}</span>
      </div>

      <div style={{maxWidth:720,margin:"0 auto",padding:"52px 5% 100px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",padding:"5px 14px",borderRadius:100,background:post.color,border:`1px solid ${post.border}`,color:"#00c8ff",letterSpacing:2,textTransform:"uppercase"}}>{post.tag}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:".7rem",color:"#3a4a6a"}}>{post.date}</span>
        </div>

        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,5vw,2.8rem)",fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.1,marginBottom:24,background:"linear-gradient(135deg,#e8eaf6,#a0aec0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{post.title}</h1>

        <div style={{display:"flex",alignItems:"center",gap:14,paddingBottom:32,marginBottom:40,borderBottom:"1px solid rgba(255,255,255,.05)"}}>
          <img src={`https://avatars.githubusercontent.com/${GITHUB_USERNAME}`} alt="author" style={{width:44,height:44,borderRadius:"50%",border:"2px solid rgba(0,200,255,.2)",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:".9rem",color:"#c8d0e0"}}>Uchenna Chidera Onyesom</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#3a4a6a",marginTop:2}}>Full Stack Developer · @donsparkdev</div>
          </div>
        </div>

        <div className="article-body">
          {(post.content || []).map((block,i)=>renderBlock(block,i))}
        </div>

        <div style={{marginTop:64,paddingTop:32,borderTop:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
          <button onClick={onClose} className="btn-secondary" style={{padding:"12px 24px",fontSize:".85rem"}}>← Back to Blog</button>
          <a href="/contact" className="btn-primary" style={{padding:"12px 24px",fontSize:".85rem"}}>Work With Me →</a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   BLOG PAGE
══════════════════════════════════════════ */
export default function Blog() {
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [active,   setActive]   = useState(null);
  const [source,   setSource]   = useState("static");

  useReveal();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setPosts(data);
          setSource("supabase");
        } else {
          // Fall back to static posts
          setPosts(STATIC_POSTS);
          setSource("static");
        }
      } catch (err) {
        console.warn("Supabase fetch failed, using static posts:", err.message);
        setPosts(STATIC_POSTS);
        setSource("static");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const visible = expanded ? posts : posts.slice(0, 3);

  if (loading) return (
    <section style={{padding:"100px 5%",minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:40,height:40,borderRadius:"50%",border:"2px solid rgba(0,200,255,.1)",borderTopColor:"#00c8ff",animation:"loaderSpin .9s linear infinite",margin:"0 auto 16px"}}/>
        <p style={{color:"#6b7a99",fontFamily:"'DM Mono',monospace",fontSize:".8rem"}}>Loading articles...</p>
      </div>
    </section>
  );

  return (
    <>
      {active && <ArticleReader post={active} onClose={()=>setActive(null)}/>}

      <section style={{padding:"80px 5% 100px",background:"#080d1a"}}>
        <SectionHeader tag="Articles" title="Dev" accent="Blog" desc="Practical guides, tutorials and insights from real-world full stack development experience."/>

        {/* Source indicator */}
        {source === "supabase" && (
          <div className="reveal" style={{maxWidth:1100,margin:"0 auto 32px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:"#00ff88",boxShadow:"0 0 8px #00ff88",display:"block"}}/>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:".7rem",color:"#3a4a6a",letterSpacing:1}}>Live from database · {posts.length} articles</span>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24,maxWidth:1100,margin:"0 auto"}}>
          {visible.map((p,i)=>(
            <div key={p.id} onClick={()=>setActive(p)} className={`blog-card reveal reveal-d${i%4+1}`} style={{cursor:"pointer"}}>
              <div style={{padding:"18px 24px 14px",background:p.color,borderBottom:`1px solid ${p.border}`}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:".66rem",color:"#00c8ff",letterSpacing:2,textTransform:"uppercase",WebkitTextFillColor:"#00c8ff"}}>{p.tag}</span>
              </div>
              <div style={{padding:24,display:"flex",flexDirection:"column",gap:12,flex:1,background:"rgba(8,13,26,.85)"}}>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:700,lineHeight:1.4,color:"#e8eaf6",WebkitTextFillColor:"#e8eaf6"}}>{p.title}</h3>
                <p style={{color:"#a0aec0",fontSize:".85rem",lineHeight:1.7,flex:1,WebkitTextFillColor:"#a0aec0"}}>{p.desc}</p>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,borderTop:"1px solid rgba(255,255,255,.05)"}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#6b7a99",WebkitTextFillColor:"#6b7a99"}}>{p.date}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#00c8ff",WebkitTextFillColor:"#00c8ff",display:"flex",alignItems:"center",gap:6}}>
                    {p.read_time}
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{textAlign:"center",marginTop:40}}>
          <button onClick={()=>setExpanded(e=>!e)} className="btn-secondary" style={{color:"#e8eaf6",WebkitTextFillColor:"#e8eaf6"}}>
            {expanded ? "Show Less ↑" : `View All ${posts.length} Articles →`}
          </button>
        </div>
      </section>
      <Footer/>
    </>
  );
}

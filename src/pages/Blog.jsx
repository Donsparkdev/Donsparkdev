import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";
import { useReveal, SectionHeader, Footer, GITHUB_USERNAME } from "../shared";

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder"
);

/* ══════════════════════════════════════════
   STATIC FALLBACK POSTS
══════════════════════════════════════════ */
const STATIC_POSTS = [
  {
    id: 1,
    title: "How JWT Authentication Really Works",
    blog_markdown: `## What Is a JWT?\n\nJWT stands for JSON Web Token. It's a compact, URL-safe string that encodes a payload of data and signs it with a secret key.\n\nThe server doesn't store the token — it just verifies the signature every time.\n\n## Why Use JWT Over Sessions?\n\nJWTs are stateless. The token itself contains the user info. Any server that knows the secret key can verify it. This makes JWTs perfect for REST APIs and microservices.\n\n## Implementing JWT in Node.js\n\n\`\`\`js\nconst token = jwt.sign(\n  { userId: user._id },\n  process.env.JWT_SECRET,\n  { expiresIn: '15m' }\n);\n\`\`\`\n\n> Never store sensitive data in the JWT payload. Keep it to userId and role only.`,
    thumbnail_url: null,
    created_at: "2025-04-01",
    tag: "Authentication",
    color: "rgba(0,200,255,.1)",
    border: "rgba(0,200,255,.2)",
  },
  {
    id: 2,
    title: "Building a File Upload API with Multer & Cloudinary",
    blog_markdown: `## Setting Up Multer\n\nMulter is the standard Node.js middleware for handling multipart/form-data.\n\n\`\`\`bash\nnpm install multer cloudinary multer-storage-cloudinary\n\`\`\`\n\n## Configuring Cloudinary Storage\n\nConnect Cloudinary to Multer for automatic CDN upload with image resizing.\n\n> Always validate on both frontend AND backend. Never trust client-side validation alone.`,
    thumbnail_url: null,
    created_at: "2025-03-15",
    tag: "File Uploads",
    color: "rgba(123,47,255,.1)",
    border: "rgba(123,47,255,.2)",
  },
  {
    id: 3,
    title: "From Zero to Full Stack Developer in Nigeria",
    blog_markdown: `## Starting With Nothing But a Phone\n\nI didn't start with a laptop. I started with an Android phone, Termux, and a stubborn refusal to accept that was a limitation.\n\n> The tools don't make the developer. The discipline does.\n\n## What Nigerian Developers Need to Hear\n\n- Build publicly. GitHub is your CV before your CV.\n- Price in USD, even for local clients.\n- Consistency over intensity. 2 hours daily beats 14 hours on weekends.\n- The market is global. Your client doesn't care that you're in Abuja if your code is clean.`,
    thumbnail_url: null,
    created_at: "2024-12-01",
    tag: "Career",
    color: "rgba(0,200,255,.1)",
    border: "rgba(0,200,255,.2)",
  },
];

/* ── Tag color map for AI-generated posts ── */
const TAG_COLORS = {
  javascript:     { color:"rgba(255,215,0,.1)",   border:"rgba(255,215,0,.2)",   tag:"JavaScript"  },
  typescript:     { color:"rgba(0,122,204,.1)",    border:"rgba(0,122,204,.2)",   tag:"TypeScript"  },
  react:          { color:"rgba(0,200,255,.1)",    border:"rgba(0,200,255,.2)",   tag:"React"       },
  nodejs:         { color:"rgba(0,200,80,.1)",     border:"rgba(0,200,80,.2)",    tag:"Node.js"     },
  mongodb:        { color:"rgba(255,165,0,.1)",    border:"rgba(255,165,0,.2)",   tag:"MongoDB"     },
  security:       { color:"rgba(255,45,120,.1)",   border:"rgba(255,45,120,.2)",  tag:"Security"    },
  career:         { color:"rgba(0,200,255,.1)",    border:"rgba(0,200,255,.2)",   tag:"Career"      },
  api:            { color:"rgba(123,47,255,.1)",   border:"rgba(123,47,255,.2)",  tag:"API"         },
  default:        { color:"rgba(0,200,255,.1)",    border:"rgba(0,200,255,.2)",   tag:"Dev"         },
};

function getTagInfo(title) {
  const t = title?.toLowerCase() || "";
  if (t.includes("react"))      return TAG_COLORS.react;
  if (t.includes("node"))       return TAG_COLORS.nodejs;
  if (t.includes("mongo"))      return TAG_COLORS.mongodb;
  if (t.includes("jwt") || t.includes("auth") || t.includes("security")) return TAG_COLORS.security;
  if (t.includes("typescript")) return TAG_COLORS.typescript;
  if (t.includes("javascript")) return TAG_COLORS.javascript;
  if (t.includes("api"))        return TAG_COLORS.api;
  if (t.includes("career") || t.includes("nigeria") || t.includes("developer")) return TAG_COLORS.career;
  return TAG_COLORS.default;
}

function getReadTime(markdown) {
  const words = markdown?.split(" ").length || 0;
  const mins  = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  } catch { return ""; }
}

/* ══════════════════════════════════════════
   ARTICLE READER
══════════════════════════════════════════ */
function ArticleReader({ post, onClose }) {
  const [progress, setProgress] = useState(0);
  const tagInfo = post.tag ? { color: post.color, border: post.border, tag: post.tag } : getTagInfo(post.title);

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

  return (
    <div className="article-overlay">
      <div className="progress-bar" style={{width:`${progress}%`}}/>

      {/* Nav bar */}
      <div style={{position:"sticky",top:0,zIndex:10,background:"rgba(5,8,17,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,200,255,.1)",padding:"16px 5%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={onClose} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:"#a0aec0",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:".78rem",letterSpacing:1}}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Blog
        </button>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#3a4a6a",letterSpacing:2,textTransform:"uppercase"}}>{getReadTime(post.blog_markdown)}</span>
      </div>

      <div style={{maxWidth:720,margin:"0 auto",padding:"52px 5% 100px"}}>
        {/* Tag + date */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",padding:"5px 14px",borderRadius:100,background:tagInfo.color,border:`1px solid ${tagInfo.border}`,color:"#00c8ff",letterSpacing:2,textTransform:"uppercase"}}>{tagInfo.tag}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:".7rem",color:"#3a4a6a"}}>{formatDate(post.created_at)}</span>
        </div>

        {/* Thumbnail if available */}
        {post.thumbnail_url && (
          <img src={post.thumbnail_url} alt={post.title} style={{width:"100%",borderRadius:12,marginBottom:32,border:"1px solid rgba(0,200,255,.1)",objectFit:"cover",maxHeight:300}}/>
        )}

        {/* Title */}
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,5vw,2.8rem)",fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.1,marginBottom:24,background:"linear-gradient(135deg,#e8eaf6,#a0aec0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{post.title}</h1>

        {/* Author */}
        <div style={{display:"flex",alignItems:"center",gap:14,paddingBottom:32,marginBottom:40,borderBottom:"1px solid rgba(255,255,255,.05)"}}>
          <img src={`https://avatars.githubusercontent.com/${GITHUB_USERNAME}`} alt="author" style={{width:44,height:44,borderRadius:"50%",border:"2px solid rgba(0,200,255,.2)",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:".9rem",color:"#c8d0e0"}}>Uchenna Chidera Onyesom</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#3a4a6a",marginTop:2}}>Full Stack Developer · @donsparkdev</div>
          </div>
        </div>

        {/* Markdown content */}
        <div className="article-body">
          <ReactMarkdown
            components={{
              h1: ({children}) => <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#e8eaf6",margin:"40px 0 14px",letterSpacing:"-.5px"}}>{children}</h2>,
              h2: ({children}) => <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.35rem",fontWeight:800,color:"#e8eaf6",margin:"40px 0 14px",letterSpacing:"-.5px"}}>{children}</h2>,
              h3: ({children}) => <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.05rem",fontWeight:700,color:"#c8d0e0",margin:"28px 0 10px"}}>{children}</h3>,
              p:  ({children}) => <p  style={{color:"#8892a4",lineHeight:1.95,marginBottom:18,fontSize:".97rem"}}>{children}</p>,
              ul: ({children}) => <ul style={{paddingLeft:22,marginBottom:18,color:"#8892a4"}}>{children}</ul>,
              ol: ({children}) => <ol style={{paddingLeft:22,marginBottom:18,color:"#8892a4"}}>{children}</ol>,
              li: ({children}) => <li style={{lineHeight:1.85,fontSize:".95rem",marginBottom:6}}>{children}</li>,
              blockquote: ({children}) => <blockquote style={{borderLeft:"3px solid #00c8ff",padding:"14px 20px",background:"rgba(0,200,255,.04)",borderRadius:"0 10px 10px 0",margin:"24px 0",fontStyle:"italic",color:"#6b7a99"}}>{children}</blockquote>,
              code: ({inline, children}) => inline
                ? <code style={{fontFamily:"'DM Mono',monospace",fontSize:".82rem",background:"rgba(0,200,255,.07)",border:"1px solid rgba(0,200,255,.15)",color:"#00c8ff",padding:"2px 8px",borderRadius:5}}>{children}</code>
                : <pre style={{background:"rgba(5,8,17,.9)",border:"1px solid rgba(0,200,255,.12)",borderRadius:12,padding:24,margin:"24px 0",overflowX:"auto"}}><code style={{fontFamily:"'DM Mono',monospace",fontSize:".82rem",color:"#a0aec0",lineHeight:1.8}}>{children}</code></pre>,
              a: ({href, children}) => <a href={href} target="_blank" rel="noreferrer" style={{color:"#00c8ff",textDecoration:"underline"}}>{children}</a>,
              strong: ({children}) => <strong style={{color:"#c8d0e0",fontWeight:600}}>{children}</strong>,
              img: ({src, alt}) => <img src={src} alt={alt} style={{width:"100%",borderRadius:10,margin:"16px 0",border:"1px solid rgba(0,200,255,.1)"}}/>,
            }}
          >
            {post.blog_markdown || ""}
          </ReactMarkdown>
        </div>

        {/* Footer CTA */}
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
          .from("generated_assets")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setPosts(data);
          setSource("supabase");
        } else {
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
        <SectionHeader tag="Articles" title="Dev" accent="Blog" desc="AI-powered articles on full stack development — generated fresh from trending topics daily."/>

        {/* Source badge */}
        <div className="reveal" style={{maxWidth:1100,margin:"0 auto 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:source==="supabase"?"#00ff88":"#ffd700",boxShadow:`0 0 8px ${source==="supabase"?"#00ff88":"#ffd700"}`,display:"block"}}/>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:".7rem",color:"#3a4a6a",letterSpacing:1}}>
              {source==="supabase" ? `Live · ${posts.length} AI-generated articles` : "Static articles · Connect Supabase for live posts"}
            </span>
          </div>
          {source==="supabase" && (
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#3a4a6a",padding:"4px 12px",border:"1px solid rgba(0,200,255,.1)",borderRadius:100}}>Auto-updated daily</span>
          )}
        </div>

        {/* Blog grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24,maxWidth:1100,margin:"0 auto"}}>
          {visible.map((p,i) => {
            const tagInfo = p.tag ? { color:p.color, border:p.border, tag:p.tag } : getTagInfo(p.title);
            const preview = p.blog_markdown?.replace(/[#*`>\n]/g,"").slice(0,120) + "...";
            return (
              <div key={p.id} onClick={()=>setActive(p)} className={`blog-card reveal reveal-d${i%4+1}`} style={{cursor:"pointer"}}>
                {/* Thumbnail */}
                {p.thumbnail_url && (
                  <img src={p.thumbnail_url} alt={p.title} style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
                )}
                {/* Tag header */}
                <div style={{padding:"16px 24px 12px",background:tagInfo.color,borderBottom:`1px solid ${tagInfo.border}`}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:".66rem",color:"#00c8ff",letterSpacing:2,textTransform:"uppercase",WebkitTextFillColor:"#00c8ff"}}>{tagInfo.tag}</span>
                </div>
                {/* Body */}
                <div style={{padding:24,display:"flex",flexDirection:"column",gap:12,flex:1,background:"rgba(8,13,26,.85)"}}>
                  <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:700,lineHeight:1.4,color:"#e8eaf6",WebkitTextFillColor:"#e8eaf6"}}>{p.title}</h3>
                  <p style={{color:"#a0aec0",fontSize:".85rem",lineHeight:1.7,flex:1,WebkitTextFillColor:"#a0aec0"}}>{preview}</p>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,borderTop:"1px solid rgba(255,255,255,.05)"}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#6b7a99",WebkitTextFillColor:"#6b7a99"}}>{formatDate(p.created_at)}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:".68rem",color:"#00c8ff",WebkitTextFillColor:"#00c8ff",display:"flex",alignItems:"center",gap:6}}>
                      {getReadTime(p.blog_markdown)}
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more */}
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

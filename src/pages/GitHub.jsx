import { useState, useEffect } from "react";
import { S, useReveal, SectionHeader, Divider, Footer, useGitHub, lc, GITHUB_USERNAME } from "../shared";

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

export default function GitHubPage() {
  useReveal();
  return (
    <>
      <GitHubSection/>
      <Footer/>
    </>
  );
}

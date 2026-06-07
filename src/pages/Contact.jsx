import { useState, useEffect } from "react";
import { S, useReveal, SectionHeader, Divider, Footer, GITHUB_USERNAME } from "../shared";

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

export default function ContactPage() {
  useReveal();
  return (
    <>
      <Contact/>
      <Footer/>
    </>
  );
}

import { NavLink } from "react-router-dom";
import { S, useReveal, SectionHeader, Divider, Footer } from "../shared";

const SERVICES = [
  {icon:"🖥️",title:"Full Stack Development",desc:"End-to-end web apps with seamless frontend-backend integration, database design, and deployment."},
  {icon:"🔗",title:"API Development",       desc:"Secure, scalable REST APIs with auth, file handling, validation, and full documentation."},
  {icon:"⚛️",title:"Frontend UI Dev",       desc:"Pixel-perfect, responsive React interfaces with modern UX and smooth animations."},
  {icon:"🗄️",title:"Backend Systems",       desc:"Robust Node.js + MongoDB backends with optimized queries, caching, and secure architecture."},
  {icon:"🎓",title:"Mentorship & Training", desc:"One-on-one coaching and YouTube tutorials to master full stack development fast."},
];

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

export default function ServicesPage() {
  useReveal();
  return (
    <>
      <Services/>
      <Divider/>
      <Pricing/>
      <Footer/>
    </>
  );
}

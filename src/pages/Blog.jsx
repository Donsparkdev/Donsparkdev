import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { S, useReveal, SectionHeader, Divider, Footer, GITHUB_USERNAME } from "../shared";

// 📡 INITIALIZE FRONTEND SUPABASE CLIENT LAYER
// Replace these with your actual environment variables or configuration strings
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STATIC_BLOG_POSTS = [
  {
    id: 1, tag: "Authentication", color: "rgba(0,200,255,.1)", border: "rgba(0,200,255,.2)",
    date: "Apr 2025", readTime: "5 min read",
    title: "How JWT Authentication Really Works",
    desc: "A deep dive into JSON Web Tokens — how to sign, verify, and secure your Node.js APIs with access and refresh token patterns.",
    content: [
      {type: "p", text: "If you've built any kind of API, you've heard of JWT. But most tutorials skip the 'why' and jump straight to the code. In this article, we're going to fix that — you'll understand exactly what a JWT is, how it protects your routes, and how to implement a proper access + refresh token system in Node.js."},
      {type: "h2", text: "What Is a JWT?"},
      {type: "p", text: "JWT stands for JSON Web Token. It's a compact, URL-safe string that encodes a payload of data and signs it with a secret key. The result looks like this:"},
      {type: "code", text: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDNhYmMiLCJpYXQiOjE2ODB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"},
      {type: "p", text: "It has 3 parts separated by dots: the Header (algorithm used), the Payload (your data), and the Signature (proof it hasn't been tampered with). The key insight: the server doesn't store the token. It just verifies the signature every time."},
      {type: "h2", text: "Why Use JWT Over Sessions?"},
      {type: "p", text: "Traditional sessions store user data server-side and give the client a session ID cookie. This works, but it means your server needs to maintain state — a problem when you scale horizontally across multiple servers."},
      {type: "p", text: "JWTs are stateless. The token itself contains the user info. Any server that knows the secret key can verify it. This makes JWTs perfect for REST APIs and microservices."},
      {type: "h2", text: "Implementing JWT in Node.js"},
      {type: "p", text: "First, install the library:"},
      {type: "code", text: "npm install jsonwebtoken bcryptjs"},
      {type: "p", text: "Here's a clean login route:"},
      {type: "code", text: "const jwt = require('jsonwebtoken');\nconst bcrypt = require('bcryptjs');\n\n// POST /api/auth/login\nrouter.post('/login', async (req, res) => {\n  const { email, password } = req.body;\n\n  // 1. Find user\n  const user = await User.findOne({ email });\n  if (!user) return res.status(401).json({ error: 'Invalid credentials' });\n\n  // 2. Verify password\n  const valid = await bcrypt.compare(password, user.password);\n  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });\n\n  // 3. Sign token\n  const token = jwt.sign(\n    { userId: user._id, email: user.email },\n    process.env.JWT_SECRET,\n    { expiresIn: '15m' }\n  );\n\n  res.json({ token });\n});"},
      {type: "h2", text: "The Access + Refresh Token Pattern"},
      {type: "p", text: "Short-lived access tokens (15 min) + long-lived refresh tokens (7 days) is the gold standard. When the access token expires, the client uses the refresh token to get a new one — silently, without logging the user out."},
      {type: "blockquote", text: "Never store sensitive data in the JWT payload. It's encoded, not encrypted. Anyone can decode it. Keep it to userId and role only."},
      {type: "h2", text: "Protecting Routes with Middleware"},
      {type: "code", text: "function authMiddleware(req, res, next) {\n  const auth = req.headers.authorization;\n  if (!auth?.startsWith('Bearer '))\n    return res.status(401).json({ error: 'No token' });\n\n  try {\n    const token = auth.split(' ')[1];\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch {\n    res.status(401).json({ error: 'Invalid token' });\n  }\n}\n\n// Usage\nrouter.get('/profile', authMiddleware, (req, res) => {\n  res.json({ userId: req.user.userId });\n});"},
      {type: "p", text: "And that's it — a clean, secure JWT authentication system. Store your JWT_SECRET in .env, never hardcode it, and always use HTTPS in production."},
    ]
  },
  {
    id: 2, tag: "File Uploads", color: "rgba(123,47,255,.1)", border: "rgba(123,47,255,.2)",
    date: "Mar 2025", readTime: "7 min read",
    title: "Building a File Upload API with Multer & Cloudinary",
    desc: "Step-by-step guide to accepting, validating and storing file uploads in a Node.js/Express backend with Cloudinary integration.",
    content: [
      {type: "p", text: "File uploads are one of those features that sound simple but hide a dozen edge cases. Wrong file type? File too large? What happens if Cloudinary is down? In this guide we'll build a bulletproof upload API from scratch."},
      {type: "h2", text: "Setting Up Multer"},
      {type: "p", text: "Multer is the standard Node.js middleware for handling multipart/form-data. Install it alongside the Cloudinary SDK:"},
      {type: "code", text: "npm install multer cloudinary multer-storage-cloudinary"},
      {type: "h2", text: "Configuring Cloudinary Storage"},
      {type: "code", text: "const cloudinary = require('cloudinary').v2;\nconst { CloudinaryStorage } = require('multer-storage-cloudinary');\n\ncloudinary.config({\n  cloud_name: process.env.CLOUD_NAME,\n  api_key:    process.env.CLOUD_KEY,\n  api_secret: process.env.CLOUD_SECRET,\n});\n\nconst storage = new CloudinaryStorage({\n  cloudinary,\n  params: {\n    folder: 'avatars',\n    allowed_formats: ['jpg','jpeg','png','webp'],\n    transformation: [{ width:400, height:400, crop:'fill' }],\n  },\n});\n\nconst upload = multer({\n  storage,\n  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB\n  fileFilter: (req, file, cb) => {\n    const allowed = ['image/jpeg','image/png','image/webp'];\n    if (allowed.includes(file.mimetype)) cb(null, true);\n    else cb(new Error('Only images allowed'), false);\n  },\n});"},
      {type: "h2", text: "The Upload Route"},
      {type: "code", text: "router.post('/upload/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {\n  try {\n    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });\n\n    // Save URL to user profile\n    await User.findByIdAndUpdate(req.user.userId, {\n      avatar: req.file.path,\n      avatarPublicId: req.file.filename,\n    });\n\n    res.json({\n      success: true,\n      url: req.file.path,\n      message: 'Avatar updated successfully',\n    });\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n});"},
      {type: "h2", text: "Deleting Old Images"},
      {type: "p", text: "Always delete the old Cloudinary image before uploading a new one — otherwise you'll accumulate storage costs:"},
      {type: "code", text: "if (user.avatarPublicId) {\n  await cloudinary.uploader.destroy(user.avatarPublicId);\n}"},
      {type: "blockquote", text: "Tip: Always validate on both frontend AND backend. Never trust client-side validation alone."},
      {type: "p", text: "With this setup you get automatic image resizing, format conversion, CDN delivery, and all file management handled by Cloudinary — your server just orchestrates the process."},
    ]
  },
  {
    id: 3, tag: "React", color: "rgba(0,200,80,.1)", border: "rgba(0,200,80,.2)",
    date: "Mar 2025", readTime: "6 min read",
    title: "5 React Patterns Every Developer Should Know",
    desc: "From compound components to custom hooks — practical React patterns that make your components cleaner, reusable, and maintainable.",
    content: [
      {type: "p", text: "React gives you the freedom to structure your code however you want. That freedom is also a trap. After working on multiple projects, I've settled on 5 patterns that consistently produce cleaner, more maintainable code."},
      {type: "h2", text: "1. Custom Hooks for Logic Separation"},
      {type: "p", text: "The single best thing you can do for your components is move logic into custom hooks. Your component should only care about rendering."},
      {type: "code", text: "// Before — logic mixed with UI\nfunction UserProfile() {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  useEffect(() => {\n    fetch('/api/user').then(r => r.json()).then(setUser).finally(() => setLoading(false));\n  }, []);\n  // ... 50 more lines of render\n}\n\n// After — clean separation\nfunction useUser() {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  useEffect(() => {\n    fetch('/api/user').then(r => r.json()).then(setUser).finally(() => setLoading(false));\n  }, []);\n  return { user, loading };\n}\n\nfunction UserProfile() {\n  const { user, loading } = useUser();\n  if (loading) return <Spinner />;\n  return <div>{user.name}</div>;\n}"},
      {type: "h2", text: "2. Compound Components"},
      {type: "p", text: "Compound components let you build flexible, expressive APIs for complex UI components — like a custom Select or Modal that feels native."},
      {type: "h2", text: "3. Render Props for Shared Behavior"},
      {type: "p", text: "When you need to share stateful behavior between components without forcing a specific UI, render props (or the modern hook equivalent) are your friend."},
      {type: "h2", text: "4. Component Composition Over Props Drilling"},
      {type: "p", text: "Before you reach for Context or Redux, try composition. Pass components as children or props instead of drilling data five levels deep."},
      {type: "code", text: "// Instead of prop drilling\n<Layout user={user} theme={theme} onLogout={handleLogout}>\n  <Dashboard user={user} />\n</Layout>\n\n// Use composition\n<Layout>\n  <Layout.Header>\n    <UserMenu user={user} onLogout={handleLogout} />\n  </Layout.Header>\n  <Dashboard user={user} />\n</Layout>"},
      {type: "h2", text: "5. Lazy Loading with Suspense"},
      {type: "code", text: "const BlogPost = React.lazy(() => import('./BlogPost'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <BlogPost />\n    </Suspense>\n  );\n}"},
      {type: "p", text: "These 5 patterns alone will make your React code dramatically easier to read, test, and scale. Pick one and apply it to your next component."},
    ]
  },
  {
    id: 4, tag: "MongoDB", color: "rgba(255,165,0,.1)", border: "rgba(255,165,0,.2)",
    date: "Feb 2025", readTime: "8 min read",
    title: "MongoDB Schema Design for Beginners",
    desc: "How to design MongoDB schemas that scale — embedding vs referencing, indexing strategies, and real-world examples with Mongoose.",
    content: [
      {type: "p", text: "The most common mistake new MongoDB developers make is treating it like a relational database — normalizing everything into separate collections and joining them with populate(). Sometimes that's right. Often it's not. Let's break it down."},
      {type: "h2", text: "Embedding vs Referencing"},
      {type: "p", text: "The core decision in MongoDB schema design is: should I embed this data inside the document, or store it in a separate collection and reference it?"},
      {type: "p", text: "Embed when: the data is always accessed together, the embedded data is small, and it won't grow unboundedly. Reference when: the data is large, shared across many documents, or updated frequently on its own."},
      {type: "code", text: "// Embedding — good for small, stable data\nconst userSchema = new Schema({\n  name: String,\n  email: String,\n  address: {          // embedded\n    street: String,\n    city: String,\n    country: String,\n  },\n});\n\n// Referencing — good for large or shared data\nconst postSchema = new Schema({\n  title: String,\n  content: String,\n  author: { type: Schema.Types.ObjectId, ref: 'User' }, // referenced\n  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],\n});"},
      {type: "h2", text: "Indexing for Performance"},
      {type: "p", text: "Without indexes, MongoDB scans every document in a collection for every query. That's fine at 100 documents. At 100,000 it's a disaster."},
      {type: "code", text: "// Always index fields you query frequently\nuserSchema.index({ email: 1 }, { unique: true });\npostSchema.index({ author: 1, createdAt: -1 }); // compound index\npostSchema.index({ title: 'text', content: 'text' }); // full-text search"},
      {type: "h2", text: "Real-World Example: Blog Platform"},
      {type: "code", text: "const postSchema = new Schema({\n  title:     { type: String, required: true, maxlength: 100 },\n  slug:      { type: String, unique: true },\n  content:   { type: String, required: true },\n  author:    { type: ObjectId, ref: 'User', required: true },\n  tags:      [String],\n  views:     { type: Number, default: 0 },\n  published: { type: Boolean, default: false },\n  createdAt: { type: Date, default: Date.now },\n}, { timestamps: true });\n\n// Auto-generate slug before saving\npostSchema.pre('save', function(next) {\n  if (this.isModified('title')) {\n    this.slug = this.title.toLowerCase().replace(/\s+/g, '-');\n  }\n  next();\n});"},
      {type: "blockquote", text: "Design your schema around your queries, not your data. Ask: how will this data be read? That determines how it should be stored."},
      {type: "p", text: "Good schema design is the difference between a MongoDB app that flies and one that crawls. Get the fundamentals right early and scaling becomes a non-issue."},
    ]
  },
  {
    id: 5, tag: "Node.js", color: "rgba(255,45,120,.1)", border: "rgba(255,45,120,.2)",
    date: "Jan 2025", readTime: "9 min read",
    title: "Building REST APIs with Express — Best Practices",
    desc: "Error handling, validation, rate limiting, CORS, and project structure — everything you need to ship production-grade APIs.",
    content: [
      {type: "p", text: "Anyone can get an Express server running in 10 minutes. Shipping a production-grade API is a different story. Here are the practices that separate hobby projects from professional backends."},
      {type: "h2", text: "Project Structure That Scales"},
      {type: "code", text: "src/\n├── controllers/     # request handlers\n├── middleware/      # auth, validation, errors\n├── models/          # Mongoose schemas\n├── routes/          # Express routers\n├── services/        # business logic\n├── utils/           # helpers\n├── config/          # env, db connection\n└── app.js           # Express setup"},
      {type: "h2", text: "Centralised Error Handling"},
      {type: "p", text: "Never handle errors in individual route handlers. Create one error middleware that catches everything:"},
      {type: "code", text: "// middleware/errorHandler.js\nfunction errorHandler(err, req, res, next) {\n  const status = err.statusCode || 500;\n  const message = err.message || 'Internal server error';\n\n  console.error(`[${new Date().toISOString()}] ${status}: ${message}`);\n\n  res.status(status).json({\n    success: false,\n    error: message,\n    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),\n  });\n}\n\n// In app.js — must be last\napp.use(errorHandler);"},
      {type: "h2", text: "Input Validation with express-validator"},
      {type: "code", text: "const { body, validationResult } = require('express-validator');\n\nconst registerRules = [\n  body('email').isEmail().normalizeEmail(),\n  body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/),\n  body('name').trim().isLength({ min: 2, max: 50 }),\n];\n\nrouter.post('/register', registerRules, (req, res) => {\n  const errors = validationResult(req);\n  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });\n  // proceed with valid data\n});"},
      {type: "h2", text: "Rate Limiting"},
      {type: "code", text: "const rateLimit = require('express-rate-limit');\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100,\n  message: { error: 'Too many requests, slow down.' },\n});\n\nconst authLimiter = rateLimit({\n  windowMs: 60 * 60 * 1000, // 1 hour\n  max: 5, // only 5 login attempts\n});\n\napp.use('/api', limiter);\napp.use('/api/auth/login', authLimiter);"},
      {type: "h2", text: "CORS Configuration"},
      {type: "code", text: "const cors = require('cors');\n\napp.use(cors({\n  origin: process.env.CLIENT_URL || 'http://localhost:3000',\n  methods: ['GET','POST','PUT','PATCH','DELETE'],\n  allowedHeaders: ['Content-Type','Authorization'],\n  credentials: true,\n}));"},
      {type: "blockquote", text: "Security is not optional. Rate limiting, input validation, and proper error handling should be in every API you ship — no exceptions."},
    ]
  },
  {
    id: 6, tag: "Career", color: "rgba(0,200,255,.1)", border: "rgba(0,200,255,.2)",
    date: "Dec 2024", readTime: "10 min read",
    title: "From Zero to Full Stack Developer in Nigeria",
    desc: "My honest journey learning web development in Abuja — the resources, struggles, and breakthroughs that made the difference.",
    content: [
      {type: "p", text: "I'm writing this for the developer in Abuja, Lagos, Port Harcourt — anywhere in Nigeria — who is staring at a screen, wondering if this tech thing is actually possible for them. It's possible. Here's my honest account."},
      {type: "h2", text: "Starting With Nothing But a Phone"},
      {type: "p", text: "I didn't start with a laptop. I started with an Android phone, Termux, and a stubborn refusal to accept that was a limitation. The constraints forced creativity — I had to understand what I was doing because there was no GUI to hide behind."},
      {type: "blockquote", text: "The tools don't make the developer. The discipline does. I've seen people with MacBooks produce nothing. I built production APIs on a phone."},
      {type: "h2", text: "The Moment Everything Clicked"},
      {type: "p", text: "It wasn't one moment — it was when I shipped my first JWT authentication system and a real user logged in with it. Not localhost. A deployed URL. A real person."},
      {type: "h2", text: "What Nigerian Developers Need to Hear"},
      {type: "p", text: "The market is global. Your client doesn't care that you're in Abuja if your code is clean and you communicate well. The gap is confidence and portfolio, not skill."},
      {type: "ul", items: ["Build publicly. GitHub is your CV before your CV.","Write about what you learn. It compounds your understanding AND your visibility.","Price in USD, even for local clients. Your work has international market value.","Consistency over intensity. 2 hours daily beats 14 hours on weekends."]},
    ]
  },
];

function ArticleReader({ post, onClose }) {
  const [progress, setProgress] = useState(0);
  const contentRef = useRef(null);

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
    if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
    if (block.type === "h3") return <h3 key={i}>{block.text}</h3>;
    if (block.type === "p") return <p key={i}>{block.text}</p>;
    if (block.type === "blockquote") return <blockquote key={i}>{block.text}</blockquote>;
    if (block.type === "ul") return <ul key={i}>{block.items.map((it, j) => <li key={j}>{it}</li>)}</ul>;
    if (block.type === "ol") return <ol key={i}>{block.items.map((it, j) => <li key={j}>{it}</li>)}</ol>;
    if (block.type === "code") return <pre key={i}><code>{block.text}</code></pre>;
    return null;
  }

  return (
    <div className="article-overlay">
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      {/* Nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(5,8,17,.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,200,255,.1)", padding: "16px 5%", display: "flex", alignItems: "center", justifyNavigation: "space-between", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#a0aec0", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: ".78rem", letterSpacing: 1 }} className="btn-back-link">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Back to Blog
        </button>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".68rem", color: "#3a4a6a", letterSpacing: 2, textTransform: "uppercase" }}>{post.readTime}</span>
      </div>

      {/* Content Canvas */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "52px 5% 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".68rem", padding: "5px 14px", borderRadius: 100, background: post.color, border: `1px solid ${post.border}`, color: "#00c8ff", letterSpacing: 2, textTransform: "uppercase" }}>{post.tag}</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".7rem", color: "#3a4a6a" }}>{post.date}</span>
        </div>

        {/* Dynamic Header Image Display (Renders Bannerbear creation if present!) */}
        {post.image && (
          <img src={post.image} alt="Cover Graphic" style={{ width: "100%", borderRadius: 12, marginBottom: 32, border: "1px solid rgba(0,200,255,.2)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
        )}

        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 24, background: "linear-gradient(135deg,#e8eaf6,#a0aec0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{post.title}</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 32, marginBottom: 40, borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <img src={`https://avatars.githubusercontent.com/${GITHUB_USERNAME}`} alt="author" style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid rgba(0,200,255,.2)", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".9rem", color: "#c8d0e0" }}>Uchenna Chidera Onyesom</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".68rem", color: "#3a4a6a", marginTop: 2 }}>Full Stack Developer · @donsparkdev</div>
          </div>
        </div>

        <div className="article-body" ref={contentRef}>
          {post.content.map((block, i) => renderBlock(block, i))}
        </div>

        <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: "12px 24px", fontSize: ".85rem" }}>← Back to Blog</button>
          <a href="#contact" onClick={onClose} className="btn-primary" style={{ padding: "12px 24px", fontSize: ".85rem" }}>Work With Me →</a>
        </div>
      </div>
    </div>
  );
}

function Blog() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(null);
  const [posts, setPosts] = useState(STATIC_BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  // 🛠️ DYNAMIC STREAM SYNCER EFFECT
  useEffect(() => {
    async function streamLiveAssets() {
      try {
        const { data: dbAssets, error } = await supabase
          .from('generated_assets')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;

        if (dbAssets) {
          // Transform database rows seamlessly into your custom view models
          const structuredAssets = dbAssets.map((asset) => {
            // Cleans dynamic content text entries of harsh md titles for standard summary previews
            const plainDescription = asset.blog_markdown
              ? asset.blog_markdown.substring(0, 150).replace(/[#*`\-]/g, "") + "..."
              : "Click to unpack this newly generated tech analysis post.";

            return {
              id: `db-${asset.id}`,
              tag: "AI AUTOMATION",
              color: "rgba(0,200,80,.1)", 
              border: "rgba(0,200,80,.2)",
              date: new Date(asset.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              }),
              readTime: "4 min read",
              title: asset.title,
              desc: plainDescription,
              image: asset.thumbnail_url, // Feeds your custom layout graphic directly down to UI
              content: [
                { type: "p", text: asset.blog_markdown || "" }
              ]
            };
          });

          // Stack fresh automation deliveries squarely at the front of your feed deck
          setPosts([...structuredAssets, ...STATIC_BLOG_POSTS]);
        }
      } catch (err) {
        console.error("Supabase live layer synchronization fault:", err.message);
      } finally {
        setLoading(false);
      }
    }
    streamLiveAssets();
  }, []);

  const visible = expanded ? posts : posts.slice(0, 3);

  return (
    <>
      {active && <ArticleReader post={active} onClose={() => setActive(null)} />}
      <section id="blog" style={{ padding: "100px 5%", background: "#080d1a", color: "#e8eaf6" }}>
        <SectionHeader tag="Articles" title="Dev" accent="Blog" desc="Practical guides, tutorials and insights from real-world full stack development experience." />
        
        {loading ? (
          <div style={{ textAlign: "center", fontFamily: "'DM Mono',monospace", color: "#00c8ff", padding: "40px 0", letterSpacing: 1 }}>📡 Connecting to global automation data mesh...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
            {visible.map((p, i) => (
              <div key={p.id} onClick={() => setActive(p)} className="blog-card" style={{ cursor: "pointer", opacity: 1, transform: "translateY(0)", animation: `blogIn .4s ease ${i * 0.08}s both` }}>
                
                {/* Visual Thumbnail Frame */}
                {p.image && (
                  <div style={{ width: "100%", height: 160, overflow: "hidden", borderBottom: `1px solid ${p.border}` }}>
                    <img src={p.image} alt="Cover Thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s ease" }} className="card-img-preview" />
                  </div>
                )}

                <div style={{ padding: "18px 24px 14px", background: p.color, borderBottom: `1px solid ${p.border}` }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".66rem", color: "#00c8ff", WebkitTextFillColor: "#00c8ff", letterSpacing: 2, textTransform: "uppercase" }}>{p.tag}</span>
                </div>
                
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, flex: 1, background: "rgba(8,13,26,.85)" }}>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, lineHeight: 1.4, color: "#e8eaf6 !important" }}>{p.title}</h3>
                  <p style={{ color: "#a0aec0", fontSize: ".85rem", lineHeight: 1.7, flex: 1, WebkitTextFillColor: "#a0aec0" }}>{p.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyNavigation: "space-between", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.05)" }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".68rem", color: "#6b7a99", WebkitTextFillColor: "#6b7a99" }}>{p.date}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: ".68rem", color: "#00c8ff", WebkitTextFillColor: "#00c8ff", display: "flex", alignItems: "center", gap: 6 }}>
                      {p.readTime}
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="reveal" style={{ textAlign: "center", marginTop: 40 }}>
          <button onClick={() => setExpanded(e => !e)} className="btn-secondary" style={{ color: "#e8eaf6", WebkitTextFillColor: "#e8eaf6" }}>
            {expanded ? "Show Less ↑" : "View All Articles →"}
          </button>
        </div>
      </section>
    </>
  );
}

const PLANS = [
  {
    name: "Starter", price: "₦80,000", usd: "~$50", badge: null,
    desc: "Perfect for small businesses needing a clean online presence.",
    features: ["Landing page (up to 5 sections)", "Responsive mobile design", "Contact form integration", "Basic SEO setup", "1 round of revisions", "Delivery in 5–7 days"],
    cta: "Get Started", ctaStyle: "btn-secondary",
  },
  {
    name: "Professional", price: "₦200,000", usd: "~$130", badge: "Most Popular",
    desc: "Full stack web application for serious businesses and startups.",
    features: ["Full stack web app (React + Node.js)", "User authentication (JWT)", "MongoDB database setup", "REST API development", "Admin dashboard", "3 rounds of revisions", "Deployment on Render/Netlify", "Delivery in 2–3 weeks"],
    cta: "Hire Me Now", ctaStyle: "btn-primary",
  },
  {
    name: "Enterprise", price: "Custom", usd: "Let's talk", badge: null,
    desc: "Complex systems, teams, and long-term partnerships.",
    features: ["Custom full stack architecture", "File upload & storage systems", "Third-party API integrations", "Performance optimization", "Ongoing maintenance", "Priority support", "NDA available", "Timeline based on scope"],
    cta: "Book a Call", ctaStyle: "btn-secondary",
  },
];

export default function BlogPage() {
  useReveal();
  return (
    <>
      <Blog />
      <Footer />
    </>
  );
}


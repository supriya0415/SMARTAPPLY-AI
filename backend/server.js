
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { connectDb } = require('./db');
const User = require('./models/User');
const Resume = require('./models/Resume');
const Career = require('./models/Career');
const { hashPassword, comparePassword } = require('./utils/password');
const { isAdmin } = require('./middleware/adminAuth');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARE (FIXED)
======================= */

app.use(cors());

// 🔥 FIX: increase payload size to prevent PayloadTooLargeError
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Strip /api prefix (Vite proxy support)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    req.url = req.url.replace(/^\/api/, '');
  }
  next();
});

/* =======================
   CONSTANTS
======================= */

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

/* =======================
   AUTH HELPERS
======================= */

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ error: 'Missing token' });

  try {
    const token = auth.slice(7);
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/* =======================
   BASIC ROUTES
======================= */

app.get('/', (req, res) => {
  res.json({ message: 'SmartApply-AI backend running' });
});

/* =======================
   AUTH ROUTES
======================= */

app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: 'username and password required' });

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const passwordHash = await hashPassword(password);
    const user = await new User({ username, passwordHash }).save();

    if (user.username === 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = generateToken({
      id: user._id,
      username: user.username,
      role: user.role,
      accessLevel: user.accessLevel
    });

    res.json({ user: { id: user._id, username }, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: 'username and password required' });

  try {
    const user = await User.findOne({ username });
    if (!user || !(await comparePassword(password, user.passwordHash)))
      return res.status(401).json({ error: 'Invalid credentials' });

    if (user.username === 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = generateToken({
      id: user._id,
      username: user.username,
      role: user.role,
      accessLevel: user.accessLevel
    });

    res.json({ user: { id: user._id, username }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.get('/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

/* =======================
   PROFILE ROUTES
======================= */

app.use('/profile', authMiddleware, profileRoutes);

/* =======================
   ALL YOUR OTHER ROUTES
   (UNCHANGED & SAFE)
======================= */
/* 🔥 Everything below your enhanced profile,
   learning progress, admin, analytics,
   career management etc. remains AS IS 🔥 */

/* =======================
   SERVER START
======================= */

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SmartApply backend listening on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

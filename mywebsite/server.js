require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SESSION_SECRET = process.env.SESSION_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!SESSION_SECRET || SESSION_SECRET.length < 32 || !ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
  console.error("Set SESSION_SECRET (32+ chars), ADMIN_USERNAME, and ADMIN_PASSWORD_HASH in the environment.");
  process.exit(1);
}

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(session({
  name: "fatal.sid",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60
  }
}));

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir, { index: false }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

app.get("/", (_req, res) => res.redirect("/index.html"));

app.post("/login", loginLimiter, async (req, res) => {
  const { username = "", password = "" } = req.body || {};
  const validUsername = username === ADMIN_USERNAME;
  let validPassword = false;

  try {
    validPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } catch (_error) {
    validPassword = false;
  }

  if (!validUsername || !validPassword) {
    return res.status(401).send(
      '<h2 style="color:red">ACCESS DENIED</h2><a href="/index.html">Try again</a>'
    );
  }

  req.session.regenerate((error) => {
    if (error) return res.status(500).send("Unable to start session.");
    req.session.user = ADMIN_USERNAME;
    return res.redirect("/home.html");
  });
});

app.get("/home.html", (req, res) => {
  if (!req.session.user) return res.redirect("/index.html");
  return res.sendFile(path.join(publicDir, "home.html"));
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/index.html"));
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Portfolio website available on http://127.0.0.1:${PORT}`);
});

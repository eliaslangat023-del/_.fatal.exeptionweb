# Reew Martin | Hacker Portfolio

A dark, terminal-inspired personal website scaffold built with HTML, CSS, and Express.

## Run locally

Requirements: Node.js 18+.

```bash
cd mywebsite
cp .env.example .env
npm install
```

Generate a session secret:

```bash
openssl rand -hex 32
```

Generate a bcrypt password hash without putting your password in shell history:

```bash
node -e 'const bcrypt=require("bcryptjs"); const readline=require("readline"); const r=readline.createInterface({input:process.stdin,output:process.stdout}); r.question("Password to hash: ", async p=>{console.log(await bcrypt.hash(p,12)); r.close();});'
```

Put the generated secret, chosen username, and hash in `.env`, then run:

```bash
npm start
```

Open `http://127.0.0.1:3000`.

## Security notes

- The server no longer contains the previous demo plaintext credentials or a hardcoded session secret.
- Login requires environment configuration; do not commit `.env`.
- Sessions use HTTP-only, same-site cookies, regenerate on login, and expire after one hour.
- Login attempts are rate limited.
- The app binds to localhost by default. For deployment, use a properly configured HTTPS reverse proxy, set `NODE_ENV=production`, and configure the session cookie/proxy settings to match the host.
- Use a production session store rather than Express's default in-memory store before deploying.
- The visual terminal effects are decorative only and do not perform real security operations.

## Known limitations

This is a single-admin starter, not a complete multi-user authentication system. Review deployment configuration and add automated tests before public hosting.

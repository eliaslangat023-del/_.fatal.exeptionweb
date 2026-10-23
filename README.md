# fatal.exception web project

An early Express website scaffold with static pages, a login route, and session-based access to `home.html`.

## Important security work before running
- Replace hardcoded demo usernames/passwords with a persistent user store and securely hashed passwords (for example, Argon2id or bcrypt).
- Load the session secret from an environment variable and use a strong random secret.
- Configure secure session cookies (`httpOnly`, `sameSite`, and `secure` behind HTTPS), disable unnecessary session resaving, and set a finite session lifetime.
- Add login rate limiting, input validation, CSRF protection for state-changing routes, and proper logout handling.
- Use `express.static` with an explicit absolute path and review which files are public.
- The current `package.json` is empty; inspect the source and then define dependencies/scripts before installing or deploying.

## Development
After creating a valid `package.json` with the required dependencies, install dependencies and run only in a local development environment. Never deploy the demo credentials or hardcoded session secret.

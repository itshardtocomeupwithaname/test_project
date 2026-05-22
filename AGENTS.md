# AGENTS.md

## Project Overview
<!-- AUTO:START overview -->
- RealWorld/Conduit full-stack example app implementing CRUD articles, comments, auth, profiles, follows, favorites, tags, pagination, and feed behavior.
- Stack: React 19 + Vite + SWC frontend, Express 5 backend, Sequelize 6 models/migrations, PostgreSQL support via `pg`/`pg-hstore`.
- Monorepo uses npm workspaces: `backend` and `frontend`; root scripts orchestrate both.
<!-- AUTO:END overview -->

## Commands
<!-- AUTO:START commands -->
- Install dependencies from repository root:
```bash
  npm install
```

- Start local PostgreSQL service from repository root:
```bash
  docker compose up -d postgres
```

- Create the configured development database from repository root:
```bash
  npm run sqlz -- db:create
```

- Seed development data from repository root:
```bash
  npm run sqlz -- db:seed:all
```

- Run both dev servers from repository root:
```bash
  npm run dev
```
  - Frontend Vite dev server: `http://localhost:3000/`
  - Backend API: `http://localhost:3001/api`

- Run backend only from repository root:
```bash
  npm run dev -w backend
```

- Run frontend only from repository root:
```bash
  npm run dev -w frontend
```

- Run all tests from repository root:
```bash
  npm run test
```

- Run Vitest with a focused file from repository root:
```bash
  npx vitest backend/helper/helpers.test.js
  npx vitest frontend/src/helpers/dateFormatter.test.js
  npx vitest frontend/src/helpers/errorHandler.test.js
```

- Build the frontend from repository root:
```bash
  npm run build -w frontend
```

- Preview the frontend production build from repository root:
```bash
  npm run preview -w frontend
```

- Build frontend and start backend production server from repository root:
```bash
  npm run start
```

- Run Sequelize CLI through the root alias:
```bash
  npm run sqlz -- --help
```

- Run Sequelize CLI directly in backend workspace:
```bash
  npm run sqlz -w backend -- --help
```
<!-- AUTO:END commands -->

## Architecture
<!-- AUTO:START architecture -->
- Root workspace:
  - `package.json` defines npm workspaces for `backend` and `frontend`.
  - Root `npm run dev` uses `concurrently` to run `backend` and `frontend` dev scripts.
  - Root `npm run test` runs `vitest` using `vitest.config.js`.
  - `docker-compose.yml` defines a single Postgres 16 service named `conduit-realworld-postgres`.

- Backend entry point:
  - `backend/index.js` loads `dotenv`, creates the Express app, enables CORS and JSON parsing, connects Sequelize, mounts API routers, serves `../frontend/dist` in production, and starts on `process.env.PORT || 3001`.
  - API router prefixes:
    - `/api/users` -> registration/login routes in `backend/routes/users.js`
    - `/api/user` -> current user / <redacted> routes in `backend/routes/user.js`
    - `/api/articles` -> article/feed/comment/favorite routes in `backend/routes/articles.js`
    - `/api/profiles` -> profile/follow routes in `backend/routes/profiles.js`
    - `/api/tags` -> tag list route in `backend/routes/tags.js`
  - Catch-all backend 404 response shape is `{ errors: { body: ["Not found"] } }`.

- Backend configuration/data:
  - `backend/config/config.js` reads Sequelize config from environment variables for `development`, `test`, and `production`.
  - Expected DB env names include `DEV_DB_USERNAME`, `DEV_DB_PASSWORD`, `DEV_DB_NAME`, `DEV_DB_HOSTNAME`, `DEV_DB_PORT`, `DEV_DB_DIALECT`, and `DEV_DB_LOGGING` with corresponding `TEST_`/`PROD_` variants.
  - `backend/.env.example` documents the required environment variables and `JWT_KEY`.
  - `backend/models/index.js` dynamically loads every `.js` model file in `backend/models` and calls each model’s `associate` method.
  - `backend/index.js` calls `sequelize.sync({ alter: true })` at startup.
  - Sequelize migrations live in `backend/migrations`; seed data lives in `backend/seeders`.

- Backend models:
  - `backend/models/User.js`: users have articles, comments, favorites through `Favorites`, followers/following through `Followers`, and custom `toJSON()` hides `id`, `password`, `updatedAt`, and `createdAt`.
  - `backend/models/Article.js`: articles belong to an `author`, have comments, have many tags through `TagList`, have favorites through users, and custom `toJSON()` hides `id` and `userId`.
  - `backend/models/Tag.js` and `backend/models/Comment.js` support tag lists and comments used by article/profile/comment controllers.

- Backend controllers/helpers:
  - Article logic is centralized in `backend/controllers/articles.js`.
  - Comment logic is in `backend/controllers/comments.js`.
  - Favorite toggle logic is in `backend/controllers/favorites.js`.
  - Profile/follow logic is in `backend/controllers/profiles.js`.
  - Auth registration/login is in `backend/controllers/users.js`; current-user / <redacted> is in `backend/controllers/user.js`.
  - `backend/middleware/authentication.js` parses `Authorization: Token <jwt>`, verifies JWT, and sets `req.loggedUser` when present.
  - `backend/middleware/errorHandler.js` maps custom errors to RealWorld-style JSON errors.
  - `backend/helper/helpers.js` provides `slugify`, `appendTagList`, `appendFavorites`, and `appendFollowers`.
  - `backend/helper/customErrors.js` defines the app-specific error classes.

- Frontend entry points:
  - `frontend/src/main.jsx` renders the React app with `HashRouter`, wraps routes in `AuthProvider`, and defines all route paths.
  - `frontend/src/App.jsx` provides the shared layout: `Navbar`, `Outlet`, and `Footer`.
  - Route components live in `frontend/src/routes`.
  - Reusable UI components live in `frontend/src/components`, usually one directory per component with `Component.jsx` and `index.js`.

- Frontend routing:
  - Uses `HashRouter`, not browser history routing.
  - Main routes:
    - `/` -> `Home` with `HomeArticles`
    - `/login` -> `Login`
    - `/register` -> `SignUp`
    - `/settings` -> `Settings`
    - `/editor` and `/editor/:slug` -> `ArticleEditor`
    - `/article/:slug` -> `Article` with `CommentsSection`
    - `/profile/:username` -> profile articles
    - `/profile/:username/favorites` -> favorited profile articles
    - `*` -> `NotFound`

- Frontend API layer:
  - Service functions in `frontend/src/services` use `axios` and relative `api/...` URLs.
  - Vite dev proxy in `frontend/vite.config.js` forwards `/api` to `http://localhost:3001`.
  - `frontend/src/context/AuthContext.jsx` stores auth state from `localStorage.getItem("loggedUser")`.
  - `frontend/src/context/FeedContext.jsx` controls selected feed tab/tag.
  - `frontend/src/hooks/useArticles.js` fetches article lists and skips feed loading until auth headers exist.

- Tests:
  - Vitest config is at root `vitest.config.js`, uses React SWC plugin, `jsdom`, globals, CSS support, and `frontend/src/setupTests.js`.
  - Existing tests cover backend `slugify` and frontend helpers `dateFormatter` and `errorHandler`.
<!-- AUTO:END architecture -->

## Workflows
<!-- AUTO:START workflows -->
- Environment setup:
  - Create an env file from `backend/.env.example` before running backend/database commands.
  - README says to create `.env` in the project root; backend code calls `require("dotenv").config()` from `backend/index.js`, so verify the runtime working directory when debugging missing env values.
  - `docker-compose.yml` Postgres uses host port `5433`, database `database_development`, and development credentials. Align `DEV_DB_*` env values with this if using compose.
  - `backend/.env.example` defaults dialect values to `mysql`; for the included compose database use a Postgres dialect/config instead.
  - `backend/config/config.js` reads `*_DB_LOGGING`; the example file spells these as `*_DB_LOGGGIN`, so copy carefully if enabling/disabling SQL logging.

- API response contracts:
  - Success responses follow RealWorld shapes: `{ user }`, `{ profile }`, `{ article }`, `{ articles, articlesCount }`, `{ comments }`, `{ tags }`.
  - Delete responses use `{ message: { body: ["... deleted successfully"] } }`.
  - Errors should be returned as `{ errors: { body: [message] } }`.
  - Frontend `frontend/src/helpers/errorHandler.js` expects `error.response.data.errors.body[0]` for statuses `401`, `403`, `404`, `422`, and `500`.

- Auth flow:
  - Login/register responses include a user token.
  - Frontend stores auth as `{ headers, isAuth, loggedUser }` in localStorage under `loggedUser`.
  - Service auth headers use `Authorization: Token <token>`.
  - Backend auth middleware allows unauthenticated requests to continue when there is no `Authorization` header; controllers decide whether auth is required.
  - Controllers that require auth throw `UnauthorizedError`, which maps to HTTP 401.

- Article/feed behavior:
  - Article list endpoints accept `limit` and `offset`; backend default `limit` is `3` and computes SQL offset as `offset * limit`.
  - Supported article list filters are `author`, `tag`, and `favorited`.
  - Feed endpoint `/api/articles/feed` requires an authenticated user and returns articles from followed authors.
  - Article slugs are generated by `slugify`: trim, lowercase, and replace non-word characters/underscores with `-`.
  - Creating an article requires `title`, `description`, and `body`; duplicate generated slug raises a validation error.
  - Article creation expects `req.body.article.tagList`; frontend editor splits tag input on comma or space before sending.
  - Updating an article only changes `title`, `description`, and `body`; tag updates are not handled in the inspected controller.
  - Only the article author can update/delete an article.

- Comments/favorites/follows:
  - Comments are nested under `/api/articles/:slug/comments`.
  - Creating a comment requires auth and `comment.body`.
  - Only the comment author can delete a comment.
  - Favorite toggle endpoint is `/api/articles/:slug/favorite`; POST favorites, DELETE unfavorites.
  - Follow toggle endpoint is `/api/profiles/:username/follow`; POST follows, DELETE unfollows.
  - Helper functions append derived fields such as `tagList`, `favorited`, `favoritesCount`, `following`, and `followersCount`; preserve those fields when changing controller responses.

- Frontend conventions:
  - Components are functional React components.
  - Most component folders export through an `index.js`; keep that pattern for new reusable components.
  - Service functions return parsed response data or a specific value such as article slug; errors are delegated to `frontend/src/helpers/errorHandler.js`.
  - Keep frontend API URLs relative (`api/...`) so the Vite proxy handles local development.
  - App uses Bootstrap/RealWorld class names from `frontend/src/styles.css` and `frontend/src/index.css`.
  - `ArticleEditorForm` redirects unauthenticated users to `/` and redirects non-authors away from editing existing articles.

- Verification guidance:
  - For backend helper changes, run focused Vitest files such as `npx vitest backend/helper/helpers.test.js`.
  - For frontend helper changes, run focused Vitest files under `frontend/src/helpers`.
  - For route/controller response changes, verify both the backend JSON shape and the corresponding frontend service/helper that consumes it.
  - For auth-sensitive UI changes, verify localStorage `loggedUser`, `Authorization: Token ...` headers, and `/api/user` behavior together.
  - For article list/feed changes, verify global feed, authenticated personal feed, tag filter, author profile articles, and favorited profile articles because they share `useArticles`/`getArticles`.

- Operational caveats:
  - Production backend serves the built frontend from `../frontend/dist`; run the frontend build before production start.
  - Backend startup mutates schema with `sequelize.sync({ alter: true })`; be cautious with model changes against non-disposable databases.
  - Do not commit real JWT secrets or database credentials from `.env`; document required env names instead.
  - Avoid editing generated/build/cache/dependency outputs such as `node_modules`, `frontend/dist`, coverage output, and test caches.
<!-- AUTO:END workflows -->

## Manual Notes
<!-- MANUAL -->
<!-- Add durable human-written project rules here. /init will not overwrite this section. -->

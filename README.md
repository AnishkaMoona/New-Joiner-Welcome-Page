# New Joiner Welcome Guide

A calm, friendly one-page welcome guide for new team members featuring a persistent first-week checklist, key contacts directory, useful links, and FAQ.

## 🚀 GitHub Pages Deployment Options

When you push this repository to GitHub, you have **three seamless ways** to host it on GitHub Pages so the UI displays perfectly:

### Option 1: Deploy from `/docs` folder (Instant, No build required)
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select your branch (e.g. `main` or `master`) and select the **`/docs`** folder from the dropdown.
4. Click **Save**.
5. Your site is immediately live with all pre-compiled JavaScript and CSS bundles!

---

### Option 2: Deploy using GitHub Actions (Automated CI/CD)
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) will automatically install dependencies, build the application, and publish to GitHub Pages on every `git push`.

---

### Option 3: Local Development & Rebuilding
If you make changes to the source code:
```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Rebuild the production JS/CSS assets and update docs/ & assets/
npm run build
```

## 📁 Repository Structure
- `src/` — React & TypeScript source code (`App.tsx`, `main.tsx`, `index.css`)
- `docs/` — Pre-built production distribution ready for GitHub Pages `/docs` deployment
- `assets/` — Compiled JavaScript bundle (`app.js`) and stylesheets (`index.css`)
- `.github/workflows/deploy.yml` — Automated GitHub Pages deployment pipeline

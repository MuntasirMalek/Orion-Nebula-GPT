# Orion Nebula GPT — Static Web Client

A fast, responsive, and elegant static web client powered by frontier models (OpenAI & Claude flagship intelligence) and styled with high-definition Hubble Orion Nebula optical imagery. Built with **Vite**, **React**, **TypeScript**, and **Tailwind CSS**. Fully static and optimized for zero-configuration deployment to **GitHub Pages**.

---

## Key Features

- **Hubble 4K Cosmic Wallpaper:** Pristine optical crop from the Hubble 2006 Orion Nebula mosaic, rendered in native 4K with frosted glass cards and light mode aesthetics.
- **Frontier Model Support:** 
  - **GPT-6 Astra** (`OpenAI Most Powerful Model`)
  - **Claude Opus 5.5** (`Claude Most Powerful Model`)
- **Zero Tinkering for Friends:** Guests open the site and can start chatting immediately without requiring logins or API keys. Upstream authentication is handled securely by the decoupled backend proxy.
- **Configurable Backend Proxy URL:**
  - Gear icon opens System Settings to configure or test your backend proxy endpoint.
  - Live latency ping diagnostic (`testBackendHealth`).
  - Saved to browser `localStorage` with fallback to `config.ts` default.
- **Full Markdown & Syntax Highlighting:**
  - Powered by `react-markdown` and `remark-gfm`.
  - Prism-powered syntax-highlighted code blocks with one-click **Copy code** button.
  - Formatted tables, task lists, blockquotes, and math.
- **Real-Time Streaming UX:**
  - Robust SSE stream reader handling packet fragmentation.
  - Real-time auto-scrolling with smart scroll-up detection and a floating "Scroll to bottom" button.
  - Stop generation button.
- **Client-Side History & Session Management:**
  - Conversations saved strictly in `localStorage`.
  - Add, switch, rename, search, and delete chat sessions.
  - One-click export to Markdown (`.md`) or JSON (`.json`).
- **Responsive Mobile First:** iOS dynamic island / notch safe area insets (`pt-safe`, `pb-safe`) and collapsible sliding drawer.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Vite dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Build for GitHub Pages

```bash
npm run build
```

The static bundle will be generated into `dist/`. Assets use relative path resolution (`./assets/...`), allowing the application to run smoothly under root domains (`https://username.github.io/`) or repository subpaths (`https://username.github.io/orion-nebula-gpt/`).

---

## Deploy to GitHub Pages

### Method 1: Automated GitHub Actions (Recommended)

1. Create a repository on GitHub (e.g. `orion-nebula-gpt`).
2. Push this `frontend` directory to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Orion Nebula GPT"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
   git push -u origin main
   ```
3. In your GitHub repository, go to **Settings** > **Pages**.
4. Under **Build and deployment** > **Source**, select **GitHub Actions**.
5. GitHub will automatically run the included `.github/workflows/deploy.yml` workflow and publish your site!

### Method 2: Deploy from `dist` folder directly

Alternatively, push the pre-built `dist/` folder to a `gh-pages` branch or select the root `/` or `/dist` branch in **Settings** > **Pages**.

---

## Backend Proxy Endpoint

To connect to your Netlify serverless proxy, enter your Netlify URL in the app's Settings:
```
https://cool-palmier-9f4ae5.netlify.app/api/chat
```
Or set it as the default in `src/config.ts`.

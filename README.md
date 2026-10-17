# Orion Nebula GPT — Frontend Client

A high-performance, responsive web application engineered for academic study, research, and frontier AI reasoning. Built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**, optimized for zero-configuration deployment to **GitHub Pages**.

---

## 🌟 Key Features

- **Frontier Multi-Model Suite:**
  - **OpenAI GPT-6 Astra** — Premier frontier reasoning & code synthesis with 3 thinking depths (Low, Medium, High).
  - **Anthropic Claude Opus 5.5** — Flagship cognitive synthesis & architectural analysis with 3 thinking depths (Low, Medium, High).
  - **DeepSeek V4** — High-speed reasoning & code intelligence engine.
  - **Cohort Passcode Protection** — Multi-tier serverless access control verified server-side.
- **Token-Saving Sliding Context Window:**
  - Automatically activates on Question 3 for expensive frontier models, pruning older turns while keeping natural context and dropping token costs by over 50%.
- **Frontier Thinking Level Controls:**
  - Dynamic on-screen selector on the input bar (`Low`, `Medium` [Default], `High`) to calibrate reasoning depth. Automatically hides when DeepSeek is active.
- **Multimodal Vision:**
  - Attach study materials, circuit schematics, diagrams, and math problems via drag-and-drop, file picker, or clipboard paste (`Cmd + V`).
  - Automatic HTML5 canvas downscaling to preserve token quotas.
- **Raycast Pearl Optical Aesthetics:**
  - Native 4K Hubble Orion Nebula optical imagery with dynamic adaptive canvas framing and translucent glass sidebar.
- **Client-Side History & Data Ownership:**
  - Conversations saved privately in client `localStorage`.
  - Multi-session drawer with session renaming, searching, and one-click export to Markdown (`.md`) or JSON (`.json`).
- **Decoupled Architecture:**
  - Connects to the secure Netlify serverless proxy without storing or exposing API keys on GitHub Pages.

---

## 🛠️ Quickstart

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (GitHub Pages)
npm run build
```

# RoleMetro ⚡

> **The open-source Mailmeteor for startup roles.**  
> Upload your resume, match curated high-growth startup opportunities, generate minimal anti-cliché cold emails, and launch founder outreach campaigns with 1-click Gmail drafts.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Built by](https://img.shields.io/badge/Author-Bhavuk_Arora-zinc.svg)](https://bhavuk.website)

---

## 💡 The Problem with Job Hunting at Startups

Traditional job boards and generic 500-word cover letters don't work for early-stage startups and high-growth scaleups. Technical founders, CTOs, and founding team members **hate generic corporate applications**—they look for:
1. **Proof of work**: Real projects shipped, open-source code, and concrete latency/growth metrics.
2. **Speed & brevity**: Punchy, 75–110 word cold emails that get straight to the point.
3. **Product awareness**: Specific mention of their recent launch, milestone, or tech stack bottleneck.

**RoleMetro** brings the beloved spreadsheet-first, mail-merge UX of **Mailmeteor** to developer job applications and founder outreach.

---

## ✨ Features

- 📄 **Smart Resume Signal Extractor**: Upload PDF, Markdown, or plain text. Automatically identifies tech stacks, production achievements, latency/metric hooks, and candidate portfolio links.
- 🏢 **Curated Startup Job Explorer**: Filter live YC (W24/S24/W25), AI toolchains, DevTools, and high-growth infra roles (Supabase, Resend, Cognition AI, Modal, Linear, Dub).
- 🎯 **Anti-Cliché Pitch Engine**: 4 founder-tested presets:
  - **Founding Engineer Pitch**: High ownership, speed, and 0-to-1 execution.
  - **Minimal Builder (< 75 words)**: Pure signal, direct metrics, and GitHub link.
  - **Value-First / Teardown**: Technical improvement suggestion based on recent product launches.
  - **Product-Minded Engineer**: Bridges system design with user polish and iteration velocity.
- 📊 **Mailmeteor Campaign Table**: Real-time batch mail merge table with live variables (`{{first_name}}`, `{{company}}`, `{{highlight_project}}`, `{{metric}}`).
- ⚡ **1-Click Gmail Compose & Drafts**: Launches pre-populated Gmail compose windows instantly without requiring complicated OAuth setup or API keys.
- 📥 **Export to CSV**: Download campaign data formatted for Mailmeteor, Apollo, or Lemlist.
- 🔐 **Privacy-First & Local Storage**: 100% client-side operation. All resumes, keys, and campaigns stay in your browser.

---

## 🛠️ Architecture & Pipeline Flow

```text
  [ Resume (PDF / Text / MD) ]
               │
               ▼
   lib/resumeParser.ts
   ├── Extracts Skills & Tech Stack
   ├── Extracts Metrics & Key Projects
   └── Computes Skill Match % vs Startups
               │
               ▼
   lib/pitchTemplates.ts
   ├── Injects Dynamic Tokens ({{founder}}, {{metric}})
   └── Enforces < 100 Word Founder Tone
               │
               ▼
   Mailmeteor Campaign Engine
   ├── Batch Spreadsheet View & Status Tracker
   ├── 1-Click Gmail Web Compose URL Generator
   └── CSV / JSON Export for Mail Tools
```

---

## 🚀 Quickstart

Clone the repository and run the development server locally:

```bash
# Clone the repository
git clone https://github.com/bhavukar/rolemetro.git
cd rolemetro

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Static Export

RoleMetro compiles to a pure static export (`out/` directory), making it deployable on GitHub Pages, Cloudflare Pages, or Vercel:

```bash
# Build static site
npm run build
```

---

## 🏷️ Merge Variables Reference

You can customize pitches using any of these live tokens:

| Token | Description | Example |
|---|---|---|
| `{{first_name}}` | Recipient's first name | Paul |
| `{{company}}` | Target startup name | Supabase |
| `{{role}}` | Target position | Founding Engineer |
| `{{candidate_name}}` | Your full name | Bhavuk Arora |
| `{{highlight_project}}` | Your best matching project | Manage Your Display |
| `{{project_metric}}` | Performance or impact metric | Sub-microsecond packet latency |
| `{{portfolio_url}}` | Candidate portfolio link | https://bhavuk.website |
| `{{github_url}}` | Candidate GitHub profile | https://github.com/bhavukar |
| `{{recent_milestone}}` | Target company's recent launch | Announced Edge Runtime v2 |

---

## 👨‍💻 Author

Built by **[Bhavuk Arora](https://bhavuk.website)**  
- GitHub: [@bhavukar](https://github.com/bhavukar)  
- Website: [bhavuk.website](https://bhavuk.website)  

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

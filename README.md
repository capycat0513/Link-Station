# 🚀 Link Station

**Link Station** is a lightweight web service that removes the shortcut limit on Chrome's 'New Tab' page. To keep hosting costs at zero while ensuring fast edge performance without login requirements, I built this personal dashboard using **Cloudflare Workers** and **LocalStorage**.

---

## 📌 Overview

* **Title**: Link Station - Unlimited Chrome Shortcuts Dashboard
* **Live Site**: [https://link-station.capycat0513.workers.dev/]([https://workers.dev](https://link-station.capycat0513.workers.dev/))
* **Preview**:
  * <img width="1499" height="775" alt="스크린샷 2026-11-12 오후 5 42 50" src="https://github.com/user-attachments/assets/222c5f09-c23b-45f8-ba31-062392b74cf2" />

---

## ✨ Key Features

* **Unlimited Shortcuts & Custom Icons**: Add, edit, and delete unlimited links. Automatically fetches site favicons or lets users upload custom icons (PNG, JPG, WEBP up to 5MB) with live preview.
* **Smart Sorting & Real-time Search**: Organize shortcuts by *Newest*, *Recently Used*, or *Most Visited*, and filter them instantly via the live search bar.
* **JSON Data Backup & Restore**: Export and import shortcut data as `.json` files to prevent data loss when clearing browser cache.
* **Interactive Onboarding & UX**: Includes a 9-step interactive tutorial modal, empty-state guidance, and input validation.
* **$0 Server Costs**: Powered by a serverless architecture using Cloudflare Workers and browser LocalStorage.

---

## 🏗 Project Architecture

Designed with Separation of Concerns (SoC) by modularizing styles and core logic:

* **Styles**: `style.css` (base), `components.css` (shared UI), `modal.css` (popups), `responsive.css` (mobile/tablet layouts)
* **Scripts**: `storage.js` (LocalStorage & JSON I/O), `shortcuts.js` (CRUD & sorting), `ui.js` (DOM rendering), `tutorial.js` (9-step guide), `settings.js` (user preferences)

---

## 🛠 Tech Stack

* **Frontend**: `HTML5`, `CSS3`, `JavaScript (ES6+)`
* **Deployment & Hosting**: `Cloudflare Workers`

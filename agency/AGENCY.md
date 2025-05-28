# AGENCY.md

## 🧠 About the Agency

This agency is a specialized team of experts focused on delivering precise, modular, and reliable software — with one mission: **build exactly what the client wants, nothing more, nothing less**.

We care deeply about clarity, rigor, and outcome. Every team member is a top-level specialist in their domain, with over a decade of experience working in high-performance, product-focused environments.

We do not over-engineer. We do not guess. We ask, verify, build small, and deliver cleanly. Also, when the edit Tools available we are free to use ut completely, leaning run commands, delete files, edit code...

---

## 🧱 Project Structure & Codebase Philosophy

The codebase follows two core principles:

### 1. Feature-First Structure
All real work is done in the `/features/` folder.  
Each folder inside represents one **complete, isolated feature** (such as a contact form, feedback system, authentication, etc.).

Inside each feature folder:
- `spec.md` — detailed specification written by the product manager (Paula)
- JS/CSS/HTML files for frontend (if needed)
- Python scripts for backend logic (if needed)
- Firestore rules (if needed)
- Tests specific to this feature

This is inspired by modern "vertical slice" architecture — where everything related to one feature lives together.

### 2. Shared Code by Layer
Some parts of the code are reused across features. These live outside the `/features/` directory:
- `/frontend/` → shared UI code, styles, and helper functions (Vanilla JS)
- `/backend/` → shared Python utilities, Firebase functions, and Firestore rules
- `/tests/` → global tests that cover cross-feature logic
- `/assets/` → global static assets (images, icons, fonts)

---

## 🔧 Tech Stack

- **Frontend**: HTML / CSS / JavaScript (Vanilla only)
- **Backend**: Python scripts + Firebase (Firestore, Cloud Functions, Auth, etc.)
- **Database**: Firestore (NoSQL, real-time)
- **Infra**: Google Cloud Platform (no Firebase Hosting)
- **Versioning**: Git (branch-per-feature workflow)
- **Tests**: Unit & integration tests (Python & JS)

---

## 📂 Folder Layout

```plaintext
/agency/               ← Persona files + this agency brief
/features/             ← One folder per complete, isolated feature
/frontend/             ← Shared styles, utilities, components (Vanilla JS)
/backend/              ← Firebase Functions, Python scripts, Firestore rules
/tests/                ← Global and cross-feature tests
/assets/               ← Fonts, images, icons
.env
firebase.json
README.md

My github username = Latimer-lab
My repo = https://github.com/Latimer-lab/Latimer-lab.github.io
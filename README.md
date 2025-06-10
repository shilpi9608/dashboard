## 🚀 Mission Control Dashboard

A responsive mission management platform that simulates task tracking for admins — featuring real-time timers, error logs, authentication, and a clean dashboard. Built for the Jayadhi limited Full Stack Internship assessment (Option 5).

---

### 📸 Demo

> 🔗 [Live Demo](dashboard-beta-lake-81.vercel.app)

### ✅ Features

* **🔐 Authentication System**

  * Login with email/password
  * Persistent Firebase auth state
  * Protected routes with auto-redirect

* **📊 Dashboard Page**

  * Responsive grid for mission cards (3→2→1 columns)
  * Filter tabs: All / Active / Completed
  * Empty state messages + floating action button on mobile

* **➕ Create Mission Page**

  * Clean form (title + description)
  * Client-side validation with error messages
  * Toast notification on success

* **📋 Mission Detail Page**

  * View full mission info
  * Toggle active/completed status
  * Delete mission with confirmation
  * Real-time timer (start/stop, live display)
  * Add/view error logs with timestamps

* **🎨 UI/UX Design**

  * Mobile-first responsive layout
  * Accessible with ARIA and semantic HTML
  * Dark header, collapsible sidebar, styled cards
  * Minimal 404 page with navigation

---

### 🛠 Tech Stack

| Layer         | Tech                                          |
| ------------- | --------------------------------------------- |
| Frontend      | Next.js (App Router)                          |
| Backend       | Firebase Authentication                       |
| Database      | Firestore                                     |
| UI Components | Tailwind CSS + Lucide Icons                   |
| Extras        | ShadCN UI, Toasts, ARIA roles                 |

---

### 📁 Project Structure

```
/app
  /dashboard       → Auth-protected dashboard + filtering
  /create          → Mission creation form
  /mission/[id]    → Mission detail page with timer, logs
  /login           → Auth page
  /not-found       → 404 handler
/components        → Reusable UI (cards, header, auth context)
```

---

### 🧪 Local Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/shilpi9608/dashboard.git
cd dashboard
```

#### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

#### 3. Set Up Environment Variables

Create a `.env.local` file in the root and add your Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> You can find this config in your Firebase project settings under Web App.

#### 4. Run the App

```bash
npm run dev
# or
yarn dev
```

App will be available at `http://localhost:3000`

---

### 📌 Notes

* Login works with **any email/password combination** after registering.
* Missions are stored in memory — can be upgraded to Firestore
* This project was submitted as part of the **Jayadhi limited Full Stack assignment – Option 5** challenge

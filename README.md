# SocialApp

> A Facebook-inspired social platform built entirely on the frontend — no backend, no database, just React and localStorage doing the heavy lifting.

---

## 🔗 Live Demo

**[https://social-app-amna-sarwar.vercel.app](https://social-app-amna-sawar.vercel.app)** 

---

## 📸 Screenshots

| Feed | Create Post |
|---|---|
| ![Feed page](./screenshots/feed.png) | ![Create post](./screenshots/create-post.png) |

| Profile | Dashboard |
|---|---|
| ![Profile page](./screenshots/profile.png) | ![Dashboard](./screenshots/dashboard.png) |

<!-- Take these screenshots from your running app and drop them in a /screenshots folder at the project root -->

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React (Vite)** | Frontend framework and build tooling |
| **React Router v6** | Client-side routing, nested routes, protected routes |
| **Tailwind CSS** | Utility-first styling, dark mode, responsive design |
| **React Hook Form** | Form state, validation (login, signup, post creation, settings) |
| **Context API** | Global auth state (`currentUser`, login/logout/signup) |
| **localStorage** | Full data persistence — users, posts, comments, likes |
| **clsx** | Conditional className composition |
| **React.lazy + Suspense** | Code-splitting — each route loads its own JS chunk on demand |

No backend, no Firebase, no Supabase, no external database, and no UI component libraries — every pixel is custom Tailwind.

---

## ✨ Features

**Auth**
- Signup with full validation (name, email format, password strength, confirm-password match)
- Login with inline error handling, session persists across page refresh
- Protected routes — the dashboard redirects to `/login` if you're not authenticated, and remembers where you were headed

**Feed**
- Public feed of published posts, newest first
- Real-time search by description (no submit button — filters as you type)
- Guests can see Like/Comment buttons but are redirected to login on click

**Posts**
- Create posts with image upload + live preview, description (10–500 chars, live counter), and Public/Private visibility
- Save as Draft or Publish, from both Create and Edit
- Full CRUD from the dashboard: edit, delete (custom confirmation modal — not the browser's `confirm()`), toggle Public/Private, publish drafts

**Post Detail & Comments**
- Full post view with like/unlike (optimistic UI + a small heart-burst animation)
- Comments visible to everyone; only logged-in users can add one
- Users can delete their own comments, with an inline "Are you sure? Yes / No" confirmation

**Profile**
- Cover image (or a themed gradient fallback), avatar, bio, location, join date
- Shows a user's public posts only
- "Edit Profile" button appears only for the profile owner

**Profile Settings**
- Update name, bio (150-char live counter), location, and avatar
- Changes reflect instantly in the navbar — no page reload

**Extras**
- Dark mode (midnight slate + emerald theme), persisted, on by default
- Skeleton loading states, empty states everywhere a list could be empty
- Fully responsive, from phone to desktop

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/social-app-amna-khan.git

# 2. Move into the project folder
cd social-app-amna-khan

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev

# App opens at http://localhost:5173
```

To build for production:
```bash
npm run build
npm run preview
```

---

## 📁 Folder Structure

```text
social-app/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── RequireAuth.jsx
│   │   ├── post/
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   ├── PostActions.jsx
│   │   │   └── CommentSection.jsx
│   │   ├── profile/
│   │   │   └── ProfileHeader.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       ├── Avatar.jsx
│   │       └── Badge.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── usePosts.js
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── FeedPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── dashboard/
│   │       ├── DashboardLayout.jsx
│   │       ├── PostsDashboard.jsx
│   │       ├── CreatePost.jsx
│   │       ├── EditPost.jsx
│   │       └── ProfileSettings.jsx
│   ├── utils/
│   │   ├── storage.js
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
└── package.json
```

---

## 🗄️ localStorage Data Structure

All data lives under four keys, managed exclusively through `utils/storage.js`.

**`users`**
```js
[
  {
    id: 'usr_1703001234_abc',
    name: 'Amna Khan',
    email: 'amna@example.com',
    password: 'Password123',
    bio: 'Frontend developer',
    location: 'Lahore, Pakistan',
    avatar: 'data:image/jpeg;base64,...',
    coverImage: null,
    joinedAt: '2026-01-15T10:00:00Z',
  }
]
```

**`posts`**
```js
[
  {
    id: 'post_1703001234_xyz',
    authorId: 'usr_1703001234_abc',
    description: 'Hello everyone! This is my first post.',
    image: 'data:image/jpeg;base64,...',
    isPublic: true,
    isDraft: false,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  }
]
```

**`comments`**
```js
[
  {
    id: 'cmt_1703001234',
    postId: 'post_1703001234_xyz',
    authorId: 'usr_1703001234_abc',
    text: 'Great post!',
    createdAt: '2026-01-15T10:05:00Z',
  }
]
```

**`likes`**
```js
[
  {
    id: 'like_1703001234',
    postId: 'post_1703001234_xyz',
    userId: 'usr_1703001234_abc',
    createdAt: '2026-01-15T10:03:00Z',
  }
]
```

---

## 🎓 What I Learned

Building SocialApp taught me how much architecture matters before a single component gets written — starting with `storage.js` and the localStorage data shapes forced me to think through the whole data model up front, which saved me from a lot of rework later. Working with the Context API for authentication showed me the real difference between local component state and state that genuinely needs to be global, and why stripping the password out of the session object matters even in a project with no real backend. React Hook Form made validation-heavy forms (especially the signup flow with password strength rules and `watch()`-based confirm-password matching) far less repetitive than manually wiring `useState` for every field. I also got much more comfortable with `React.lazy` and `Suspense` for route-level code splitting, and with designing reusable components (`Button`, `Input`, `Avatar`, `Modal`, `Badge`) so they could be composed consistently across very different pages instead of rewriting the same markup everywhere. Finally, building the protected-route guard and the guest-interaction redirects clarified for me how much of "auth" in a frontend-only app is really just carefully directed UI state, not real security — which is exactly why a real backend matters for anything beyond a portfolio piece.

---

## ⚠️ Known Limitations

- **No real security**: passwords are stored in plain text in localStorage, and there's no hashing, tokens, or session expiry — a real app needs a backend for this.
- **No persistence across devices/browsers**: since everything lives in the browser's localStorage, data doesn't sync between devices or survive a cleared cache.
- **No pagination**: the feed loads all public posts at once; with real scale this would need pagination or infinite scroll backed by a database query.
- **No image optimization**: images are stored as base64 strings directly in localStorage, which is fine for a demo but would blow past localStorage's ~5–10MB limit with real usage — a real backend would use object storage (S3, Cloudinary) instead.
- **No real-time updates**: if two tabs are open, one won't see the other's likes/comments until it refreshes — a real backend with WebSockets or polling would fix this.
- **With a real backend**, I'd add: server-side validation, JWT-based auth, image upload to cloud storage, real-time notifications, and a proper database (MongoDB, given the rest of my stack) instead of localStorage.

---

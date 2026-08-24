# LinkedIn Clone - Full-Stack Professional Networking Platform

A modern, full-stack **LinkedIn Clone** web application built with **Next.js**, **Redux Toolkit**, **Express.js**, **MongoDB**, and **PDFKit**. Featuring a custom **Liquid Gold & Glassmorphic Design System**, dynamic activity feeds, media post creation, network connection requests, member profiles, and an automated **Executive Resume PDF Generator**.

---

## 🌟 Key Features

### 🔐 Authentication & Account Management
- **Secure Sign Up & Sign In**: Password hashing via `bcrypt` and token-based authentication.
- **Session Persistence**: Automatic user state retrieval and route protection using Redux state.

### 📰 Dynamic Feed & Post Streams
- **Create Post Component**: Rich multi-line text input with real-time media upload preview (images & videos) and easy attachment removal (`✕`).
- **Feed Interactivity**: Like posts, view comment counts, and add comments to posts.
- **Post Management**: Post authors can delete their published posts directly from the feed.

### 👥 Connections & Networking System
- **Connection Requests**: Send, accept, or reject connection invitations.
- **Network Management**: Dedicated views for **My Connections** and pending **Requests**.
- **Context-Aware Action Buttons**: Dynamic button state (`+ Connect`, `Request send`, `Accepted`, `Delete`) synchronized across feed posts and recommended users.

### 👤 Profile Management & Member Profiles
- **My Profile Page**: Customize bio, current position, work experience, education history, and profile picture.
- **Member Profiles**: Dynamic routing (`/userProfile/[username]`) to view any network member's career details and recent activity.

### 📄 Executive Resume PDF Generator
- **Automated Resume Download**: Clicking **📄 Download CV** triggers backend PDF generation powered by `pdfkit` and `sharp`.
- **Professional Formatting**: Styled PDF output with liquid gold headers, user avatar, executive summary, work history, and education layout.

### 🎨 Design System & UI/UX
- **Liquid Gold & Glassmorphism Theme**: Custom CSS variables, background banners (`golden-area.png`), glass cards, focus ring glows, and smooth micro-animations.
- **Redesigned UserCard Sidebar**: Left sidebar displaying golden cover banner, avatar with live online status badge, role title, quick connection stats, and active menu links.
- **Redesigned Navbar & Dropdown Popup**: Top header with logo, search box with focus glow, center navigation items (`Feed`, `My Network`, `My Posts`, `Requests` with badge counts), and user popup menu.

### 📱 100% Fully Responsive Layout
- **Cross-Device Adaptability**: Mobile (`< 600px`), Tablet (`768px - 992px`), and Desktop (`> 1200px`) responsive layouts with zero horizontal page overflow.

---

## 🛠️ Technology Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **Next.js 16** | React framework with SSR and Pages Router |
| **React 19** | Modern UI component library |
| **Redux Toolkit** | State management (`authSlice`, `postSlice`) |
| **CSS Modules** | Component-scoped styling and responsive breakpoints |
| **Axios** | HTTP client for backend REST API communication |

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js & Express.js 5** | RESTful backend web server |
| **MongoDB & Mongoose** | NoSQL database schemas (`User`, `Profile`, `Post`, `ConnectionRequest`) |
| **bcrypt & crypto** | Password hashing and secure token generation |
| **PDFKit & Sharp** | PDF document creation and image formatting |
| **Multer** | File upload handling for avatars and post media |

---

## 📁 Project Structure

```
LinkedIn/
├── backend/
│   ├── controllers/
│   │   ├── user.controller.js      # User auth, profile, and PDF generator handlers
│   │   └── post.controller.js      # Post creation, likes, comments, and feed handlers
│   ├── models/
│   │   ├── user.model.js           # User credentials and token schema
│   │   ├── profile.model.js        # Work history, bio, and education schema
│   │   ├── post.model.js           # Feed posts and media schema
│   │   └── connection.model.js    # Followings and connection request schema
│   ├── routes/
│   │   ├── user.route.js           # User & network API endpoints
│   │   └── post.route.js           # Post & comment API endpoints
│   ├── media/                      # Static uploads (pictures, posts, profile_PDF)
│   ├── server.js                   # Express server entry point & static file serving
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── navbar/             # Main navigation header & user popup menu
    │   │   ├── userCard/           # Sidebar profile card with network stats
    │   │   ├── login/              # Sign in form component
    │   │   ├── signup/             # Registration form component
    │   │   └── footer/             # Platform footer links
    │   ├── config/
    │   │   ├── index.js            # Axios client setup (BASE_URL)
    │   │   └── redux/              # Redux store, actions, and reducers
    │   ├── pages/
    │   │   ├── index.jsx           # Landing / Home page
    │   │   ├── auth/               # Sign in / Sign up page
    │   │   ├── dashboard/          # Feed & subpages (myProfile, myConnections, myPosts, requests)
    │   │   └── userProfile/        # Public member profile page ([username].jsx)
    │   └── styles/
    │       ├── Dashboard.module.css # Feed, sidebar & profile layout styles
    │       ├── Home.module.css      # Landing page styles
    │       └── globals.css          # Global resets & overflow protection
    └── package.json
```

---

## 🚀 Getting Started & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)

---

### 1. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `backend` folder:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/linkedin_clone
   ```

4. **Start the backend development server**:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:8000`.*

---

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Next.js development server**:
   ```bash
   npm run dev
   ```
   *The frontend application will run on `http://localhost:3000`.*

---

## 🔌 API Endpoint Summary

### User & Profile Routes (`/`)
- `POST /register` - Create new user account and empty profile.
- `POST /login` - Authenticate user and receive token.
- `GET /get_user_and_profile?token=` - Fetch current user credentials and profile details.
- `PUT /update_user` - Update user name, handle, or email.
- `PUT /update_user_profile` - Update bio, current role, past work, and education.
- `PUT /update_profile_picture` - Upload profile picture.
- `GET /users/download_resume?id=` - Generate executive PDF resume and return file path.
- `GET /user/userProfile?username=` - Fetch public member profile data by username.

### Network & Connection Routes (`/user/`)
- `POST /user/send_connection_request` - Send connection request to another user.
- `GET /user/followings?token=` - Fetch user's outgoing connection requests & accepted connections.
- `GET /user/followers?token=` - Fetch incoming connection requests.
- `POST /user/accept_connection` - Accept incoming connection request.
- `POST /user/reject_connection` - Decline connection request.

### Feed & Post Routes (`/`)
- `POST /post` - Create a new feed post (text & media).
- `GET /posts` - Fetch all posts for the dashboard stream.
- `DELETE /delete_post` - Delete post owned by user.
- `POST /like_post` - Toggle like on a post.
- `POST /comment` - Add a comment to a post.
- `GET /get_comments?post_id=` - Fetch comments for a post.

---

## 📜 License

This project is open source and available under the [ISC License](LICENSE).
<div align="center">

# 💬 Chit-Chat — Web App

**A real-time, full-featured chat application built with React 19 and Firebase.**  
Pairs natively with the [Chit-Chat Android App](https://github.com/Thre4dripper/Chit-Chat-AndroidApp) — same Firestore backend, same real-time experience, every platform.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)

</div>

---

## ✨ Features

### 💬 Messaging
- **Direct Messages** — real-time 1-on-1 chat powered by Firestore `onSnapshot`
- **Group Chats** — create groups, send messages, images & stickers as a team
- **Image sharing** — send photos in DMs and groups; tap any image to open a full-screen zoomable viewer
- **Animated stickers** — 30+ Lottie sticker pack, looping animations, lazy-loaded by viewport
- **Deleted message rendering** — messages unsent on Android show as *"This message was deleted"* on web too

### 👤 User Profiles
- **Google & GitHub sign-in** — OAuth via Firebase Auth
- **Username** — set once, never editable again (enforced in UI)
- **Profile picture** — crop, upload, and update at any time
- **Online / Last Seen** — live status shown in chat headers; updated on focus/blur/beforeunload

### 📋 Chat Management
- **DM profile panel** — view partner's name, bio, shared media grid, common groups
- **Mute notifications** — per-chat and per-group mute toggle
- **Favourite chats** — star important conversations
- **Clear / Delete chat** — clear message history or remove the chat entirely
- **Group profile panel** — change group image (with crop), view members, leave group

### 🔔 Push Notifications
- **Firebase Cloud Messaging (FCM)** — foreground & background push via service worker
- **AWS Lambda delivery** — notifications are dispatched through a serverless Lambda function behind API Gateway (migrated from Appwrite)
- **Smart suppression** — notifications are skipped when the recipient has muted that chat/group
- **Notification click routing** — clicking a notification focuses the open tab and navigates directly to the relevant chat

### 🔍 Discoverability
- **Home screen search** — filter DMs by username and groups by name in real time
- **Common Groups** — DM profile panel lists groups both users share
- **Group member → DM** — tap any group member's avatar to jump to their DM

### 👁️ Read Receipts
- **Seen-by popover** — right-click your own messages to see who has read them, with avatars and usernames
- **Group seen-by** — each name is tappable and navigates to that member's DM

---

## 🤖 Android Companion

The web app shares its entire Firebase backend with the **[Chit-Chat Android App](https://github.com/Thre4dripper/Chit-Chat-AndroidApp)** (Kotlin, Jetpack Compose). Every feature written on Android works on web and vice versa — messages, stickers, group management, read receipts, push notifications — all in real time across both platforms.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript |
| Build Tool | Vite (Rolldown bundler) |
| Styling | Tailwind CSS v4 + MUI v9 |
| State Management | Zustand + Immer |
| Backend / Auth | Firebase 12 (Auth, Firestore, FCM) |
| Push Notifications | FCM + AWS Lambda + API Gateway |
| Animations | Lottie React |
| Forms | React Hook Form + Zod |
| Routing | React Router v7 |
| Image Cropping | react-image-crop |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Firebase project with **Auth**, **Firestore**, and **Cloud Messaging** enabled
- An AWS Lambda function for FCM dispatch (see [notification setup](#push-notifications-setup))

### Installation

```bash
git clone https://github.com/Thre4dripper/Chit-Chat-WebApp.git
cd Chit-Chat-WebApp
yarn install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_FIREBASE_VAPID_KEY=

# AWS Lambda FCM dispatcher
VITE_LAMBDA_FCM_URL=
VITE_LAMBDA_FCM_API_KEY=
VITE_LAMBDA_FCM_AUTH_TOKEN=
```

### Development

```bash
yarn dev
```

### Production Build

```bash
yarn build
yarn preview
```

---

## 🔔 Push Notifications Setup

Notifications are dispatched by an **AWS Lambda** function that uses the Firebase Admin SDK to send FCM messages. The web app calls it with:

```json
POST <VITE_LAMBDA_FCM_URL>
x-api-key: <VITE_LAMBDA_FCM_API_KEY>
Authorization: Bearer <VITE_LAMBDA_FCM_AUTH_TOKEN>

{
  "deviceToken": "<recipient FCM token>",
  "data": { "title": "...", "body": "..." }
}
```

The service worker (`firebase-messaging-sw.js`) is generated at build time from a template so Firebase secrets are never committed to source control.

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components (chat bubbles, dialogs, stickers)
├── firebase/         # Firebase wrappers (Auth, Firestore ops, FCM messaging)
├── fragments/        # Page-level fragment components (home, profile, auth)
├── repositories/     # Data access layer — orchestrates Firebase calls
├── screens/          # Top-level screen components (Auth, Home)
├── store/            # Zustand stores (auth, chats, user, group, profile)
├── enums/            # Shared enums (message types, sticker map)
├── models/           # TypeScript data models
├── utils/            # Utility helpers (chat utils, storage, lottie)
└── assets/           # Lottie animations, sticker packs, auth images
```

---

## 📄 License

MIT


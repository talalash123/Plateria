# 🍽️ Plateria - Homecooked Meal Delivery Platform

**Plateria** is a modern, full-stack mobile application ecosystem designed to connect hungry customers with local home chefs. It features an interactive, high-performance React Native mobile prototype alongside a backend architecture built to scale.

---

## 🚀 Overview

Plateria empowers home chefs to run digital kitchens while offering customers an authentic alternative to commercial fast food. The repository contains a complete UI/UX prototype for both **Customer** and **Vendor** roles, fully equipped with state management, smooth navigation, and realistic mock data flows.

---

## ✨ Key Features

### 📱 Customer App
* **Interactive Discovery & Search:** Filter daily specials by categories (Biryani, Karahi, Haleem, BBQ, Sweets) with instant search capabilities.
* **Kitchen Subscription System:** Follow/subscribe to favorite home chefs to receive real-time updates when new daily menus go live.
* **Rich Dish Cards:** Detailed food listings featuring price badges, prep times, ratings, and dietary indicators (Veg/Non-Veg).
* **Cart & Notification Center:** Live cart counter and an in-app notification drawer with unread tracking indicators.

### 👩‍🍳 Vendor Dashboard
* **Real-time Order Management:** Track incoming, active, and completed orders with instant status toggles.
* **Menu & Dish Controls:** Easily toggle dish availability, update daily specials, and manage pricing.
* **Earnings & Analytics:** Overview of daily revenue, top-selling dishes, and customer feedback.

---

## 🛠️ Tech Stack & Architecture

Plateria System Architecture
├── plateria-mobile/     # React Native (Expo) Frontend Client
└── plateria-backend/    # Server & API Architecture


* **Frontend:** React Native, Expo, React Navigation (Native Stacks & Bottom Tabs), React Native Safe Area Context, Ionicons
* **Styling & UI:** Custom Glassmorphism, Slate & Amber Color Palette, Responsive Layouts
* **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
* **Backend:** Node.js / Express Architecture (API Ready)

---

## 📂 Project Structure

plateria/
├── plateria-mobile/
│   ├── assets/              # App images and fonts
│   ├── components/          # Reusable UI components
│   ├── screens/             # Customer & Vendor screen layouts
│   │   ├── CustomerHomeScreen.js
│   │   ├── KitchenProfileScreen.js
│   │   ├── CartScreen.js
│   │   └── VendorDashboardScreen.js
│   ├── App.js               # Main entry point & Navigation setup
│   └── package.json
│
└── plateria-backend/        # Backend server configurations
└── package.json


---

## ⚙️ Getting Started

### Prerequisites
* **Node.js** (v16.x or higher)
* **npm** or **yarn**
* **Expo Go** app installed on iOS/Android or an emulator running.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/talalash123/Plateria.git](https://github.com/talalash123/Plateria.git)
   cd Plateria
Setup Mobile App:

Bash
cd plateria-mobile
npm install
Run the Mobile Prototype:

Bash
npx expo start
Scan the QR code using the Expo Go app on your phone, or press a for Android Emulator / i for iOS Simulator.

Setup Backend (Optional):

Bash
cd ../plateria-backend
npm install
npm start
🎯 MVP / Prototype Scope
This repository houses a fully working MVP (Minimum Viable Product) prototype designed for client demonstrations, UX testing, and portfolio showcases.

Complete UI/UX Transitions: Seamless screen switching between Customer and Vendor modes.

Simulated Data Flow: Dynamic cart calculations, state updates, and real-time subscription toggles without requiring a live database connection.

Production-Ready Frontend: Pre-configured for immediate backend API integration.

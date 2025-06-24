<div align="center">
  <h1>SynthTrek</h1>
  <h3>AI-Based Trip Planner</h3>
</div>

<br />

## 📍 About The Project

**SynthTrek** is an AI-powered travel planning app that makes organizing your trips easier and more efficient. It uses artificial intelligence to understand your preferences and provide personalized suggestions for places to visit, where to stay, and things to do.

### ✨ Key Features

- **Personalized Recommendations:** AI recommends the best destinations, hotels, and activities based on your preferences.
- **Automated Itinerary Generation:** Automatically creates a complete travel plan, considering travel time and user preferences.

SynthTrek aims to improve your travel experience through a simple, user-friendly platform for planning trips — perfect for both casual travelers and frequent explorers.

---

## ⚙️ Built With

This project is built using popular tools and services like:

- React
- Google Maps API
- Gemini AI
- Auth0
- Firebase

---

## 🚀 Getting Started

Setting up SynthTrek is easy! Just configure your `.env` file, and you're good to go.

### ✅ Prerequisites

- **Node.js (v16.0 or newer)** – [Download Node.js](https://nodejs.org/)
- **VS Code** (or any preferred code editor) – [Download VS Code](https://code.visualstudio.com/)

---

## 🔑 Services & API Key Setup

<details>
<summary>🗺 Google Cloud Setup</summary>

1. Create an account at [Google Cloud](https://cloud.google.com/).
2. You'll receive ₹25,000 in free credits as a new user.
3. Go to **APIs & Services** → **Credentials** → create an API key.
4. Enable the following APIs:
   - Maps JavaScript API
   - Maps Embed API
   - Geolocation API
   - Geocoding API
   - Places API
   - Places API (New)
5. Add the key to your `.env` file:
   ```env
   VITE_GOOGLE_MAP_API_KEY="YOUR_GOOGLE_API_KEY"

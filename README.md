# 🌧️ MazhaCar (മഴക്കാർ)

**Live Demo:** [mazhacar.vercel.app](https://mazhacar.vercel.app)

MazhaCar is an AI-powered weather decision platform designed for India, with Malayalam as the default language. Instead of just showing temperatures, it calculates weather variables to answer practical everyday questions:
- *Can I dry clothes today?*
- *Should I carry an umbrella?*
- *Is it safe to travel?*
- *Is it suitable for farming?*

---

## 🚀 How to Run Locally

### 1. Open your terminal in the project folder and navigate to `frontend`:
```bash
cd frontend
```

### 2. Start the local server:
```bash
npm run dev
```

### 3. Open in your browser:
Go to **[http://localhost:3000](http://localhost:3000)** (or the port shown in your terminal).

---

## ⚡ How to Deploy on Vercel

You can deploy the live application on Vercel for free in under a minute:

1. Import your GitHub repository into Vercel.
2. In the **Configure Project** settings, change the **Root Directory** from `./` to **`frontend`**.
3. Click **Deploy**! Vercel will build and deploy only the Next.js frontend, ignoring the backend folder.

---

## 🌟 Key Features

- **Decision Engines**: Computes safety percentages for drying clothes, travel, farming, and outdoors.
- **Multilingual Support**: Supports **Malayalam (മല)**, **English (EN)**, and **Hindi (हिं)** with an instant language toggle right in the mobile header.
- **Resilient Offline Cache**: Automatically stores weather data in `localStorage` so the app continues to work even if you lose network connectivity.
- **Interactive Leaflet Map**: Centers on your active coordinate, marks bookmarked cities, and updates location coordinates when you click on the map.

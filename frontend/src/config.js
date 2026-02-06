
// frontend/src/config.js

// If we are in production (Vercel), use the Render URL.
// If we are in development (Localhost), use localhost:5000.
const API_URL = import.meta.env.MODE === "production" 
  ? "https://instaclone-backend-y2jo.onrender.com/api" 
  : "http://localhost:5000/api";

export default API_URL;
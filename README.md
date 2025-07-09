# 🔥 FirePulse – Reinventing the Fire TV Experience

**Team Name:** Oopsie Operators  
**Team Members:** Ananya Mangal, Mohd Hassan  
**Hackathon Theme:** Enhanced Fire TV Experience  

---

## 🌐 Live Demo

**Deployed Link:** [https://fire-pulse.vercel.app/](https://fire-pulse.vercel.app/)

## 🎥 Demo Video

[Watch on YouTube](https://www.youtube.com/watch?v=A-rQoePfSa8)

---

## 🚀 Overview

**FirePulse** transforms how users engage with Fire TV by making content consumption more **social, interactive, and intelligent**. We address the pain points of passive viewing, weak personalization, and fragmented discovery—turning them into engaging, seamless, and context-aware experiences.

---

## 🌟 Key Features

- **🔄 Friends Liked This**: Discover content your friends liked, rated, or shared—directly on Fire TV.
- **👥 Watch Party + Guess the Plot**: Host synchronized watch sessions with friends and predict what happens next during suspenseful scenes.
- **🎯 Movie Matcher**: Swipe on suggested movies individually and let our algorithm find the perfect match for your group.
- **🧠 Contextual Recommendations**: Dynamic content suggestions based on time, mood, behavior, and social signals.
- **🖼️ Picture-in-Picture Mode**: Watch a movie and live match simultaneously, without switching screens.
- **⏪ Smart Recap**: Personalized, AI-generated recaps of skipped or key scenes before resuming playback.
- **📈 Centralised Dashboard for cross platform viewing**: View trending movies/shows from Hotstar, Netflix, etc., via smart homepage scraping.
- **🤝 Connect & Suggest**: Find friends, suggest content, and share moments easily.
- **📊 Peak Moments**: Visualize and relive the most exciting moments in movies with our Peak Watch Graph.
- **📸 Snap Stories**: Capture and share 10-second highlights (snaps) with friends.

---

## 🖼️ Screenshots

1. **Homepage & Navigation**  
<img width="700" alt="Screenshot 2025-06-21 at 12 42 35 AM" src="https://github.com/user-attachments/assets/e8535cdd-be87-4c71-9c11-bd906d8e429a" />

2. **Watch Party Screen**  
<img width="650" alt="Screenshot 2025-06-21 at 12 48 06 AM" src="https://github.com/user-attachments/assets/6c5803fa-9eb1-4927-9ea9-281db842eab3" />

3. **Movie Matcher**  
<img width="600" alt="Screenshot 2025-06-21 at 12 51 17 AM" src="https://github.com/user-attachments/assets/19c59516-75e7-43e6-a94b-bb90a488ce63" />

4. **Content Detail View**  
<img width="700" alt="Screenshot 2025-06-21 at 12 51 01 AM" src="https://github.com/user-attachments/assets/6ef1eda4-fbc5-4fa3-921c-24ecc20f65a4" />

5. **AI Smart Recap Modal**  
<img width="600" alt="Screenshot 2025-06-21 at 12 50 24 AM" src="https://github.com/user-attachments/assets/4b61e4ad-2123-4f0c-a4df-7e1c261bf071" />

6. **Discover Friends and Suggest Movies**  
<img width="400" height="350" alt="Screenshot 2025-06-21 at 12 49 08 AM" src="https://github.com/user-attachments/assets/78b01081-f900-45d0-bbd5-7d7091e37e97" />
<img width="400" height="350" alt="Screenshot 2025-06-21 at 12 50 03 AM" src="https://github.com/user-attachments/assets/12003d35-dd9e-4e94-bd94-a9f857abeb4b" />

7. **Snap Stories**  
<img width="700" alt="Screenshot 2025-06-21 at 12 48 51 AM" src="https://github.com/user-attachments/assets/18c5c63e-529c-461c-993d-20d13ed15f50" />

---

## 🛠️ Tech Stack

- **Frontend:** React (TypeScript), Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **ML/AI:** Python (recommendation microservice, mood-based suggestions, AI recaps)
- **APIs:** OMDB, Gemini (Google GenAI)
- **Deployment:** Vercel (frontend), [local backend]

---

## 🏗️ Architecture & How It Works

- **Frontend**: Single-page React app with modular components for navigation, recommendations, watch party, and more. Communicates with backend via REST APIs.
- **Backend**: Express.js server with routes for authentication, user management, content, watch parties, and suggestions. Stores data in MongoDB.
- **ML Microservice**: Optional Python service for advanced recommendations and mood-based filtering. Can be run separately and integrated via backend API calls.
- **AI Recaps**: Uses Gemini API for generating smart recaps of skipped or key scenes.

---

## 💻 Installation & Local Setup

This project is a full-stack movie recommendation and watch party platform. It includes:
- A React frontend (already Vercel-ready)
- A Node.js/Express backend (with socket.io for real-time watch parties)
- A Python/Flask microservice for mood-based movie recommendations ("Mood backend")

---

## 1. Running the Mood Backend (Python/Flask) Locally

### **A. Prerequisites**
- Python 3.8+
- pip

### **B. Setup**
1. **Navigate to the project root:**
   ```sh
   cd backend
   # or wherever your mood_service.py and requirements.txt are
   ```
2. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
   Example `requirements.txt`:
   ```
   flask
   joblib
   scikit-learn
   numpy
   pandas
   ```
3. **Ensure your model file is present:**
   - Place `movie_recommender_data.pkl` in the correct directory (e.g., `ML models/`).

4. **Run the Flask app:**
   ```sh
   python mood_service.py
   # or python backend/mood_service.py if that's your file
   ```
   - The service will start on `http://127.0.0.1:10000` (or as set in your code).

5. **Test the endpoint:**
   ```sh
   curl -X POST http://127.0.0.1:10000/predict -H "Content-Type: application/json" -d '{"your": "input"}'
   ```

---

## 2. Running the Node.js Backend (Watch Party API) Locally

### **A. Prerequisites**
- Node.js 16+
- npm
- MongoDB (local or Atlas)

### **B. Setup**
1. **Navigate to the backend directory:**
   ```sh
   cd backend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Create a `.env` file in `backend/` with:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret
   ```
4. **Start the backend:**
   ```sh
   npm start
   ```
   - The server will run on `http://localhost:5000`

---

## 3. Running the Frontend Locally

### **A. Prerequisites**
- Node.js 16+
- npm

### **B. Setup**
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Create a `.env` file in the root with:**
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_MOOD_API_URL=http://localhost:10000
   ```
3. **Start the frontend:**
   ```sh
   npm run dev
   ```
   - The app will run on `http://localhost:5173`

---

## 4. Testing the Watch Party Feature Locally

1. **Start all services:**
   - Start the Node.js backend (`npm start` in `backend/`)
   - Start the Python mood backend (`python mood_service.py`)
   - Start the frontend (`npm run dev`)
2. **Open two browser windows (or use two devices):**
   - Go to `http://localhost:5173` in both.
3. **Register/login as two different users.**
4. **User 1:**
   - Pick a movie and click **Start Watch Party**.
   - Copy the join code shown at the top.
5. **User 2:**
   - Click **Join Watch Party** and enter the code.
6. **Test features:**
   - Both users should see each other in the participants list.
   - Try chat, play/pause sync, and other real-time features.

---

## 5. Notes
- The Python mood backend is only needed for mood-based recommendations.
- The Node.js backend is required for all watch party and user features.
- For production, deploy the Node.js backend and Python backend separately (see deployment section above).

---

## 6. Troubleshooting
- If you see 404s for `/socket.io/` on the Python backend, make sure your frontend is connecting to the Node.js backend for socket.io, not the mood backend.
- Check your `.env` files and environment variables for correct URLs.

---

## 7. Project Structure Reference
```
FireTV-Oopsie-operators/
  backend/
    src/
      index.js         # Node.js/Express entry
      routes/
      models/
    mood_service.py    # Flask app for mood model
    requirements.txt   # For Python service
    package.json       # For Node.js backend
    .env               # For local dev
  ML models/
    movie_recommender_data.pkl
  components/
  ... (frontend code)
```

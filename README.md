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

### Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB (local or Atlas)
- Python 3.x (for ML microservice, optional)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/firepulse.git
cd firepulse
```

### 2. Frontend Setup
```bash
npm install
# Create a .env.local file in the root with your Gemini API key:
echo "GEMINI_API_KEY=your_gemini_api_key" > .env.local
npm run dev
```
- The app will run at `http://localhost:5173` by default.

### 3. Backend Setup
```bash
cd backend
npm install
# Create a .env file in backend/ with the following:
# MONGODB_URI=mongodb://localhost:27017/firepulse
# JWT_SECRET=your_jwt_secret
# PORT=5000
npm run dev
```
- The backend API runs at `http://localhost:5000` by default.

### 4. (Optional) ML Microservice
- Go to `ML models/` and run the Python notebook or script for recommendations.
- Ensure the backend is configured to call the ML microservice if you want advanced recommendations.

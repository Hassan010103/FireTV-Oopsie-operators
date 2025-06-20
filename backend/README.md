# FirePulse Backend

This is the backend for the FirePulse TV Content Discovery app.

## Features
- User authentication (JWT)
- User profiles and friends
- Content management and recommendations
- Watch parties and chat
- Suggestions and snaps
- MongoDB for data storage

## Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the backend folder with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/firepulse
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
3. Start the backend:
   ```bash
   npm run dev
   ```

## API
- The API runs on `http://localhost:5000` by default.
- See `routes/` for endpoint details.

## ML Recommendations
- (Optional) To use the ML model, run the Python microservice in `ML models/` and configure the backend to call it. 
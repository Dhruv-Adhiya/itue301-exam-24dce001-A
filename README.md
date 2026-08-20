# Hospital Appointment System (MedCare Plus)

This is a full-stack web application designed for a private hospital (MedCare Plus) to maintain basic information about doctors, patients, and appointments.

## 1. Project Name
**MedCare Plus - Hospital Appointment System**

## 2. Frontend Setup and Run Command
The frontend is a React application scaffolded with Vite.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 3. Backend Setup and Run Command
The backend is an Express REST API.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
*(Alternatively, you can run `node server.js` to start the backend).*

## 4. MongoDB Setup
The application uses Mongoose to interact with MongoDB.

1. You must have MongoDB running locally on your machine, or you can use a cloud instance like MongoDB Atlas.
2. If running locally, ensure your MongoDB service is active (usually running on port `27017`).
3. Once the Express server is started, Mongoose will automatically connect and build the database using the defined schemas (Patient, Doctor, Appointment).

## 5. Required Environment Variables
The backend requires environment variables to connect to the database and configure the server port. 

Navigate to the `backend` directory and create a `.env` file (you can use `.env.example` as a template). Ensure it includes the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam_db
```
*(If you are using MongoDB Atlas, replace the connection string with your remote URI).*

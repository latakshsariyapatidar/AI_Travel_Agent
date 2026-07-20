# Getting Started

Follow these instructions to set up the AI Travel Assistant locally on your machine.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
- [Google Gemini API Key](https://aistudio.google.com/)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/latakshsariyapatidar/AI_Travel_Agent
   cd VITRAGA_Assessment
   ```

2. **Backend Setup:**
   Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. **Environment Variables:**
   Copy the example environment file and configure it with your credentials:
   ```bash
   cp .env.example .env
   ```
   Open `backend/.env` and fill in your `GEMINI_API_KEY` and `MONGODB_CONNECTION_URI`.

4. **Frontend Setup:**
   Open a new terminal, navigate to the frontend directory, and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. **Start the Backend:**
   In the `backend` directory, start the server:
   ```bash
   npm run dev
   ```
   The backend should now be running on `http://localhost:8989`.

2. **Start the Frontend:**
   In the `frontend` directory, start the Vite development server:
   ```bash
   npm run dev
   ```
   This will typically start on `http://localhost:5173`. Open this URL in your browser to access the application.

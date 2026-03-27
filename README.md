# AgriTwin AI: Intelligent Digital Twin System for Smart Agriculture

AgriTwin AI is an advanced, AI-driven Intelligent Digital Twin platform designed to revolutionize smart farming. By integrating real-time sensor data with machine learning models, the system provides farmers with actionable insights to optimize crop yields and farm productivity.

## 🚀 Key Features

- **Real-time Crop Monitoring**: Live tracking of temperature, humidity, soil pH, and moisture levels across multiple crop types (Rice, Wheat, Corn, Turmeric, Tomato).
- **ML-Based Yield Prediction**: Utilizes XGBoost and Random Forest ML models to forecast crop yields based on historic data and real-time environmental factors.
- **AI Harvest Advisor**: Recommends the optimal harvest window and projected revenue based on crop maturity and market demand.
- **Critical Alert System**: Automated email and SMS alerts for critical water needs and environmental stressors.
- **Intelligent AI Chatbot**: An interactive assistant that helps farmers navigate the dashboard and understand complex data.

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite** for a performant, modern UI.
- **Tailwind CSS** for responsive, mobile-first design.
- **Lucide React** for premium iconography.
- **Recharts** for interactive data visualization.

### Backend
- **FastAPI (Python)** for a high-performance, asynchronous backend.
- **ML Engine**: Custom simulation engine for real-time sensor data and predictive analytics.
- **SMTP Integration**: Secure alert system for critical notifications.

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Setup Frontend
```bash
npm install
npm run dev
```

### Setup Backend
```bash
cd backend
pip install fastapi uvicorn pydantic python-dotenv
uvicorn main:app --reload
```

## 📄 License
This project is licensed under the MIT License.

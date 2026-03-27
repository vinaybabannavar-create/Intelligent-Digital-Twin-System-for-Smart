from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(env_path, override=True)

# Ensure backend directory is in path for local imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from ml_engine import ml_engine
except ImportError:
    from .ml_engine import ml_engine

app = FastAPI(
    title="AgriTwin AI Backend",
    description="Real-time ML Data Simulation for Smart Twin System",
    version="1.0.0"
)

class EmailRequest(BaseModel):
    crop_name: str
    water_need: float
    mobile_number: str
    receiver_email: str

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    """Health check endpoint"""
    return {"status": "online", "message": "AgriTwin AI Live Data Server"}

@app.get("/api/live-data/{crop_name}")
async def get_crop_data(crop_name: str):
    """Fetch real-time metrics for a specific crop"""
    valid_crops = ["Rice", "Wheat", "Corn", "Turmeric", "Tomato"]
    
    # Normalize input
    name = crop_name.capitalize()
    if name not in valid_crops:
        name = "Rice"
            
    return ml_engine.get_live_metrics(name)

@app.post("/api/send-alert")
async def send_alert_email(request: EmailRequest):
    """Send critical email alert securely using smtplib"""
    sender_email = os.environ.get("SENDER_EMAIL")
    sender_password = os.environ.get("SENDER_PASSWORD")
    smtp_server = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", 587))

    if not sender_email or not sender_password:
        # We don't want to crash the frontend API, just return an error state indicating config is needed
        raise HTTPException(status_code=500, detail="Backend Email settings not configured in .env file.")

    if not request.receiver_email:
        raise HTTPException(status_code=400, detail="No receiver email provided by the frontend.")

    try:
        msg = MIMEMultipart()
        msg['From'] = f"AgriTwin System <{sender_email}>"
        msg['To'] = request.receiver_email
        msg['Subject'] = f"CRITICAL WATER ALARM: {request.crop_name}"

        body = f"""
        Alert for Farm linked to phone: {request.mobile_number}
        
        The water need for {request.crop_name} has reached a CRITICAL state.
        Current Water Need calculation: {request.water_need} mm/day.
        
        Immediate action is required. Log into the Digital Twin Dashboard for details.
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, request.receiver_email, text)
        server.quit()
        
        return {"status": "success", "message": "Email sent successfully."}
    except Exception as e:
        print(f"SMTP Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

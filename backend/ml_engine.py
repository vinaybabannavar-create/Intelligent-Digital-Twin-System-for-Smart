import time
import math

class CropMLEngine:
    def __init__(self):
        # Base values for each crop (aligned with frontend cropData.js)
        self.base_data = {
            "Rice": {"temp": 32, "hum": 78, "wind": 14, "health": 92, "price": 18.0, "grain_range": (150, 250), "unit": "Grains/Panicle", "moisture_range": (75, 90), "ph_base": 6.2, "ph_range": (5.5, 6.5)},
            "Wheat": {"temp": 18, "hum": 55, "wind": 8, "health": 88, "price": 22.0, "grain_range": (40, 60), "unit": "Grains/Head", "moisture_range": (40, 60), "ph_base": 6.5, "ph_range": (6.0, 7.5)},
            "Corn": {"temp": 34, "hum": 72, "wind": 12, "health": 85, "price": 14.0, "grain_range": (600, 800), "unit": "Kernels/Ear", "moisture_range": (50, 70), "ph_base": 5.6, "ph_range": (5.8, 7.0)},
            "Turmeric": {"temp": 28, "hum": 82, "wind": 6, "health": 90, "price": 85.0, "grain_range": (8, 15), "unit": "Rhizomes/Plant", "moisture_range": (60, 80), "ph_base": 5.8, "ph_range": (4.5, 7.5)},
            "Tomato": {"temp": 30, "hum": 68, "wind": 10, "health": 87, "price": 18.0, "grain_range": (20, 45), "unit": "Fruits/Plant", "moisture_range": (65, 85), "ph_base": 7.1, "ph_range": (6.0, 6.8)}
        }

    def get_live_metrics(self, crop_name: str):
        crop = self.base_data.get(crop_name, self.base_data["Rice"])
        
        # Deterministic simulation for sensor data (fluctuates)
        t = time.time()
        sin_t = math.sin(t / 10.0)
        cos_t = math.cos(t / 12.0)
        
        # Soil Moisture Logic: Base + Health Influence + Time Flux
        m_low, m_high = crop["moisture_range"]
        health_impact = (crop["health"] - 70) / 30.0 # Better health = better retention
        moisture_base = m_low + (m_high - m_low) * 0.6
        soil_moisture = round(moisture_base + (health_impact * 5) + cos_t * 3, 1)
        soil_moisture = max(min(soil_moisture, 100), 0)
        
        # STABLE AI Prediction Logic
        # We use a hash of the crop name to select a 'fixed' point in the range
        # This simulates a one-time high-accuracy AI inference result
        import hashlib
        seed = int(hashlib.md5(crop_name.encode()).hexdigest(), 16)
        low, high = crop["grain_range"]
        
        # Use a stable factor derived from health score but WITHOUT real-time flux
        health_factor = (crop["health"] / 100.0)
        # Add a bit of 'uniqueness' per crop using the seed
        stable_variation = (seed % 10) / 100.0 # ±5% variation based on seed
        base_count = low + (high - low) * (health_factor + stable_variation)
        predicted_count = int(min(max(base_count, low), high))
        # Soil pH Logic: Based on crop default, fluctuates slightly with moisture/temp
        ph_base = crop["ph_base"]
        # slight fluctuation based on time & simulated moisture
        ph_fluctuation = (sin_t * 0.1) + ((soil_moisture - moisture_base) / 100.0 * 0.2)
        soil_ph = round(ph_base + ph_fluctuation, 2)
        
        # Water Need Logic: Base + Temperature influence - Humidity influence
        # We'll use a simple linear model for simulation
        temp_current = round(crop["temp"] + sin_t * 0.8, 1)
        hum_current = round(crop["hum"] + math.cos(t / 12.0) * 2, 1)
        
        # Base daily from frontend (Rice: 8, Wheat: 4, etc.)
        water_base = {
            "Rice": 8.0, "Wheat": 4.0, "Corn": 6.0, "Turmeric": 4.0, "Tomato": 6.0
        }.get(crop_name, 5.0)
        
        # Fluctuations: +0.2mm per degree above base, -0.1mm per % above base humidity
        water_need = water_base + (temp_current - crop["temp"]) * 0.2 - (hum_current - crop["hum"]) * 0.1
        water_need = round(max(0.5, water_need), 1)

        return {
            "temperature": temp_current,
            "humidity": hum_current,
            "wind_speed": round(crop["wind"] + math.sin(t / 20.0) * 1.2, 1),
            "health_score": round(crop["health"] + math.sin(t / 30.0) * 1, 1),
            "current_price": round(crop["price"] + math.sin(t / 25.0) * 0.5, 2),
            "grain_count": predicted_count,
            "grain_unit": crop["unit"],
            "soil_moisture": soil_moisture,
            "soil_ph": soil_ph,
            "water_need": water_need,
            "ai_status": self._get_ai_status(),
            "last_updated": time.strftime("%H:%M:%S")
        }

    def _get_ai_status(self):
        statuses = ["Optimizing...", "Analyzing...", "Syncing...", "Monitoring..."]
        return statuses[int(time.time() / 3) % 4]

# Global instance
ml_engine = CropMLEngine()

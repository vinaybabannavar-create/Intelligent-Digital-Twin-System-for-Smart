import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCropData, getCropList } from '../data/cropData';

const CropContext = createContext(null);

export const CropProvider = ({ children }) => {
    const [selectedCrop, setSelectedCrop] = useState('Rice');
    const cropData = getCropData(selectedCrop);
    const cropList = getCropList();

    // Core Engine: Centralized Real-time Data
    const [liveData, setLiveData] = useState({
        temperature: cropData.weather.temperature,
        humidity: cropData.weather.humidity,
        windSpeed: cropData.weather.windSpeed,
        healthScore: cropData.healthScore,
        currentPrice: cropData.market.currentPrice,
        grainCount: 0,
        grainUnit: '...',
        soilMoisture: 0,
        soilPH: cropData.soilPH.current,
        waterNeed: cropData.waterRequirement.daily,
        aiStatus: 'Syncing...'
    });

    useEffect(() => {
        const fetchRealtimeData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/live-data/${selectedCrop}`);
                if (!response.ok) throw new Error('Backend offline');
                const data = await response.json();

                setLiveData({
                    temperature: data.temperature,
                    humidity: data.humidity,
                    windSpeed: data.wind_speed,
                    healthScore: data.health_score,
                    currentPrice: data.current_price,
                    grainCount: data.grain_count,
                    grainUnit: data.grain_unit,
                    soilMoisture: data.soil_moisture,
                    soilPH: data.soil_ph,
                    waterNeed: data.water_need,
                    aiStatus: data.ai_status
                });
            } catch (error) {
                console.error("FastAPI Sync Error:", error);
                // Fallback to minimal simulation or static data if backend down
                setLiveData(prev => ({ ...prev, aiStatus: 'Offline (Reconnect...)' }));
            }
        };

        // Reset baseline immediately so UI doesn't show old crop's data while waiting for API
        setLiveData({
            temperature: cropData.weather.temperature,
            humidity: cropData.weather.humidity,
            windSpeed: cropData.weather.windSpeed,
            healthScore: cropData.healthScore,
            currentPrice: cropData.market.currentPrice,
            grainCount: 0,
            grainUnit: '...',
            soilMoisture: 0,
            soilPH: cropData.soilPH.current,
            waterNeed: cropData.waterRequirement.daily,
            aiStatus: 'Syncing...'
        });

        fetchRealtimeData(); // Fetch immediately
        const interval = setInterval(fetchRealtimeData, 2000);
        return () => clearInterval(interval);
    }, [selectedCrop, cropData]);

    const switchCrop = useCallback((cropName) => {
        setSelectedCrop(cropName);
    }, []);

    return (
        <CropContext.Provider value={{ selectedCrop, cropData, cropList, switchCrop, liveData }}>
            {children}
        </CropContext.Provider>
    );
};

export const useCrop = () => {
    const context = useContext(CropContext);
    if (!context) throw new Error('useCrop must be used within CropProvider');
    return context;
};

export default CropContext;

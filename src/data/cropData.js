// Comprehensive mock data for each crop — simulates ML/AI model outputs
const cropDatabase = {
    Rice: {
        name: 'Rice',
        emoji: '🌾',
        color: '#22c55e',
        season: 'Kharif (Jun–Nov)',
        growthDurationDays: 120,
        stages: [
            { name: 'Germination', duration: '7 days', status: 'completed', date: 'Jan 15' },
            { name: 'Seedling', duration: '20 days', status: 'completed', date: 'Feb 05' },
            { name: 'Tillering', duration: '30 days', status: 'completed', date: 'Mar 04' },
            { name: 'Flowering', duration: '25 days', status: 'current', date: 'Mar 29' },
            { name: 'Ripening', duration: '30 days', status: 'upcoming', date: 'Apr 28' },
        ],
        currentStage: 'Flowering',
        daysToHarvest: 28,
        healthScore: 92,
        ndviScore: 0.78,
        yieldPerAcre: 3.8,   // tons
        seedRatePerAcre: 30,  // kg
        waterRequirement: { daily: 8, unit: 'mm/day', status: 'critical', message: 'Water stress risk detected. Recommended irrigation within 2 days.' },
        profit: { past: 45000, predicted: 72000, currency: '₹' },
        soilPH: { current: 6.2, optimalRange: [5.5, 6.5], soilType: 'Clayey Loam', status: 'normal', recommendation: 'pH is within optimal range. Maintain current soil amendments.' },
        diseases: [
            {
                name: 'Blast Disease',
                confidence: 89,
                severity: 'High',
                cause: 'Magnetic fungus (Magnaporthe grisea) triggered by high night-time humidity (>90%).',
                treatment: 'Apply systemic fungicide (Tricyclazole) and avoid over-fertilization with nitrogen.'
            },
            {
                name: 'Sheath Blight',
                confidence: 74,
                severity: 'Medium',
                cause: 'Soil-borne pathogen spreading due to dense planting and high water levels.',
                treatment: 'Drain field for 48 hours and apply Validamycin-based organic repellent.'
            },
            {
                name: 'Brown Spot',
                confidence: 62,
                severity: 'Low',
                cause: 'K+ deficiency coupled with prolonged leaf wetness.',
                treatment: 'Boost Potassium (K) application and improve field aeration.'
            },
        ],
        sectors: [
            { id: 'NW-1', name: 'Northwest Quadrant', ndvi: 0.65, status: 'Healthy', message: 'Optimal growth, no intervention needed.' },
            { id: 'NE-2', name: 'Northeast Quadrant', ndvi: 0.42, status: 'Moderate', message: 'Slight nitrogen deficiency detected. Consider top-dressing.' },
            { id: 'SW-3', name: 'Southwest Quadrant', ndvi: 0.78, status: 'Healthy', message: 'Vibrant canopy, excellent biomass density.' },
            { id: 'SE-4', name: 'Southeast Quadrant', ndvi: 0.28, status: 'Poor', message: 'Water stagnation detected. Review drainage immediately.' },
        ],
        ndviTrend: [
            { week: 'W1', score: 0.35 },
            { week: 'W2', score: 0.45 },
            { week: 'W3', score: 0.58 },
            { week: 'W4', score: 0.72 },
            { week: 'Current', score: 0.78 },
        ],
        aiInsights: {
            summary: "AI analysis detects optimal photosynthesis but warns of high transpiration due to humidity levels.",
            genAiReport: "Your Rice crop is currently entering the critical 'Flowering' stage. Bayesian ML models suggest a 15% increase in nitrogen absorption efficiency if irrigated immediately. Satellite spectrography shows a minor NDVI dip in the north-west quadrant, likely due to localized nutrient leaching.",
            mlModel: {
                name: "Random Forest Regressor v4.2",
                accuracy: "94.8%",
                features: ["Leaf Area Index", "Chlorophyll Concentration", "Soil CEC"]
            }
        },
        weather: {
            temperature: 32, humidity: 78, rainfall: 12, windSpeed: 14,
            forecast: [
                { day: 'Today', temp: 32, rain: 12, icon: '🌧️' },
                { day: 'Tue', temp: 30, rain: 8, icon: '⛅' },
                { day: 'Wed', temp: 29, rain: 2, icon: '☀️' },
                { day: 'Thu', temp: 31, rain: 0, icon: '☀️' },
                { day: 'Fri', temp: 33, rain: 15, icon: '🌧️' },
            ]
        },
        market: {
            currentPrice: 18,
            predictedPrice: 28,
            priceChange: '+55%',
            region: 'Karnataka',
            harvestPeak: '15 Sept – 5 Oct',
            supplyLevel: 'HIGH',
            demandTrend: [
                { month: 'Mar', demand: 40, price: 15 },
                { month: 'Apr', demand: 60, price: 18 },
                { month: 'May', demand: 85, price: 21 },
                { month: 'Jun', demand: 100, price: 28 },
                { month: 'Jul', demand: 90, price: 30 },
                { month: 'Aug', demand: 50, price: 20 },
            ],
            monthlyDemand: [
                { month: 'Jul', level: 'Medium' },
                { month: 'Aug', level: 'High' },
                { month: 'Sep', level: 'Very High' },
            ]
        },
        harvest: {
            optimalDate: 'May 5',
            sellingWindow: 'May 7 – May 10',
            expectedPrice: 30,
            maturity: 95,
            recommendation: 'Delay selling until Oct 7–10. Market demand is forecasted to peak following regional festival season.'
        },
        alerts: [
            { type: 'warning', title: '⚠️ Pest Risk Detected', message: 'Aphid activity in Sector B. Apply neem oil spray immediately.' },
            { type: 'water', title: '💧 Irrigation Required', message: 'Soil moisture dropped below 35%. Schedule irrigation within 48 hours.' },
            { type: 'price', title: '📈 Market Price Rising', message: 'Rice price has risen 15% in the last 48h. Consider delaying sale.' },
            { type: 'harvest', title: '🌾 Harvest Window Approaching', message: 'Optimal harvest window opens in 3 days. Prepare equipment.' },
        ]
    },

    Wheat: {
        name: 'Wheat',
        emoji: '🌾',
        color: '#f59e0b',
        season: 'Rabi (Nov–Apr)',
        growthDurationDays: 140,
        stages: [
            { name: 'Germination', duration: '10 days', status: 'completed', date: 'Nov 10' },
            { name: 'Tillering', duration: '35 days', status: 'completed', date: 'Dec 15' },
            { name: 'Jointing', duration: '25 days', status: 'current', date: 'Jan 09' },
            { name: 'Heading', duration: '20 days', status: 'upcoming', date: 'Jan 29' },
            { name: 'Ripening', duration: '35 days', status: 'upcoming', date: 'Mar 05' },
        ],
        currentStage: 'Jointing',
        daysToHarvest: 55,
        healthScore: 88,
        ndviScore: 0.72,
        yieldPerAcre: 2.5,
        seedRatePerAcre: 45,
        waterRequirement: { daily: 5, unit: 'mm/day', status: 'critical', message: 'Water stress detected. Immediate irrigation recommended.' },
        profit: { past: 38000, predicted: 55000, currency: '₹' },
        soilPH: { current: 6.5, optimalRange: [6.0, 7.5], soilType: 'Alluvial', status: 'normal', recommendation: 'Optimum pH for nutrient availability. No action needed.' },
        diseases: [
            {
                name: 'Rust Disease',
                confidence: 81,
                severity: 'High',
                cause: 'Airborne spores (Puccinia) thriving in cool, moist morning temperatures.',
                treatment: 'Immediate application of Propiconazole 25% EC.'
            },
            {
                name: 'Powdery Mildew',
                confidence: 67,
                severity: 'Medium',
                cause: 'Dry foliage coupled with high atmospheric humidity.',
                treatment: 'Sulfur-based spray (Wettable Sulfur 80% WP) and increased spacing.'
            },
            {
                name: 'Loose Smut',
                confidence: 45,
                severity: 'Low',
                cause: 'Internal seed-borne infection activated during jointing.',
                treatment: 'Seed treatment with Carboxin before next sowing cycle.'
            },
        ],
        sectors: [
            { id: 'N-1', name: 'North Border', ndvi: 0.72, status: 'Healthy', message: 'Consistent jointing observed across border.' },
            { id: 'C-2', name: 'Central Field', ndvi: 0.68, status: 'Healthy', message: 'Optimal chlorophyll concentration.' },
            { id: 'S-3', name: 'South Border', ndvi: 0.55, status: 'Moderate', message: 'Slight frost damage on outer leaves.' },
        ],
        ndviTrend: [
            { week: 'W1', score: 0.40 },
            { week: 'W2', score: 0.50 },
            { week: 'W3', score: 0.65 },
            { week: 'W4', score: 0.70 },
            { week: 'Current', score: 0.72 },
        ],
        aiInsights: {
            summary: "ML models predict robust growth despite cooler temperatures.",
            genAiReport: "CNN-based disease scanning shows zero rust indicators in the current jointing stage. XGBoost price forecasting indicates a 12% rise in MSP next month. Recommendation: Maintain current soil pH of 6.5 for maximum nutrient uptake.",
            mlModel: {
                name: "XGBoost Classifier v1.8",
                accuracy: "92.3%",
                features: ["Soil Temp", "Daylight Hours", "Phosphorus Level"]
            }
        },
        weather: {
            temperature: 18, humidity: 55, rainfall: 2, windSpeed: 8,
            forecast: [
                { day: 'Today', temp: 18, rain: 2, icon: '☀️' },
                { day: 'Wed', temp: 16, rain: 0, icon: '☀️' },
                { day: 'Thu', temp: 14, rain: 0, icon: '⛅' },
                { day: 'Fri', temp: 15, rain: 5, icon: '🌧️' },
                { day: 'Sat', temp: 17, rain: 0, icon: '☀️' },
            ]
        },
        market: {
            currentPrice: 22,
            predictedPrice: 30,
            priceChange: '+36%',
            region: 'Punjab',
            harvestPeak: '10 Mar – 30 Mar',
            supplyLevel: 'MEDIUM',
            demandTrend: [
                { month: 'Jan', demand: 45, price: 20 },
                { month: 'Feb', demand: 55, price: 22 },
                { month: 'Mar', demand: 70, price: 25 },
                { month: 'Apr', demand: 90, price: 30 },
                { month: 'May', demand: 85, price: 28 },
                { month: 'Jun', demand: 50, price: 22 },
            ],
            monthlyDemand: [
                { month: 'Feb', level: 'Medium' },
                { month: 'Mar', level: 'Very High' },
                { month: 'Apr', level: 'High' },
            ]
        },
        harvest: {
            optimalDate: 'Mar 20',
            sellingWindow: 'Mar 22 – Mar 28',
            expectedPrice: 30,
            maturity: 78,
            recommendation: 'Wheat prices are climbing ahead of Holi season. Hold harvest for peak pricing around March 22–28.'
        },
        alerts: [
            { type: 'warning', title: '⚠️ Frost Warning', message: 'Temperature dropping to 4°C tonight. Cover seedlings if possible.' },
            { type: 'water', title: '💧 Irrigation Scheduled', message: 'Next irrigation due in 5 days based on soil sensor data.' },
            { type: 'price', title: '📈 Wheat Price Steady', message: 'Wheat MSP holding at ₹22/kg. Expected rise in March.' },
        ]
    },

    Corn: {
        name: 'Corn',
        emoji: '🌽',
        color: '#eab308',
        season: 'Kharif (Jun–Oct)',
        growthDurationDays: 100,
        stages: [
            { name: 'Emergence', duration: '10 days', status: 'completed', date: 'Jun 20' },
            { name: 'Vegetative', duration: '30 days', status: 'completed', date: 'Jul 20' },
            { name: 'Tasseling', duration: '15 days', status: 'completed', date: 'Aug 04' },
            { name: 'Silking', duration: '15 days', status: 'current', date: 'Aug 19' },
            { name: 'Maturity', duration: '30 days', status: 'upcoming', date: 'Sep 18' },
        ],
        currentStage: 'Silking',
        daysToHarvest: 32,
        healthScore: 85,
        ndviScore: 0.69,
        yieldPerAcre: 4.2,
        seedRatePerAcre: 8,
        waterRequirement: { daily: 6, unit: 'mm/day', status: 'critical', message: 'Severe water stress. Schedule irrigation immediately.' },
        profit: { past: 28000, predicted: 42000, currency: '₹' },
        soilPH: { current: 5.6, optimalRange: [5.8, 7.0], soilType: 'Sandy Loam', status: 'warning', recommendation: 'Soil slightly acidic. Consider applying agricultural lime.' },
        diseases: [
            {
                name: 'Corn Borer',
                confidence: 78,
                severity: 'High',
                cause: 'Larval feeding on stalks during high humidity cycles.',
                treatment: 'Apply Bacillus thuringiensis (Bt) and release Trichogramma wasps.'
            },
            {
                name: 'Northern Leaf Blight',
                confidence: 65,
                severity: 'Medium',
                cause: 'Fungal growth (Exserohilum turcicum) favored by moderate temperatures and rain.',
                treatment: 'Improve field residue management and apply azoxystrobin spray.'
            },
            {
                name: 'Gray Leaf Spot',
                confidence: 42,
                severity: 'Low',
                cause: 'Prolonged leaf wetness exceeding 12 hours.',
                treatment: 'Rotate crops and use resistant hybrids for next cycle.'
            },
        ],
        sectors: [
            { id: 'C-E1', name: 'East Section', ndvi: 0.75, status: 'Healthy', message: 'Tasseling completed successfully.' },
            { id: 'C-W2', name: 'West Section', ndvi: 0.58, status: 'Moderate', message: 'Low soil moisture detected in upper layer.' },
            { id: 'C-S3', name: 'South Section', ndvi: 0.69, status: 'Healthy', message: 'Uniform silk development.' },
        ],
        ndviTrend: [
            { week: 'W1', score: 0.25 },
            { week: 'W2', score: 0.42 },
            { week: 'W3', score: 0.55 },
            { week: 'W4', score: 0.65 },
            { week: 'Current', score: 0.69 },
        ],
        aiInsights: {
            summary: "Precision AI detects silking stage completion at 82%.",
            genAiReport: "Multi-modal analysis suggests corn borer risk is escalating due to rising humidity. Generative AI recommends adjusting the drip irrigation flow by +2.5L/hr to compensate for anticipated heatwave next Tuesday. Carbon sequestration rate is currently optimal.",
            mlModel: {
                name: "Deep Neural Network (LSTM)",
                accuracy: "91.5%",
                features: ["Ear Diameter", "Root Depth", "VPD"]
            }
        },
        weather: {
            temperature: 34, humidity: 72, rainfall: 18, windSpeed: 12,
            forecast: [
                { day: 'Today', temp: 34, rain: 18, icon: '🌧️' },
                { day: 'Tue', temp: 32, rain: 5, icon: '⛅' },
                { day: 'Wed', temp: 31, rain: 0, icon: '☀️' },
                { day: 'Thu', temp: 33, rain: 0, icon: '☀️' },
                { day: 'Fri', temp: 35, rain: 20, icon: '⛈️' },
            ]
        },
        market: {
            currentPrice: 14,
            predictedPrice: 22,
            priceChange: '+57%',
            region: 'Maharashtra',
            harvestPeak: '20 Sep – 10 Oct',
            supplyLevel: 'HIGH',
            demandTrend: [
                { month: 'Mar', demand: 35, price: 12 },
                { month: 'Apr', demand: 50, price: 14 },
                { month: 'May', demand: 80, price: 19 },
                { month: 'Jun', demand: 95, price: 22 },
                { month: 'Jul', demand: 60, price: 18 },
                { month: 'Aug', demand: 40, price: 15 },
            ],
            monthlyDemand: [
                { month: 'Sep', level: 'High' },
                { month: 'Oct', level: 'Very High' },
                { month: 'Nov', level: 'Medium' },
            ]
        },
        harvest: {
            optimalDate: 'Sep 25',
            sellingWindow: 'Sep 28 – Oct 5',
            expectedPrice: 22,
            maturity: 82,
            recommendation: 'Corn demand spikes in October for animal feed. Hold until late September for best returns.'
        },
        alerts: [
            { type: 'warning', title: '⚠️ Pest Alert: Corn Borer', message: 'Corn borer larvae detected in 3 fields. Apply Bt spray.' },
            { type: 'water', title: '💧 Moderate Water Stress', message: 'Schedule drip irrigation within 3 days for optimal silk development.' },
            { type: 'harvest', title: '🌽 Harvest Approaching', message: 'Corn ears reaching physiological maturity in ~4 weeks.' },
        ]
    },

    Turmeric: {
        name: 'Turmeric',
        emoji: '🟡',
        color: '#f97316',
        season: 'Kharif (Jun–Feb)',
        growthDurationDays: 240,
        stages: [
            { name: 'Sprouting', duration: '30 days', status: 'completed', date: 'Jan 15' },
            { name: 'Vegetative', duration: '60 days', status: 'completed', date: 'Feb 15' },
            { name: 'Rhizome Formation', duration: '60 days', status: 'current', date: 'Mar 14' },
            { name: 'Maturation', duration: '60 days', status: 'upcoming', date: 'May 13' },
            { name: 'Dormancy', duration: '30 days', status: 'upcoming', date: 'Jul 11' },
        ],
        currentStage: 'Rhizome Formation',
        daysToHarvest: 90,
        healthScore: 90,
        ndviScore: 0.81,
        yieldPerAcre: 6.5,
        seedRatePerAcre: 1000,
        waterRequirement: { daily: 4, unit: 'mm/day', status: 'critical', message: 'Critical moisture drop. Immediate drip irrigation required.' },
        profit: { past: 120000, predicted: 185000, currency: '₹' },
        soilPH: { current: 5.8, optimalRange: [4.5, 7.5], soilType: 'Red Laterite', status: 'normal', recommendation: 'Excellent pH range for rhizome development.' },
        diseases: [
            {
                name: 'Rhizome Rot',
                confidence: 72,
                severity: 'High',
                cause: 'Pythium fungus spreading due to water stagnation and poor drainage.',
                treatment: 'Improve sub-surface drainage and drench with Metalaxyl (0.2%).'
            },
            {
                name: 'Leaf Spot',
                confidence: 58,
                severity: 'Medium',
                cause: 'Colletotrichum fungus infection during high humidity (>80%).',
                treatment: 'Spray Bordeaux mixture (1%) or Mancozeb (0.2%).'
            },
            {
                name: 'Leaf Blotch',
                confidence: 38,
                severity: 'Low',
                cause: 'Taphrina fungus causing leaf deformation in early growth.',
                treatment: 'Remove infected leaves and apply sulfur-based fungicide.'
            },
        ],
        sectors: [
            { id: 'T-N1', name: 'North Slopes', ndvi: 0.82, status: 'Healthy', message: 'Excellent rhizome density predicted.' },
            { id: 'T-S2', name: 'South Valley', ndvi: 0.74, status: 'Healthy', message: 'Stable biomass index.' },
            { id: 'T-E3', name: 'East Ridge', ndvi: 0.25, status: 'Poor', message: 'Soil erosion detected. Reinforce bunds.' },
        ],
        ndviTrend: [
            { week: 'W1', score: 0.50 },
            { week: 'W2', score: 0.62 },
            { week: 'W3', score: 0.71 },
            { week: 'W4', score: 0.78 },
            { week: 'Current', score: 0.81 },
        ],
        aiInsights: {
            summary: "Rhizome growth models indicate high curcumin potential.",
            genAiReport: "Advanced transformer models analyze current soil thermal conductivity as 'High'. Digital twin simulations show a 4% yield increase if organic mulch is applied by Friday. Price prediction models suggest a global supply shortage, favoring Turmeric holders.",
            mlModel: {
                name: "LightGBM Regressor v3.0",
                accuracy: "96.2%",
                features: ["Soil Moisture Index", "Rhizome Density", "Curcumin %"]
            }
        },
        weather: {
            temperature: 28, humidity: 82, rainfall: 8, windSpeed: 6,
            forecast: [
                { day: 'Today', temp: 28, rain: 8, icon: '⛅' },
                { day: 'Tue', temp: 27, rain: 5, icon: '🌧️' },
                { day: 'Wed', temp: 29, rain: 0, icon: '☀️' },
                { day: 'Thu', temp: 30, rain: 0, icon: '☀️' },
                { day: 'Fri', temp: 28, rain: 10, icon: '🌧️' },
            ]
        },
        market: {
            currentPrice: 85,
            predictedPrice: 120,
            priceChange: '+41%',
            region: 'Andhra Pradesh',
            harvestPeak: '1 Feb – 28 Feb',
            supplyLevel: 'LOW',
            demandTrend: [
                { month: 'Mar', demand: 50, price: 80 },
                { month: 'Apr', demand: 60, price: 85 },
                { month: 'May', demand: 75, price: 95 },
                { month: 'Jun', demand: 90, price: 110 },
                { month: 'Jul', demand: 100, price: 120 },
                { month: 'Aug', demand: 70, price: 100 },
            ],
            monthlyDemand: [
                { month: 'Jan', level: 'High' },
                { month: 'Feb', level: 'Very High' },
                { month: 'Mar', level: 'Medium' },
            ]
        },
        harvest: {
            optimalDate: 'Jul 10',
            sellingWindow: 'Jul 12 – Jul 20',
            expectedPrice: 120,
            maturity: 65,
            recommendation: 'Turmeric prices peak around Holi festival. Hold stocks until mid-February for maximum returns.'
        },
        alerts: [
            { type: 'warning', title: '⚠️ Rhizome Rot Risk', message: 'High humidity detected. Improve drainage in low-lying sections.' },
            { type: 'water', title: '💧 Mulching Recommended', message: 'Apply organic mulch to conserve soil moisture during dry spells.' },
            { type: 'price', title: '📈 Turmeric Demand Rising', message: 'Export demand increasing. Prices expected to rise 40% by February.' },
        ]
    },

    Tomato: {
        name: 'Tomato',
        emoji: '🍅',
        color: '#ef4444',
        season: 'Year-round',
        growthDurationDays: 75,
        stages: [
            { name: 'Seedling', duration: '15 days', status: 'completed', date: 'Feb 10' },
            { name: 'Vegetative', duration: '20 days', status: 'completed', date: 'Feb 25' },
            { name: 'Flowering', duration: '15 days', status: 'completed', date: 'Mar 05' },
            { name: 'Fruiting', duration: '15 days', status: 'current', date: 'Mar 15' },
            { name: 'Ripening', duration: '10 days', status: 'upcoming', date: 'Mar 25' },
        ],
        currentStage: 'Fruiting',
        daysToHarvest: 14,
        healthScore: 87,
        ndviScore: 0.74,
        yieldPerAcre: 12.0,
        seedRatePerAcre: 0.2,
        waterRequirement: { daily: 6, unit: 'mm/day', status: 'critical', message: 'Critical water shortage for fruiting stage. Irrigate now.' },
        profit: { past: 65000, predicted: 95000, currency: '₹' },
        soilPH: { current: 7.1, optimalRange: [6.0, 6.8], soilType: 'Black Soil', status: 'warning', recommendation: 'pH slightly alkaline. Consider adding elemental sulfur or organic mulch.' },
        diseases: [
            {
                name: 'Early Blight',
                confidence: 92,
                severity: 'High',
                cause: 'Alternaria solani fungus spreading via air and water-splash during warm, humid weather.',
                treatment: 'Remove lower infected leaves and apply Chlorothalonil fungicide.'
            },
            {
                name: 'Late Blight',
                confidence: 71,
                severity: 'Medium',
                cause: 'Phytophthora infestans thriving in cool, wet conditions (common after heavy rain).',
                treatment: 'Immediate spray of Copper oxychloride and avoid overhead irrigation.'
            },
            {
                name: 'Bacterial Wilt',
                confidence: 55,
                severity: 'Medium',
                cause: 'Ralstonia solanacearum bacteria entering through root wounds in warm soil.',
                treatment: 'No chemical cure. Roguing (remove plant) and long-term crop rotation required.'
            },
        ],
        sectors: [
            { id: 'TM-1', name: 'Greenhouse A', ndvi: 0.88, status: 'Healthy', message: 'Optimal fruiting environment.' },
            { id: 'TM-2', name: 'Open Field B', ndvi: 0.62, status: 'Moderate', message: 'Minor early blight spots detected in Sector B2.' },
            { id: 'TM-3', name: 'South Plot', ndvi: 0.74, status: 'Healthy', message: 'Vigorous growth, high fruit set.' },
        ],
        ndviTrend: [
            { week: 'W1', score: 0.35 },
            { week: 'W2', score: 0.50 },
            { week: 'W3', score: 0.61 },
            { week: 'W4', score: 0.68 },
            { week: 'Current', score: 0.74 },
        ],
        aiInsights: {
            summary: "AI vision models detect early blight onset (4% canopy).",
            genAiReport: "TensorFlow-based disease detection has identified Early Blight symptoms with 92% confidence. Generative AI suggests a targeted fungicide application rather than broad-spectrum spraying. Price forecasting models predict a 2x surge in retail prices by Sep 15.",
            mlModel: {
                name: "EfficientNet-B0 (Computer Vision)",
                accuracy: "97.1%",
                features: ["Leaf Spot Texture", "Stem Coloration", "Ambient Light"]
            }
        },
        weather: {
            temperature: 30, humidity: 68, rainfall: 5, windSpeed: 10,
            forecast: [
                { day: 'Today', temp: 30, rain: 5, icon: '⛅' },
                { day: 'Tue', temp: 31, rain: 0, icon: '☀️' },
                { day: 'Wed', temp: 29, rain: 10, icon: '🌧️' },
                { day: 'Thu', temp: 28, rain: 15, icon: '🌧️' },
                { day: 'Fri', temp: 30, rain: 2, icon: '⛅' },
            ]
        },
        market: {
            currentPrice: 18,
            predictedPrice: 28,
            priceChange: '+55%',
            region: 'Karnataka',
            harvestPeak: '15 Sept – 5 Oct',
            supplyLevel: 'HIGH',
            demandTrend: [
                { month: 'Mar', demand: 40, price: 15 },
                { month: 'Apr', demand: 60, price: 18 },
                { month: 'May', demand: 85, price: 21 },
                { month: 'Jun', demand: 100, price: 28 },
                { month: 'Jul', demand: 90, price: 30 },
                { month: 'Aug', demand: 50, price: 20 },
            ],
            monthlyDemand: [
                { month: 'Aug', level: 'High' },
                { month: 'Sep', level: 'Very High' },
                { month: 'Oct', level: 'High' },
            ]
        },
        harvest: {
            optimalDate: 'Apr 10',
            sellingWindow: 'Apr 12 – Apr 18',
            expectedPrice: 28,
            maturity: 88,
            recommendation: 'Tomato prices surge in September due to festival demand. Harvest at 80% ripeness for best shelf life and pricing.'
        },
        alerts: [
            { type: 'warning', title: '⚠️ Early Blight Detected', message: 'Fungal infection identified. Apply Mancozeb solution immediately.' },
            { type: 'water', title: '💧 Drip Irrigation Needed', message: 'Fruiting stage requires consistent moisture. Schedule irrigation now.' },
            { type: 'price', title: '📈 Price Surge Expected', message: 'Tomato supply shortage predicted. Prices may double by September.' },
            { type: 'harvest', title: '🍅 Harvest in 14 Days', message: 'Fruits reaching optimal color break. Begin harvest preparation.' },
        ]
    },
};

export const getCropList = () => Object.keys(cropDatabase);
export const getCropData = (cropName) => cropDatabase[cropName] || cropDatabase.Rice;
export default cropDatabase;

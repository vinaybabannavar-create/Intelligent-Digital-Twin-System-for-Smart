import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CropHealth from './pages/CropHealth';
import GrowthStage from './pages/GrowthStage';
import YieldPrediction from './pages/YieldPrediction';
import MarketDemand from './pages/MarketDemand';
import HarvestAdvisor from './pages/HarvestAdvisor';
import Settings from './pages/Settings';
import { CropProvider } from './context/CropContext';
import { AlertProvider } from './context/AlertContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <ThemeProvider>
      <CropProvider>
        <ChatProvider>
          <AlertProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/health" element={<CropHealth />} />
                  <Route path="/growth" element={<GrowthStage />} />
                  <Route path="/yield" element={<YieldPrediction />} />
                  <Route path="/demand" element={<MarketDemand />} />
                  <Route path="/harvest" element={<HarvestAdvisor />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </Router>
          </AlertProvider>
        </ChatProvider>
      </CropProvider>
    </ThemeProvider>
  );
}

export default App;

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('agritwin-theme') || 'dark');
    const [region, setRegion] = useState(() => localStorage.getItem('agritwin-region') || 'Global');
    const [alertsEnabled, setAlertsEnabled] = useState(() => localStorage.getItem('agritwin-alerts') !== 'false');
    const [dataSovereignty, setDataSovereignty] = useState(() => localStorage.getItem('agritwin-data') !== 'false');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('agritwin-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('agritwin-region', region);
        localStorage.setItem('agritwin-alerts', alertsEnabled);
        localStorage.setItem('agritwin-data', dataSovereignty);
    }, [region, alertsEnabled, dataSovereignty]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{
            theme, toggleTheme,
            region, setRegion,
            alertsEnabled, setAlertsEnabled,
            dataSovereignty, setDataSovereignty
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

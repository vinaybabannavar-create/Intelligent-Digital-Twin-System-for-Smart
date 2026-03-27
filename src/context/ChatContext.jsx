import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useCrop } from './CropContext';

const ChatContext = createContext(null);

const STORAGE_KEY = 'agribot-chat-history';
const GEMINI_API_KEYS = [
    'AIzaSyCEawiR0YoLZlWxm_TusmGVkIiAYgRMHhs', // Key 1
    // 'PASTE_SECOND_KEY_HERE', // Add more keys here to double/triple your limit
];

// Stable Gemini models
const GEMINI_MODELS = [
    'gemini-1.5-flash',
    'gemini-2.0-flash',
];

const getApiUrl = (model, apiKey) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getSystemPrompt = (selectedCrop, cropData, liveData) => {
    return `You are AgriBot 🌱 — an expert AI agronomist and crop advisor.

CURRENT USER CONTEXT:
- Selected Crop: ${selectedCrop}
- Health Score: ${liveData.healthScore}/100
- Temperature: ${liveData.temperature}°C
- Humidity: ${liveData.humidity}%
- Soil Moisture: ${liveData.soilMoisture}%
- Soil pH: ${liveData.soilPH}
- Growth Stage: ${cropData.growthStage?.current || 'N/A'}
- Optimal Temperature Range: ${cropData.weather?.optimalTemp || 'N/A'}

GUIDELINES:
- Be helpful and practical.
- Use emojis sparingly.
- Keep responses concise.
- Format with markdown.`;
};

const loadChatHistory = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

const saveChatHistory = (messages) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
        console.error('Failed to save chat history:', e);
    }
};

export const ChatProvider = ({ children }) => {
    const { selectedCrop, cropData, liveData } = useCrop();
    const [messages, setMessages] = useState(loadChatHistory);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        saveChatHistory(messages);
    }, [messages]);

    useEffect(() => {
        if (isOpen) setUnreadCount(0);
    }, [isOpen]);

    const toggleChat = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const callGeminiWithFallback = async (contents, signal) => {
        let lastError = null;

        // Try rotating through API keys first
        for (let keyIndex = 0; keyIndex < GEMINI_API_KEYS.length; keyIndex++) {
            const currentApiKey = GEMINI_API_KEYS[keyIndex];

            // For each key, try the available models
            for (const model of GEMINI_MODELS) {
                try {
                    console.log(`AgriBot: Trying ${model} with Key ${keyIndex + 1}...`);
                    const response = await fetch(getApiUrl(model, currentApiKey), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents,
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 1024,
                            }
                        }),
                        signal
                    });

                    if (response.status === 429) {
                        console.warn(`AgriBot: Key ${keyIndex + 1} is rate limited.`);
                        lastError = { status: 429, detail: 'Rate limit exceeded' };
                        break; // Stop trying models for THIS key, move to next key
                    }

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        lastError = { status: response.status, detail: errData?.error?.message || `HTTP ${response.status}` };
                        continue; // try next model
                    }

                    const data = await response.json();
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) return text;

                    lastError = { status: 'empty', detail: 'Empty response from API' };
                } catch (err) {
                    if (err.name === 'AbortError') throw err;
                    lastError = { status: 'network', detail: err.message };
                }
            }

            // If we have more keys, wait a tiny bit before trying the next one if it was a rate limit
            if (lastError?.status === 429 && keyIndex < GEMINI_API_KEYS.length - 1) {
                console.log("AgriBot: Rotating to next API key...");
                await sleep(500);
            } else if (lastError?.status !== 429) {
                // If it's a different error (like 400), don't bother rotating keys, just throw
                throw lastError;
            }
        }
        throw lastError;
    };

    const sendMessage = useCallback(async (text) => {
        if (!text.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: text.trim(),
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Abort any previous in-flight request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const systemPrompt = getSystemPrompt(selectedCrop, cropData, liveData);

            // Build Gemini request contents
            const contents = [
                {
                    role: 'user',
                    parts: [{
                        text: systemPrompt + '\n\nConversation so far:\n' +
                            messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'AgriBot'}: ${m.content}`).join('\n') +
                            '\n\nPlease respond to the latest user message: ' + text.trim()
                    }]
                }
            ];

            const botText = await callGeminiWithFallback(contents, abortControllerRef.current.signal);

            const botMessage = {
                role: 'assistant',
                content: botText,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, botMessage]);
            if (!isOpen) setUnreadCount(prev => prev + 1);

        } catch (error) {
            if (error?.name === 'AbortError') return;
            console.error('Gemini API Error:', error);

            let errorText;
            if (error?.status === 429) {
                errorText = '⚠️ **Rate Limit** — Your Gemini API key has exceeded its free limit. Please wait a minute or use a different key.';
            } else if (error?.status === 'network') {
                errorText = '⚠️ **Network Error** — Could not reach Gemini. Please check your internet connection.';
            } else {
                errorText = `⚠️ **Error** — ${error?.detail || 'Something went wrong. Please try again later.'}`;
            }

            const errorMessage = {
                role: 'assistant',
                content: errorText,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading, selectedCrop, cropData, liveData, isOpen]);

    const clearHistory = useCallback(() => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <ChatContext.Provider value={{
            messages,
            isOpen,
            isLoading,
            unreadCount,
            toggleChat,
            sendMessage,
            clearHistory
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};

export default ChatContext;

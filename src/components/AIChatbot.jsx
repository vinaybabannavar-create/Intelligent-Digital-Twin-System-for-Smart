import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Trash2, Bot, Sparkles, Leaf } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const AIChatbot = () => {
    const { messages, isOpen, isLoading, unreadCount, toggleChat, sendMessage, clearHistory } = useChat();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatPanelRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatContent = (content) => {
        // Basic markdown-like formatting
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded text-xs">$1</code>')
            .replace(/\n/g, '<br/>');
        
        // Convert bullet points
        formatted = formatted.replace(/^[-•]\s(.+)/gm, '<span class="flex gap-1.5"><span class="text-agrigreen-400">•</span><span>$1</span></span>');
        
        return formatted;
    };

    const quickQuestions = [
        "🌾 Best time to plant?",
        "💧 Irrigation advice",
        "🐛 Pest control tips",
        "📈 Yield prediction"
    ];

    return (
        <>
            {/* Floating Chat Button */}
            <button
                id="agribot-toggle"
                onClick={toggleChat}
                className={`fixed bottom-6 right-6 z-50 group transition-all duration-500 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
                aria-label="Open AgriBot Chat"
            >
                <div className="relative">
                    {/* Pulse rings */}
                    <div className="absolute inset-0 rounded-full bg-agrigreen-500/30 animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-agrigreen-500 to-emerald-400 opacity-40 blur-md group-hover:opacity-70 transition-opacity duration-300" />
                    
                    {/* Main button */}
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-agrigreen-500 to-agrigreen-600 flex items-center justify-center shadow-2xl shadow-agrigreen-500/30 group-hover:shadow-agrigreen-500/50 group-hover:scale-110 transition-all duration-300">
                        <Bot className="w-7 h-7 text-white" />
                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                    </div>

                    {/* Unread badge */}
                    {unreadCount > 0 && (
                        <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-bounce shadow-lg">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </div>
            </button>

            {/* Chat Panel */}
            <div
                ref={chatPanelRef}
                className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${
                    isOpen 
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                        : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                }`}
                style={{ width: '400px', maxWidth: 'calc(100vw - 2rem)' }}
            >
                <div className="chatbot-panel rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-slate-700/50 flex flex-col" style={{ height: '550px' }}>
                    
                    {/* Header */}
                    <div className="chatbot-header px-5 py-4 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agrigreen-500 to-emerald-600 flex items-center justify-center shadow-lg">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm tracking-wide">AgriBot AI</h3>
                                <p className="text-agrigreen-400 text-xs font-medium">
                                    {isLoading ? '✨ Thinking...' : '🌱 Online · Crop Assistant'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={clearHistory}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                                title="Clear chat history"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={toggleChat}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                                title="Close chat"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 chatbot-messages space-y-3">
                        {/* Welcome message if no messages */}
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fadeInUp">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-agrigreen-500/20 to-emerald-500/20 flex items-center justify-center mb-4 border border-agrigreen-500/20">
                                    <Bot className="w-8 h-8 text-agrigreen-400" />
                                </div>
                                <h4 className="text-white font-semibold mb-1.5">Welcome to AgriBot! 🌾</h4>
                                <p className="text-slate-400 text-xs mb-5 leading-relaxed">
                                    I'm your AI crop advisor. Ask me about planting, pest control, yield predictions, or anything agriculture-related!
                                </p>
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    {quickQuestions.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setInput(''); sendMessage(q); }}
                                            className="text-xs px-3 py-2.5 rounded-xl bg-slate-800/60 text-slate-300 hover:bg-agrigreen-500/15 hover:text-agrigreen-300 hover:border-agrigreen-500/30 border border-slate-700/50 transition-all duration-200 text-left"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Message bubbles */}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} chat-message-enter`}
                                style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
                            >
                                {msg.role !== 'user' && (
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-agrigreen-500 to-emerald-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 shadow-md">
                                        <Leaf className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                                    <div
                                        className="text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                                    />
                                    <span className={`text-[10px] mt-1.5 block ${msg.role === 'user' ? 'text-agrigreen-200/60 text-right' : 'text-slate-500'}`}>
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="flex items-start gap-2 chat-message-enter">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-agrigreen-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                    <Leaf className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="chat-bubble-bot">
                                    <div className="flex items-center gap-1.5 py-1">
                                        <div className="typing-dot" />
                                        <div className="typing-dot" style={{ animationDelay: '0.15s' }} />
                                        <div className="typing-dot" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-slate-700/50 flex-shrink-0 chatbot-input-area">
                        <div className="flex items-center gap-2 bg-slate-800/70 rounded-xl px-3 py-1.5 border border-slate-700/50 focus-within:border-agrigreen-500/50 transition-colors duration-200">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about crops, weather, yield..."
                                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none py-2"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-9 h-9 rounded-lg bg-gradient-to-br from-agrigreen-500 to-agrigreen-600 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-agrigreen-500/30 active:scale-95 transition-all duration-200"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1.5 text-center">
                            Powered by AgriTech AI Assistant
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AIChatbot;

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AIChatbot from './AIChatbot';

const Layout = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-agridark text-slate-100">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header />
                <main className="w-full grow p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <AIChatbot />
        </div>
    );
};

export default Layout;

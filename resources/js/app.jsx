import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow">
                <h1 className="text-2xl font-bold text-gray-800">
                    Job Tracker is working! 🎉
                </h1>
            </div>
        </div>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
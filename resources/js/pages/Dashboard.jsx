import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
    // Get the user from localStorage that we saved during login
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            // Tell Laravel to delete the token
            await api.post('/logout');
        } catch (err) {
            // Even if the request fails, we still log out on the frontend
            console.log('Logout error:', err);
        } finally {
            // Remove the token and user from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login page
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">
                    Job Tracker
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                        Hello, {user?.name}!
                    </span>
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                        {loading ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto mt-10 p-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome to your Dashboard!
                    </h2>
                    <p className="text-gray-600">
                        Your job applications will appear here. Let's start building!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// The four columns of our board
const COLUMNS = [
    { id: 'applied', label: 'Applied', color: 'bg-blue-500' },
    { id: 'interview', label: 'Interview', color: 'bg-yellow-500' },
    { id: 'offer', label: 'Offer', color: 'bg-green-500' },
    { id: 'rejected', label: 'Rejected', color: 'bg-red-500' },
];

function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    // applications holds all the job applications from the API
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Controls showing/hiding the Add Application form
    const [showForm, setShowForm] = useState(false);

    // Stores what the user types in the form
    const [form, setForm] = useState({
        company: '',
        position: '',
        status: 'applied',
        notes: '',
        applied_at: '',
    });

    // This runs once when the page loads - fetches all applications
    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications');
            setApplications(response.data);
        } catch (err) {
            console.error('Failed to fetch applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddApplication = async () => {
        try {
            const response = await api.post('/applications', form);
            // Add the new application to the list without reloading
            setApplications([response.data, ...applications]);
            // Reset the form
            setForm({
                company: '',
                position: '',
                status: 'applied',
                notes: '',
                applied_at: '',
            });
            setShowForm(false);
        } catch (err) {
            console.error('Failed to add application:', err);
        }
    };

    const handleStatusChange = async (application, newStatus) => {
        try {
            const response = await api.put(`/applications/${application.id}`, {
                status: newStatus,
            });
            // Update the application in the list
            setApplications(applications.map(app =>
                app.id === application.id ? response.data : app
            ));
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/applications/${id}`);
            // Remove the application from the list
            setApplications(applications.filter(app => app.id !== id));
        } catch (err) {
            console.error('Failed to delete application:', err);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (err) {
            console.log('Logout error:', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    // Filter applications by status for each column
    const getApplicationsByStatus = (status) => {
        return applications.filter(app => app.status === status);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Job Tracker</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Hello, {user?.name}!</span>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Add Application
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Add Application Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Add New Application
                        </h2>

                        <div className="mb-3">
                            <label className="block text-gray-700 mb-1">Company</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                value={form.company}
                                onChange={(e) => setForm({ ...form, company: e.target.value })}
                                placeholder="e.g. Google"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-gray-700 mb-1">Position</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                value={form.position}
                                onChange={(e) => setForm({ ...form, position: e.target.value })}
                                placeholder="e.g. Frontend Developer"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="applied">Applied</option>
                                <option value="interview">Interview</option>
                                <option value="offer">Offer</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="block text-gray-700 mb-1">Date Applied</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                value={form.applied_at}
                                onChange={(e) => setForm({ ...form, applied_at: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Notes</label>
                            <textarea
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                placeholder="Any notes about this application..."
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddApplication}
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Save Application
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            <div className="p-6">
                {loading ? (
                    <p className="text-center text-gray-500">Loading applications...</p>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {COLUMNS.map((column) => (
                            <div key={column.id} className="bg-white rounded-lg shadow">
                                {/* Column Header */}
                                <div className={`${column.color} text-white px-4 py-3 rounded-t-lg flex justify-between items-center`}>
                                    <h2 className="font-bold">{column.label}</h2>
                                    <span className="bg-white bg-opacity-30 text-white text-sm px-2 py-0.5 rounded-full">
                                        {getApplicationsByStatus(column.id).length}
                                    </span>
                                </div>

                                {/* Cards */}
                                <div className="p-3 space-y-3 min-h-32">
                                    {getApplicationsByStatus(column.id).map((app) => (
                                        <div key={app.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                                            <h3 className="font-bold text-gray-800">{app.company}</h3>
                                            <p className="text-gray-600 text-sm">{app.position}</p>
                                            {app.notes && (
                                                <p className="text-gray-400 text-xs mt-1 truncate">{app.notes}</p>
                                            )}

                                            {/* Move to another status */}
                                            <div className="mt-2">
                                                <select
                                                    className="text-xs border border-gray-200 rounded px-1 py-1 w-full"
                                                    value={app.status}
                                                    onChange={(e) => handleStatusChange(app, e.target.value)}
                                                >
                                                    <option value="applied">Applied</option>
                                                    <option value="interview">Interview</option>
                                                    <option value="offer">Offer</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>

                                            {/* Delete button */}
                                            <button
                                                onClick={() => handleDelete(app.id)}
                                                className="mt-2 text-xs text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}

                                    {getApplicationsByStatus(column.id).length === 0 && (
                                        <p className="text-gray-400 text-sm text-center py-4">
                                            No applications yet
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
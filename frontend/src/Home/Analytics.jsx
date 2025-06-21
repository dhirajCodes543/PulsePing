import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, Loader2, AlertCircle, Activity } from "lucide-react";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const URLMonitoringDashboard = () => {
    const navigate = useNavigate();
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user || !user.emailVerified) {
            navigate("/");
        }

        const fetchUrls = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = await user.getIdToken();
                const res = await fetch("/api/users/analytics", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setUrls(data.urls.map((u) => u.url));
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUrls();
    }, []);

    const truncate = (url, max = 50) =>
        url.length <= max ? url : `${url.slice(0, max)}…`;

    return (
        <div className="min-h-screen bg-gray-900 text-white relative">
            {/* ── Home button (left) */}
            <Link
                to="/"
                className="fixed top-6 left-6 inline-flex items-center space-x-2
             text-violet-400 hover:text-violet-300 transition-colors duration-200 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Home</span>
            </Link>
            {/* ── Service‑Live badge (right) */}
            <div className="fixed top-6 right-6 z-50 select-none">
                <div className="flex items-center space-x-2 bg-gray-800/90 backdrop-blur px-4 py-2 rounded-full border border-green-500/30">
                    <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
                    </div>
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Service Live</span>
                </div>
            </div>

            {/* ── Main centred content */}
            <main className="w-full max-w-4xl mx-auto pt-24 px-4 md:px-6">
                <header className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r pb-2 from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        API Monitoring Dashboard
                    </h1>
                    <p className="text-gray-400 text-lg">Monitor up to 10 APIs with real-time status tracking.</p>
                </header>

                {/* Render states */}
                {loading ? (
                    <div className="flex flex-col items-center min-h-80">
                        <Loader2 className="w-12 h-12 text-violet-400 animate-spin mb-4" />
                        <p className="text-gray-400 text-lg">Loading your URLs…</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center min-h-80">
                        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                        <h3 className="text-xl font-semibold text-red-400 mb-2">Failed to load URLs</h3>
                        <p className="text-gray-400 mb-4">{error}</p>
                        <button
                            onClick={() => location.reload()}
                            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg"
                        >
                            Try Again
                        </button>
                    </div>
                ) : urls.length === 0 ? (
                    <div className="flex flex-col items-center  min-h-80">
                        <Globe className="w-16 h-16 text-violet-400 mb-4 opacity-60" />
                        <p className="text-xl text-gray-400 font-medium">Use our service to monitor your first URL.</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {urls.map((url, i) => (
                            <li
                                key={`${url}-${i}`}
                                className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-6 py-5 hover:border-violet-500/50 transition"
                            >
                                <div className="flex items-center space-x-4 overflow-hidden">
                                    <Globe className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                    <span className="text-gray-300 font-medium break-all">
                                        {truncate(url)}
                                    </span>
                                </div>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-600 text-white text-sm font-medium rounded-full transition-all duration-200 hover:bg-violet-700 hover:shadow-md hover:-translate-y-0.5"
                                >
                                    Visit
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default URLMonitoringDashboard;

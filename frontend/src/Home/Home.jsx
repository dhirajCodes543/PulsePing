import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../Stores/Authstore';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    Send,
    BarChart3,
    Loader2,
    CheckCircle,
    Lock,
} from 'lucide-react';



const Homepage = () => {
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const isVerified = useAuthStore((s) => s.isVerified);

    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const canUseService = isLoggedIn && isVerified;

    useEffect(() => {
        if (!canUseService && !sessionStorage.getItem("reloadedOnce")) {
            sessionStorage.setItem("reloadedOnce", "true"); // mark it
            window.location.reload();                       // do a single hard reload
        }
    }, [canUseService]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url.trim() || !canUseService) {
            return;
        }
        setIsLoading(true);
        setShowSuccess(false);
        const currentUser = auth.currentUser;
        const token = await currentUser.getIdToken(true);
        setUrl(url.trim());
        try {
            const res = await axios.post("/api/url/ping-api",
                { url },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            console.log("url responce", res);
            setShowSuccess(true);
            setUrl('');
        } catch (error) {
            if (error.response.data.msg == "Only 10 accouts per user is allowed") {
                toast.error("Only 10 accouts per user is allowed");
            }
            console.error('Url responce Error', error);
            toast.error("URl service error");
            setUrl('');
        } finally {
            setIsLoading(false);
        }
    };


    const getAccessMessage = () => {
        if (!isLoggedIn && !isVerified) {
            return 'Please log in and verify your account to use this service.';
        }
        if (!isLoggedIn) {
            return 'Please log in to use this service.';
        }
        if (!isVerified) {
            return 'Please verify your account to use this service.';
        }
        return '';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* ---------------- Header ---------------- */}
            <header className="p-4 lg:p-6 flex items-center justify-between border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
                {/* Brand */}
                <div className="flex items-center space-x-3 select-none">
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        PulsePing
                    </h1>
                </div>

                {/* Right‑side actions */}
                <div className="flex items-center space-x-4">
                    {/* Analytics Link */}
                    <Link
                        to="/analytics"
                        className="flex items-center space-x-2 text-gray-300 hover:text-violet-400 transition-colors"
                    >
                        <BarChart3 size={18} />
                        <span className="hidden sm:inline text-sm font-medium">Analytics</span>
                    </Link>

                    {/* Status Pill (desktop) */}
                    <div
                        className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border"
                        style={{
                            backgroundColor: canUseService ? 'rgba(16,88,46,0.3)' : 'rgba(144,63,0,0.3)',
                            borderColor: canUseService ? 'rgba(34,197,94,0.3)' : 'rgba(251,146,60,0.3)',
                            color: canUseService ? '#86efac' : '#fdba74',
                        }}
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: canUseService ? '#22c55e' : '#fb923c' }}
                        />
                        <span>{canUseService ? 'Service Ready' : 'Setup Required'}</span>
                    </div>
                </div>
            </header>

            {/* ---------------- Main Content ---------------- */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl">
                    {/* Access Restriction Message */}
                    {!canUseService && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-700/30 backdrop-blur-sm"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="p-2 bg-red-500/20 rounded-xl">
                                    <Lock className="text-red-400" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-red-300 font-bold text-lg mb-2">Access Restricted</h3>
                                    <p className="text-red-400 leading-relaxed mb-4">{getAccessMessage()}</p>

                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 group"
                                    >
                                        <span>Login to Continue</span>
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Success Message */}
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/30 backdrop-blur-sm"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="p-2 bg-green-500/20 rounded-xl">
                                        <CheckCircle className="text-green-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-green-300 font-bold text-lg mb-2">Service Active</h3>
                                        <p className="text-green-400 leading-relaxed">
                                            Your service is now being monitored. We'll ping your API every 5 minutes to ensure uptime.{' '}
                                            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                                                You can monitor up to 10 APIs with one account.
                                            </span>
                                        </p>

                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* URL Input Form */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="text-center">
                            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                Monitor Your API
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                                Enter your API to start real-time uptime monitoring
                            </p>
                        </div>

                        <div className="space-y-6">
                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://your-api.com"
                                    disabled={!canUseService || isLoading}
                                    className={`w-full p-6 pr-16 rounded-2xl bg-gray-800/50 backdrop-blur-sm border-2 text-white placeholder-gray-400 focus:outline-none focus:ring-4 transition-all text-lg ${canUseService
                                        ? 'border-gray-700/50 hover:border-gray-600/50 focus:border-violet-500/50 focus:ring-violet-500/20 hover:bg-gray-800/70'
                                        : 'border-gray-700/30 opacity-50 cursor-not-allowed'
                                        }`}
                                />

                                <button
                                    type="submit"
                                    disabled={!canUseService || isLoading || !url.trim()}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${canUseService && url.trim() && !isLoading
                                        ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-500/20 bg-violet-500/10'
                                        : 'text-gray-500 cursor-not-allowed bg-gray-700/30'
                                        }`}
                                >
                                    {isLoading ? (
                                        <span className="animate-spin">
                                            <Loader2 size={24} />
                                        </span>
                                    ) : (
                                        <span className="transition-transform duration-300 ease-in-out group-hover:-translate-y-0.5">
                                            <Send size={24} />
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Mobile Status Pill */}
                            <div className="sm:hidden">
                                <div
                                    className={`p-4 rounded-xl border ${canUseService
                                        ? 'bg-green-900/20 border-green-700/30'
                                        : 'bg-orange-900/20 border-orange-700/30'
                                        }`}
                                >
                                    <div className="flex items-center justify-center space-x-2 text-sm font-medium">
                                        <div
                                            className={`w-2 h-2 rounded-full ${canUseService ? 'bg-green-400' : 'bg-orange-400'
                                                }`}
                                        />
                                        <span className={canUseService ? 'text-green-300' : 'text-orange-300'}>
                                            {canUseService ? 'Ready to Monitor' : 'Login & Verify Required'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Homepage;

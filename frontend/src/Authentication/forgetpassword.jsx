import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, Check } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      default:
        return 'Failed to send reset email. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-6 focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center bg-blue-500/10 w-16 h-16 rounded-full mb-4">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400">
              Enter your email to receive a password reset link
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-900/20 border border-red-700 rounded-lg p-3"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-green-900/20 border border-green-700 rounded-lg p-3"
              >
                <p className="text-green-300 text-sm flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  {success}
                </p>
              </motion.div>
            )}

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <h3 className="text-gray-300 text-sm font-medium mb-2">Didn't receive the email?</h3>
              <ul className="text-gray-400 text-sm list-disc pl-5 space-y-1">
                <li>Check your spam or junk folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait a few minutes for the email to arrive</li>
              </ul>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Remember your password?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors focus:outline-none"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, RefreshCw, Check, Loader2, LogOut } from 'lucide-react';
import { sendEmailVerification, signOut, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '../Stores/Authstore';
import { auth } from '../firebase';

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setUser(currentUser);
      setLoading(false);


      if (currentUser.emailVerified) {
        navigate('/signup');
      }
    });

    return unsubscribe;
  }, [navigate]);


  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!user) return;

    setSending(true);
    setError('');
    setSuccess('');

    try {
      await sendEmailVerification(user);
      setSuccess('Verification email sent successfully!');
      setCountdown(60); // 60 seconds cooldown
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      setError('Failed to sign out. Please try again.');
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {


        const currentUser = auth.currentUser;
        const token = await currentUser.getIdToken(true);

        try {

          const res = await axios.post("/api/user/signup", {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          await auth.currentUser.reload();
          console.log("user created");
        } catch (error) {
          console.log("Backend responce failed", error);
        }

        navigate('/');
      } else {
        setError('Email not verified yet. Please check your inbox.');
      }
    } catch (err) {
      setError('Failed to check verification status.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center bg-blue-500/10 w-16 h-16 rounded-full mb-4">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-gray-400">
              We've sent a verification link to
              <span className="font-medium text-white"> {user?.email}</span>
            </p>
          </div>

          <div className="space-y-6">
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

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-900/20 border border-red-700 rounded-lg p-3"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <h3 className="text-gray-300 text-sm font-medium mb-2">Didn't receive the email?</h3>
              <ul className="text-gray-400 text-sm list-disc pl-5 space-y-1">
                <li>Check your spam or junk folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            <button
              onClick={handleResendEmail}
              disabled={sending || countdown > 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                </>
              )}
            </button>

            <button
              onClick={handleCheckVerification}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Check className="w-5 h-5 mr-2" />
              I've Verified My Email
            </button>

            <button
              onClick={handleSignOut}
              className="w-full text-gray-400 hover:text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
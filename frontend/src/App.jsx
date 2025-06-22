import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import SignupPage from "./Authentication/signup";
import LoginPage from "./Authentication/login";
import EmailVerificationPage from "./Authentication/emailverification";
import ForgotPasswordPage from "./Authentication/forgetpassword";
import Homepage from "./Home/Home";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./Stores/Authstore";
import URLMonitoringDashboard from "./Home/Analytics";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      aria-label="Loading"
    >
      <circle cx="32" cy="32" r="28" stroke="#3B82F6" strokeWidth="8" opacity="0.25" />
      <motion.path
        d="M60 32a28 28 0 0 1-28 28"
        stroke="#2563EB"
        strokeWidth="8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
      />
    </motion.svg>
  </div>
);


function App() {
  const isLoading = useAuthStore((s) => s.isLoading)
  if (isLoading) {
    return (
      <LoadingSpinner />
    )
  }
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false}      
        toastOptions={{
          style: { background: "#18181b", color: "#fff" },    
          success: {
            iconTheme: { primary: "#8b5cf6", secondary: "#fff" }
          },
        }}
      />
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/analytics" element={<URLMonitoringDashboard />} />
        <Route path="/verify" element={<EmailVerificationPage />} />
        <Route path="/forget-password" element={<ForgotPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

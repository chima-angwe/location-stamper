import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import Container from "../components/layout/Container";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import { useAuth } from "../hooks/useAuth";
import { LocationOnOutlined } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        // Register
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Login
        await login({
          email: formData.email,
          password: formData.password,
        });
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-120px)] bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center py-10 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full translate-x-1/4 translate-y-1/4 opacity-10 blur-3xl pointer-events-none" />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl mx-auto relative z-10"
          >
            {/* Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-b border-gray-700 px-8 py-12">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex justify-center mb-4"
                >
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <LocationOnOutlined
                      className="text-white"
                      style={{ fontSize: 40 }}
                    />
                  </div>
                </motion.div>

                <h1 className="text-4xl font-bold text-white text-center mb-2">
                  {isRegister ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="text-gray-400 text-center text-sm">
                  {isRegister
                    ? "Join us and start stamping locations"
                    : "Sign in to your account"}
                </p>
              </div>

              {/* Content */}
              <div className="px-8 py-10 space-y-6">
                {/* Error Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert
                      type="error"
                      message={error}
                      onClose={() => setError("")}
                    />
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field - Only show on register */}
                  {isRegister && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        label="Full Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required={isRegister}
                      />
                    </motion.div>
                  )}

                  {/* Email Field */}
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />

                  {/* Password Field */}
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />

                  {/* Confirm Password - Only show on register */}
                  {isRegister && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required={isRegister}
                      />
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30 mt-2 text-lg"
                  >
                    {loading
                      ? isRegister
                        ? "Creating Account..."
                        : "Signing In..."
                      : isRegister
                      ? "Create Account"
                      : "Sign In"}
                  </motion.button>
                </form>

                {/* Toggle Auth Mode */}
                <div className="border-t border-gray-700 pt-6">
                  <p className="text-gray-400 text-sm text-center mb-4">
                    {isRegister
                      ? "Already have an account?"
                      : "Don't have an account?"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleToggleMode}
                    disabled={loading}
                    className="w-full px-6 py-2 bg-gray-700 hover:bg-gray-600 text-blue-400 hover:text-blue-300 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRegister ? "Sign In Instead" : "Create Account Instead"}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Security Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-gray-600 mt-6"
            >
              🔒 Your data is encrypted and secure
            </motion.p>
          </motion.div>
        </Container>
      </div>
    </Layout>
  );
};

export default Login;

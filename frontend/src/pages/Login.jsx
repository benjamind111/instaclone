import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `${API_URL}/auth/login`;
      const { data } = await axios.post(url, formData);
      
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 left-0"></div>
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-0 right-0"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Instagram Logo */}
          <div className="text-center">
            <h1 className="text-5xl font-serif text-white mb-2 tracking-wide">Instagram</h1>
            <p className="text-white text-opacity-80 text-sm">Sign in to see photos and videos from your friends</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="email" 
              name="email" 
              placeholder="Email address" 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              required 
            />
            
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              required 
            />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white bg-opacity-30"></div>
            <span className="text-white text-opacity-70 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-white bg-opacity-30"></div>
          </div>

          {/* Forgot Password */}
          <div className="text-center">
            <a href="#" className="text-sm text-white text-opacity-80 hover:text-opacity-100 transition">
              Forgot password?
            </a>
          </div>
        </div>

        {/* Sign Up Card */}
        <div className="mt-4 bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-2xl shadow-xl p-6 text-center">
          <p className="text-white text-opacity-90">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-pink-400 hover:text-pink-300 transition">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <div className="mt-6 text-center">
          <p className="text-white text-opacity-60 text-sm">
            Made with ❤️ for Instagram Clone
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
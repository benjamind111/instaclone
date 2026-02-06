import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = "http://localhost:5000/api/auth/register";
      const { data } = await axios.post(url, formData);
      
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-900 via-purple-900 to-blue-900 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 right-0"></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-0 left-0"></div>
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Instagram Logo */}
          <div className="text-center">
            <h1 className="text-5xl font-serif text-white mb-2 tracking-wide">Instagram</h1>
            <p className="text-white text-opacity-80 text-sm">Sign up to see photos and videos from your friends</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required 
            />

            <input 
              type="email" 
              name="email" 
              placeholder="Email address" 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required 
            />
            
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required 
            />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-white text-opacity-70 text-center">
            By signing up, you agree to our Terms, Data Policy and Cookies Policy.
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-4 bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-2xl shadow-xl p-6 text-center">
          <p className="text-white text-opacity-90">
            Have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition">
              Log in
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

export default Register;
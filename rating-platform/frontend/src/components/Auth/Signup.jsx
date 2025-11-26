import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signup } from '../../services/api';
import { User, Mail, Lock, MapPin, Star, AlertCircle } from 'lucide-react';
import Background3D from '../Layout/Background3D';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const response = await signup(formData);
      loginUser(response.data.user, response.data.token);
      navigate('/user/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([{ message: err.response?.data?.message || 'Signup failed' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background3D />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center mb-4">
              <Star className="text-white" size={64} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-200">Join RateMaster today</p>
          </div>

          <div className="card animate-slide-up">
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                {errors.map((err, idx) => (
                  <div key={idx} className="flex items-start text-red-700 text-sm mb-1">
                    <AlertCircle size={16} className="mr-2 mt-0.5 shrink-0" />
                    <span>{err.message}</span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name (20-60 characters)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="John Doe Smith Johnson"
                    minLength={20}
                    maxLength={60}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password (8-16 chars, 1 uppercase, 1 special)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Password@123"
                    minLength={8}
                    maxLength={16}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address (Max 400 characters)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field pl-10 min-h-20"
                    placeholder="123 Main St, City, State, ZIP"
                    maxLength={400}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner border-white border-t-transparent w-5 h-5 mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
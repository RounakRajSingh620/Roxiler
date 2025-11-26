import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../services/api';
import { User, Mail, Lock, MapPin, UserCog, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import Background3D from '../Layout/Background3D';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
  });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors([]);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccess(false);

    try {
      await createUser(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([{ message: err.response?.data?.message || 'Failed to create user' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background3D />
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-white hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="card animate-slide-up">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New User</h1>
            <p className="text-gray-600">Add a new user or admin to the platform</p>
          </div>

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

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
              <CheckCircle size={20} className="mr-2" />
              <span>User created successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                Full Name (20-60 characters)
              </label>
              <div className="relative">
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
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="user@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                Password (8-16 chars, 1 uppercase, 1 special)
              </label>
              <div className="relative">
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
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
                Address (Max 400 characters)
              </label>
              <div className="relative">
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <UserCog className="absolute left-3 top-3.5 text-gray-400" size={20} />
                Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field pl-10"
                  required
                >
                  <option value="user">Normal User</option>
                  <option value="admin">Admin User</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Note: Store Owners are created automatically when you create a store
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner border-white border-t-transparent w-5 h-5 mr-2"></div>
                  Creating user...
                </div>
              ) : (
                'Create User'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
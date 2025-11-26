import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStore } from '../../services/api';
import { Store, Mail, Lock, MapPin, AlertCircle, CheckCircle, ArrowLeft, Star } from 'lucide-react'; // <-- added Star
import Navbar from '../Layout/Navbar';
import Background3D from '../Layout/Background3D';

const CreateStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
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
      await createStore(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([{ message: err.response?.data?.message || 'Failed to create store' }]);
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
          {/* ====== Replaced header block: icon beside title (uses .title-row from CSS) ====== */}
          <div className="mb-6 title-row">
            <Star className="text-white" size={28} /> {/* icon placed beside title, NOT absolute */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Create New Store</h1>
              <p className="text-gray-600">Register a new store with owner credentials</p>
            </div>
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
              <span>Store created successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Store className="absolute left-3 top-3.5 text-gray-400" size={20} />
                Store Name (20-60 characters)
              </label>
              <div className="relative">
           
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Best Electronics Store Shop"
                  minLength={20}
                  maxLength={60}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                Store Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="store@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                Owner Password (8-16 chars, 1 uppercase, 1 special)
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
                Store Address (Max 400 characters)
              </label>
              <div className="relative">
          
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field pl-10 min-h-20"
                  placeholder="456 Commerce Blvd, Shopping District, City, State, ZIP"
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
                  Creating store...
                </div>
              ) : (
                'Create Store'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateStore;

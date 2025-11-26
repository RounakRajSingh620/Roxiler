import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from '../../services/api';
import { Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import Background3D from '../Layout/Background3D';

const PasswordChange = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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

 
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors([{ message: 'New passwords do not match' }]);
      setLoading(false);
      return;
    }

    try {
      await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([{ message: err.response?.data?.message || 'Failed to update password' }]);
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
          onClick={() => navigate('/owner/dashboard')}
          className="flex items-center text-white hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="card animate-slide-up">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Change Password</h1>
            <p className="text-gray-600">Update your account password</p>
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
              <span>Password updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter current password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password (8-16 chars, 1 uppercase, 1 special)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter new password"
                  minLength={8}
                  maxLength={16}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Confirm new password"
                  minLength={8}
                  maxLength={16}
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
                  Updating password...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordChange;
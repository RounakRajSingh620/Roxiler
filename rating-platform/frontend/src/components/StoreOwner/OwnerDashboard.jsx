import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoreDashboard } from '../../services/api';
import { Star, Users, Lock } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import Background3D from '../Layout/Background3D';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getStoreDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={24} fill="currentColor" className="text-yellow-400" />);
    }
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={24} className="text-gray-300" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <>
        <Background3D />
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  if (!dashboardData) {
    return (
      <>
        <Background3D />
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="card text-center">
            <p className="text-gray-600">No store data found</p>
          </div>
        </div>
      </>
    );
  }

  const { store, raters } = dashboardData;

  return (
    <>
      <Background3D />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Store Dashboard</h1>
          <p className="text-gray-200">Manage your store and view ratings</p>
        </div>

        {/* Store Info Card */}
        <div className="card mb-6 animate-slide-up">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{store.name}</h2>
              <p className="text-gray-600">{store.address}</p>
            </div>
            <button
              onClick={() => navigate('/owner/change-password')}
              className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Lock size={18} />
              <span>Change Password</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
            <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Average Rating</h3>
                <Star size={32} fill="currentColor" className="text-yellow-400" />
              </div>
              <div className="flex items-center space-x-3 mb-2">
                {renderStars(parseFloat(store.averageRating))}
              </div>
              <p className="text-4xl font-bold text-gray-800">{store.averageRating}</p>
              <p className="text-sm text-gray-600 mt-2">out of 5.00</p>
            </div>

        
            <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Total Raters</h3>
                <Users size={32} className="text-blue-500" />
              </div>
              <p className="text-4xl font-bold text-gray-800">{store.totalRaters}</p>
              <p className="text-sm text-gray-600 mt-2">
                {store.totalRaters === 1 ? 'user has' : 'users have'} rated your store
              </p>
            </div>
          </div>
        </div>

   
        <div className="card animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Users Who Rated Your Store</h2>

          {raters.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No ratings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {raters.map((rater) => (
                    <tr key={rater.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{rater.name}</td>
                      <td className="py-3 px-4">{rater.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {renderStars(rater.rating)}
                          </div>
                          <span className="font-semibold">{rater.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(rater.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;
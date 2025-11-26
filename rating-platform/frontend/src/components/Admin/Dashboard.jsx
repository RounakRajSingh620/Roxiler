import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';
import { Users, Store, Star, Plus, List } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import Background3D from '../Layout/Background3D';


const StatCard = ({ icon, title, value, color, delay }) => (
  <div
    className="card hover:scale-105 transition-transform duration-300 animate-slide-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-semibold mb-2">{title}</p>
        <p className="text-4xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`${color} p-4 rounded-xl`}>
        {icon}
      </div>
    </div>
  </div>
);


const ActionCard = ({ icon, title, description, onClick, color }) => (
  <button
    onClick={onClick}
    className="card text-left hover:scale-105 transition-all duration-300 group"
  >
    <div className="flex items-start space-x-4">
      <div className={`${color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  </button>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <>
      <Background3D />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-200">Manage your platform effectively</p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
          <StatCard
            icon={<Users size={40} className="text-white" />}
            title="Total Users"
            value={stats.totalUsers}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            delay={0}
          />
          <StatCard
            icon={<Store size={40} className="text-white" />}
            title="Total Stores"
            value={stats.totalStores}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            delay={100}
          />
          <StatCard
            icon={<Star size={40} className="text-white" />}
            title="Total Ratings"
            value={stats.totalRatings}
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
            delay={200}
          />
        </div>

  
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
              icon={<Plus size={24} className="text-white" />}
              title="Create New User"
              description="Add admin users or normal users to the platform"
              onClick={() => navigate('/admin/create-user')}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <ActionCard
              icon={<Plus size={24} className="text-white" />}
              title="Create New Store"
              description="Register a new store with owner credentials"
              onClick={() => navigate('/admin/create-store')}
              color="bg-gradient-to-br from-indigo-500 to-indigo-600"
            />
            <ActionCard
              icon={<List size={24} className="text-white" />}
              title="View All Users"
              description="Browse and filter all registered users"
              onClick={() => navigate('/admin/users')}
              color="bg-gradient-to-br from-pink-500 to-pink-600"
            />
            <ActionCard
              icon={<List size={24} className="text-white" />}
              title="View All Stores"
              description="Browse all stores with ratings"
              onClick={() => navigate('/admin/stores')}
              color="bg-gradient-to-br from-cyan-500 to-cyan-600"
            />
          </div>
        </div>

     
        <div className="card bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">👤 System Admin</h3>
              <p className="text-sm text-gray-600">
                Manage users, stores, and view all platform statistics
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">👤 Normal User</h3>
              <p className="text-sm text-gray-600">
                Browse stores and submit ratings (can self-register)
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">👤 Store Owner</h3>
              <p className="text-sm text-gray-600">
                View store ratings (created automatically with stores)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
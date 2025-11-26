import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Store, Lock } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import Background3D from '../Layout/Background3D';


const ActionCard = ({ icon, title, description, onClick, color }) => (
  <button
    onClick={onClick}
    className="card text-left hover:scale-105 transition-all duration-300 group"
  >
    <div className="flex items-start space-x-4">
      <div className={`${color} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </button>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Background3D />
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-200">Explore stores and share your ratings</p>
        </div>

   
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            icon={<Store size={32} className="text-white" />}
            title="Browse Stores"
            description="View all registered stores, search by location, and submit your ratings"
            onClick={() => navigate('/user/stores')}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <ActionCard
            icon={<Lock size={32} className="text-white" />}
            title="Change Password"
            description="Update your account password for better security"
            onClick={() => navigate('/user/change-password')}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>


        <div className="card mt-6 bg-linear-to-r from-primary-50 to-purple-50 border border-primary-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2">How to Rate a Store</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Navigate to the "Browse Stores" section</li>
            <li>Find the store you want to rate using search filters</li>
            <li>Click the star rating (1-5 stars) to submit your rating</li>
            <li>You can update your rating anytime by selecting a new star value</li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
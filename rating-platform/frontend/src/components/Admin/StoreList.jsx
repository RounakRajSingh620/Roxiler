import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStores } from '../../services/api';
import { Search, ArrowUpDown, ArrowLeft, Star } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import Background3D from '../Layout/Background3D';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [sortConfig, setSortConfig] = useState({ field: 'name', order: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortConfig]);

  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await getAllStores({
        ...filters,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
      });
      setStores(response.data.stores);
    } catch (error) {
      console.error('Failed to load stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setSortConfig({
      field,
      order: sortConfig.field === field && sortConfig.order === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="currentColor" className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} className="text-yellow-400" fill="currentColor" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    }
    return stars;
  };

  return (
    <>
      <Background3D />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
       <button
  onClick={() => navigate('/admin/dashboard')}
  className="flex items-center text-white bg-blue-600 hover:bg-blue-700 
             px-5 py-2.5 rounded-lg text-lg shadow-md transition-all mb-6"
>
  <ArrowLeft size={26} className="mr-3" />
  Back to Dashboard
</button>


        <div className="card animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">All Stores</h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Search className=" left-3 top-3 text-gray-400" size={20} />
            <div className="relative">
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Filter by name"
                className="input-field pl-10"
              />
            </div>
              <Search className=" left-3 top-3 text-gray-400" size={20} />
            <div className="relative">
              <input
                type="text"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                placeholder="Filter by email"
                className="input-field pl-10"
              />
            </div>
              <Search className=" left-3 top-3 text-gray-400" size={20} />
            <div className="relative">
              <input
                type="text"
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                placeholder="Filter by address"
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center space-x-1 font-semibold hover:text-primary-600"
                      >
                        <span>Name</span>
                        <ArrowUpDown size={16} />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4">
                      <button
                        onClick={() => handleSort('email')}
                        className="flex items-center space-x-1 font-semibold hover:text-primary-600"
                      >
                        <span>Email</span>
                        <ArrowUpDown size={16} />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4">
                      <button
                        onClick={() => handleSort('address')}
                        className="flex items-center space-x-1 font-semibold hover:text-primary-600"
                      >
                        <span>Address</span>
                        <ArrowUpDown size={16} />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4">
                      <button
                        onClick={() => handleSort('rating')}
                        className="flex items-center space-x-1 font-semibold hover:text-primary-600"
                      >
                        <span>Rating</span>
                        <ArrowUpDown size={16} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{store.name}</td>
                      <td className="py-3 px-4">{store.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{store.address}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex">{renderStars(parseFloat(store.rating))}</div>
                          <span className="text-sm font-semibold">
                            {parseFloat(store.rating).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({store.totalRatings || 0})
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {stores.length === 0 && (
                <p className="text-center text-gray-500 py-8">No stores found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StoreList;
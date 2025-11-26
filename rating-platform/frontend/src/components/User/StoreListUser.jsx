import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStores, submitRating } from '../../services/api';
import { Search, ArrowUpDown, ArrowLeft, Star } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import Background3D from '../Layout/Background3D';

const StoreListUser = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
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

  const handleRating = async (storeId, rating) => {
    try {
      await submitRating({ storeId, rating });
  
      loadStores();
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="currentColor" className="text-yellow-400" />);
    }
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    }
    return stars;
  };

  const RatingStars = ({ storeId, currentRating }) => {
    const [hoveredRating, setHoveredRating] = useState(0);
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRating(storeId, star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={24}
              className={
                star <= (hoveredRating || currentRating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }
              fill={star <= (hoveredRating || currentRating) ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Background3D />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/user/dashboard')}
          className="flex items-center text-white hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="card animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Stores</h1>

      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Search by store name"
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                placeholder="Search by address"
                className="input-field pl-10"
              />
            </div>
          </div>

 
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => handleSort('name')} 
              className="flex items-center px-4 py-2 bg-primary-50 rounded-lg text-primary-600 text-sm hover:bg-primary-100 transition-colors"
            >
              <ArrowUpDown size={16} className="mr-2" />
              Sort by Name ({sortConfig.order === 'asc' ? 'A-Z' : 'Z-A'})
            </button>
          </div>

 
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{store.address}</p>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-gray-700">Overall:</span>
                          <div className="flex">{renderStars(parseFloat(store.rating))}</div>
                          <span className="text-sm font-semibold text-gray-700">
                            {parseFloat(store.rating).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({store.totalRatings || 0} ratings)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          {store.userRating ? 'Your Rating:' : 'Rate this store:'}
                        </p>
                        <RatingStars storeId={store.id} currentRating={store.userRating || 0} />
                      </div>
                      {store.userRating && (
                        <p className="text-xs text-gray-500">Click to update your rating</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
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

export default StoreListUser;
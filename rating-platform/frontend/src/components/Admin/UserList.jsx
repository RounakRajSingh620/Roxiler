import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getUserDetails } from '../../services/api';
import { Search, ArrowUpDown, ArrowLeft, Eye, X } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import Background3D from '../Layout/Background3D';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  });
  const [sortConfig, setSortConfig] = useState({ field: 'name', order: 'asc' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortConfig]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers({
        ...filters,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
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

  const handleViewDetails = async (userId) => {
    try {
      const response = await getUserDetails(userId);
      setSelectedUser(response.data.user);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to load user details:', error);
    }
  };

  return (
    <>
      <Background3D />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-white hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="card mb-6 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">All Users</h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
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
                        onClick={() => handleSort('role')}
                        className="flex items-center space-x-1 font-semibold hover:text-primary-600"
                      >
                        <span>Role</span>
                        <ArrowUpDown size={16} />
                      </button>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'store_owner' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-lg text-sm transition-colors inline-flex items-center"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-center text-gray-500 py-8">No users found</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-600">Name</label>
                <p className="text-gray-800">{selectedUser.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <p className="text-gray-800">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Address</label>
                <p className="text-gray-800">{selectedUser.address}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Role</label>
                <p className="text-gray-800 capitalize">{selectedUser.role.replace('_', ' ')}</p>
              </div>
              {selectedUser.store && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <h3 className="font-bold text-gray-800 mb-2">Store Information</h3>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Store Name</label>
                    <p className="text-gray-800">{selectedUser.store.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Store Rating</label>
                    <p className="text-gray-800">⭐ {parseFloat(selectedUser.store.rating).toFixed(2)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserList;
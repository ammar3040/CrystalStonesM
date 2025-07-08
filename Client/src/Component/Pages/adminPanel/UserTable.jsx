import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(0);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/usertable`);
      setUsers(response.data);
    } catch (err) {
      toast.error('Failed to fetch users');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/userdelete/?uid=${id}`);
      if (res.data.success) {
        toast.success('User deleted successfully!');
        setUsers(prev => prev.filter(user => user._id !== id));
      } else {
        toast.error(res.data.message || 'Failed to delete user.');
      }
    } catch (err) {
      toast.error('Server error while deleting user.');
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(val =>
      val && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getSortValue = (user, column) => {
    switch (column) {
      case 0: return user.Uname?.toLowerCase() || '';
      case 1: return user.email?.toLowerCase() || '';
      case 2: return user.mobile || '';
      case 3: return user.address?.toLowerCase() || '';
      case 4: return user.role || '';
      case 5: return new Date(user.createdAt);
      default: return '';
    }
  };

  const sortUsers = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedUsers = filteredUsers.sort((a, b) => {
    const aVal = getSortValue(a, sortColumn);
    const bVal = getSortValue(b, sortColumn);
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalRows = sortedUsers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="border p-1 rounded"
          >
            {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <input
            type="search"
            placeholder="Search users..."
            className="border px-2 py-1 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => { if (e.key === 'Enter') setCurrentPage(1); }}
          />
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {['Name', 'Email', 'Mobile', 'Address', 'Role', 'Joined Date'].map((label, i) => (
                <th key={i} className="p-2 cursor-pointer" onClick={() => sortUsers(i)}>
                  {label} {sortColumn === i && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
              ))}
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? paginatedUsers.map(user => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{user.Uname}</td>
                <td className="p-2">{user.email || 'N/A'}</td>
                <td className="p-2">{user.mobile || 'N/A'}</td>
                <td className="p-2">{user.address || 'N/A'}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs text-white ${user.role === 'admin' ? 'bg-green-500' : 'bg-blue-500'}`}>{user.role}</span>
                </td>
                <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="text-center py-4">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {totalRows === 0 ? 0 : startIndex + 1} to {endIndex} of {totalRows} entries
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >Previous</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-100' : ''}`}
              >{i + 1}</button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
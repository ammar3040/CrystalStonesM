import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    mobile: '',
    password: ''
  });

  useEffect(() => {
    const getUserFromCookie = () => {
      const cookieString = document.cookie;
      const cookies = cookieString.split('; ');
      const userCookie = cookies.find(cookie => cookie.startsWith('user='));
      if (userCookie) {
        const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
        if (cookieValue && cookieValue !== 'undefined') {
          const parsedUser = JSON.parse(cookieValue);
          setUser(parsedUser);
          setFormData(prev => ({
            ...prev,
            email: parsedUser.email || '',
            name: parsedUser.name || '',
            address: parsedUser.address || '',
            mobile: parsedUser.mobile || '',
          }));
        }
      }
    };
    getUserFromCookie();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/updateProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          uid: user.uid,
          ...formData
        })
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        navigate('/');
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={formData.email} disabled className="w-full mt-1 border px-3 py-2 rounded bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" value={formData.name} disabled className="w-full mt-1 border px-3 py-2 rounded bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full mt-1 border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full mt-1 border px-3 py-2 rounded" />
        </div>
        {!user.password && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full mt-1 border px-3 py-2 rounded" />
          </div>
        )}
        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;

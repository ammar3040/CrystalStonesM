import api from '../../lib/api';
import toast from 'react-hot-toast';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    Uname: '',
    address: '',
    mobile: '',
    password: ''
  });

  useEffect(() => {
    // Attempt to get user data from localStorage or cookies
    const token = localStorage.getItem('token');
    const getUserFromCookie = () => {
      const cookieString = document.cookie;
      const cookies = cookieString.split('; ');
      const userCookie = cookies.find(cookie => cookie.startsWith('user='));
      if (userCookie) {
        const cookieValue = decodeURIComponent(userCookie.split('=')[1]);
        if (cookieValue && cookieValue !== 'undefined') {
          try {
            const parsedUser = JSON.parse(cookieValue.startsWith('j:') ? cookieValue.substring(2) : cookieValue);
            setUser(parsedUser);
            setFormData({
              email: parsedUser.email || '',
              Uname: parsedUser.name || parsedUser.Uname || '',
              address: parsedUser.address || '',
              mobile: parsedUser.mobile || '',
              password: ''
            });
          } catch (e) {
            console.error("Failed to parse user cookie", e);
          }
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
      const { data } = await api.post('/api/updateProfile', {
        uid: user.uid || user.id,
        ...formData
      });

      if (data.success || data.message === "Profile updated successfully!") {
        toast.success("Profile updated successfully!");
        navigate('/');
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
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
          <input type="text" value={formData.Uname} disabled className="w-full mt-1 border px-3 py-2 rounded bg-gray-100" />
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

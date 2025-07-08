import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ toggleMobileSidebar, activeMenu }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [admin, setAdmin] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const userCookie = Cookies.get("user");

    if (userCookie) {
      try {
        // ✅ Decode and parse
        const userData = JSON.parse(decodeURIComponent(userCookie));

        // ✅ Check role
        if (userData.role !== "admin") {
          navigate("/"); // ⛔ redirect if not admin
        }

        setAdmin({ name: userData.name, email: userData.email });
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        navigate("/"); // fallback redirect
      }
    } else {
      // ⛔ No user cookie at all
      navigate("/");
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/admin/login");
  };

  return (
    <header className="bg-white shadow-sm" style={{ borderBottom: "2px solid black" }}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button
            onClick={toggleMobileSidebar}
            className="text-gray-600 mr-4 focus:outline-none md:hidden"
          >
            <FaBars />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {activeMenu ? activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1) : 'Dashboard'}
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <FaUserCircle className="text-gray-600 text-xl" />
            </div>
            <span className="hidden md:inline font-medium">{admin.name || "Admin"}</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium">{admin.name}</p>
                <p className="text-xs text-gray-500">{admin.email}</p>
              </div>
              <a href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Your Profile
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

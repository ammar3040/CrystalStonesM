import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  User,
  LogOut,
  Settings,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AdminHeader = ({ toggleMobileSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [admin, setAdmin] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie));
        if (userData.role !== "admin") {
          navigate("/");
        }
        setAdmin({ name: userData.name, email: userData.email });
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/admin/login");
  };

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path.startsWith('admin-')) return 'Dashboard';
    if (path === 'add-product') return 'Create Product';
    if (path === 'add-category') return 'New Category';
    if (path === 'view-products') return 'Inventory';
    if (path === 'view-user') return 'User Management';
    if (path === 'admin-Inquiries') return 'Customer Support';
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/60 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleMobileSidebar}
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-100 focus:outline-none md:hidden transition-colors"
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:flex items-center relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Global platform search..."
              className="pl-12 pr-6 py-2.5 bg-zinc-100 hover:bg-zinc-200/50 border-none rounded-2xl text-sm w-[400px] focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all outline-none font-medium placeholder:text-zinc-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded border border-zinc-200 text-[10px] font-bold text-zinc-400">⌘</span>
              <span className="px-1.5 py-0.5 rounded border border-zinc-200 text-[10px] font-bold text-zinc-400">K</span>
            </div>
          </div>

          <div className="md:hidden">
            <h1 className="text-xl font-black text-zinc-900 tracking-tight">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">Server Live</span>
            </div>
          </div>

          <button className="p-2.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group">
            <Bell size={22} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white ring-4 ring-indigo-500/0 group-hover:ring-indigo-500/20 transition-all"></span>
          </button>

          <div className="w-px h-8 bg-zinc-200 mx-2 hidden md:block" />

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 p-1 rounded-2xl hover:bg-zinc-50 transition-all focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white border border-white shadow-sm transition-transform active:scale-95 group overflow-hidden">
                {admin.email ? (
                  <span className="text-sm font-black tracking-tighter">{admin.email.charAt(0).toUpperCase()}</span>
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="hidden xl:flex flex-col items-start leading-tight">
                <span className="text-sm font-black text-zinc-900 tracking-tight">{admin.name || "Administrator"}</span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.15em] mt-0.5">Control Panel</span>
              </div>
              <ChevronDown size={14} className={cn("text-zinc-400 transition-transform mr-2", profileOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute right-0 mt-4 w-72 origin-top-right rounded-[2rem] bg-white p-2 shadow-2xl ring-1 ring-zinc-200 z-50 overflow-hidden"
                >
                  <div className="p-4 bg-zinc-50/50 rounded-[1.5rem] mb-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black tracking-tighter">
                        {admin.email?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-900 leading-none mb-1">{admin.name || "Administrator"}</p>
                        <p className="text-[11px] font-bold text-zinc-500 truncate max-w-[160px]">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 py-1.5 px-3 bg-white rounded-xl border border-zinc-200 text-center">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Status</p>
                        <p className="text-xs font-black text-emerald-600">Active</p>
                      </div>
                      <div className="flex-1 py-1.5 px-3 bg-white rounded-xl border border-zinc-200 text-center">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Role</p>
                        <p className="text-xs font-black text-indigo-600">Admin</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 rounded-2xl transition-all group">
                      <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <User size={16} />
                      </div>
                      <span>Account Settings</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 rounded-2xl transition-all group">
                      <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Settings size={16} />
                      </div>
                      <span>Platform Config</span>
                    </button>
                  </div>

                  <div className="h-px bg-zinc-100 my-2 mx-4" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-4 text-sm font-black text-rose-600 hover:bg-rose-50 rounded-[1.5rem] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all">
                      <LogOut size={16} />
                    </div>
                    <span>Secure Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

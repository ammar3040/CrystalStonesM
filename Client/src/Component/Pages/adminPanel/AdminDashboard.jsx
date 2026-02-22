import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users as UsersIcon,
  UserCheck,
  Mail,
  Clock,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/admin/usertable`)
      .then((res) => res.json())
      .then((allData) => {
        const usersList = allData.users || allData;

        // Filter for login users
        const filteredUsers = (Array.isArray(usersList) ? usersList : [])
          .filter((user) => {
            const onlyMobile = user.mobile && !user.uname && !user.email;
            const onlyEmail = user.Uname && user.email && !user.mobile;
            return onlyMobile || onlyEmail;
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);

        // Filter for subscribed users
        const filteredSubscribers = (Array.isArray(usersList) ? usersList : [])
          .filter((user) => user.isSubscribed === true)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setData({
          users: filteredUsers,
          subscribers: filteredSubscribers,
          totalCount: allData.totalCount || (Array.isArray(usersList) ? usersList.length : 0)
        });
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
    >
      <div className={cn("absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-125 transition-transform duration-500", color)} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl", color, "bg-opacity-10")}>
            <Icon size={24} className={cn(color.replace('bg-', 'text-'))} />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold tracking-tight",
              trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              <TrendingUp size={12} className={trend < 0 ? "rotate-180" : ""} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <p className="text-sm font-bold text-zinc-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-zinc-900 tracking-tight">
            {loading ? <div className="h-8 w-16 bg-zinc-100 animate-pulse rounded-lg" /> : value}
          </h3>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Growth</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-wider uppercase mb-2">
            <Activity size={16} />
            Platform Metrics
          </div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-zinc-500 text-lg font-medium">Monitoring real-time business health and user activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm">
            <Calendar size={18} className="text-zinc-400" />
            <span>This Month</span>
            <ChevronRight size={14} className="rotate-90 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Platform Users"
          value={data?.totalCount || 0}
          icon={UsersIcon}
          color="bg-indigo-600"
          trend={12.4}
          index={0}
        />
        <StatCard
          title="Active Subscribers"
          value={data?.subscribers?.length || 0}
          icon={Mail}
          color="bg-violet-600"
          trend={5.2}
          index={1}
        />
        <StatCard
          title="New Sessions"
          value={data?.users?.length || 0}
          icon={UserCheck}
          color="bg-blue-600"
          trend={-2.4}
          index={2}
        />
        <StatCard
          title="Avg. Retention"
          value="84.2%"
          icon={Clock}
          color="bg-sky-600"
          trend={3.1}
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Users Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full" />
              Recent Arrivals
            </h2>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors px-4 py-2 rounded-xl hover:bg-indigo-50">
              View All Activity
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Profile</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Credential</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Channel</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      [...Array(6)].map((_, i) => (
                        <tr key={`skel-${i}`}>
                          <td colSpan={4} className="px-8 py-4">
                            <div className="flex items-center gap-4 animate-pulse">
                              <div className="w-10 h-10 bg-zinc-100 rounded-full" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-zinc-100 rounded w-1/4" />
                                <div className="h-3 bg-zinc-100 rounded w-1/2 opacity-50" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (data?.users || []).map((user, index) => (
                      <motion.tr
                        key={user._id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-zinc-50/50 transition-all group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                              {(user.Uname || "A").charAt(0).toUpperCase()}
                            </div>
                            <p className="font-bold text-zinc-900">{user.Uname || "Anonymous User"}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-semibold text-zinc-500 font-mono tracking-tight">
                            {user.mobile || user.email || "---"}
                          </p>
                        </td>
                        <td className="px-8 py-5">
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider",
                            user.mobile
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          )}>
                            {user.mobile ? "Direct Mobile" : "Email Auth"}
                          </span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Clock size={14} />
                            <p className="text-xs font-bold">{formatDate(user.createdAt)}</p>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: New Subscriptions */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-violet-600 rounded-full" />
            Newsletter Pulse
          </h2>
          <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm p-4">
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={`sub-skel-${i}`} className="h-16 bg-zinc-50 animate-pulse rounded-2xl mb-1" />
                  ))
                ) : (data?.subscribers || []).slice(0, 8).map((sub, index) => (
                  <motion.div
                    key={sub._id || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 transition-all group border border-transparent hover:border-zinc-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                        {sub.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-900 truncate w-32 md:w-40 tracking-tight">{sub.email}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{formatDate(sub.createdAt).split(',')[0]}</p>
                      </div>
                    </div>
                    <a
                      href={`mailto:${sub.email}`}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-300 hover:text-indigo-600 hover:bg-white hover:border-zinc-200 border border-transparent transition-all shadow-sm group-hover:shadow"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {!loading && (data?.subscribers?.length || 0) > 8 && (
              <button className="w-full mt-4 py-4 text-xs font-black text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all uppercase tracking-widest border border-dashed border-indigo-100">
                View Full Network List
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

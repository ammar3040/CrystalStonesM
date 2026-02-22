import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PackagePlus,
  Tags,
  Package,
  Users,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Settings,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AdminSidebar = ({
  sidebarOpen,
  mobileSidebarOpen,
  toggleSidebar,
  toggleMobileSidebar
}) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const navItems = [
    {
      type: 'label',
      label: 'Main Overview'
    },
    {
      type: 'link',
      href: '/admin-a9xK72rQ1m8vZpL0',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      type: 'label',
      label: 'Management'
    },
    {
      type: 'menu',
      id: 'add',
      icon: PackagePlus,
      label: 'Creation',
      children: [
        { href: '/admin-a9xK72rQ1m8vZpL0/add-product', label: 'New Product' },
        { href: '/admin-a9xK72rQ1m8vZpL0/add-category', label: 'New Category' },
      ]
    },
    {
      type: 'menu',
      id: 'view',
      icon: Package,
      label: 'Operations',
      children: [
        { href: '/admin-a9xK72rQ1m8vZpL0/view-products', label: 'Inventory' },
        { href: '/admin-a9xK72rQ1m8vZpL0/view-user', label: 'User Directory' },
      ]
    },
    {
      type: 'label',
      label: 'Communication'
    },
    {
      type: 'link',
      href: '/admin-a9xK72rQ1m8vZpL0/admin-Inquiries',
      icon: Mail,
      label: 'Inquiries',
    },
    {
      type: 'link',
      href: '/admin-a9xK72rQ1m8vZpL0/admin-chats',
      icon: MessageSquare,
      label: 'Messages',
    }
  ];

  return (
    <>
      <aside
        className={cn(
          "fixed md:relative z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white text-zinc-600 border-r border-zinc-100 shadow-xl overflow-hidden flex flex-col",
          sidebarOpen ? "w-[280px]" : "w-[100px]",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between h-20 px-6 border-b border-zinc-100 relative z-10">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
                  <Zap size={20} className="text-white relative z-10" fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-sm text-zinc-900 tracking-widest uppercase leading-none mb-0.5">Crystal Stones</span>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] leading-none">Management</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-small"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20"
              >
                <Zap size={24} className="text-white" fill="currentColor" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar relative z-10 mt-4">
          {navItems.map((item, idx) => (
            <div key={idx} className="mb-2">
              {item.type === 'label' ? (
                sidebarOpen ? (
                  <p className="px-4 py-3 text-[10px] font-black text-amber-400/80 uppercase tracking-[0.25em]">
                    {item.label}
                  </p>
                ) : (
                  <div className="h-px bg-amber-500/20 mx-4 my-6" />
                )
              ) : item.type === 'link' ? (
                <SidebarLink
                  href={item.href}
                  icon={<item.icon size={22} />}
                  label={item.label}
                  sidebarOpen={sidebarOpen}
                  active={location.pathname === item.href}
                />
              ) : (
                <SidebarMenu
                  id={item.id}
                  icon={<item.icon size={22} />}
                  label={item.label}
                  sidebarOpen={sidebarOpen}
                  isOpen={openSubmenu === item.id}
                  onToggle={() => toggleSubmenu(item.id)}
                  active={item.children.some(child => location.pathname === child.href)}
                >
                  <div className="mt-1 space-y-1 relative">
                    <div className="absolute left-1.5 top-0 bottom-2 w-0.5 bg-zinc-100 rounded-full" />
                    {item.children.map((child, cIdx) => (
                      <SidebarLink
                        key={cIdx}
                        href={child.href}
                        label={child.label}
                        sidebarOpen={sidebarOpen}
                        nested
                        active={location.pathname === child.href}
                      />
                    ))}
                  </div>
                </SidebarMenu>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-100 relative z-10 bg-white/50 backdrop-blur-sm">
          <div className={cn(
            "rounded-[2rem] bg-zinc-50 border border-zinc-100 p-3 transition-all",
            !sidebarOpen && "flex justify-center"
          )}>
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck size={18} className="text-emerald-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-0.5">Security Level</p>
                  <p className="text-xs font-black text-zinc-900">Full Admin Access</p>
                </div>
              </div>
            ) : (
              <ShieldCheck size={20} className="text-emerald-500" />
            )}
          </div>


        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarLink = ({ href, icon, label, sidebarOpen, active, nested }) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
      active
        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 font-black"
        : "text-zinc-500 hover:bg-zinc-50 hover:text-indigo-600",
      nested && !sidebarOpen && "hidden",
      nested && "mx-2 py-2.5"
    )}
  >
    {icon && (
      <span className={cn(
        "flex-shrink-0 transition-transform duration-300",
        active ? "scale-110" : "group-hover:scale-110 group-hover:text-white"
      )}>
        {icon}
      </span>
    )}

    {(sidebarOpen || (nested && sidebarOpen)) && (
      <span className={cn(
        "text-sm tracking-tight",
        nested ? "text-xs font-bold" : "font-black"
      )}>
        {label}
      </span>
    )}

    {/* Active indicator for collapsed state */}
    {active && !sidebarOpen && (
      <motion.div
        layoutId="activeBubble"
        className="absolute left-0 w-1.5 h-8 bg-indigo-600 rounded-r-full shadow-[4px_0_15px_rgba(79,70,229,0.4)]"
      />
    )}

    {/* Tooltip for collapsed sidebar */}
    {!sidebarOpen && !nested && (
      <div className="absolute left-20 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl z-[60] pointer-events-none border border-zinc-100">
        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
        {label}
      </div>
    )}
  </Link>
);

const SidebarMenu = ({ id, icon, label, sidebarOpen, isOpen, onToggle, active, children }) => (
  <div className="space-y-1">
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
        active && !isOpen ? "text-indigo-600 font-black" : "text-zinc-500 hover:bg-zinc-50 hover:text-indigo-600"
      )}
    >
      <div className="flex items-center gap-4">
        <span className={cn(
          "flex-shrink-0 transition-transform duration-300",
          active ? "text-indigo-500" : "group-hover:scale-110 group-hover:text-white"
        )}>
          {icon}
        </span>
        {sidebarOpen && <span className="text-sm font-black tracking-tight">{label}</span>}
      </div>
      {sidebarOpen && (
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
          transition={{ duration: 0.3, type: "spring" }}
          className={cn(active ? "text-indigo-500" : "text-zinc-600")}
        >
          <ChevronDown size={16} />
        </motion.div>
      )}

      {/* Tooltip for collapsed sidebar */}
      {!sidebarOpen && (
        <div className="absolute left-20 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl z-[60] pointer-events-none border border-zinc-100">
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
          {label}
        </div>
      )}
    </button>

    <AnimatePresence initial={false}>
      {isOpen && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, x: -10 }}
          animate={{ opacity: 1, height: 'auto', x: 0 }}
          exit={{ opacity: 0, height: 0, x: -10 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0 }}
          className="ml-6 overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default AdminSidebar;
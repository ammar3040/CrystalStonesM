import { Link } from 'react-router-dom';
import { 
  FaHome, FaPlus, FaEye, FaEnvelope, 
  FaChevronDown, FaChevronRight 
} from 'react-icons/fa';

const AdminSidebar = ({ 
  sidebarOpen, 
  mobileSidebarOpen,
  activeMenu,
  toggleMenu,
  toggleSidebar,
  toggleMobileSidebar 
}) => {
  return (
    <aside 
      className={`fixed md:relative z-30 bg-[#fff8a8] text-black transition-all duration-300 ease-in-out font-bold  
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      style={{ height: '100vh', fontSize: '1.2rem',borderRight: '2px solid black' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700 text-black">
        {sidebarOpen && <h1 className="text-xl font-bold">Crystal Stone</h1>}
        <button 
          onClick={toggleSidebar}
          className="text-black focus:outline-none hidden md:block"
        >
          {sidebarOpen ? '×' : '≡'}
        </button>
        <button 
          onClick={toggleMobileSidebar}
          className="text-black focus:outline-none md:hidden"
        >
          ×
        </button>
      </div>

      <div className="overflow-y-auto h-full py-4">
        <SidebarLink 
          to={`/admin-a9xK72rQ1m8vZpL0`}
          icon={<FaHome />}
          text="Dashboard"
          active={activeMenu === 'dashboard'}
          onClick={() => toggleMenu('dashboard')}
          sidebarOpen={sidebarOpen}
        />

        <SidebarMenu 
          icon={<FaPlus />}
          text="Add"
          active={activeMenu === 'add'}
          isOpen={activeMenu === 'add'}
          toggleMenu={() => toggleMenu('add')}
          sidebarOpen={sidebarOpen}
        >
          <SidebarLink 
            to={`/admin-a9xK72rQ1m8vZpL0/add-product`}
            text="Add Product"
            sidebarOpen={sidebarOpen}
            nested
          />
          <SidebarLink 
            to={`/admin-a9xK72rQ1m8vZpL0/add-category`}
            text="Add Category"
            sidebarOpen={sidebarOpen}
            nested
          />
        </SidebarMenu>

        <SidebarMenu 
          icon={<FaEye />}
          text="View"
          active={activeMenu === 'view'}
          isOpen={activeMenu === 'view'}
          toggleMenu={() => toggleMenu('view')}
          sidebarOpen={sidebarOpen}
        >
          <SidebarLink 
            to={`/admin-a9xK72rQ1m8vZpL0/view-products`} 
            text="View Products"
            sidebarOpen={sidebarOpen}
            nested
          />
          <SidebarLink 
            to={`/admin-a9xK72rQ1m8vZpL0/view-user`} 
            text="View Users"
            sidebarOpen={sidebarOpen}
            nested
          />
        </SidebarMenu>

        <SidebarLink 
          to={`/admin-a9xK72rQ1m8vZpL0/admin-Inquiries`}
          icon={<FaEnvelope />}
          text="Inquiries"
          active={activeMenu === 'inquiries'}
          onClick={() => toggleMenu('inquiries')}
          sidebarOpen={sidebarOpen}
        />
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, text, active, onClick, sidebarOpen, nested = false }) => (
  <Link 
    to={to} 
    className={`flex items-center p-2 rounded hover:bg-gray-700 hover:text-white ${active ? 'bg-gray-700 text-white' : ''} ${nested ? 'ml-8 text-sm' : ''}`}
    onClick={onClick}
  >
    {icon && <span className="text-lg">{icon}</span>}
    {sidebarOpen && <span className={`${icon ? 'ml-3' : ''}`}>{text}</span>}
  </Link>
);

const SidebarMenu = ({ icon, text, active, isOpen, toggleMenu, sidebarOpen, children }) => (
  <div className="px-4 py-2">
    <div 
      className={`flex items-center justify-between p-2 rounded hover:bg-gray-700 hover:text-white cursor-pointer ${active ? 'bg-gray-700 text-white' : ''}`}
      onClick={toggleMenu}
    >
      <div className="flex items-center">
        <span className="text-lg">{icon}</span>
        {sidebarOpen && <span className="ml-3">{text}</span>}
      </div>
      {sidebarOpen && (isOpen ? <FaChevronDown /> : <FaChevronRight />)}
    </div>
    
    {isOpen && sidebarOpen && (
      <div className="ml-8 mt-1 space-y-1">
        {children}
      </div>
    )}
  </div>
);

export default AdminSidebar;
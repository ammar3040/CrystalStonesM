import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCart from './AddCart';
import LoginMain from '../Form/LoginMain';
import { MdEmail, MdLocationOn, MdPhoneAndroid } from 'react-icons/md';
import { FaBoxOpen } from 'react-icons/fa';
import Inquiry from './Inquiry';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';


const MobileNavbar = ({ catagory, MobilecartItems, Mobileuser }) => {
  const { user, login: contextLogin, logout: contextLogout } = useAuth();
  const navigate = useNavigate();
  const [showInquiry, setShowInquiry] = useState(false);


  const [cartOpen, setCartOpen] = useState(false);
  const [showAside, setShowAside] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // const [user, setUser] = useState(null);
  const [openCollection, setOpenCollection] = useState(false);
  // Function to read user from cookie - REMOVED redundant logic


  const handleLogout = () => {
    contextLogout();
  };

  const homeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
      <path stroke="currentColor" d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"></path>
    </svg>
  );

  const shopIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );

  const collectionsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  const aboutIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const accountIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
  const DockItem = ({ icon, label, onClick }) => (
    <div
      className="relative flex-1 flex flex-col items-center cursor-pointer group"
      onClick={onClick}
    >
      {/* Tooltip */}
      <span
        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs 
                 font-medium px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 
                 transition-all duration-200 pointer-events-none z-50"
      >
        {label}
      </span>

      {/* Icon */}
      <div className="p-2 hover:text-yellow-500">{icon}</div>
    </div>
  );

  return (
    <>
      {/* Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around items-center px-4 py-3">
          <DockItem icon={homeIcon} label="Home" onClick={() => navigate('/')} />
          <DockItem icon={shopIcon} label="Cart" onClick={() => {
            if (!user) {
              setShowProfile(true); // force login first
            } else {
              setCartOpen(true);
            }
          }} />
          <DockItem icon={collectionsIcon} label="Collections" onClick={() => setShowAside(true)} />
          <DockItem
            icon={<FaBoxOpen size={22} />}
            label="Inquiry"
            onClick={() => {
              if (!user) {
                setShowProfile(true); // force login
              } else {
                setShowInquiry(true); // open inquiry aside
              }
            }}
          />

          <DockItem icon={accountIcon} label="Account" onClick={() => setShowProfile(true)} />
        </div>
      </div>

      {/* Cart Modal */}
      <AddCart show={cartOpen} onClose={() => setCartOpen(false)} cartItems={MobilecartItems} user={Mobileuser} />

      {/* Aside Slide Menu */}
      {showAside && (
        // hayblackbox ai i want to scroll below asie in vertial so which class is use

        <div className="fixed inset-0 z-50 flex bg-opacity-50 ">
          <div className="w-64 bg-white shadow-lg p-4 flex flex-col gap-3 overflow-x-scroll">
            <h3 className="text-lg font-semibold mb-2">Explore</h3>

            {/* Simple Accordion */}
            <div className="space-y-2">
              {/* Collections Accordion Item */}
              <div>
                <button
                  onClick={() => setOpenCollection(!openCollection)}
                  className="w-full flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                >
                  <span className="font-medium">Collections</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${openCollection ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>


                {/* Collection List - shown when expanded */}
                {openCollection && (
                  <ul className="pl-4 py-1 space-y-1 border-l-2 border-gray-100">
                    {catagory.map((catagory) => (
                      <li>
                        <a
                          key={catagory._id}
                          href={`/catagory/${encodeURIComponent(catagory.category)}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                        >
                          {catagory.category}
                        </a></li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Other menu items */}
              <a href="/#bestProduct" className="block p-2 hover:bg-gray-50 rounded">Best Products</a>
              <a href="/ViewAllProduct" className="block p-2 hover:bg-gray-50 rounded">All Products</a>
            </div>
          </div>
          <div className="flex-1  bg-opacity-10" onClick={() => setShowAside(false)} />
        </div>
      )}



      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm" onClick={() => setShowProfile(false)}></div>

          {user ? (
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="relative w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl shadow-black/50" style={{ backdropFilter: 'blur(40px)' }}>
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/30 z-0" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] z-0" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-600/8 rounded-full blur-[50px] z-0" />

                {/* Close Button */}
                <button
                  onClick={() => setShowProfile(false)}
                  className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-400 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="relative z-10 p-6 border border-white/[0.08] rounded-2xl">
                  <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center mb-3">
                      <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>

                    <h3 className="text-base font-bold text-white">{user.name}</h3>

                    <div className="mt-2 space-y-1 text-center">
                      <p className="text-xs text-zinc-400 flex items-center gap-1.5"><MdEmail className="text-amber-500" /> {user.email}</p>
                      <p className="text-xs text-zinc-400 flex items-center gap-1.5"><MdLocationOn className="text-amber-500" /> {user.address || 'Not set'}</p>
                      {user.mobile && <p className="text-xs text-zinc-400 flex items-center gap-1.5"><MdPhoneAndroid className="text-amber-500" /> {user.mobile}</p>}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.08] space-y-2">
                    <button onClick={() => { setShowProfile(false); navigate('/'); }} className="w-full py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-amber-400 text-xs font-bold uppercase tracking-widest hover:bg-white/[0.08] transition-all duration-200">
                      View Products
                    </button>
                    {(!user.address || !user.mobile) && (
                      <button onClick={() => { setShowProfile(false); navigate('/CompleteProfile'); }} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200">
                        Complete Profile
                      </button>
                    )}
                    <button onClick={handleLogout} className="w-full py-2.5 bg-white/[0.04] border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all duration-200">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <LoginMain
              onLoginSuccess={(userData) => {
                // setUser(userData); // Context handles it via onLoginSuccess callback chain or direct use
                if (userData.role === 'admin') {
                  window.location.href = `${import.meta.env.VITE_API_URL}/admin`;
                } else {
                  setShowProfile(false);
                }
              }}
              onClose={() => setShowProfile(false)}
            />
          )}

        </div>
      )}
      {user && (
        <Inquiry show={showInquiry} onClose={() => setShowInquiry(false)} user={user} />
      )}

    </>
  );
};

export default MobileNavbar;

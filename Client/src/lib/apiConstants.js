// ─── Centralized API Constants ───
// All API endpoints are defined here using VITE_API_URL and VITE_ADMIN_PANEL_LINK as base URLs.
// Import these constants in your components instead of constructing URLs inline.

const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_PANEL_URL = import.meta.env.VITE_ADMIN_PANEL_LINK;

// Derive the server root URL (without /api) — used for admin routes
const getServerRoot = () => {
    let url = API_URL || '';
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (url.endsWith('/api')) url = url.slice(0, -4);
    return url;
};

const SERVER_URL = getServerRoot();

// ─── Public API Endpoints (VITE_API_URL based) ───
export const API_GET_CATEGORY = `${API_URL}/getCatagory`;
export const API_GET_CART_ITEM = `${API_URL}/getCartItem`;
export const API_CARTED_ITEM = `${API_URL}/cartedItem`;
export const API_GET_BEST_PRODUCT_LIST = `${API_URL}/getbestproductlist`;
export const API_SET_BEST_PRODUCT_LIST = `${API_URL}/setbestproductlist`;
export const API_ALL_PRODUCTS = `${API_URL}/all`;
export const API_SINGLE_PRODUCT = `${API_URL}/product`;
export const API_CATEGORY_PRODUCTS = `${API_URL}/catagoryproduct`;
export const API_REGISTER = `${API_URL}/register`;
export const API_LOGOUT = `${API_URL}/logout`;
export const API_GOOGLE_AUTH = `${API_URL}/google`;
export const API_SEND_OTP = `${API_URL}/send-otp`;
export const API_SUBSCRIBE = `${API_URL}/subscribe`;
export const API_UPDATE_PHONE = `${API_URL}/updatePhone`;
export const API_GET_USER_INQUIRIES = `${API_URL}/getUserInquiries`;
export const API_SPECIFICATIONS_BY_CATEGORY = `${API_URL}/specifications-by-category`;
export const API_ADMIN_REDIRECT = `${API_URL}/admin`;

// ─── Admin Panel Endpoints (VITE_ADMIN_PANEL_LINK based) ───
export const ADMIN_USER_TABLE = `${ADMIN_PANEL_URL}/userddtable`;
export const ADMIN_USER_TABLE_ALL = `${ADMIN_PANEL_URL}/usertable`;

// ─── Admin Server Endpoints (SERVER_URL based, i.e. without /api) ───
export const ADMIN_DELETE_USER = `${SERVER_URL}/admin/deleteUser`;
export const ADMIN_DELETE_PRODUCT = `${SERVER_URL}/admin/deleteProduct`;
export const ADMIN_SHOW_ALL_PRODUCTS = `${SERVER_URL}/admin/show-all-products`;
export const ADMIN_CATEGORIES = `${SERVER_URL}/admin/categories`;
export const ADMIN_CRYSTAL_TYPES = `${SERVER_URL}/admin/crystal-types`;
export const ADMIN_EDIT_PAGE = `${SERVER_URL}/admin/EditPage`;
export const ADMIN_UPDATE_DATA = `${SERVER_URL}/admin/updateData`;
export const ADMIN_GET_INQUIRY = `${SERVER_URL}/admin/getInquiry`;
export const ADMIN_UPDATE_INQUIRY_STATUS = `${SERVER_URL}/admin/updateInquiryStatus`;
export const ADMIN_ADD_PRODUCT = `${SERVER_URL}/admin/AddProduct`;
export const ADMIN_ADD_CATEGORY = `${SERVER_URL}/admin/addcatagory`;
export const ADMIN_DELETE_CATEGORY = `${SERVER_URL}/admin/deletecatagory`;

// Re-export base URLs for cases where dynamic path construction is needed
export { API_URL, ADMIN_PANEL_URL, SERVER_URL };

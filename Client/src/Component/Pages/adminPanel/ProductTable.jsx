import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const ProductTable = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(-1);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBestProducts, setSelectedBestProducts] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all`);
        const data = await response.json();
        setAllProducts(data);
        const bestProducts = data
          .filter(product => product.bestproduct)
          .map(product => product._id);
        setSelectedBestProducts(bestProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle best product selection
  const handleBestProductChange = (productId) => {
    setSelectedBestProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Submit best products
  const handleSubmitBestProducts = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/setbestproductlist`, { bestProducts: selectedBestProducts });
      toast.success('Best products updated successfully!');
    } catch (err) {
      toast.error('Error updating best products');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/deleteProduct/?id=${id}`);
      if (res.data.success) {
        toast.success('Product deleted successfully!');
        window.location.reload();
      } else {
        toast.error(res.data.message || 'Failed to delete product.');
      }
    } catch (err) {
      toast.error('Server error while deleting product.');
      console.error(err);
    }
  };

  // Sorting function
  const sortProducts = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (column) => {
    if (sortColumn !== column) return 'fa-sort';
    return sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  };

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = allProducts.filter(product => {
      if (!searchQuery) return true;
      return Object.values(product).some(
        value => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    if (sortColumn >= 0) {
      filteredProducts.sort((a, b) => {
        const aValue = getSortValue(a, sortColumn);
        const bValue = getSortValue(b, sortColumn);
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredProducts;
  };

  // Get sort value for a column
  const getSortValue = (product, column) => {
    switch (column) {
      case 1: return product.modelNumber?.toLowerCase() || '';
      case 2: return product.productName?.toLowerCase() || '';
      case 3: return product.category?.toLowerCase() || '';
      case 4: return product.dollarPrice || 0;
      case 5: return product.originalPrice || 0;
      case 6: return product.crystalType?.toLowerCase() || '';
      default: return '';
    }
  };

  // Pagination
  const filteredProducts = getFilteredAndSortedProducts();
  const totalRows = filteredProducts.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header with search and pagination controls */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <label className="text-sm text-gray-700 mr-2">Show</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="block w-20 px-3 py-1.5 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700 ml-2">entries</span>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <form onSubmit={handleSubmitBestProducts}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Best <button type="submit" className="ml-1 px-1 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Save</button>
                  </th>
                  <th 
                    scope="col" 
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => sortProducts(1)}
                  >
                    <div className="flex items-center">
                      Model
                      <i className={`fas ${getSortIcon(1)} ml-1`}></i>
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th 
                    scope="col" 
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-48"
                    onClick={() => sortProducts(2)}
                  >
                    <div className="flex items-center">
                      Product Name
                      <i className={`fas ${getSortIcon(2)} ml-1`}></i>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => sortProducts(3)}
                  >
                    <div className="flex items-center">
                      Category
                      <i className={`fas ${getSortIcon(3)} ml-1`}></i>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => sortProducts(4)}
                  >
                    <div className="flex items-center justify-end">
                      Price ($)
                      <i className={`fas ${getSortIcon(4)} ml-1`}></i>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => sortProducts(5)}
                  >
                    <div className="flex items-center justify-end">
                      Original (₹)
                      <i className={`fas ${getSortIcon(5)} ml-1`}></i>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => sortProducts(6)}
                  >
                    <div className="flex items-center">
                      Crystal
                      <i className={`fas ${getSortIcon(6)} ml-1`}></i>
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedBestProducts.includes(product._id)}
                            onChange={() => handleBestProductChange(product._id)}
                          />
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.modelNumber}</div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={product.mainImage?.url || 'https://via.placeholder.com/50'} 
                            alt={product.productName}
                          />
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="text-sm font-semibold text-gray-900 truncate max-w-xs">{product.productName}</div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-right text-sm font-medium">
                        {product.dollarPrice ? (
                          <span className="text-red-600 font-bold">${product.dollarPrice}</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                        ₹{product.originalPrice}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">
                        {product.crystalType}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => navigate(`/admin-a9xK72rQ1m8vZpL0/edit-product/${product._id}`)}
                            className="text-blue-600 hover:text-blue-900 me-2"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-sm text-gray-500">Add your first product to get started</p>
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() => navigate('/admin/addProduct')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Product
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </form>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{totalRows === 0 ? 0 : startIndex + 1}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalRows}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;
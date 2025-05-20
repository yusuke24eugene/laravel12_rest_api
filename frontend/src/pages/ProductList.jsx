import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    min_price: '',
    max_price: '',
    sort_by: 'id',
    sort_dir: 'asc',
    per_page: 10,
    page: 1,
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Configure Axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

  const checkAuth = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      const res = await axios.get('/user');
      setUser(res.data);
    } catch (err) {
      setUser(null); // Not logged in
      navigate('/login');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.get('/products', {
        params: filters,
      });

      setProducts(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) fetchProducts();
  }, [filters, user]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded"
        />
        <input
          type="number"
          name="min_price"
          placeholder="Min Price"
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded"
        />
        <input
          type="number"
          name="max_price"
          placeholder="Max Price"
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded"
        />
        <select
          name="sort_by"
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded"
        >
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
        <select
          name="sort_dir"
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {products.map((product) => (
              <li key={product.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <p className="text-gray-500 text-sm">{product.description}</p>
                  </div>
                  <span className="text-green-600 font-semibold">₱{product.price}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <p>
              Page {pagination.current_page} of {pagination.last_page}
            </p>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;

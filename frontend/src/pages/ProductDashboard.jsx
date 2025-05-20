import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [perPage, setPerPage] = useState(15);
  const [pagination, setPagination] = useState({});
  const [form, setForm] = useState({ name: '', description: '', price: '', barcode: '' });
  const [editId, setEditId] = useState(null);

  // Configure Axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


  const fetchProducts = async (page = 1) => {
    try {
      const params = {
        search,
        min_price: minPrice,
        max_price: maxPrice,
        sort_by: sortBy,
        sort_dir: sortDir,
        per_page: perPage,
        page,
      };

      await axios.get('/sanctum/csrf-cookie')
         .catch(error => {
          console.error('CSRF Error:', error);
        });

      const { data } = await axios.get('/products', { params });
      setProducts(data.data);
      setPagination(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, minPrice, maxPrice, sortBy, sortDir, perPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`products/${editId}`, form);
      } else {
        await axios.post('/products', form);
      }
      setForm({ name: '', description: '', price: '', barcode: '' });
      setEditId(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await axios.delete(`products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Dashboard</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search"
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Price"
            className="input"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="input"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          <select className="input" value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              className="input"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="input"
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              className="input"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              className="input"
              type="text"
              placeholder="Barcode"
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {editId ? 'Update Product' : 'Create Product'}
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left text-sm">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Barcode</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{product.id}</td>
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">{product.description}</td>
                  <td className="py-2 px-4">₱{product.price}</td>
                  <td className="py-2 px-4">{product.barcode || 'N/A'}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex gap-2 mt-6">
          {pagination.links?.map((link, index) => (
            <button
              key={index}
              disabled={!link.url}
              className={`px-3 py-1 rounded ${
                link.active
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              onClick={() => {
                const page = new URL(link.url).searchParams.get('page');
                fetchProducts(page);
              }}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;

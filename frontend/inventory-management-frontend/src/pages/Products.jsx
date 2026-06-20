import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Products.css';
const API_URL = process.env.VITE_API_URL;

function Products() {
  const [products, setProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [stockFilter, setStockFilter] = useState('all'); 
  const [sortOption, setSortOption] = useState('none'); 
  const [error, setError] = useState(''); 
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
      const response = await axios.get(`${API_URL}/api/products`); 
        setProducts(response.data); 
      } catch (error) {
        console.error('Error fetching products:', error); 
        setError('Error fetching products');
      }
    };

    fetchProducts(); 
  }, []); 

  // Function to handle stock increment and decrement
  const updateStock = async (id, newStock) => {
    try {
      await axios.put(`${API_URL}/api/products/${id}`, { stock: newStock }); 
      setProducts(products.map(product => product._id === id ? { ...product, stock: newStock } : product)); // Update local state
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Error updating stock');
    }
  };

  // Function to delete a product
  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/products/${id}`);
      setProducts(products.filter(product => product._id !== id)); // Update the UI after successful deletion
      console.log(response.data.message); 
    } catch (error) {
      console.error('Error deleting product:', error); 
      setError('Error deleting product'); 
    }
  };

  // Function to handle stock filter
  const handleStockFilterChange = (e) => {
    setStockFilter(e.target.value); 
  };

  // Function to handle sort option change
  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value); // Set selected sort option
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${API_URL}/api/products/${editingProduct._id}`, editingProduct);
      // Update the product list after successful edit
      setProducts(products.map(product => product._id === editingProduct._id ? editingProduct : product));
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.whereToBuy && product.whereToBuy.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (stockFilter === 'all' || (stockFilter === 'in-stock' && product.stock > 0) || (stockFilter === 'out-of-stock' && product.stock === 0))
    )
    .sort((a, b) => {
      if (sortOption === 'low-stock') {
        return a.stock - b.stock; 
      }
      if (sortOption === 'high-stock') {
        return b.stock - a.stock; 
      }
      return 0; 
    });

  return (
    <div className="products-page">
      <h1>Products</h1>
      {error && <p className="error-message">{error}</p>} 

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
      />

      {/* Stock Filter */}
      <select value={stockFilter} onChange={handleStockFilterChange} className="filter-dropdown">
        <option value="all">All</option>
        <option value="in-stock">In Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>

      {/* Sort Dropdown */}
      <select value={sortOption} onChange={handleSortOptionChange} className="sort-dropdown">
        <option value="none">No Sorting</option>
        <option value="low-stock">Low Stock</option>
        <option value="high-stock">High Stock</option>
      </select>

      <ul className="product-list">
      {editingProduct && (
        <div className="edit-form">
          <h3>Edit Product</h3>
          <input
            type="text"
            name="name"
            value={editingProduct.name}
            onChange={handleEditChange}
            placeholder="Product Name"
          />
          <input
            type="number"
            name="stock"
            value={editingProduct.stock}
            onChange={handleEditChange}
            placeholder="Stock Quantity"
          />
          <input
            type="text"
            name="whereToBuy"
            value={editingProduct.whereToBuy}
            onChange={handleEditChange}
            placeholder="Where to Buy"
          />
          <input
            type="text"
            name="description"
            value={editingProduct.description || ''}
            onChange={handleEditChange}
            placeholder="Product Description"
          ></input>
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditingProduct(null)}>Cancel</button>
        </div>
      )}
        {filteredAndSortedProducts.map(product => (
          <li key={product._id} className="product-item">
            <span><strong>Product:</strong> {product.name}</span>
            <span><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            <span><strong>Where to Buy:</strong> {product.whereToBuy || 'Not available'}</span> 
            <span><strong>Description:</strong> {product.description || 'No description available'}</span> 
            <button onClick={() => updateStock(product._id, product.stock + 1)}>+</button>
            <button onClick={() => updateStock(product._id, product.stock - 1)}>-</button>
            <button onClick={() => deleteProduct(product._id)} className="delete-button">Delete</button> 
            <button onClick={() => setEditingProduct(product)} className="edit-button">Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;

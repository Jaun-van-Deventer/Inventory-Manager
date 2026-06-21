import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Products.css';
import {
  fetchProducts as fetchProductList,
  getProductsErrorMessage,
  getProductsUrl,
} from '../api/products';

function Products() {
  const [products, setProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [stockFilter, setStockFilter] = useState('all'); 
  const [sortOption, setSortOption] = useState('none'); 
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError('');

      try {
        const fetchedProducts = await fetchProductList();

        if (!isMounted) {
          return;
        }

        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setError(getProductsErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts(); 

    return () => {
      isMounted = false;
    };
  }, []); 

  // Function to handle stock increment and decrement
  const updateStock = async (id, newStock) => {
    try {
      await axios.put(`${getProductsUrl()}/${id}`, { stock: newStock }); 
      setProducts((currentProducts) => {
        const productList = Array.isArray(currentProducts) ? currentProducts : [];
        return productList.map(product => product._id === id ? { ...product, stock: newStock } : product);
      });
    } catch (error) {
      setError('Error updating stock');
    }
  };

  // Function to delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${getProductsUrl()}/${id}`);
      setProducts((currentProducts) => {
        const productList = Array.isArray(currentProducts) ? currentProducts : [];
        return productList.filter(product => product._id !== id);
      });
    } catch (error) {
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
      await axios.put(`${getProductsUrl()}/${editingProduct._id}`, editingProduct);
      // Update the product list after successful edit
      setProducts((currentProducts) => {
        const productList = Array.isArray(currentProducts) ? currentProducts : [];
        return productList.map(product => product._id === editingProduct._id ? editingProduct : product);
      });
      setEditingProduct(null);
    } catch (error) {
      setError('Failed to update product');
    }
  };

  // Filter and sort products
  const productList = Array.isArray(products) ? products : [];
  const filteredAndSortedProducts = productList
    .filter(product =>
      ((product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((product.whereToBuy || '').toLowerCase().includes(searchQuery.toLowerCase())) ||
        ((product.description || '').toLowerCase().includes(searchQuery.toLowerCase()))) &&
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
      {isLoading && <p className="status-message">Loading products...</p>}
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
      <ul className="product-list">
        {!isLoading && !error && filteredAndSortedProducts.length === 0 && (
          <li className="status-message">No products found.</li>
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

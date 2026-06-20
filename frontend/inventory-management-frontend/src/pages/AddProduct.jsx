import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddProduct.css';
const API_URL = import.meta.env.VITE_API_URL;

function AddProduct() {
  const [name, setName] = useState('');
  const [stock, setStock] = useState(0);
  const [whereToBuy, setWhereToBuy] = useState('');
  const [customWhereToBuy, setCustomWhereToBuy] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const predefinedOptions = ['President Hyper', 'Zio', 'Clicks', "Letta's Spices", 'Other'];

  const handleWhereToBuyChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setWhereToBuy('');
    } else {
      setWhereToBuy(value);
    }
  };

  const handleCustomWhereToBuyChange = (e) => {
    setCustomWhereToBuy(e.target.value);
    setWhereToBuy(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const newProduct = { name, stock, whereToBuy, description };
      const response = await axios.post(`${API_URL}/api/products`, newProduct);
      setSuccess(`Product added successfully: ${response.data.name}`);
      setName('');
      setStock(0);
      setWhereToBuy('');
      setCustomWhereToBuy('');
      setDescription('');
    } catch (error) {
      setError('Error adding product. Please try again.');
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="add-product-page">
      <h1>Add New Product</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value ? Number(e.target.value) : '')}
          required
        />
        <select
          value={whereToBuy || 'Other'}
          onChange={handleWhereToBuyChange}
          required
        >
          {predefinedOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {whereToBuy === '' && (
          <input
            type="text"
            placeholder="Enter custom location"
            value={customWhereToBuy}
            onChange={handleCustomWhereToBuyChange}
            required
          />
        )}
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;

import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { fetchProducts, getProductsErrorMessage } from '../api/products';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const fetchedProducts = await fetchProducts();
        const safeProducts = Array.isArray(fetchedProducts) ? fetchedProducts : [];

        if (!isMounted) {
          return;
        }

        setProducts(safeProducts);
        setTotalProducts(safeProducts.length);
        const stockSum = safeProducts.reduce(
          (acc, product) => acc + Number(product.stock || 0),
          0
        );
        setTotalStock(stockSum);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setTotalProducts(0);
        setTotalStock(0);
        setError(getProductsErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const productList = Array.isArray(products) ? products : [];

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      {isLoading && <p className="status-message">Loading products...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="dashboard-stats">
        <div className="stat-item">
          <h2>Total Products</h2>
          <p>{totalProducts}</p>
        </div>
        <div className="stat-item">
          <h2>Total Stock</h2>
          <p>{totalStock}</p>
        </div>
      </div>
      <div className="product-list">
        <h2>All Products</h2>
        {!isLoading && !error && productList.length === 0 && (
          <p className="status-message">No products found.</p>
        )}
        {productList.length > 0 && (
          <ul>
            {productList.map(product => (
              <li key={product._id} className="product-item">
                <span><strong>{product.name}</strong> - {product.stock} in stock</span>
                {product.whereToBuy && (
                  <span><strong>Where to Buy:</strong> {product.whereToBuy}</span>
                )}
                {product.description ? (
                  <span>
                    <strong>Description:</strong> {product.description}
                  </span>
                ) : (
                  <span>
                    <strong>Description:</strong> No description available
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

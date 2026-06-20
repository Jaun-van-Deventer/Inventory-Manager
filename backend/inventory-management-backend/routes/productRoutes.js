const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  const { name, stock, whereToBuy, description } = req.body;  

  try {
    const newProduct = new Product({ name, stock, whereToBuy, description }); 
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product' });
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id); 
    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); 
    }
    res.status(200).json({ message: 'Product deleted successfully' }); 
  } catch (error) {
    console.error('Error deleting product:', error); 
    res.status(500).json({ message: 'Error deleting product' }); 
  }
});

// Update product details (Edit product)
router.put('/:id', async (req, res) => {
  const { name, stock, whereToBuy, description } = req.body; 

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, stock, whereToBuy, description }, 
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' }); 
    }

    res.json(updatedProduct); 
  } catch (error) {
    console.error('Error updating product:', error); 
    res.status(500).json({ message: 'Error updating product' }); 
  }
});


module.exports = router;

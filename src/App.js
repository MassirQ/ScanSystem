// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScannerPage from './components/ScannerPage';
import ProductActions from './components/ProductActions';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import './App.css';

function App() {
    const [scannedProduct, setScannedProduct] = useState(null);

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ScannerPage
                                onProductScanned={setScannedProduct}
                            />
                        }
                    />
                    <Route
                        path="/actions"
                        element={
                            <ProductActions
                                product={scannedProduct}
                                onBack={() => setScannedProduct(null)}
                            />
                        }
                    />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/add-product" element={<ProductForm />} />
                    <Route path="/edit-product/:barcode" element={<ProductForm />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
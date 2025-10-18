import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScannerPage from './components/ScannerPage';
import ProductActions from './components/ProductActions';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import './App.css';
import ProductDetails from "./components/ProductDetails";
import PriceScan from "./components/PriceScan";
import UpdateQuantityPage from "./components/UpdateQuantityPage";
import UpdateWarehousePage from "./components/UpdateWarehousePage";

function App() {
    const [scannedProduct, setScannedProduct] = useState(null);

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    {/* Scanner-siden */}
                    <Route path="/" element={<PriceScan />} />

                    {/* Produkt-handlingssiden */}
                    <Route
                        path="/actions"
                        element={
                            <ProductActions
                                product={scannedProduct}
                                onBack={() => setScannedProduct(null)}
                            />
                        }
                    />

                    {/* Liste over alle produkter */}
                    <Route path="/products" element={<ProductList />} />

                    {/* Opret nyt produkt */}
                    <Route path="/add-product" element={<ProductForm />} />

                    {/* Rediger eksisterende produkt */}
                    <Route path="/edit-product/:barcode" element={<ProductForm />} />

                    {/* Vis produktdetaljer */}
                    <Route path="/product-details/:barcode" element={<ProductDetails />} />

                    {/* Drift scanner */}
                    <Route
                        path="/drift-scanner"
                        element={<ScannerPage onProductScanned={setScannedProduct} />}
                    />

                    {/* Opdater antal og lager */}
                    <Route path="/update-quantity" element={<UpdateQuantityPage />} />
                    <Route path="/update-warehouse" element={<UpdateWarehousePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

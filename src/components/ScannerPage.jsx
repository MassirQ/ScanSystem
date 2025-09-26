import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import '../App.css';

const ScannerPage = ({ onProductScanned }) => {
    const [barcode, setBarcode] = useState('');
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            setBarcode('');
            setProduct(null);
            setError('');
        }
    }, [product]);

    // Lyt efter Enter-tasten
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleScanComplete();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [barcode]);

    // Hent produktdata
    const fetchProduct = useCallback(async (barcode) => {
        if (!barcode) {
            setProduct(null);
            setError("Indtast venligst en stregkode.");
            return;
        }
        try {
            const product = await productService.searchProduct(barcode);
            if (product) {
                setProduct(product);
                setError("");
                onProductScanned(product);
                navigate("/actions");
            } else {
                setProduct(null);
                setError("Produkt ikke fundet!");
            }
        } catch (err) {
            console.error("Fejl ved hentning af produktdata", err);

            if (err.response && err.response.status === 404) {
                setError("❌ Produktet findes ikke i databasen.");
            } else {
                setError("⚠️ Der opstod en serverfejl. Prøv igen senere.");
            }

            setProduct(null);
        }
    }, [navigate, onProductScanned]);

    // Håndter færdig scanning
    const handleScanComplete = async () => {
        fetchProduct(barcode);
    };

    return (
        <div className="scanner-container">
            <h1>🛒 Scanner</h1>
            <div className="scan-box">
                <input
                    autoFocus
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="🔍 Scan stregkode her..."
                    className="scan-input"
                />
                {error && (
                    <div className="error-box">
                        <p>{error}</p>
                        <button className="btn create-btn" onClick={() => navigate('/add-product')}>
                            ➕ Opret nyt produkt
                        </button>
                    </div>
                )}
                {product && (
                    <div className="product-info">
                        <h2>{product.productName}</h2>
                        <p><strong>Brand:</strong> {product.brandName}</p>
                        <p><strong>Vægt:</strong> {product.productWeight}</p>
                        <p><strong>Pris:</strong> {product.retailPrice} DKK</p>
                        {product.imageUrl && <img src={product.imageUrl} alt={product.productName} />}
                    </div>
                )}
            </div>
            <nav className="quick-menu">
                <button className="btn" onClick={() => navigate('/products')}>📦 Alle produkter</button>
                <button className="btn" onClick={() => navigate('/add-product')}>✍️ Manuel oprettelse</button>
                <button className="btn" onClick={() => navigate('/')}>
                    🛒🔍 Drift Scanner
                </button>
            </nav>
        </div>
    );
};

export default ScannerPage;
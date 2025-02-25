import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; // Importer CSS-filen

const ScannerPage = () => {
    const [barcode, setBarcode] = useState('');
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleScanComplete();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [barcode]);

    const fetchProduct = useCallback(async (barcode) => {
        if (!barcode) {
            setProduct(null);
            setError('Indtast venligst en stregkode.');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5001/api/product/${barcode}`);
            if (response.status === 200 && response.data) {
                setProduct(response.data);
                setError('');
            } else {
                setProduct(null);
                setError('Produkt ikke fundet!');
            }
        } catch (err) {
            console.error('Fejl ved hentning af produktdata', err);
            setProduct(null);
            setError('Der opstod en fejl ved hentning af produktet.');
        }
    }, []);

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
            </nav>
        </div>
    );
};

export default ScannerPage;

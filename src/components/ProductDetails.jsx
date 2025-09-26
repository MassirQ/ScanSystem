import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import '../App.css';

const ProductDetails = () => {
    const { barcode } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const product = await productService.searchProduct(barcode);
                if (product) {
                    setProduct(product);
                } else {
                    setError('Produktet findes ikke');
                }
            } catch (err) {
                console.error('Fejl ved hentning af produktdata', err);
                setError('Der opstod en fejl ved hentning af produktet.');
            }
        };
        loadProduct();
    }, [barcode]);

    if (error) {
        return (
            <div className="scanner-container">
                <button className="btn back-btn" onClick={() => navigate('/')}>⬅️ Tilbage til forsiden</button>
                <div className="error-box">{error}</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="scanner-container">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="scanner-container">


            {/* Produktinfo */}
            <div className="scan-box">
                <h1>{product.productName}</h1>
                <p><strong>Brand:</strong> {product.brandName}</p>
                <p><strong>Vægt:</strong> {product.productWeight}</p>
                <p><strong>Pris:</strong> {product.retailPrice} DKK</p>
                {product.imageUrl && <img src={product.imageUrl} alt={product.productName} />}
            </div>

            {/* Quick-menu lig ScannerPage */}
            <nav className="quick-menu">
                <button className="btn" onClick={() => navigate('/products')}>📦 Alle produkter</button>
                <button className="btn" onClick={() => navigate('/add-product')}>✍️ Manuel oprettelse</button>
                <button className="btn" onClick={() => navigate(`/edit-product/${product.barcode}`)}>✏️ Rediger produkt </button>
                <button className="btn" onClick={() => navigate('/')}>🛒 Tilbage til Scan</button>
            </nav>
        </div>
    );
};

export default ProductDetails;

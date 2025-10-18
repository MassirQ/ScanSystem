import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import '../App.css';

const UpdateQuantityPage = () => {
    const [barcode, setBarcode] = useState('');
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const barcodeRef = useRef(null); // <-- ref til input

    const handleSearch = async () => {
        try {
            const data = await productService.searchProduct(barcode);
            if (!data) {
                setError('Produkt ikke fundet.');
                setProduct(null);
                return;
            }
            setProduct(data);
            setQuantity(data.quantity || '');
            setError('');
        } catch (err) {
            console.error("Fejl:", err);
            if (err.response && err.response.status === 404) {
                setError("❌ Produktet findes ikke i databasen.");
            } else {
                setError("⚠️ Serverfejl, prøv igen.");
            }
            barcodeRef.current.focus();
        }
    };

    const handleUpdate = async () => {
        try {
            await productService.updateQuantity(barcode, { quantity });
            alert('✅ Antal opdateret!');

            setBarcode('');
            setProduct(null);
            setQuantity('');

            barcodeRef.current.focus(); // <-- sæt fokus tilbage
        } catch (err) {
            alert('❌ Fejl ved opdatering');
        }
    };

    return (
        <div className="scanner-container">
            <h1>🧾 Opdater Butikslager</h1>

            <input
                ref={barcodeRef} // <-- bind ref
                autoFocus
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Scan stregkode..."
                className="scan-input"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            {error && <p className="error-box">{error}</p>}

            {product && (
                <div className="product-info">
                    <h2>{product.productName}</h2>
                    <p><strong>Brand:</strong> {product.brandName}</p>
                    <p><strong>Nu:</strong> {product.quantity || 0}</p>

                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Nyt antal"
                    />
                    <button className="btn create-btn" onClick={handleUpdate}>
                        💾 Opdater
                    </button>
                </div>
            )}

            <nav className="quick-menu">
                <button className="btn" onClick={() => navigate('/')}>🏠 Tilbage</button>
            </nav>
        </div>
    );
};

export default UpdateQuantityPage;

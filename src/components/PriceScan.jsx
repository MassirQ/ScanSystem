import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../services/productService";
import "../App.css";

const PriceScan = () => {
    const [lastProduct, setLastProduct] = useState(null);
    const [error, setError] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleScan = async (e) => {
        e.preventDefault();
        const barcode = e.target.barcode.value.trim();

        if (!barcode) return;

        try {
            const product = await productService.searchProduct(barcode);

            if (product) {
                setLastProduct(product);
                setError("");
            } else {
                setLastProduct(null);
                setError("❌ Produkt ikke fundet!");
            }
        } catch (err) {
            console.error("Fejl:", err);
            if (err.response && err.response.status === 404) {
                setError("❌ Produktet findes ikke i databasen.");
            } else {
                setError("⚠️ Serverfejl, prøv igen.");
            }
            setLastProduct(null);
        }

        // Ryd input og sæt fokus igen
        e.target.reset();
        inputRef.current.focus();
    };

    return (
        <div className="scanner-container">
            <h1>⚡ Drift Scanner</h1>
            <div className="scan-box">
                <form onSubmit={handleScan}>
                    <input
                        type="text"
                        name="barcode"
                        ref={inputRef}
                        placeholder="🔍 Scan stregkode her..."
                        autoFocus
                        className="scan-input"
                    />
                </form>

                {lastProduct && (
                    <div className="product-info">
                        <h3>{lastProduct.brandName} {lastProduct.productName}</h3>
                        <h5><strong>Vægt:</strong> {lastProduct.productWeight}</h5>
                        <h2>Pris: <strong>{lastProduct.retailPrice} DKK</strong></h2>
                        {lastProduct.imageUrl && (
                            <img src={lastProduct.imageUrl} alt={lastProduct.productName} />
                        )}
                    </div>
                )}

                {error && (
                    <div className="error-box">
                        <p>{error}</p>
                    </div>
                )}
            </div>

            <nav className="quick-menu">
                <button className="btn" onClick={() => navigate("/drift-scanner")}>
                    🛒 Normal scanner
                </button>
                <button className="btn" onClick={() => navigate("/products")}>
                    📦 Alle produkter
                </button>
                <button className="btn" onClick={() => navigate("/add-product")}>
                    ✍️ Manuel oprettelse
                </button>
            </nav>
        </div>
    );
};

export default PriceScan;

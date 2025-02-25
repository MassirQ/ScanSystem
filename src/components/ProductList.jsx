import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import "../App.css"; // Importer CSS-filen

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            const data = await productService.getAllProducts();
            setProducts(data);
        };
        loadProducts();
    }, []);

    const filteredProducts = products.filter(
        (product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode.includes(searchTerm)
    );

    return (
        <div>
        <button className="back-btn" onClick={() => <Link to={`/`}></Link>}>⬅ Tilbage</button>

    <div className="product-list-container">

        <div className="product-list-card">
        <h2>📦 Alle produkter</h2>
                <input
                    type="text"
                    placeholder="🔍 Søg produkter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <div className="table-container">
                    <table className="product-table">
                        <thead>
                        <tr>
                            <th>Stregkode</th>
                            <th>Brand</th>
                            <th>Produktnavn</th>
                            <th>Pris DKK</th>
                            <th>Antal</th>
                            <th>Handlinger</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.barcode}>
                                <td>{product.barcode}</td>
                                <td>{product.brandName}</td>
                                <td>{product.productName}</td>
                                <td>{product.retailPrice} </td>
                                <td>{product.quantity} </td>
                                <td>
                                    <Link to={`/edit-product/${product.barcode}`} className="edit-btn">
                                        ✏️ Rediger
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ProductList;

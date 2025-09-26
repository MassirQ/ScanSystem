import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import "../App.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(50); // Antal produkter pr. side

    const navigate = useNavigate()
    // Hent produkter ved mount
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error('Fejl ved hentning af produkter:', error);
            }
        };
        loadProducts();
    }, []);

    // Filtrer produkter baseret på søgeterm
    const filteredProducts = products.filter(
        (product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode.includes(searchTerm) ||
            product.brandName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination-logik
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Skift side
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="product-list-container">
                <div className="product-list-card">
                    <button
                        onClick={() => navigate("/")}
                        className="btn back-btn"
                        style={{marginBottom: "20px"}}
                    >
                        ⬅️ Tilbage til Scan
                    </button>
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
                            {currentProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.barcode}</td>
                                    <td>{product.brandName}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.retailPrice}</td>
                                    <td>{product.quantity}</td>
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

                    {/* Pagination-kontrol */}
                    <div className="pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            Forrige
                        </button>
                        <span>
                            Side {currentPage} af {Math.ceil(filteredProducts.length / productsPerPage)}
                        </span>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                            className="pagination-button"
                        >
                            Næste
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
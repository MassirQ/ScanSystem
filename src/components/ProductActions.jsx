// components/ProductActions.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const SERVER_ADDRESS = 'https://10ab52fb9d7f.ngrok.app';

const ProductActions = ({ product, onBack }) => {
    const navigate = useNavigate();

    const formatPrice = (price) => {
        if (!price) return '';
        let cleanedPrice = price.replace(/[^0-9,]/g, '').trim();
        cleanedPrice = cleanedPrice.replace(',', '.');
        return cleanedPrice ? `${cleanedPrice} DKK` : '';
    };

    const handlePrint = () => {
        if (!product) return;
        const priceForPrint = formatPrice(product.retailPrice).replace(' DKK', '');

        axios.get(SERVER_ADDRESS, {
            params: {
                command: "print",
                company: product.brandName,
                productName: `${product.productName} ${product.productWeight}`,
                price: priceForPrint,
            },
        })
            .then(response => {
                alert("Data sendt til server for print!");
            })
            .catch(error => {
                console.log(error);
                alert("Der opstod en fejl ved afsendelse: " + (error.response ? error.response.data.message : error.message));
            });
    };

    return (
        <div className="actions-container">
            <h2>Handlingsmenu for {product.productName}</h2>

            <div className="action-buttons">
                <button className="action-btn print-btn" onClick={handlePrint}>
                    Print prisskilt
                </button>

                <button
                    className="action-btn edit-btn"
                    onClick={() => navigate(`/edit-product/${product.barcode}`)}
                >
                    Rediger produkt
                </button>

                <button
                    className="action-btn details-btn"
                    onClick={() => navigate(`/product-details/${product.barcode}`)}
                >
                    Vis detaljer
                </button>

                <button className="action-btn back-btn" onClick={onBack}>
                    Tilbage til scanner
                </button>
            </div>
        </div>
    );
};

export default ProductActions;

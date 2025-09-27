import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

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
                command: 'print',
                company: product.brandName,
                productName: `${product.productName} ${product.productWeight}`,
                price: priceForPrint,
            },
        })
            .then(response => {
                alert('Data sendt til server for print!');
            })
            .catch(error => {
                console.log(error);
                alert('Der opstod en fejl ved afsendelse: ' + (error.response ? error.response.data.message : error.message));
            });
    };

    return (
        <div className="scanner-container">
            <h1>🛠️ Produkt Handlinger</h1>
            <div className="scan-box">
                {product && (
                    <div className="product-info">
                        <h2>{product.productName}</h2>
                        <p><strong>Brand:</strong> {product.brandName}</p>
                        <p><strong>Vægt:</strong> {product.productWeight}</p>
                        <p><strong>Pris:</strong> {formatPrice(product.retailPrice)}</p>
                        {product.imageUrl && <img src={product.imageUrl} alt={product.productName} />}
                    </div>
                )}
            </div>
            <nav className="quick-menu">
                <button className="btn" onClick={handlePrint}>🖨️ Print prisskilt</button>
                <button className="btn" onClick={() => navigate(`/edit-product/${product.barcode}`)}>✏️ Rediger produkt</button>
                <button className="btn" onClick={() => navigate(`/product-details/${product.barcode}`)}>🔍 Vis detaljer</button>
                <button className="btn" onClick={()=>navigate('/drift-scanner')}>⬅️ Tilbage til scanner</button>
            </nav>
        </div>
    );
};

export default ProductActions;

import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import productService from '../services/productService';
import '../App.css';

const ProductDetails = () => {
    const { barcode } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');

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
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-details">
            <h2>{product.productName}</h2>
            <p><strong>Brand:</strong> {product.brandName}</p>
            <p><strong>Vægt:</strong> {product.productWeight}</p>
            <p><strong>Pris:</strong> {product.retailPrice} DKK</p>
            {product.imageUrl && <img src={product.imageUrl} alt={product.productName} />}
        </div>
    );
};

export default ProductDetails;
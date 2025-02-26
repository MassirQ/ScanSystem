import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../services/productService';
import '../App.css';

const ProductForm = () => {
    const { barcode } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        barcode: '',
        productName: '',
        productBrand: '',
        productWeight: '',
        retailPrice: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Hent produktdata, hvis der er en barcode (redigering)
    useEffect(() => {
        if (barcode) {
            const loadProduct = async () => {
                try {
                    const product = await productService.searchProduct(barcode);
                    if (product) {
                        setFormData({
                            barcode: product.barcode,
                            productName: product.productName,
                            productBrand: product.brandName,
                            productWeight: product.productWeight,
                            retailPrice: product.retailPrice,
                            quantity: product.quantity
                        });
                    } else {
                        setError('Produkt ikke fundet!');
                    }
                } catch (err) {
                    console.error('Fejl ved hentning af produktdata', err);
                    setError('Der opstod en fejl ved hentning af produktet.');
                }
            };
            loadProduct();
        }
    }, [barcode]);

    // Håndter formularindsendelse
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (barcode) {
                // Opdater produkt
                await productService.updateProduct(barcode, formData);
                setSuccessMessage('Produkt opdateret succesfuldt!');
            } else {
                // Opret nyt produkt
                await productService.createProduct(formData);
                setSuccessMessage('Produkt tilføjet succesfuldt!');
            }
            setShowModal(true);
            setError('');
        } catch (err) {
            console.error('Fejl ved gemning:', err);
            if (err.response) {
                setError(`Fejl ved gemning: ${err.response.status} - ${err.response.data}`);
            } else if (err.request) {
                setError('Ingen respons fra serveren. Kontroller din serverforbindelse.');
            } else {
                setError(`Anmodningsfejl: ${err.message}`);
            }
        }
    };

    // Luk modal og naviger til startsiden
    const handleModalClose = () => {
        setShowModal(false);
        navigate('/'); // Gå tilbage til startsiden
    };

    return (
        <div className="product-form">
            <h2>{barcode ? 'Rediger Produkt' : 'Nyt Produkt'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Stregkode:</label>
                    <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                        required
                        disabled={!!barcode}
                    />
                </div>

                <div className="form-group">
                    <label>Produktnavn:</label>
                    <input
                        type="text"
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Produktbrand:</label>
                    <input
                        type="text"
                        value={formData.productBrand}
                        onChange={(e) => setFormData({ ...formData, productBrand: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Produktvægt:</label>
                    <input
                        type="text"
                        value={formData.productWeight}
                        onChange={(e) => setFormData({ ...formData, productWeight: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Pris:</label>
                    <input
                        type="text"
                        value={formData.retailPrice}
                        onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Antal</label>
                    <input
                        type="text"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                    <button type="submit" className="save-btn">
                        {barcode ? 'Gem ændringer' : 'Opret produkt'}
                    </button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate(-1)}
                    >
                        Annuller
                    </button>
                </div>
            </form>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Succes!</h2>
                        <p>{successMessage}</p>
                        <button onClick={handleModalClose}>Luk</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductForm;
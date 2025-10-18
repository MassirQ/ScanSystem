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
        retailPrice: '',
        quantity: 0,
        warehouseQuantity: 0,
        purchasePrice: 0,
        invoiceNumber: '',
        productCategory: '',
        productPackaging: 'PACKAGED',
        productWeightUnit: '',
        purchasePriceUnit: 'PCS',
        expiryDate: '',
        origin: '',
        retailPriceUnit: 'PCS',

    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const categoryOptions = {
        DAIRY: "Mejeriprodukter",
        BEVERAGES: "Drikkevarer",
        BREAD_BISCUITS_CAKES: "Brød, kiks og kager",
        CHARCOAL: "Trækul",
        CHOCOLATE: "Chokolade",
        COLONIAL: "Kolonialvarer",
        DRESSINGS_SAUCES: "Dressinger & saucer",
        FRESH_SWEETS: "Friske søde varer",
        FROZEN_FISH: "Frossen fisk",
        FROZEN_GOODS: "Frostvarer",
        FROZEN_VEGETABLES: "Frosne grøntsager",
        FRUIT: "Frugt",
        HERBS: "Krydderurter",
        HONEY: "Honning",
        HOOKAH_AND_ACCESSORIES: "Vandpibe & tilbehør",
        HOUSEHOLD_ITEMS: "Husholdningsartikler",
        ICE_CREAM: "Is",
        JAM: "Marmelade",
        NUTS: "Nødder",
        PASTE: "Pasta & puré",
        PERSONALHYGIENE: "Personlig hygiejne",
        PICKLES: "Syltede varer",
        READY_TO_EAT: "Færdigretter",
        REFRIGERATED_GOODS: "Kølevarer",
        SEEDS_AND_KERNELS: "Frø & kerner",
        SHOPPING_BAG: "Indkøbsposer",
        SPICES: "Krydderier",
        SWEETS_SNACKS: "Slik & snacks",
        TOBACCO: "Tobak",
        VEGETABLES: "Grøntsager",
    };

    const packagingOptions = {
        PACKAGED: "Emballeret",
        UNPACKAGED: "Uden emballage",
    };

    const weightUnitOptions = {
        KG: "Kilogram (kg)",
        L: "Liter (l)",
    };

    const priceUnitOptions = {
        KG: "Kilogram (kg)",
        PCS: "Stk.",
    };

    const countryList = [
        "Afghanistan","Albanien","Algeriet","Andorra","Angola","Argentina","Armenien","Australien","Azerbaijan",
        "Bahamas","Bahrain","Bangladesh","Barbados","Belgien","Belize","Benin","Bhutan","Bolivia","Bosnien-Hercegovina",
        "Botswana","Brasilien","Brunei","Bulgarien","Burkina Faso","Burundi","Cambodja","Cameroon","Canada","Chile","Kina",
        "Colombia","Costa Rica","Cuba","Cypern","Danmark","Den Dominikanske Republik","Ecuador","Egypten","Elfenbenskysten",
        "Estland","Etiopien","Fiji","Finland","Frankrig","Gabon","Gambia","Georgien","Ghana","Grækenland","Grenada","Guatemala",
        "Guyana","Haiti","Honduras","Hong Kong","Indien","Indonesien","Irak","Iran","Irland","Island","Israel","Italien","Jamaica",
        "Japan","Jordan","Kasakhstan","Kenya","Kina","Kirgisistan","Kroatien","Kuwait","Laos","Letland","Libanon","Liberia",
        "Libyen","Liechtenstein","Litauen","Luxembourg","Madagaskar","Malaysia","Maldiverne","Mali","Malta","Marokko","Mexico",
        "Moldova","Monaco","Mongoliet","Montenegro","Mozambique","Namibia","Nepal","Nicaragua","Niger","Nigeria","Nordmakedonien",
        "Norge","New Zealand","Oman","Pakistan","Palæstina","Panama","Paraguay","Peru","Philippinerne","Polen","Portugal",
        "Qatar","Rumænien","Rusland","Rwanda","San Marino","Saudi-Arabien","Schweiz","Senegal","Serbien","Singapore","Slovakiet",
        "Slovenien","Somalia","Spanien","Sri Lanka","Storbritannien","Sudan","Sverige","Sydafrika","Sydkorea","Syrien","Tadsjikistan",
        "Taiwan","Tanzania","Thailand","Togo","Trinidad og Tobago","Tunesien","Tyrkiet","Tyskland","Uganda","Ukraine","Ungarn",
        "Uruguay","USA","Usbekistan","Vanuatu","Vatikanstaten","Venezuela","Vietnam","Zambia","Zimbabwe"
    ];

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
                            quantity: product.quantity,
                            warehouseQuantity: product.warehouseQuantity,
                            purchasePrice: product.purchasePrice,
                            invoiceNumber: product.invoiceNumber,
                            productCategory: product.productCategory,
                            productWeightUnit: product.productWeightUnit,
                            purchasePriceUnit: product.purchasePriceUnit,
                            expiryDate: product.expiryDate,
                            origin : product.origin ,
                            retailPriceUnit: product.retailPriceUnit,

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
                        onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                        required
                        disabled={!!barcode}
                    />
                </div>
                <div className="form-group">
                    <label>Produktbrand:</label>
                    <input
                        type="text"
                        value={formData.productBrand}
                        onChange={(e) => setFormData({...formData, productBrand: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Produktnavn:</label>
                    <input
                        type="text"
                        value={formData.productName}
                        onChange={(e) => setFormData({...formData, productName: e.target.value})}
                        required
                    />
                </div>


                <div className="form-group">
                    <label>Produktvægt:</label>
                    <input
                        type="text"
                        value={formData.productWeight}
                        onChange={(e) => setFormData({...formData, productWeight: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Pris:</label>
                    <input
                        type="text"
                        value={formData.retailPrice}
                        onChange={(e) => setFormData({...formData, retailPrice: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Antal</label>
                    <input
                        type="text"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Antal på Lager</label>
                    <input
                        type="text"
                        value={formData.warehouseQuantity}
                        onChange={(e) => setFormData({...formData, warehouseQuantity: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Indkøbspris</label>
                    <input
                        type="text"
                        value={formData.purchasePrice}
                        onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}

                    />
                </div>

                <div className="form-group">
                    <label>Faktura Nummer</label>
                    <input
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}

                    />
                </div>


                <div className="form-group">
                    <label>Kategori </label>
                    <select
                        name="productCategory"
                        value={formData.productCategory || ""}
                        onChange={(e) => setFormData({...formData, productCategory: e.target.value})}
                    >
                        <option value="">Vælg kategori</option>
                        {Object.entries(categoryOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Emballage:</label>
                    <select
                        name="productPackaging"
                        value={formData.productPackaging || ""}
                        onChange={(e) => setFormData({...formData, productPackaging: e.target.value})}
                    >
                        <option value="">Vælg emballage</option>
                        {Object.entries(packagingOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Vægtenhed:</label>
                    <select
                        name="productWeightUnit"
                        value={formData.productWeightUnit || ""}
                        onChange={(e) => setFormData({...formData, productWeightUnit: e.target.value})}
                    >
                        <option value="">Vælg enhed</option>
                        {Object.entries(weightUnitOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Indkøbspris enhed:</label>
                    <select
                        name="purchasePriceUnit"
                        value={formData.purchasePriceUnit || ""}
                        onChange={(e) => setFormData({...formData, purchasePriceUnit: e.target.value})}
                    >
                        <option value="">Vælg enhed</option>
                        {Object.entries(priceUnitOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Salgspris enhed:</label>
                    <select
                        name="retailPriceUnit"
                        value={formData.retailPriceUnit || ""}
                        onChange={(e) => setFormData({...formData, retailPriceUnit: e.target.value})}
                    >
                        <option value="">Vælg enhed</option>
                        {Object.entries(priceUnitOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Oprindelsesland:</label>
                    <input
                        type="text"
                        list="countryList"
                        name="origin"
                        value={formData.origin || ""}
                        onChange={(e) => setFormData({...formData, origin: e.target.value})}
                        placeholder="Søg land..."
                    />
                    <datalist id="countryList">
                        {countryList.map((country) => (
                            <option key={country} value={country}/>
                        ))}
                    </datalist>
                </div>

                <div className="form-group">
                    <label>Udløbsdato:</label>
                    <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        placeholder={"dd-mm-yyyy"}

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

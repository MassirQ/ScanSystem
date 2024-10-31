const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'https://massirq.github.io/Scan',
}));

app.use(express.json());

const db = mysql.createConnection({
  host: 'mysql50.unoeuro.com',
  user: 'qb_aal_dk',
  password: '2DHUsuiqpce6yrJ',
  database: 'qb_aal_dk_db_data'
});

db.connect(err => {
  if (err) {
    console.error('Fejl ved forbindelse til MySQL:', err);
    return;
  }
  console.log('Forbundet til MySQL!');
});

app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Fejl ved hentning af produkter' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/product/:barcode', (req, res) => {
  const barcode = req.params.barcode;

  if (!barcode) {
    return res.status(400).json({ error: 'Barcode er påkrævet' });
  }

  const query = 'SELECT * FROM products WHERE barcode = ?';
  db.query(query, [barcode], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Fejl ved hentning af produkt' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Produkt ikke fundet' });
    } else {
      res.json(results); 
    }
  });
});

app.post('/api/products', (req, res) => {
  console.log('Modtaget req.body:', req.body);  

  const { barcode, productBrand, productName, productWeight, retailPrice } = req.body;

  if (!barcode || !productBrand || !productName || !productWeight || !retailPrice) {
    return res.status(400).send('Alle felter skal udfyldes');
  }

  const getIdQuery = 'SELECT MAX(id) AS maxId FROM products';
  
  db.query(getIdQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Fejl ved hentning af maks id' });
    }

    const nextId = result[0].maxId ? result[0].maxId + 1 : 2251; 

    const imageUrl = `https://qbaalborg.s3.eu-north-1.amazonaws.com/${barcode}.jpg`; 

    const query = 'INSERT INTO products (id, barcode, retailPrice, brandName, productName, productWeight, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [nextId, barcode, retailPrice, productBrand, productName, productWeight, imageUrl], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Fejl ved indsættelse af produkt' });
      } else {
        return res.status(201).json({ message: 'Produkt tilføjet succesfuldt', productId: result.insertId });
      }
    });
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server kører på port ${PORT}`);
});

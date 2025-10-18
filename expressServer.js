const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

(async () => {
  const app = express();
  app.use(cors({
    origin: '*',
  }));

  app.use(express.json());
let db;
  try {
  db = await mysql.createPool({
    host: process.env.DB_HOST || "scan_db",
    user: "root",
    password: "root",
    database: "qb_aal_dk_db_data",
  });
    console.log("Forbundet til MySQL!");

  } catch (err) {
    console.error("Kunne ikke forbinde til databasen:", err.message);
  }

  setInterval(async () => {
  try {
    const res = await db.query('SELECT 1');
    console.log("interval : ", res)
  } catch (err) {
    console.error('MySQL keep-alive error:', err);
  }
}, 1000 * 60 * 15);

  app.get("/api/products", async (req, res) => {
    try {
      const query = "SELECT * FROM products";
      const [rows] = await db.query(query);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: "Fejl ved hentning af produkter" });
    }
  });

  app.get("/api/product/:barcode", async (req, res) => {
    try {
      const barcode = req.params.barcode;
      const query = "SELECT * FROM products WHERE barcode = ?";
      const [results] = await db.query(query, [barcode]);


      if (results.length === 0) {
        res.status(404).json({ error: "Produktet er ikke registreret" });
      } else {
        res.json(results[0]);
      }
    } catch (error) {
      res.status(500).json({ error: "Fejl ved hentning af produkt" });
    }
  });

  app.post("/api/RegisterProducts", async (req, res) => {
    try {
      const {
        barcode,
          productBrand,
        productName,
        productWeight,
        retailPrice,
        quantity,
        warehouseQuantity,
        purchasePrice,
        invoiceNumber ,
        productCategory,
        productPackaging,
        productWeightUnit,
        purchasePriceUnit,
        expiryDate ,
        origin ,
        retailPriceUnit
      } = req.body;
      if (!barcode || !productBrand || !productName || !productWeight || !retailPrice) {
        return res.status(400).json({ error: "Alle felter skal udfyldes" });
      }

      const [existing] = await db.query("SELECT * FROM products WHERE barcode = ?", [barcode]);
      if (existing.length > 0) {
        return res.status(409).json({ error: "Produktet eksisterer allerede" });
      }

      // Generer nyt ID
      const [idResult] = await db.query("SELECT MAX(id) AS maxId FROM products");
      const nextId = idResult[0].maxId ? idResult[0].maxId + 1 : 2251;

      const imageUrl = `https://qbaalborg.s3.eu-north-1.amazonaws.com/${barcode}.jpg`;

      await db.query(
          `INSERT INTO products (
         id,
         barcode,
         retailPrice,
         brandName,
         productName,
         productWeight,
         imageUrl,
         quantity,
         warehouseQuantity,
         purchasePrice,
         invoiceNumber,
         productCategory,
         productPackaging,
         productWeightUnit,
         purchasePriceUnit,
         expiryDate,
         origin,
         retailPriceUnit
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            nextId,
            barcode,
            retailPrice,
              productBrand,
            productName,
            productWeight,
            imageUrl,
            quantity,
            warehouseQuantity,
            purchasePrice,
            invoiceNumber,
            productCategory,
            productPackaging,
            productWeightUnit,
            purchasePriceUnit,
            expiryDate,
            origin,
            retailPriceUnit
          ]
      );

      res.status(201).json({
        message: "Produkt tilføjet succesfuldt",
        barcode: barcode
      });
    } catch (error) {
      console.error("Fejl:", error);
      res.status(500).json({ error: "Serverfejl ved oprettelse" });
    }
  });

  app.put("/api/products/:barcode", async (req, res) => {
    try {
      const barcode = req.params.barcode;
      const {
        productBrand,
        productName,
        productWeight,
        retailPrice,
        quantity,
        warehouseQuantity,
        purchasePrice,
        invoiceNumber ,
        productCategory,
        productPackaging,
        productWeightUnit,
        purchasePriceUnit,
        expiryDate ,
        origin ,
        retailPriceUnit
      } = req.body;

      const [existing] = await db.query("SELECT * FROM products WHERE barcode = ?", [barcode]);
      if (existing.length === 0) {
        return res.status(404).json({ error: "Produktet findes ikke" });
      }

      await db.query(
          `UPDATE products SET
                             brandName = ?,
                             productName = ?,
                             productWeight = ?,
                             retailPrice = ?,
                             quantity = ?,
                             warehouseQuantity = ?,
                             purchasePrice = ?,
                             invoiceNumber = ?,
                             productCategory = ?,
                             productPackaging = ?,
                             productWeightUnit = ?,
                             purchasePriceUnit = ?,
                             expiryDate = ?,
                             origin = ?,
                             retailPriceUnit = ?
           WHERE barcode = ?`,
          [
            productBrand,
            productName,
            productWeight,
            retailPrice,
            quantity,
            warehouseQuantity,
            purchasePrice,
            invoiceNumber,
            productCategory,
            productPackaging,
            productWeightUnit,
            purchasePriceUnit,
            expiryDate,
            origin,
            retailPriceUnit,
            barcode
          ]
      );
      res.json({ message: "Produkt opdateret succesfuldt" });
    } catch (error) {
      console.error("Fejl:", error);
      res.status(500).json({ error: "Serverfejl ved opdatering" });
    }
  });


  app.delete("/api/product/:barcode", async (req, res) => {
    try {
      const barcode = req.params.barcode;
      const [result] = await db.query("DELETE FROM products WHERE barcode = ?", [barcode]);


      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Produktet findes ikke" });
      }

      res.json({ message: "Produkt slettet succesfuldt" });
    } catch (error) {
      console.error("Fejl:", error);
      res.status(500).json({ error: "Serverfejl ved sletning" });
    }
  });




  app.put("/api/products/update-quantity-warehouse/:barcode", async (req, res) => {
    const { warehouseQuantity } = req.body;
    const { barcode } = req.params;

    if (warehouseQuantity == null) {
      return res.status(400).json({ message: "Indsæt antallet af varer du har på lager" });
    }

    try {
      await db.query(
          `UPDATE products
           SET warehouseQuantity = ?
           WHERE barcode = ?`,
          [warehouseQuantity, barcode]
      );

      res.json({ message: "Produkt opdateret!" });
    } catch (err) {
      console.error("Fejl ved opdatering af produkt:", err);
      res.status(500).json({ message: "Serverfejl ved opdatering" });
    }
  });


  app.put("/api/products/update-quantity/:barcode", async (req, res) => {
    const { quantity } = req.body;
    const { barcode } = req.params;

    if (quantity == null) {
      return res.status(400).json({ message: "Indsæt antallet af den vare du har" });
    }
    try {
      await db.query(
          `UPDATE products
          SET quantity = ?
          WHERE barcode = ?`,
          [quantity, barcode]
      );
      res.json({ message: "Produkt opdateret!" });
    }
    catch (e) {
      console.error("Fejl ved opdatering af produkt:", e);
      res.status(500).json({ message: "Serverfejl ved opdatering" });
    }

  })

  app.use((err, req, res) => {
    console.error("Global fejl:", err);
    res.status(500).json({ error: "Der opstod en serverfejl. Tjek loggen." });
  });


  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server kører på port ${PORT}`);
  });
})();

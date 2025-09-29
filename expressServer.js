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
  db = await mysql.createConnection({
    host: process.env.DB_HOST || "scan_db",
    user: "root",
    password: "root",
    database: "qb_aal_dk_db_data",
  });
    console.log("Forbundet til MySQL!");

  } catch (err) {
    console.error("Kunne ikke forbinde til databasen:", err.message);
  }

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
      const { barcode, productBrand, productName, productWeight, retailPrice } = req.body;

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
          "INSERT INTO products (id, barcode, retailPrice, brandName, productName, productWeight, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [nextId, barcode, retailPrice, productBrand, productName, productWeight, imageUrl]
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
      const { productBrand, productName, productWeight, retailPrice, quantity } = req.body;

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
                             quantity = ?
           WHERE barcode = ?`,
          [productBrand, productName, productWeight, retailPrice, quantity, barcode]
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

  app.use((err, req, res) => {
    console.error("Global fejl:", err);
    res.status(500).json({ error: "Der opstod en serverfejl. Tjek loggen." });
  });


  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server kører på port ${PORT}`);
  });
})();

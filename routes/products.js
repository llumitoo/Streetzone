import express from "express";
import { upload } from "../config/cloudinary.js";
import Product from "../models/Product.js";
import { verifyToken } from "../middleware/auth.js"; // si ya tienes JWT

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Crear producto con imagen
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price,
      description: req.body.description,
      image: req.file.path // URL generada por Cloudinary
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar producto" });
  }
});

export default router;

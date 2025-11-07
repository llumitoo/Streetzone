import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js"; // ajusta la ruta según tu estructura
import { verifyToken } from "../middleware/auth.js"; // si tienes autenticación

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Crear producto
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, brand, price, description } = req.body;

    // Verifica que Multer sí recibió los datos
    console.log("🧾 Datos recibidos:", req.body);
    console.log("📷 Archivo:", req.file);

    const newProduct = new Product({
      name,
      brand,
      price,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(400).json({ message: error.message });
  }
});

export default router;

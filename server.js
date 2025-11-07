import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error(err));

// Modelo del producto
import Product from "./models/Product.js";

// Ruta para obtener productos
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Ruta para crear productos (solo para pruebas)
app.post("/api/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Puerto
app.listen(3000, () => console.log("🚀 Servidor en http://localhost:3000"));

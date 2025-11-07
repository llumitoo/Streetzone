import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const SALT_ROUNDS = 10;

// Registrar admin (usa esto sólo para crear el primer usuario)
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Faltan datos" });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Usuario ya existe" });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ username, passwordHash, role: "admin" });
    await user.save();
    res.json({ message: "Usuario creado", user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Usuario o contraseña incorrectos" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Usuario o contraseña incorrectos" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

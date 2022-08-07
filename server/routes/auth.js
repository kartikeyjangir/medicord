import express from "express";
import { login, signup } from "../controllers/auth.js";

const router = express.Router();

router.get("/", (req, res) => res.send("hello from"));
router.post("/signup", signup);
router.post("/login", login);

export default router;

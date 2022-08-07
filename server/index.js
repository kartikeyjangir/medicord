import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/auth.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT || 5003;
app.use("/auth", AuthRoutes);

app.get("/", (req, res) => res.send("hello from backend"));

app.listen(PORT, () => console.log(`server is running at port ${PORT}`));

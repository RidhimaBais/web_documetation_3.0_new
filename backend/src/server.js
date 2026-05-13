import express from "express";
import cors from "cors";

import registerRoute from "./routes/register.js";
import verifyRoute from "./routes/verify.js";

import dashboardRoute from "./routes/dashboard.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/register", registerRoute);
app.use("/verify", verifyRoute);

app.use("/dashboard", dashboardRoute);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import "reflect-metadata";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { sequelize } from "./config/database";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

sequelize.sync({ alter: true }).then(() => {
  console.log("DB Connected");
});

app.listen(3000, () => console.log("Server running"));
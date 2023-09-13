import express from "express";
import dotenv from "dotenv";
dotenv.config();
console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
import db from "./config/Database.js";
import router from "./routes/index.js";
// import Users from "./models/UserModel.js";
const app = express();

try {
  await db.authenticate();
  console.log("Database Connected...");
  // await Users.sync();
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(router);

app.listen(5000, () => console.log("Server running at port 5000"));

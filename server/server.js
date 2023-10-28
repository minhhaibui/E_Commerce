import express from "express";
import "dotenv/config";
import { dbConnect } from "./config/dbConfig.js";
import { initRouter } from "./routes/index.js";

import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
dbConnect();
const port = process.env.PORT || 8888;
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
initRouter(app);
app.listen(port, () => {
  console.log("server running on the port :" + port);
});

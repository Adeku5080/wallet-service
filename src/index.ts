import express, { Express, Request, Response, Application } from "express";
import * as dotenv from "dotenv";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());

//connect to db

//routes

app.listen(port, () => {
  console.log(`Server starting at port ${port}`);
});

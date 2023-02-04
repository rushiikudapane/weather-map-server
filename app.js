const express = require("express");
const router = require("./routes/api");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
app.use("/api", router); //api route is made is routes folder
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server working on port");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server started!!!");
});

const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const Url = require("./models/Url");

const app = express();
app.use(express.json());

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/urlShortener")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const BASE_URL = "http://localhost:5000";

// create short url
app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  const shortCode = shortid.generate();
  const shortUrl = `${BASE_URL}/${shortCode}`;

  const newUrl = new Url({
    originalUrl,
    shortCode,
    shortUrl
  });

  await newUrl.save();
  res.json(newUrl);
});

// redirect
app.get("/:code", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });

  if (url) {
    return res.redirect(url.originalUrl);
  } else {
    return res.send("Not found");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
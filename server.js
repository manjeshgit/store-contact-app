var express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
var app = express();
const cors = require("cors");
app.use(cors());
// app.use(express.json());
app.use(bodyParser.text({ type: "application/xml" }));
app.use("/", require("./routes/routes"));
app.use((req, res, next) => {
  return res.status(404).send("URL Not Found");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

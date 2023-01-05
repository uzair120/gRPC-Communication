const express = require("express");
const bodyParser = require("body-parser");

const simpleSQS = require("./modules/simpleSQS/simpleSQS.controller");

const app = express();

app.use(bodyParser.json());
app.use("/simple-sqs", simpleSQS);

app.listen(3000, () => console.log("app is listening at port 3000"));

const express = require("express");
const bodyParser = require("body-parser");

const simpleSQS = require("./modules/simpleSQS/simpleSQS.controller");

const app = express();

app.use(bodyParser.json());
app.use("/simple-sqs", simpleSQS);

app.listen(3001, () => console.log("Receiver app is listening at port 3001"));

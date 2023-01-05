const AWS = require("aws-sdk");
const router = require("express").Router();
const utils = require("../../common/Utils");
// Set the region
AWS.config.update({ region: "us-east-1" });
// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

router.get("/receiveMessages/:name", async (req, res) => {
  var params = {
    QueueName: req.params.name,
  };
  var queueURL = "";
  try {
    const data = await sqs.getQueueUrl(params).promise();
    console.log("Success", data.QueueUrl);
    queueURL = data.QueueUrl;
  } catch (err) {
    console.log("Error", err);
    res.status(400).send(utils.createErrorObj(400, err));
  }

  var params = {
    AttributeNames: ["SentTimestamp"],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ["All"],
    QueueUrl: queueURL,
    VisibilityTimeout: 10,
    WaitTimeSeconds: 5,
  };

  sqs.receiveMessage(params, function (err, data) {
    if (err) {
      console.log("Receive Error", err);
      res.status(400).send(utils.createErrorObj(400, err));
    } else if (data.Messages) {
      var deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle,
      };
      console.log("Data received", data.Messages);
      if (req.body.isDelete) {
        sqs.deleteMessage(deleteParams, function (err, Ddata) {
          if (err) {
            console.log("Delete Error", err);
            res.status(400).send(utils.createErrorObj(400, err));
          } else {
            console.log("Message Deleted", Ddata);
            res.send(
              utils.createSuccessObj(200, {
                name: req.params.name,
                message: data.Messages[0] || data,
                deleted: req.body.isDelete,
              })
            );
          }
        });
      } else {
        var visibilityParams = {
          QueueUrl: queueURL,
          ReceiptHandle: data.Messages[0].ReceiptHandle,
          VisibilityTimeout: 50, // 50 second timeout
        };
        sqs.changeMessageVisibility(visibilityParams, function (err, data) {
          if (err) {
            console.log("Delete Error", err);
          } else {
            console.log("Timeout Changed", data);
          }
        });
        res.send(
          utils.createSuccessObj(200, {
            name: req.params.name,
            message: data.Messages[0] || data,
            deleted: req.body.isDelete,
          })
        );
      }
    }
  });

  // setTimeout(() => {
  //   console.log("TimeOut - not received ");
  //   res.send(utils.createErrorObj(404, "TimeOut - not received"));
  // }, 9000);
});

module.exports = router;

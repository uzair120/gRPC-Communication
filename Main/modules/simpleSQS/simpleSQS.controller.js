const AWS = require("aws-sdk");
const router = require("express").Router();
const utils = require("../../common/Utils");
// Set the region
AWS.config.update({ region: "us-east-1" });
// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

router.get("/available-queues", (req, res) => {
  const params = {};
  sqs.listQueues(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.status(400).send(utils.createErrorObj(400, err));
    } else {
      console.log("Success", data.QueueUrls);
      res.send(utils.createSuccessObj(200, { queues: data.QueueUrls }));
    }
  });
});

router.get("/getURLByName/:name", (req, res) => {
  const params = {
    QueueName: req.params.name,
  };
  sqs.getQueueUrl(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.status(400).send(utils.createErrorObj(400, err));
    } else {
      console.log("Success", data.QueueUrl);
      res.send(
        utils.createSuccessObj(200, {
          name: req.params.name,
          url: data.QueueUrl,
        })
      );
    }
  });
});

router.post("/create", (req, res) => {
  var params = {
    QueueName: req.body.name,
    Attributes: {
      DelaySeconds: req.body.delaySec || "60",
      MessageRetentionPeriod: req.body.MessageRetentionPeriod || "86400",
    },
  };

  sqs.createQueue(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.QueueUrl);
      res.send(
        utils.createSuccessObj(200, {
          name: params.QueueName,
          url: data.QueueUrl,
        })
      );
    }
  });
});

router.delete("/delete/:name", (req, res) => {
  var params = {
    QueueName: req.params.name,
  };
  sqs.getQueueUrl(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.status(400).send(utils.createErrorObj(400, err));
    } else {
      params = {
        QueueUrl: data.QueueUrl,
      };

      sqs.deleteQueue(params, function (err, data) {
        if (err) {
          console.log("Error", err);
          res.status(400).send(utils.createErrorObj(400, err));
        } else {
          console.log("Success", data);
          res.send(utils.createSuccessObj(200));
        }
      });
    }
  });
});

router.post("/sendMessage/:name", async (req, res) => {
  var params = {
    QueueName: req.params.name,
  };
  var url = "";
  try {
    const data = await sqs.getQueueUrl(params).promise();
    console.log("Success", data.QueueUrl);
    url = data.QueueUrl;
  } catch (err) {
    console.log("Error", err);
    res.status(400).send(utils.createErrorObj(400, err));
  }

  params = {
    // Remove DelaySeconds parameter and value for FIFO queues
    DelaySeconds: 1,
    MessageAttributes: {
      Title: {
        DataType: "String",
        StringValue: "The Whistler",
      },
      Author: {
        DataType: "String",
        StringValue: "John Grisham",
      },
      WeeksOn: {
        DataType: "Number",
        StringValue: "6",
      },
    },
    MessageBody: req.body.message,
    // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
    // MessageGroupId: "Group1",  // Required for FIFO queues
    QueueUrl: url,
  };

  sqs.sendMessage(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.status(400).send(utils.createErrorObj(400, err));
    } else {
      console.log("Success", data.MessageId);
      res.send(utils.createSuccessObj(200, { MessageId: data.MessageId }));
      //   res.send(utils.createSuccessObj(200, params));
    }
  });
});
module.exports = router;

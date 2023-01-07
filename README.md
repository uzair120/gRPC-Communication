# gRPC-Communication
AWS SQS communication with consumer and receiver

Purpose of this repository to understand SQS communication between two servers(node). Consumer send messages to queue and receiver get all messages whenever demand.

Two modules in that repository:
* Main (Consumer): 
I have create APIs to control SQS through our node js. there APIs are:
  * Available queues
  * Get queue URL By Name
  * Create a queue
  * Send message to queue
 <br />
* Receiver:
  * Receive Message from a queue
<br />

You can find postman docs of these APIs [here](https://github.com/uzair120/gRPC-Communication/blob/master/Queues.postman_collection.json).
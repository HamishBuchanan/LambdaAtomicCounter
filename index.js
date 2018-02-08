'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();


/**
 * Lambda Atomic Counter
 *
 */
 exports.handler = function(event, context, callback) {

    var AWS = require("aws-sdk");
    var eventName;
    var monthKey;
    var dateKey;
    var tableName = process.env.TABLENAME;
    var requestPath = String(event.requestContext.path);
    var tablePrefix = "STAGE";
    var responseBody;
    var statusCode = 200;

    if (event.queryStringParameters && event.queryStringParameters.e && event.queryStringParameters.e !== "") {
      console.log(event.queryStringParameters.e);
      eventName = event.queryStringParameters.e.toUpperCase();
    } else {
      responseBody = {
        "statusCode": 400,
        "body": JSON.stringify({"status": "Failure","eventkey": "No event parameter specified."}),
        "isBase64Encoded": false
      };

      callback(null, responseBody);
      return;
    }

    var dateObj = new Date();
    dateKey = (dateObj.getUTCFullYear()*10000) + (dateObj.getUTCMonth() + 1) * 100 + dateObj.getDate();
    monthKey = (dateObj.getUTCFullYear()*100) + (dateObj.getUTCMonth() + 1);

    var dynamodb = new AWS.DynamoDB();

    if (requestPath.substring(0,"/Prod/".length) == "/Prod/") {
      tablePrefix = "PROD";
    }

    var countersTable = tablePrefix + tableName;

    var docClient = new AWS.DynamoDB.DocumentClient();

    var paramStr = "";
    var params;

    paramStr = "{\"TableName\":\"" + countersTable + "\"";
    paramStr = paramStr + ",\"Key\":{\"Month\":" + monthKey + ",\"DateCode\":" + dateKey + "}";
    paramStr = paramStr + ",\"UpdateExpression\": \"ADD " + eventName + " :val\"";
    paramStr = paramStr + ",\"ExpressionAttributeValues\":{\":val\":1}"
    paramStr = paramStr + ",\"ReturnValues\":\"UPDATED_NEW\"";
    paramStr = paramStr + "}";

    console.log(paramStr);

    params = JSON.parse(paramStr);

    responseBody = {
      "status": "Success",
      "eventkey": eventName
    };

    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            statusCode = 400;
            responseBody = {
              "status": "Failure",
              "eventkey": "Unable to add item." + JSON.stringify(err, null, 2)
            };
        }
    });

    var response = {
       "statusCode": statusCode,
       "body": JSON.stringify(responseBody),
       "isBase64Encoded": false
    };

    callback(null, response);
 }

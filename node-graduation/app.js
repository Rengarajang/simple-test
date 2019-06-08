var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AWS = require("aws-sdk");
var app = express();
app.listen(3000, () => console.log('Graduate API listening on port 3000!'))
AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://host.docker.internal:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'jade');
app.get('/', function (req, res) {
  res.send({ title: "Graduate API Entry Point" })
})
app.get('/graduation-date', function (req, res) {
var params = {
    TableName: "Graduate",
    ProjectionExpression: "#name, #gdate",
    ExpressionAttributeNames: {
        "#name": "name",
        "#gdate": "gdate",
    }
};
console.log("Scanning Graduate table.");
docClient.scan(params, onScan);
function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        res.send(data)
        // print all the Graduation 
        console.log("Scan succeeded.");
        data.Items.forEach(function(graduate) {
           console.log(graduate.name, graduate.gdate)
        });
if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
  }
})
app.get('/graduation-date/:name', function (req, res) {
var gradNAME = (req.url.slice(9));
  console.log(req.url)
  console.log(gradNAME)
var params = {
      TableName : "Graduate",
      KeyConditionExpression: "#name = :name",
      ExpressionAttributeNames:{
          "#name": "name"
      },
      ExpressionAttributeValues: {
          ":name": gradNAME
      }
  };
docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        res.send(data.Items)
        data.Items.forEach(function(grad) {
            console.log(grad.id, grad.name, grad.type);
        });
    }
})
});

var AWS = require("aws-sdk");
var fs = require('fs');
AWS.config.update({
    region: "eu-west-2",
    endpoint: "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();
console.log("Importing graduation into DynamoDB. Please wait.");
var graduate = JSON.parse(fs.readFileSync('gradData.json', 'utf8'));
graduate.forEach(function(graduate) {
  console.log(graduate)
var params = {
        TableName: "Graduate",
        Item: {
            "name": graduate.name,
            "gdate": graduate.dgate
        }
    };
docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add Graduation", graduate.name, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", graduate.name);
       }
    });
});

var AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();
var params = {
    TableName : "Graduate",
    KeySchema: [
        { AttributeName: "name", KeyType: "HASH"},  //Partition key
],
    AttributeDefinitions: [
        { AttributeName: "name", AttributeType: "S" },
],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};
dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

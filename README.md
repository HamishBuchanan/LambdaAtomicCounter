# LambdaAtomicCounter
Serverless atomic counter

Shows how to create an Atomic Counter using Lambda

Steps to use:

1. Create two DynamoDB tables called PROD_<your table name> and STAGE_<your table name>
  e.g. PROD_atomicCounter and STAGE_atomicCounter
  Use a Primary Key called Month of type Number and a Sort Key called DateCode also of Type Number

2. Edit the file parameters.json to match your table name (without the PROD and STAGE prefixes).

3. Edit the file deployTemplate.sh and enter the name of an S3 bucket to store your CloudFormation deployTemplate

4. Run the file deployTemplate.sh to deploy the function

5. In the AWS console go to API Gateway and find the endpoints for PROD and STAGE

6. Test the function by triggering an event using the endpoint with the url parameter e=<name of the event>
e.g. https://xxxxxxxx.execute-api.eu-west-1.amazonaws.com/Prod/AtomicCounter?e=Test

7. Log into DynamoDB and check that the event has been registered

8. To add new events just specify a different parameter name

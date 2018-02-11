
aws cloudformation package \
    --template-file LambdaAtomicCounter.yaml \
    --output-template-file LambdaAtomicCounter-output.yaml \
    --s3-bucket <YOUR BUCKET NAME HERE>

aws --region <YOUR REGION> cloudformation deploy \
    --template-file LambdaAtomicCounter-output.yaml \
    --stack-name LambdaAtomicCounter \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides $(cat parameters.json)

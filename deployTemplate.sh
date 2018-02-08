rm -f build/*

aws cloudformation package \
    --template-file LambdaAtomicCounter.yaml \
    --output-template-file build/LambdaAtomicCounter-output.yaml \
    --s3-bucket <YOUR BUCKET NAME HERE>

cp parameters.json ./build/

cd build/

aws --region <YOUR REGION> cloudformation deploy \
    --template-file LambdaAtomicCounter-output.yaml \
    --stack-name LambdaAtomicCounter \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides $(cat parameters.json)

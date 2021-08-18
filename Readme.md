# AWS Batch Example #

All deployment is fully automated with serverless.js framework and includes all resources needed to run AWS Batch with cost optimisations on fresh account.

Example searches for collisions of md5 hashed value by brute-forcing through huge amount of alphabet coombination. 

For more information check [the hint](https://hinty.io/devforth/aws-batch-use-cloud-power-for-batch-processing-simple-example/)

## Prerequisites ##
1. Node + Npm
2. Docker
3. AWS CLI

## How to use ##
1. Run `./deploy.sh <aws-profile> <aws-region>` script. It will install npm modules, deploy serverless and docker image to create ECR repository. (If you dont have aws profile configured run `aws configure --profile <profile-name>`).
2. Run `node stress_test_control.js <aws-profile> <num-of-instances-to-use>`. (Ex. `node stress_test_control.js myaws 2`)

## Structure ##
- `./deploy.sh` - Provisions AWS account with needed resources. Also builds docker image which will be used for task and pushes them to ECR.
- `batch_image` - contains resources that are used for building Docker image that will be used by Batch task.
- `batch_image/md5_brute_force.py` - main alghorithm that is being ran by Batch jobs.
- `stress_test_control.js` - script that is used to post Batch jobs with given parameters, wait for Batch job to finish and retrieve the result.
- `serverless.yaml` - template that is used to deploy AWS resources.


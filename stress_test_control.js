const AWS = require('aws-sdk');
const md5 = require('md5');
const slsStackOutput = require('./sls-stack-output.json');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startBatchJob(jobsCount) {
    const batch = new AWS.Batch();

    const jobDefinition = slsStackOutput.JobDefinition;
    const jobQueue = slsStackOutput.BatchQueue;

    const submitResult = await batch.submitJob({
        jobDefinition,
        jobQueue,
        jobName: "dev_strees_puppeter_job",
        arrayProperties: {
            size: jobsCount,
        },
        containerOverrides: {
            environment: [
                {
                    name: "jobsCount",
                    value: jobsCount.toString()
                }
            ],
        },
    }).promise();

    return { jobId: submitResult.jobId };
}

async function waitForBatchJob(jobId) {
    const batch = new AWS.Batch();
    let status = '';

    while (!['SUCCEEDED', 'FAILED'].includes(status)) {
        const result = await batch.describeJobs({
            jobs: [jobId]
        }).promise();

        status = result.jobs[0].status;
        const statusSummary = result.jobs[0].arrayProperties ?
            Object.keys(result.jobs[0].arrayProperties.statusSummary).reduce((acc, key) => {
                if (result.jobs[0].arrayProperties.statusSummary[key] > 0) {
                    acc.push(`${key}: ${result.jobs[0].arrayProperties.statusSummary[key]}`);
                }
                return acc;
            }, [])
        : '';
        console.log('Current status', status, statusSummary);
        await sleep(1000);
    }

}

async function main() {
    const argv = process.argv.slice(2);

    if (argv.length !== 2 ) {
        console.log('Not enought arguments. You must supply at least 5 arguments in that order: aws profile, brute force min length, brute force max length, hex formated md5, number of instances to use, <alphabet>.');
        process.exitCode = 1;
    }

    const [profile, instanceCount] = argv;

    AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile });
    AWS.config.region = slsStackOutput.Region;

    const { jobId } = await startBatchJob(instanceCount);
    await waitForBatchJob(jobId);
}

main();
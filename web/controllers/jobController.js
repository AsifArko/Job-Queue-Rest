let Queue = require('bull');

const {logger} = require('../../utils/logger');

const config = require('../../config/default');
const REDIS_URI = config.redis.uri;

let workQueue = new Queue('job', REDIS_URI);

exports.jobs = async (ctx) => {
    try {
        let jobs = await workQueue.getCompleted();
        ctx.ok({
            data: jobs
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

exports.addJob = async (ctx) => {
    const {body} = ctx.request;
    try {
        let job = await workQueue.add(body);
        ctx.ok({
            data: job
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

exports.getJob = async (ctx) => {
    const {id} = ctx.request.params;
    try {
        let job = await workQueue.getJobFromId(id);
        ctx.ok({
            data: job
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

workQueue.on('global:completed', (jobId, result) => {
    logger.debug(`Job ${jobId} completed with result ${result}`);
});

workQueue.on('global:failed', async (jobId, result) => {
    logger.debug(`Job ${jobId} failed ${result}`);

    logger.debug(`Initiating Retry for Job ${jobId}`);
    let job = await workQueue.getJobFromId(jobId);
    await job.retry();
    logger.debug(`Initiated Retry for Job ${jobId}`);
});

let Queue = require('bull');

const {logger} = require('../../utils/logger');

const config = require('../../config/default');
const REDIS_URI = config.redis.uri;

let workQueue = new Queue('job', REDIS_URI);

exports.jobs = async (ctx) => {
    try {
        let jobs = await workQueue.getJobs("completed", 0, 10, true);
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

exports.statistics = async (ctx) => {
    try {
        let statistics = await workQueue.getJobCounts();
        ctx.ok({
            data: statistics
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

exports.getFailedList = async (ctx) => {
    try {
        let data = await workQueue.getJobs("failed", 0, 10, true);
        ctx.ok({
            data: data
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

exports.getDelayedList = async (ctx) => {
    try {
        let data = await workQueue.getJobs("delayed", 0, 10, true);
        ctx.ok({
            data: data
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

exports.getWaitingList = async (ctx) => {
    try {
        let data = await workQueue.getJobs("waiting", 0, 10, true);
        ctx.ok({
            data: data
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

workQueue.on('global:completed', (jobId, result) => {
    logger.debug(`Job ${jobId} completed with ${result}`);
});

workQueue.on('global:failed', async (jobId, result) => {
    logger.debug(`Job ${jobId} failed ${result}`);
    logger.debug(`Initiating Retry for Job ${jobId}`);
    let job = await workQueue.getJobFromId(jobId);
    setTimeout(async () => {
        await job.retry()
    }, 10000);
    logger.debug(`Initiated Retry for Job ${jobId}`);
});

workQueue.on('global:waiting', async (jobId, result) => {
    logger.debug(`Job ${jobId} is in waiting`);
});

workQueue.on('global:delayed', async (jobId, result) => {
    logger.debug(`Job ${jobId} is delayed`);
});

workQueue.on('global:active', async (jobId, result) => {
    logger.debug(`Job ${jobId} is in process`);
});

workQueue.on('global:stalled', async (jobId, result) => {
    logger.debug(`Job ${jobId} is stalled`);
});
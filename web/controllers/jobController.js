let Queue = require('bull');

const {paginationMeta} = require('../../utils/pagination');
const {logger} = require('../../utils/logger');
const config = require('../../config/default');
const REDIS_URI = config.redis.uri;

let workQueue = new Queue('job', REDIS_URI);

exports.jobs = async (ctx) => {
    let {skip, limit} = paginationMeta(ctx.query);
    try {
        let jobs = await workQueue.getJobs("completed", skip, limit, false);
        ctx.ok({
            data: jobs,
            meta: {
                skip: skip,
                limit: limit
            }
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
    let {skip, limit} = paginationMeta(ctx.query);
    try {
        let data = await workQueue.getJobs("failed", skip, limit, true);
        ctx.ok({
            data: data,
            meta: {
                skip: skip,
                limit: limit
            }
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

exports.getDelayedList = async (ctx) => {
    let {skip, limit} = paginationMeta(ctx.query);
    try {
        let data = await workQueue.getJobs("delayed", skip, limit, true);
        ctx.ok({
            data: data,
            meta: {
                skip: skip,
                limit: limit
            }
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

exports.getWaitingList = async (ctx) => {
    let {skip, limit} = paginationMeta(ctx.query);
    try {
        let data = await workQueue.getJobs("waiting", skip, limit, true);
        ctx.ok({
            data: data,
            meta: {
                skip: skip,
                limit: limit
            }
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

exports.getActiveList = async (ctx) => {
    let {skip, limit} = paginationMeta(ctx.query);
    try {
        let data = await workQueue.getJobs("active", skip, limit, true);
        ctx.ok({
            data: data,
            meta: {
                skip: skip,
                limit: limit
            }
        })
    } catch (e) {
        ctx.badRequest({
            error: JSON.stringify(e)
        })
    }
};

exports.retryJob = async (ctx) => {
    const {id} = ctx.request.params;
    try {
        let job = await workQueue.getJobFromId(id);
        await job.retry();
        ctx.ok({
            data: `Job ${id} is pushed in the queue`
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
    logger.debug(`Job ${jobId} is in process with result ${result}`);
});

workQueue.on('global:stalled', async (jobId, result) => {
    logger.debug(`Job ${jobId} is stalled`);
});
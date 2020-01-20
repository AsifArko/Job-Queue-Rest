let Queue = require('bull');
let REDIS_URI = 'redis://localhost:6379';

let workQueue = new Queue('work', REDIS_URI);

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
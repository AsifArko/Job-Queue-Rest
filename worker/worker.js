const throng = require('throng');
const Queue = require('bull');

const config = require('../config/default');
const {logger} = require('../utils/logger');

const REDIS_URI = config.redis.uri;
const Workers = config.worker;
const MaxJobPerWorker = config.maxJobPerWorker;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function start() {
    let workQueue = new Queue('job', REDIS_URI);

    let promise = workQueue.process(MaxJobPerWorker, async (job) => {
        let progress = 0;
        if (Math.random() < 0.50) {
            throw new Error(`Job : ${job.id} Failed`)
        }

        while (progress < 100) {
            await sleep(50);
            progress += 1;
            await job.progress(progress)
        }

        return {
            job: JSON.stringify(job)
        }
    });
}

throng({Workers, start});
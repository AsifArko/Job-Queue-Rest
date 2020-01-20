const throng = require('throng');
const Queue = require('bull');

const {logger} = require('../utils/logger');

let REDIS_URI = 'redis://127.0.0.1:6379';

let workers = 2;

let maxJobsPerWorker = 50;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function start() {
    logger.debug("Starting Worker Server");

    let workQueue = new Queue('work', REDIS_URI);

    let promise = workQueue.process(maxJobsPerWorker, async (job) => {
        logger.debug(`Job ${job.id} is in process`);
        let progress = 0;
        if (Math.random() < 0.35) {
            throw new Error(`Job : ${job.id} Failed`)
        }

        while (progress < 100) {
            await sleep(50);
            progress += 1;
            await job.progress(progress)
        }
        return {message: `Job ${job.id} will be stored`}
    });
    logger.debug("Worker Server started");
}

throng({workers, start});
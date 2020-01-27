const throng = require('throng');
const Queue = require('bull');

const config = require('../config/default');
const genericWorkerService = require('./service/service');

const REDIS_URI = config.redis.uri;
const Workers = config.worker;
const MaxJobPerWorker = config.maxJobPerWorker;

let workQueue = new Queue('job', REDIS_URI);

function start() {
    let promise;
    try {
        promise = workQueue.process("GENERIC", MaxJobPerWorker, async (job) => {
            return await genericWorkerService.processJob(job);
        });

        promise = workQueue.process("DELAYED", MaxJobPerWorker, async (job) => {
            return await genericWorkerService.processJob(job);
        });

        promise = workQueue.process("PRIORITIZED", MaxJobPerWorker, async (job) => {
            return await genericWorkerService.processJob(job);
        });
    } catch (e) {
        throw e
    }
};

throng({Workers, start});
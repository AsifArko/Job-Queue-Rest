let Queue = require('bull');

const config = require('../config/default');
const REDIS_URI = config.redis.uri;

let workQueue = new Queue('job', REDIS_URI);

async function seed() {
    let data = {
        name: "SEND_EMAIL",
        email: "xxx",
        message: Math.random().toString(36).substring(7),
    };
    console.log(`Pushing Job ${JSON.stringify(data)}`);
    await workQueue.add("GENERIC", data)
}

async function seedWithDelay() {
    let data = {
        name: "SEND_EMAIL",
        email: "xxx",
        message: Math.random().toString(36).substring(7),
    };
    console.log(`Pushing Job ${JSON.stringify(data)}`);
    await workQueue.add("DELAYED", data, {delay: 5000})
}

async function seedWithPriority() {
    let data = {
        name: "SEND_EMAIL",
        email: "xxx",
        message: "Priority test",
    };
    console.log(`Pushing Job ${JSON.stringify(data)}`);
    await workQueue.add("PRIORITIZED", data, {priority: 1})
}

setInterval(seed, 10);
setInterval(seedWithDelay, 10);
setInterval(seedWithPriority, 10);

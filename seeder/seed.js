let Queue = require('bull');

const config = require('../config/default');
const REDIS_URI = config.redis.uri;

let workQueue = new Queue('job', REDIS_URI);

async function seed() {
    let data = {
        name: "SEND_EMAIL",
        email: "asif@kickbackapps.com",
        message: Math.random().toString(36).substring(7),
    };
    console.log(`Pushing Job ${JSON.stringify(data)}`);
    await workQueue.add(data)
}

async function seedWithDelay() {
    let data = {
        name: "SEND_EMAIL",
        email: "asif@kickbackapps.com",
        message: Math.random().toString(36).substring(7),
    };
    console.log(`Pushing Job ${JSON.stringify(data)}`);
    await workQueue.add(data, {delay: Math.floor(Math.random()*10000)})
}

async function seedWithPriority() {
    let data = {
        name: "SEND_EMAIL",
        email: "asif@kickbackapps.com",
        message: "Priority test",
    };
    console.log(`Pushing Job ${JSON.stringify(data)}`);
    await workQueue.add(data, {priority: 1})
}

setInterval(seed, Math.floor(Math.random()*10000));
setInterval(seedWithDelay, Math.floor(Math.random()*10000));
// setInterval(seedWithPriority, Math.floor(Math.random()*10000));
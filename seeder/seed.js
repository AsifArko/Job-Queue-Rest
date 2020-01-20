let Queue = require('bull');

const config = require('../config/default');
const REDIS_URI = config.redis.uri;

let workQueue = new Queue('work', REDIS_URI);

async function seed() {
    let data = {
        name: "SEND_EMAIL",
        email: Math.random().toString(36).substring(7) + "@gmail.com",
        message: "Job Push Test",
    };

    console.log(`Pushing Job ${JSON.stringify(data)}`);
    await workQueue.add(data)
}

setInterval(seed, 300);
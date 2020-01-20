let Queue = require('bull');
let REDIS_URI = 'redis://localhost:6379';

let workQueue = new Queue('work', REDIS_URI);

async function seed() {
    for (let i = 0; i < 100; i++) {
        let data = {
            name: Math.random().toString(36).substring(7),
            email: Math.random().toString(36).substring(7) + "@gmail.com",
            message: Math.random().toString(36).substring(7),
        };
        await workQueue.add(data)
    }
}

seed();
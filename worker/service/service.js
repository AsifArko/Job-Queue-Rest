exports.processJob = async (job) => {
    let progress = 0;
    if (Math.random() < 0.10) {
        throw new Error(`Job : ${job.id} Failed`)
    }

    while (progress < 100) {
        await sleep(50);
        progress += 1;
        await job.progress(progress);
    }
    return {
        job: JSON.stringify(job)
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};
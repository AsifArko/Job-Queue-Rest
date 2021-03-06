const joiRouter = require('koa-joi-router');
const {Joi} = joiRouter;

const jobController = require('../controllers/jobController');
const jobValidator = require('../validators/jobValidator');

const jobRouter = joiRouter();

jobRouter.route({
    method: 'get',
    path: '/completed',
    handler: [jobController.jobs]
});

jobRouter.route({
    method: 'post',
    path: '/job',
    validate: jobValidator.createJobValidator,
    handler: [jobController.addJob]
});

jobRouter.route({
    method: 'get',
    validate: {
        params: {
            id: Joi.string(),
        }
    },
    path: '/job/:id',
    handler: [jobController.getJob]
});

jobRouter.route({
    method: 'get',
    path: '/statistics',
    handler: [jobController.statistics]
});

jobRouter.route({
    method: 'get',
    path: '/failed',
    handler: [jobController.getFailedList]
});

jobRouter.route({
    method: 'get',
    path: '/delayed',
    handler: [jobController.getDelayedList]
});

jobRouter.route({
    method: 'get',
    path: '/waiting',
    handler: [jobController.getWaitingList]
});

jobRouter.route({
    method: 'get',
    path: '/active',
    handler: [jobController.getActiveList]
});

jobRouter.route({
    method: 'post',
    path: '/retry/:id',
    handler: [jobController.retryJob]
});

module.exports = jobRouter;
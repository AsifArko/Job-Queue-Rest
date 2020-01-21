const joiRouter = require('koa-joi-router');
const {Joi} = joiRouter;

const jobController = require('../controllers/jobController');
const jobValidator = require('../validators/jobValidator');

const jobRouter = joiRouter();

jobRouter.route({
    method: 'get',
    path: '/jobs',
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

module.exports = jobRouter;
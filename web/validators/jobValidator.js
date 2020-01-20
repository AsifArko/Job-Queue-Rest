const {Joi} = require('koa-joi-router');

exports.createJobValidator = {
    body: {
        name: Joi.string(),
        email: Joi.string().email().required(),
        message: Joi.string().max(320)
    },
    type: 'json',
};
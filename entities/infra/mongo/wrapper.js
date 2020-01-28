const errors = require('./error');

exports.create = async (model, data) => {
    try {
        return await model.create(data);
    } catch (e) {
        if (e.code === 11000) {
            throw errors.DuplicateKeyError(model);
        } else {
            throw e
        }
    }
};
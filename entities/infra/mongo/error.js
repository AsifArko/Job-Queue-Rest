class BaseError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }

    error() {
        return this.message;
    }
}

class DuplicateError extends BaseError {
    constructor(props) {
        super(props);
    }
}

const DuplicateKeyError = (model) => new DuplicateError(model.modelName + "Key already exists");

module.exports = {
    DuplicateKeyError
};
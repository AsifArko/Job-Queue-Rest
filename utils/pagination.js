const config = require('../config/default');

exports.paginationMeta = (query) => {
    let {skip, limit} = query;

    if (skip === undefined) {
        skip = config.skip;
    }

    if (limit === undefined) {
        limit = config.limit;
    }

    return {
        skip: skip,
        limit: limit
    }
};
const {isValid} = require("mongoose").Types.ObjectId;

exports.isValidMongoIDS = (IDS) => {
    if (Array.isArray(IDS)) {
        IDS.forEach(id => {
            if (!isValid(id)) {
                throw Error("Invalid ID")
            }
        })
    } else if (!isValid(IDS)) {
        throw Error("Invalid ID")
    }
};
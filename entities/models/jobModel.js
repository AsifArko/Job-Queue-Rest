const mongoose = require('mongoose');
const {Schema} = mongoose;

const jobSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true
        },
        email: {
            type: Schema.Types.String,
            required: true
        },
        message: {
            type: Schema.Types.String,
            required: true
        }
    }
);

const jobModel = mongoose.model('job', jobSchema);
module.exports = jobModel;
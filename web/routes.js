const fs = require('fs');

// Registering all the routes from the routes folder to the App
module.exports = async (app) => {
    fs.readdir(`${__dirname}/routes`, (err, files) => {
        files.forEach(file => {
            const path = `${__dirname}/routes/${file}`;
            const dynamicRouter = require(path);
            app.use(dynamicRouter.middleware());
        })
    })
};
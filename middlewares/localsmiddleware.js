const categorymodel = require('../models/categorymodel');

module.exports = function (app) {
    app.use(async function (req, res, next) {
        res.locals.session = req.session;
        next();
    })

    app.use(async function (req, res, next) {
        const category = await categorymodel.all();
        res.locals.categories = category;
        next();
    })
};


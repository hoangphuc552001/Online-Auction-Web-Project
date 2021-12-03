import categorymodel from '../models/categorymodel.js';

export default function (app){
    app.use(async function (req, res, next) {
        res.locals.session = req.session;
        next();
    })

    app.use(async function (req, res, next) {
        const category = await categorymodel.findAllWithDetails();
        res.locals.categories = category;
        next();
    })
};


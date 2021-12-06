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
    app.use(async function (req, res, next) {
        if(typeof (req.session.authenticated)==='undefined'){
            req.session.authenticated=false;

        }
        if(typeof (req.session.login )==='undefined'){
            req.session.login=false;
        }

        res.locals.authenticated = req.session.authenticated;
        res.locals.user = req.session.user;
        next();
    })
};


import categorymodel from '../models/categorymodel.js';
import multer from "multer";
import productmodel from "../models/productmodel.js";

export default function (app) {
    app.use(async function (req, res, next) {
        res.locals.session = req.session;
        next();
    })

    app.use(async function (req, res, next) {
        const category = await categorymodel.findAllWithDetails();
        res.locals.categories = category;
        await productmodel.test();
        next();
    })
    app.use(async function (req, res, next) {
        if (typeof (req.session.authenticated) === 'undefined') {
            req.session.authenticated = false;

        }
        if (typeof (req.session.admin) === 'undefined') {
            req.session.admin = false;
        }
        if (typeof (req.session.login) === 'undefined') {
            req.session.login = false;
        }
        res.locals.admin = req.session.admin
        res.locals.authenticated = req.session.authenticated;
        res.locals.user = req.session.user;
        if (res.locals.user) {
            var user_ = res.locals.user
            user_ = user_.name
            user_ = user_.split(" ")
            user_ = user_[0]
            res.locals.userName = user_
        }
        next();
    })
};




import express from "express";

import productmodel from '../models/productmodel.js'

import usermodel from "../models/usermodel.js";
const router = express.Router();



router.get('/admin', async function (req, res) {
    if (req.session.user) {
        if (req.session.user.privilege != "admin")
            return res.redirect("/Error/404");
    }
    else return res.redirect("/Error/404");

    res.render('./admin');
});



router.get('/profile', async function (req, res) {
    if (req.session.user) {
        if (req.session.user.privilege != "bidder" && req.session.user.privilege != "seller")
            return res.redirect("/404");
    }
    else
        return res.redirect("/404");

    var watchlist = await productmodel.watchlist(req.session.user.id);
    var participate = await productmodel.participate(req.session.user.id);
    var wonlist = await productmodel.wonlist(req.session.user.id);

    if (req.session.user.privilege == "bidder")
        return res.render('./profile', {
            user: req.session.user,
            name: req.session.user.name,
            email: req.session.user.email,
            dob: req.session.user.dob,
            priviledge: req.session.user.priviledge,
            address: req.session.user.address,
            watchlist: watchlist,
            participate: participate,
            wonlist: wonlist
        });

    var ongoing = await productmodel.ongoing(req.session.user.id);
    var soldlist = await productmodel.soldlist(req.session.user.id);

    res.render('./profile', {
        user: req.session.user,
        name: req.session.user.name,
        email: req.session.user.email,
        dob: req.session.user.dob,
        priviledge: req.session.user.priviledge,
        address: req.session.user.address,
        watchlist: watchlist,
        participate: participate,
        wonlist: wonlist,
        ongoing: ongoing,
        soldlist: soldlist
    });

});

router.get('/active/:id', async function (req, res) {

    var user = await usermodel.id(req.params.id);



    if (!user || user.privilege != null){
        console.log('some thing wrong ')
        return res.redirect("Error/404");
    }

    user=user[0]
    const entity = {
        id : user.id,
        privilege: 'bidder'
    }



    const it = await usermodel.update(entity);



    user = await usermodel.id(user.id)
    req.session.authenticated = true;
    req.session.user = user;
    res.render("./accept");
});

router.get('/reminder', async function (req, res) {
    res.render("./reminder");
});

router.get('/accept', async function (req, res) {
    res.render("./accept");
});


router.post('/upgrade/:Id', async function (req, res) {
    const entity = {
        request: "upgrade"
    }
    const condition = { id: req.params.Id };
    const rs = usermodel.update(entity, condition);
    res.redirect('/account/bidder');
});

export default router;
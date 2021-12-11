import express from "express";

import productmodel from '../models/productmodel.js'

import usermodel from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import admin from "../middlewares/admin.mdw.js"

const router = express.Router();


//
router.get('/admin', admin, async function (req, res) {
    if (!req.session.user)
        return res.redirect("/Error/404");
    req.session.admin = true;

    res.render('./admin');
});

function auth(req, res, next) {
    if (req.session.authenticated === false) {
        req.session.login = false;
        return res.redirect('/login');
    }
    next();
}

router.get('/profile', auth, async function (req, res) {
    if (req.session.user) {
        if (req.session.user.privilege != "bidder" && req.session.user.privilege != "seller")
            return res.redirect("/404");
    } else
        return res.redirect("/404");

    var participate = await productmodel.participate(req.session.user.id);
    var wonlist = await productmodel.wonlist(req.session.user.id);
    var watchlist = await productmodel.watchlist(req.session.user.id);
    // var participate = await productmodel.participate(req.session.user.id);
    // var wonlist = await productmodel.wonlist(req.session.user.id);

    if (req.session.user.privilege === "bidder")
        return res.render('./profile', {
            user: req.session.user,
            name: req.session.user.name,
            email: req.session.user.email,
            dob: req.session.user.dob,
            priviledge: req.session.user.priviledge,
            address: req.session.user.address,
            watchlist,
            participate,
            wonlist
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
        participate: participate,
        wonlist: wonlist,
        ongoing: ongoing,
        soldlist: soldlist
    });

});

router.get('/active/:id', async function (req, res) {

    var user = await usermodel.id(req.params.id);


    if (!user || user.privilege != null) {
        console.log('some thing wrong ')
        return res.redirect("Error/404");
    }

    user = user[0]
    const entity = {
        privilege: "bidder",
        rating:5
    }
    const condition = {
        id: user.id
    }

    await usermodel.update(entity, condition);

    user = await usermodel.id(user.id)
    user=user[0]
    req.session.authenticated = true;
    req.session.user = user;

    res.render("accept");
});

router.get('/reminder', async function (req, res) {
    res.render("./reminder");
});

router.get('/accept', async function (req, res) {
    req.session.authenticated = true;
    res.render("./accept");
});


router.post('/upgrade/:id', async function (req, res) {
    const entity = {
        request: "upgrade"
    }
    const condition = {id: req.params.id};
    console.log(condition)
    const rs = await usermodel.update(entity, condition);
    res.redirect('/account/profile');
});
router.get('/editprofile', auth, async function (req, res) {
    const user_f = await usermodel.findUser(req.session.user.id);
    res.render('./editprofile', {
        name: user_f[0].name,
        email: user_f[0].email,
        address: user_f[0].address
    });
});
router.get('/changepassword', auth, async function (req, res) {
    res.render('./changepassword');
});
router.post('/changepassword', auth, async function (req, res, next) {
    const user = await usermodel.findById(req.session.user.id);
    const currentpassword = req.body.currentpassword;
    const newpassword = req.body.newpassword;
    const confirmpassword = req.body.confirmpassword;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newpassword, salt);
    const rs = bcrypt.compareSync(currentpassword, user.password);
    if (rs === true) {
        usermodel
            .updatePassword({
                password: hash,
            }, {
                where: {id: req.session.user.id}
            })
            .then(function () {
                usermodel
                    .singleByID(req.session.user.id)
                    .then(user => {
                        req.session.user = user;
                        res.locals.user = req.session.user;
                        res.render('./changepassword', {
                            success: true,
                            newpassword: newpassword,
                            confirmpassword: confirmpassword
                        });
                    })
                    .catch(error => next(error));
            })
            .catch(function (error) {
                res.json(error);
                console.log("update profile failed!");
            });
    } else {
        res.render('./changepassword', {
            err: true,
            newpassword: newpassword,
            confirmpassword: confirmpassword
        });
    }

})

router.post('/editprofile', auth, async function (req, res) {
    usermodel
        .updateNamevsAddress({
            name: req.body.Name,
            address: req.body.Address
        }, {
            where: {id: req.session.user.id}
        })
        .then(function () {
            usermodel
                .singleByID(req.session.user.id)
                .then(user => {
                    req.session.user = user;
                    res.locals.user = req.session.user;
                    res.redirect('/account/profile');
                })
                .catch(error => next(error));
        })
        .catch(function (error) {
            res.json(error);
            console.log("update profile failed!");
        });
})
;
export default router;
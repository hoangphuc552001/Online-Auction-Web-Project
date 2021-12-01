
import express from "express";
const router = express.Router();
import userModel from "../models/usermodel.js";

import bcrypt from 'bcryptjs';
import mailgun from "mailgun-js" ;


mailgun({ apiKey: '',
                domain: '' +
                '' });


router.get('/register',function(req,res){
    res.render('register');
});

router.get('/login',function(req,res){

    res.render('login');
});

<<<<<<< HEAD

router.post('/',async function (req,res){
=======
router.post('/register',async function (req,res){
>>>>>>> 39b70c0a3dc74a9a231ec8fb3efbb8f89c56bce8
    const checking =await userModel.check(req.body.register_email);
    if(checking.length==0){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.register_password, salt);
        const entity = {
            name: req.body.register_name,
            email: req.body.register_email,
            password: hash,
            address: req.body.register_address
        }
        await userModel.add(entity);
        let user =await userModel.check(entity.email);
        user=user[0];

        const data =  {
            from: 'Web Nerdy Team <Zerd@WNT.com>',
            to: user.email,
            subject: 'Online Auction',
            text: `Hi,\nThanks for joining WNT Online Auction! Please confirm your email address by clicking on the link below. We'll communicate with you from time to time via email so it's important that we have an up-to-date email address on file.\nhttp://localhost:5000/account/active/${user.id}\nIf you did not sign up for a WNT account please disregard this email.\nHappy emailing!\nAdministrators`
        };

        //mailgun.messages().send(data);
        res.render('login', {
            announce: "Signup complete! We've sent you a mail to confirm, please follow the link inside to active your account."
        });

    }
    else {
        res.render("register", {
            name: req.body.register_name,
            email: req.body.register_email,
            password: req.body.register_password,
            repeat: req.body.register_repeat,
            address: req.body.register_address,
            error: "This email address is already being used!"
        });

    }
})
router.post('/login', async function (req, res){
    let user = await userModel.check(req.body.email);
    user = user[0];

    if (user == undefined)
        return res.render('login', {
            announce: 'Invalid username or password.'
        });
    console.log(req.body.password)
    const rs = bcrypt.compareSync(req.body.password, user.password);
    if (rs === false)
        return res.render('login', {
            announce: 'Invalid username or password.'
        });
    else console.log('login success')

    return res.render('login', {
        announce: 'Login success!!!.'
    });
})


router.get('/logout', async function (req, res) {

    res.redirect('login');
});

export default router;



import express, {request} from "express";
import productmodel from "../models/productmodel.js";
import categorymodel from "../models/categorymodel.js";
import usermodel from "../models/usermodel.js";
const router = express.Router();

router.get('/', async function (req, res) {

    const bidder = await usermodel.findBidder();
    const seller = await usermodel.findSeller();
    const request = await usermodel.findRequest();
    //console.log(user);
    res.render('./user', {
        bidder: bidder,
        seller:seller,
        request:request
    });
});

router.get('/user-view/:UserId',async function (req, res){
    await usermodel.refresh();
    const user = await usermodel.id(req.params.UserId);
    res.render('./user-view', {
        user: user[0],
    });
});

//add user
// router.get('/user-add',async function (req, res) {
//     res.render('./user-add');
// });


// upgrade bidder by id
//router.post('/up-bidder/:UserId',async function (req, res) {
//    const entity = {
//        id: req.params.UserId,
//        request: "none",
//        privilege: "seller"
//    }
//    // console.log(req.params.UserId);
//    const rs = await usermodel.changeType(entity);
//    res.redirect('/admin/user');
//});
//
//// downgrade seller by id
//router.post('/down-seller/:UserId',async function (req, res) {
//    const entity = {
//        id: req.params.UserId,
//        request: "none",
//        privilege: "bidder"
//    }
//    const rs = await usermodel.changeType(entity);
//    res.redirect('/admin/user');
//});
//
////delete user by id
//router.post('/del-user/:UserId',async function (req, res) {
//    const product = await productmodel.countByUser(req.params.UserId);
//    if(product === 0){
//        console.log("can delete this user");
//        const rs = await usermodel.delete(req.params.UserId);
//    }
//    else{
//        console.log("canot delete this user");
//    }
//    res.redirect('/admin/user');
//});

export default router;
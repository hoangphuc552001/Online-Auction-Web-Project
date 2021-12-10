



import express from "express";
import moment from "moment";
import productmodel from "../models/productmodel.js";
import mailgu from "mailgun-js/lib/mailgun.js" ;

import usermodel from "../models/usermodel.js";
import crypt from "../utils/crypt.js";

const router = express.Router();
const hashedApi ='87188d3dedb0558b49e8baa28b414ee3175caac3e27f94bd73b5fdb0f0651bb206ecb4bfea83a060032bb0ce3fd864db';
const hashedDomain='7dcecb51f53178edd7a6de01581da0b877ac22c459c6599c460cf8a438e5a2e62858b1e92c828e3d257fc9a16afb4a6aff40479f8e45184330814068' +
    'f12e4764';


const DOMAIN = crypt.decrypt(hashedDomain);
const API = crypt.decrypt(hashedApi);
const mailgun = mailgu({apiKey: API, domain: DOMAIN});

router.get('/:id', async function (req, res) {
    // await productmodel.refresh();
    let product = await productmodel.detail(req.params.id);
    if (product.length === 0)
        return res.redirect("/404");
    product = product[0];
    let related = await productmodel.related(product.category);
    let holder = await usermodel.id(product.holder);
    holder = holder[0];
    let seller = await usermodel.id(product.seller);
    seller = seller[0];
    const image = await productmodel.product(product.id);
    const mainimage = {
        image: product.image,
    }
    image.unshift(mainimage);
    //let announce;
    let history = await productmodel.history(req.params.id);
//
    //if (req.session.announce) {
    //    announce = req.session.announce;
    //    delete req.session.announce;
    //}
    //else
    //    announce = null;
    if (req.session.authenticated!==false){
        const listProductUser=await productmodel.getProductwithUser(req.session.user.id);
        for (let i=0;i<listProductUser.length;i++){
           if (listProductUser[i].product===product.id){
               product.checkwl=true;
           }
        }
    }
    req.session.save(function () {
        return res.render('./detail', {
            product: product,
            holder: holder,
            seller: seller,
            related: related,
            image: image,
            //path: path,
            //  prepath: prepath,
            //image: image,
            //announce: announce,
            //ratinglist: ratinglist,
            history: history
        });

        /* await productmodel.refresh();
        var product = await productmodel.detail(req.params.id);
        if (product.length == 0)
            return res.redirect("/404");
        product = product[0];
        var related = await productmodel.related(product.category);
        var holder = await usermodel.id(product.holder);
        holder = holder[0];
        var seller = await usermodel.id(product.seller);
        seller = seller[0];
        var image = await imagemodel.product(product.id);
        var mainimage = {
            image: product.image,
        }
        image.unshift(mainimage);
        var path;
        var prepath;
        path = await categorymodel.id(product.category);
        if (path) {
            path = path[0]
            prepath = await categorymodel.id(path.parent);
            prepath = prepath[0];
        }

        var announce;
        var history = await productmodel.history(req.params.id);

        if (req.session.announce) {
            announce = req.session.announce;
            delete req.session.announce;
        }
        else
            announce = null;

        var ratinglist;
        if (req.session.authenticated)
            if (seller.id === req.session.user.id)
                ratinglist = await usermodel.bidderratinglist(product.id);
            else
                ratinglist = await usermodel.userratinglist(seller.id);

        req.session.save(function () {
            return res.render('./detail', {
                product: product,
                holder: holder,
                seller: seller,
                related: related,
                path: path,
                prepath: prepath,
                image: image,
                announce: announce,
                ratinglist: ratinglist,
                history: history

            });

         */
    });


})

router.post('/:id', async function (req, res) {
    // await productmodel.UpdateProduct(req.params.id);
     var product = await productmodel.detail(req.params.id);
     product = product[0];
     var entity = {
         user: req.session.user.id,
         offer: req.body.offer,
         product: req.params.id
     }

     if (product.status == "bidding") {
         var exholder = await productmodel.holder(req.params.id);

         if (req.body.mode == 'on')
             await usermodel.automated(entity);
         else
             await usermodel.bid(entity);
         console.log(product)
         entity = {
             product: req.params.id,
             user: req.session.user.id
         }

         var bidding = await productmodel.bid(entity);
         bidding = bidding[0];

         product = await productmodel.detail(req.params.id);
         product = product[0];
         // var data = {
         //     from: 'GPA Team<HCMUS@fit.com>',
         //     to: bidding.bidderemail,
         //     subject: 'Online Auction',
         //     text: `Hi ${bidding.bidder},\nCongratulations!\nYou've offered ${bidding.price}$ for ${bidding.name} successfully.\n\nThank you for joining us!\nHappy bidding!\nSent: ${moment()}`
         // };
         // mailgun.messages().send(data);
         //
         // data = {
         //     from: 'GPA Team<HCMUS@fit.com>',
         //     to: bidding.selleremail,
         //     subject: 'Online Auction',
         //     text: `Hi ${bidding.seller},\nCongratulations!\nYour product ${bidding.name} has been offered for ${bidding.price}$.\n\nThank you for joining us!\nHappy selling!\nSent: ${moment()}`
         // };
         // mailgun.messages().send(data);
         //
         // if (exholder.length == 1) {
         //     exholder = exholder[0];
         //     data = {
         //         from: 'GPA Team<HCMUS@fit.com>',
         //         to: exholder.email,
         //         subject: 'Online Auction',
         //         text: `Hi ${exholder.name},\nUnfortunately!\nSomeone has offered for ${bidding.name} higher than you.\n\nThank you for joining us!\nHappy bidding!\nSent: ${moment()}`
         //     };
         //     mailgun.messages().send(data);
         // }
         //
         // entity = {
         //     product: req.params.id,
         //     offer: bidding.price + bidding.increment
         // }
         //
         // var factor = await productmodel.xfactor(entity);
         // if (factor.length == 1) {
         //     factor = factor[0];
         //
         //     data = {
         //         from: 'GPA Team<HCMUS@fit.com>',
         //         to: factor.email,
         //         subject: 'Online Auction',
         //         text: `Hi ${factor.name},\nCongratulations!\nYou've offered ${entity.offer}$ for ${bidding.name} successfully.\n\nThank you for joining us!\nHappy bidding!\nSent: ${moment()}`
         //     };
         //     mailgun.messages().send(data);
         //
         //     data = {
         //         from: 'GPA Team<HCMUS@fit.com>',
         //         to: bidding.bidderemail,
         //         subject: 'Online Auction',
         //         text: `Hi ${bidding.bidder},\nUnfortunately!\nSomeone has offered for ${bidding.name} higher than you.\n\nThank you for joining us!\nHappy bidding!\nSent: ${moment()}`
         //     };
         //     mailgun.messages().send(data);
         //
         //     data = {
         //         from: 'GPA Team<HCMUS@fit.com>',
         //         to: bidding.selleremail,
         //         subject: 'Online Auction',
         //         text: `Hi ${bidding.seller},\nCongratulations!\nYour product ${bidding.name} has been offered for ${entity.offer}$.\n\nThank you for joining us!\nHappy selling!\nSent: ${moment()}`
         //     };
         //     mailgun.messages().send(data);
         // }

         req.session.announce = "Done!";
     } else {
         req.session.announce = "Oops! Something went wrong..."
     }

     req.session.save(function () {
         return res.redirect('/detail/' + req.params.id);
     });
})


export default router;
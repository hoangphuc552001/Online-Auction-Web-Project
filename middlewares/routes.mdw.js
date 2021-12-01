
import {dirname} from "path";
import {fileURLToPath} from "url";
import productmodel from "../models/productmodel.js";
const __dirname=dirname(fileURLToPath(import.meta.url))
import userRoute from '../routes/indexrouter.js'
import userModel from "../models/usermodel.js";
//routes
export default function(app) {
    app.get('/', async function (req, res)  {
        const highestprice=await productmodel.findTop5ProHighest();
        const mostbids=await productmodel.findTop5ProMostBids();
        const instance=await productmodel.findTop5ProInstance();
       res.render('index',{
           highestprice,
           mostbids,
           instance,
           empty:mostbids.length===0 || highestprice.length===0 ,
       });
    })

    app.use('/',userRoute);


    app.use(function (req,res)
    {
        res.render('Error/404',{layout:false})
    })
    app.use(function (err,req,res,next)
    {
        console.error(err.stack)
        res.render('Error/500',{layout:false})
    })



}

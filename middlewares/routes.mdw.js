
import {dirname} from "path";
import {fileURLToPath} from "url";
import productmodel from "../models/productmodel.js";
const __dirname=dirname(fileURLToPath(import.meta.url))
import userRoute from '../routes/indexrouter.js'
import usermodel from "../models/usermodel.js";
import accountRoute from "../routes/accountrouter.js";

//routes
export default function(app) {
    app.get('/', async function (req, res)  {
        const list=await productmodel.findTop5ProHighest();
        const test=await productmodel.find();
        console.log(new Date(test[0].end).getTime());
       res.render('index',{
           products:list,
           empty:list.length===0,
       });
    })

    app.use('/',userRoute);

    app.use('/account',accountRoute)
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

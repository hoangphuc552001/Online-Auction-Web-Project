
import {dirname} from "path";
import {fileURLToPath} from "url";
const __dirname=dirname(fileURLToPath(import.meta.url))
import userRoute from '../routes/indexrouter.js'
//routes
export default function(app) {
    app.get('/', (req, res) => {
        res.render('index')
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

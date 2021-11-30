import express from 'express';
import morgan from 'morgan';
import activate_view_middleware from './middlewares/view.mdw.js';
import activate_route_middleware from './middlewares/routes.mdw.js'
//expressjs declare
const app = express()
const port = 3000
//morgan
app.use(morgan('dev'));
//middleware declare for post method
app.use(express.urlencoded({extended:true}));
//view
activate_view_middleware(app);
//routes
activate_route_middleware(app);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
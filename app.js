const express =require('express');
const morgan = require('morgan');
const activate_view_middleware = require('./middlewares/view.mdw.js');
const activate_route_middleware= require('./middlewares/routes.mdw.js')
const activate_locals_middleware= require('./middlewares/localsmiddleware.js');
const asyncErrors = require('express-async-errors')
//expressjs declare
const app = express()
const port = 3000
app.use('/public',express.static('public'))
//morgan
app.use(morgan('dev'));
//middleware declare for post method
app.use(express.urlencoded({extended:true}));
//view
app.use('/public',express.static('public'))

activate_locals_middleware(app)

activate_view_middleware(app);
//routes
activate_route_middleware(app);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
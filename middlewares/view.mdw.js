//template engine
const {engine} = require('express-handlebars');
const numeral = require("numeral");

module.exports=function (app) {
    app.engine('hbs', engine(
        {defaultLayout:'layout.hbs',
            helpers:{
                format_number(val){
                    return numeral(val).format('0,0')+" đ";}
            }}
    ));
    app.set('view engine', 'hbs');
    app.set("views", "./views");

}
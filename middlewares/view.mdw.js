//template engine
import {engine} from "express-handlebars";
import numeral from "numeral";

export default function (app) {
    app.engine('hbs', engine(
        {defaultLayout:'main.hbs',
            helpers:{
                format_number(val){
                    return numeral(val).format('0,0');}
            }}
    ));
    app.set('view engine', 'hbs');
    app.set("views", "./views");
}
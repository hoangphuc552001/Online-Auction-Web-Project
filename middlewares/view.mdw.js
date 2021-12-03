//template engine
import {engine} from "express-handlebars";
import numeral from "numeral";
import moment from "moment";
export default function (app) {
    app.engine('hbs', engine(
        {defaultLayout:'layout.hbs',
            helpers:{
                format_number(val){
                    return numeral(val).format('0,0')+" đ";},
                remain(end) {
                    if (moment(end).diff(moment(), 'days') > 0)
                        return moment(end).diff(moment(), 'days') + 'd';
                    else if (moment(end).diff(moment(), 'hours') > 0)
                        return moment(end).diff(moment(), 'hours') + 'h';
                    else if (moment(end).diff(moment(), 'minutes') > 0)
                        return moment(end).diff(moment(), 'minutes') + 'm';
                    else if (moment(end).diff(moment(), 'seconds') > 0)
                        return moment(end).diff(moment(), 'seconds') + 's';
                    return "Expired";
                },
                time(time) {
                    return moment(time).format("YYYY/MM/DD");
                },
                timestamp(time) {
                    return moment(time).format("YYYY/MM/DD hh:mm:ss");
                },
                new(start) {
                    if (moment().diff(start, 'days') < 1)
                        return "<i class='fa fa-rocket text-danger'></i>";
                },
                equal(first, second) {
                    return first === second;
                },
                equalBool(first, second) {
                    return first == second;
                },
                root(set, root) {
                    for (var i = 0; i < set.length; i++) {
                        if (set[i].parent == root)
                            return true;
                    }
                    return false;
                },
                disable(status) {
                    if (status == "bidding")
                        return;
                    return "disabled"
                },
                masked(name) {
                    var result = String(name);
                    var length = parseInt(result.length * 0.8);
                    var target = result.substring(0, length);
                    var replacer = "";
                    for (var i = 0; i < length; i++)
                        replacer += '*';

                    result = result.replace(target, replacer);

                    return result;
                },
                imageactive(index) {
                    if (index == 0)
                        return "active";

                },
                sum (first, second) {
                    return first + second;
                },
                disable(user, seller) {
                    if (seller != user)
                        return;
                    return "disabled"

                }
            }
        }
    ));
    app.set('view engine', 'hbs');
    app.set("views", "./views");

}
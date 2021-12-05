import productmodel from "../../models/productmodel.js";
import express from "express";
import hbs from "handlebars"
const app = express.Router();
app.get("/byCat/:id", async function (req, res) {
    const catID=req.params.id || 0;
    for (const c of res.locals.categories){
        if (c.id === +catID){
            c.isActive=true;
            break;
        }
    }
    //paging
    var page=+req.query.page||1;
    if (page<0) page=1;
    const offset=(page-1)*9;
    let [list,total] =await Promise.all([
        productmodel.pageByCat(catID,9,offset),
        productmodel.totalOfCat(catID)
    ]);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    for (let i=0;i<list.length;i++){
        const diffDaysEreader= Math.round(Math.abs((list[i].end - list[i].start) / oneDay));
        list[i].day=diffDaysEreader;
        var diffMsEreader=(new Date() - list[i].start)
        var checkMinuteEreader=
            Math.round(((diffMsEreader  % 86400000) % 3600000) / 60000)
            +Math.floor(diffMsEreader / 86400000)*24*60+Math.floor((diffMsEreader % 86400000) / 3600000)*60; // minutes
        list[i].minute=checkMinuteEreader<=15?1:0
    }
    total=total[0]['count(*)']
    const nPages=Math.ceil(total/9);
    const page_items=[];

    for (let i=1;i<=nPages;i++){
        const item={
            value:i,
            isActive:i===page
        }
        page_items.push(item)
    }
    res.render("productType/product", {
        products: list,
        empty: list.length === 0,
        layout:'layoutwithCat.hbs',
        page_items,
        prev_value:page-1,
        next_value:page+1,
        can_go_prev:page>1,
        can_go_next:page<nPages
    });
});
app.get("/searchPrice", async function (req, res) {
    var page=+req.query.page||1;
    if (page<0) page=1;
    const offset=(page-1)*9;
    let [list,total] =await Promise.all([
        productmodel.orderedByPrice(9,offset),
        productmodel.totalorderByPrice()
    ]);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    for (let i=0;i<list.length;i++){
        const diffDaysEreader= Math.round(Math.abs((list[i].end - list[i].start) / oneDay));
        list[i].day=diffDaysEreader;
        var diffMsEreader=(new Date() - list[i].start)
        var checkMinuteEreader=
            Math.round(((diffMsEreader  % 86400000) % 3600000) / 60000)
            +Math.floor(diffMsEreader / 86400000)*24*60+Math.floor((diffMsEreader % 86400000) / 3600000)*60; // minutes
        list[i].minute=checkMinuteEreader<=15?1:0
    }
    total=total[0]['count(*)']
    const nPages=Math.ceil(total/9);
    const page_items=[];

    for (let i=1;i<=nPages;i++){
        const item={
            value:i,
            isActive:i===page
        }
        page_items.push(item)
    }
    res.render("productType/product", {
        products:list,
        empty: list.length === 0,
        layout:'layoutwithCat.hbs',
        page_items,
        prev_value:page-1,
        next_value:page+1,
        can_go_prev:page>1,
        can_go_next:page<nPages
    })
})
app.get("/searchTime", async function (req, res) {
    var page=+req.query.page||1;
    if (page<0) page=1;
    const offset=(page-1)*9;
    let [list,total] =await Promise.all([
        productmodel.orderedByTime(9,offset),
        productmodel.totalorderByTime()
    ]);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    for (let i=0;i<list.length;i++){
        const diffDaysEreader= Math.round(Math.abs((list[i].end - list[i].start) / oneDay));
        list[i].day=diffDaysEreader;
        var diffMsEreader=(new Date() - list[i].start)
        var checkMinuteEreader=
            Math.round(((diffMsEreader  % 86400000) % 3600000) / 60000)
            +Math.floor(diffMsEreader / 86400000)*24*60+Math.floor((diffMsEreader % 86400000) / 3600000)*60; // minutes
        list[i].minute=checkMinuteEreader<=15?1:0
    }
    total=total[0]['count(*)']
    const nPages=Math.ceil(total/9);
    const page_items=[];

    for (let i=1;i<=nPages;i++){
        const item={
            value:i,
            isActive:i===page
        }
        page_items.push(item)
    }
    res.render("productType/product", {
        products:list,
        empty: list.length === 0,
        layout:'layoutwithCat.hbs',
        page_items,
        prev_value:page-1,
        next_value:page+1,
        can_go_prev:page>1,
        can_go_next:page<nPages
    })
})
app.get("/search",async function (req, res) {
    var searchpro=req.query.name;
    var page=+req.query.page||1;
    if (page<0) page=1;
    const offset=(page-1)*9;
    let [list,total] =await Promise.all([
        productmodel.searchProduct(searchpro,9,offset),
        productmodel.totalofSearchProduct(searchpro)
    ]);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    for (let i=0;i<list.length;i++){
        const diffDaysEreader= Math.round(Math.abs((list[i].end - list[i].start) / oneDay));
        list[i].day=diffDaysEreader;
        var diffMsEreader=(new Date() - list[i].start)
        var checkMinuteEreader=
            Math.round(((diffMsEreader  % 86400000) % 3600000) / 60000)
            +Math.floor(diffMsEreader / 86400000)*24*60+Math.floor((diffMsEreader % 86400000) / 3600000)*60; // minutes
        list[i].minute=checkMinuteEreader<=15?1:0
    }
    total=total[0]['count(*)']
    const nPages=Math.ceil(total/9);
    const page_items=[];

    for (let i=1;i<=nPages;i++){
        const item={
            value:i,
            isActive:i===page,searchpro
        }
        page_items.push(item)
    }
    res.render("productType/product", {
        products:list,
        empty: list.length === 0,
        layout:'layoutwithCat.hbs',
        page_items,
        prev_value:page-1,
        next_value:page+1,
        can_go_prev:page>1,
        can_go_next:page<nPages,

    })

})
export default app;

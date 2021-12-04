import productmodel from "../../models/productmodel.js";
import express from "express";
const app = express.Router();

app.get("/", async function (req, res) {
    //paging
    var page=+req.query.page||1;
    if (page<0) page=1;
    const offset=(page-1)*12;
    let [list,total] =await Promise.all([
        productmodel.pageAll(12,offset),
        productmodel.totalAll()
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
    const nPages=Math.ceil(total/12);
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
app.get("/byCat/:id", async function (req, res) {
    const catID=req.params.id || 0;
    // const list_5 = await productmodel.findCatById(catID);
    // const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    // for (let i=0;i<list_5.length;i++){
    //     const diffDaysEreader= Math.round(Math.abs((list_5[i].end - list_5[i].start) / oneDay));
    //     list_5[i].day=diffDaysEreader;
    //     var diffMsEreader=(new Date() - list_5[i].start)
    //     var checkMinuteEreader=
    //         Math.round(((diffMsEreader  % 86400000) % 3600000) / 60000)
    //         +Math.floor(diffMsEreader / 86400000)*24*60+Math.floor((diffMsEreader % 86400000) / 3600000)*60; // minutes
    //     list_5[i].minute=checkMinuteEreader<=15?1:0
    // }
    for (const c of res.locals.categories){
        if (c.id === +catID){
            c.isActive=true;
            break;
        }
    }
    //paging
    var page=+req.query.page||1;
    if (page<0) page=1;
    const offset=(page-1)*6;
    let [list,total] =await Promise.all([
        productmodel.pageByCat(catID,6,offset),
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
    const nPages=Math.ceil(total/6);
    const page_items=[];

    for (let i=1;i<=nPages;i++){
        const item={
            value:i,
            isActive:i===page
        }
        page_items.push(item)
    }
    // const disabledItem={
    //     'value':'...',
    //     'isActive':false,
    //     'isDisabled':true
    // }
    // const pg=15;
    // for (let i=1;i<=5;i++){
    //     const item={"value":i,"isActive":i===pg};
    //     page_items.push(item);
    // }
    // page_items.push(disabledItem);
    // for (let i=pg-3;i<=pg+3;i++){
    //     const item={"value":i,"isActive":i===pg};
    //     page_items.push(item);
    // }
    // page_items.push(disabledItem);
    // for (let i=nPages-5;i<=nPages;i++){
    //     const item={"value":i,"isActive":i===pg};
    //     page_items.push(item);
    // }
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

export default app;
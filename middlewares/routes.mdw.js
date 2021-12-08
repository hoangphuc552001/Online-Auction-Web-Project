import { dirname } from "path";
import { fileURLToPath } from "url";
import productmodel from "../models/productmodel.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
import productRoute from "../routes/Product/product.js";
import userRoute from "../routes/indexrouter.js";
import accountrouter from "../routes/accountrouter.js";
import detailrouter from "../routes/detailrouter.js";
import adminUserRoute from "../routes/admin.user.router.js"
import adminCategoryRoute from "../routes/admin.category.router.js"
import adminProductRoute from "../routes/admin.product.router.js"
//routes
export default function (app) {
  app.get("/", async function (req, res) {
    const highestprice = await productmodel.findTop5ProHighest();
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    for (let i = 0; i < highestprice.length; i++) {
      const diffDaysHighest = Math.round(
        Math.abs((highestprice[i].end - highestprice[i].start) / oneDay)
      );
      highestprice[i].day = diffDaysHighest;
      var diffMshighest = new Date() - highestprice[i].start;
      var checkMinuteHighest =
        Math.round(((diffMshighest % 86400000) % 3600000) / 60000) +
        Math.floor(diffMshighest / 86400000) * 24 * 60 +
        Math.floor((diffMshighest % 86400000) / 3600000) * 60; // minutes
      highestprice[i].minute = checkMinuteHighest <= 15 ? 1 : 0;
    }
    const mostbids = await productmodel.findTop5ProMostBids();
    for (let i = 0; i < mostbids.length; i++) {
      const diffDaysMostBids = Math.round(
        Math.abs((mostbids[i].end - mostbids[i].start) / oneDay)
      );
      mostbids[i].day = diffDaysMostBids;
      var diffMsMostBids = new Date() - mostbids[i].start;
      var checkMinuteMostBids =
        Math.round(((diffMsMostBids % 86400000) % 3600000) / 60000) +
        Math.floor(diffMsMostBids / 86400000) * 24 * 60 +
        Math.floor((diffMsMostBids % 86400000) / 3600000) * 60; // minutes
      mostbids[i].minute = checkMinuteMostBids <= 15 ? 1 : 0;
    }
    const instance = await productmodel.findTop5ProInstance();
    for (let i = 0; i < instance.length; i++) {
      const diffDaysInstance = Math.round(
        Math.abs((instance[i].end - instance[i].start) / oneDay)
      );
      instance[i].day = diffDaysInstance;
      var diffMsMostInstance = new Date() - instance[i].start;
      var checkMinuteMostInstance =
        Math.round(((diffMsMostInstance % 86400000) % 3600000) / 60000) +
        Math.floor(diffMsMostInstance / 86400000) * 24 * 60 +
        Math.floor((diffMsMostInstance % 86400000) / 3600000) * 60; // minutes
      instance[i].minute = checkMinuteMostInstance <= 15 ? 1 : 0;
    }
    if (req.session.authenticated !==false){
      const listProductUser=await productmodel.getProductwithUser(req.session.user.id);
      for (let i=0;i<highestprice.length;i++){
        highestprice[i].authenticated=req.session.authenticated;
        mostbids[i].authenticated=req.session.authenticated;
        instance[i].authenticated=req.session.authenticated;
        for (let j=0;j<listProductUser.length;j++){
          if (listProductUser[j].product===highestprice[i].id){
            highestprice[i].checkwl=true;
            mostbids[i].checkwl=true;
            instance[i].checkwl=true;
          }
        }
      }
    }
    res.render("index", {
      highestprice,
      mostbids,
      instance,
      empty:
        mostbids.length === 0 ||
        highestprice.length === 0 ||
        instance.length === 0,
    });
  });
  app.use("/product", productRoute);
  //
  app.use("/user", userRoute);
  app.use("/", userRoute);
  app.use("/account", accountrouter);
  app.use("/detail", detailrouter);
  app.use("/admin/user",adminUserRoute)
  app.use("/admin/category",adminCategoryRoute)
  app.use("/admin/product",adminProductRoute)
  app.use(function (req, res) {
    res.render("Error/404", { layout: false });
  });
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render("Error/500", { layout: false });
  });
}

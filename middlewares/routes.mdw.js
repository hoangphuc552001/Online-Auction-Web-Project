import { dirname } from "path";
import { fileURLToPath } from "url";
import productmodel from "../models/productmodel.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
import productRoute from "../routes/Product/product.js";
import userRoute from "../routes/indexrouter.js";
import accountrouter from "../routes/accountrouter.js";
import detailrouter from "../routes/detailrouter.js";
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
  app.use(function (req, res) {
    res.render("Error/404", { layout: false });
  });
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render("Error/500", { layout: false });
  });
}

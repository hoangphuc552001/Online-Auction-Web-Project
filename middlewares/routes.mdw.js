import { dirname } from "path";
import { fileURLToPath } from "url";
import productmodel from "../models/productmodel.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
import userRoute from "../routes/indexrouter.js";
import userModel from "../models/usermodel.js";
import router from "../routes/indexrouter.js";
//routes
export default function (app) {
  app.get("/", async function (req, res) {
    const highestprice = await productmodel.findTop5ProHighest();
    const mostbids = await productmodel.findTop5ProMostBids();
    const instance = await productmodel.findTop5ProInstance();
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

  app.get("/product/mobilephone", async function (req, res) {
    const list_1 = await productmodel.findMobile();
    res.render("productType/mobilephone", {
      products: list_1,
      empty: list_1.length === 0,
    });
  });
  app.get("/product/laptop", async function (req, res) {
    const list_2 = await productmodel.findLaptop();
    res.render("productType/laptop", {
      products: list_2,
      empty: list_2.length === 0,
    });
  });
  app.use("/user", userRoute);
  app.use("/", userRoute);

  app.use("/account", accountRoute);
  app.use("/detail", detailRoute);
  app.use(function (req, res) {
    res.render("Error/404", { layout: false });
  });
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render("Error/500", { layout: false });
  });
}

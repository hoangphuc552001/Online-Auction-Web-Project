import { dirname } from "path";
import { fileURLToPath } from "url";
import productmodel from "../models/productmodel.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
import userRoute from "../routes/indexrouter.js";
import userModel from "../models/usermodel.js";
import router from "../routes/indexrouter.js";
import accountrouter from "../routes/accountrouter.js";
import detailrouter from "../routes/detailrouter.js";
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
    const page = req.query.page || 1;
    const limit = 6;
    const offset = (page -1) * limit;
    const total = await productmodel.countCatById(1);
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
      pageNumbers.push({
        value: i,
        isCurrent: +page === i
      });
    }
    const list_p= await productmodel.findPageById(1, limit, offset);
    console.log(parseInt(page)+1);
    res.render("productType/mobilephone", {
      products: list_p,
      empty: list_p.length === 0,
      pageNumbers,
      prev_val: parseInt(page) - 1,
      next_val: parseInt(page) + 1,
      can_go_prev: parseInt(page) > 1,
      can_go_next: parseInt(page)<nPages,
    });
  });
  app.get("/product/laptop", async function (req, res) {
    const page = req.query.page || 1;
    const limit = 6;
    const offset = (page -1) * limit;
    const total = await productmodel.countCatById(2);
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
      pageNumbers.push({
        value: i,
        isCurrent: +page === i
      });
    }
    const list_p= await productmodel.findPageById(2, limit, offset);

    res.render("productType/laptop", {
      products: list_p,
      empty: list_p.length === 0,
      pageNumbers,
      prev_val: parseInt(page) - 1,
      next_val: parseInt(page) + 1,
      can_go_prev: parseInt(page) > 1,
      can_go_next: parseInt(page)<nPages,
    });

  });
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

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
    const mostbids = await productmodel.findTop5ProMostBids();
    const instance = await productmodel.findTop5ProInstance();
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
      activeHome:true,
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

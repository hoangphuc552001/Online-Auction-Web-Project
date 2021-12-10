import db from "../utils/db.js";

export default {
  findCatById(catID) {
    return db("product").where("category", catID);
  },
  async countCatById(catID) {
    const list = await db("product")
      .where("category", catID)
      .count({ amount: "id" });
    return list[0].amount;
  },
  findPageById(catID, limit, offset) {
    return db("product").where("category", catID).limit(limit).offset(offset);
  },
  findTop5ProHighest() {
    return db("product").limit(5).offset(0).orderBy("current", "DESC");
  },
  findAll() {
    return db("product");
  },
  findMobile() {
    return db("product").where("category", 1);
  },
  findLaptop() {
    return db("product").where("category", 2);
  },
  findSmartWatch() {
    return db("product").where("category", 4);
  },
  findTablet() {
    return db("product").where("category", 3);
  },
  findEreader() {
    return db("product").where("category", 5);
  },
  findTop5ProMostBids() {
    return db("product").limit(5).offset(0).orderBy("bids", "DESC");
  },
  findTop5ProInstance() {
    return db("product").limit(5).offset(0).orderBy("end", "ASC");
  },

  async find() {
    const ob = await db("product").where("id", 1);
    return ob;
  },
  detail(id) {
    const list = db("product").where("id", id);
    return list;
  },
  related(category) {
    return db("product")
      .limit(5)
      .where("category", category)
      .offset(0)
      .orderBy("start", "DESC");
  },
  async product(product) {
    return db("image").where("product", product);
    const ob = await db("product").where("id", 1);
    return ob;
  },
  pageByCat(catID, limit, offset) {
    if (catID==+0) return db.select("*").from("product").limit(limit).offset(offset);
    else return db
      .select("*")
      .from("product")
      .where("category", catID)
      .limit(limit)
      .offset(offset);
  },
  totalOfCat(catID) {
    if (catID==+0) return db("product").count();
    else return db("product").count().where("category", catID);
  },
  searchProduct(name,limit,offset){
    return db('product').where('name', 'like', `%${name}%`)
        .limit(limit)
        .offset(offset);
  },
  totalofSearchProduct(name) {
    return db('product').count().where('name', 'like', `%${name}%`)
  },
  orderedByPrice(limit,offset){
    return db("product").orderBy('current').limit(limit)
        .offset(offset);
  },
  totalorderByPrice(){
    return db("product").count();
  },
  orderedByTime(limit,offset){
    return db("product").orderBy('end').limit(limit)
        .offset(offset);
  },
  totalorderByTime(){
    return db("product").count();
  },
  addProtoWL(id, user) {
    return db('watchlist').insert({'user': user, 'product': id});
  },
  getProductwithUser(user) {
    return db('watchlist').select('product').where('user',user);
  },
  getProductInforwithUser(user,limit,offset) {
    return db('product').join('watchlist','product.id','=',
        'watchlist.product').where('watchlist.user',user)
        .limit(limit).offset(offset);
  },
  totalProductInforwithUser(user,limit,offset) {
    return db('product').count().join('watchlist','product.id','=',
        'watchlist.product').where('watchlist.user',user)
        .limit(limit).offset(offset);
  },
  delProWL(id,user){
    return db('watchlist')
        .where({'product':id,'user':user})
        .del();
  },
  history(id){
    return db('history').select('user.name','history.offer','history.time').where('history.product',id).orderBy('time','asc')
        .join('user','user.id','=','history.user')
  },
  watchlist(id){
    return db('product').join('watchlist','product.id','=','watchlist.product')
        .where('watchlist.user',id);
  },
  participate(id){
    return db('product').join('history','product.id','=','history.product')
        .where({'product.status':'bidding','history.user':id})
  },
  wonlist(id){
    return db('product').where({'holder':id,'status':'sold'})
  },
   holder(id){
    return db('user').select('user.name','user.email').join('history','user.id','history.user')
        .where('history.product',id).orderBy('history.offer','desc').limit(1);
  },
  async bid(entity){
    const sql=`select history.offer as price, bidder.name as bidder, bidder.email as bidderemail, seller.name as seller, seller.email as selleremail, product.name, product.increment from history, user as bidder, product, user as seller where history.product=${entity.product} and history.user=${entity.user} and product.id=history.product and bidder.id=history.user and product.seller=seller.id order by history.offer desc limit 1`
    const raw_data= await db.raw(sql)
    return raw_data[0]
  },
  xfactor(entity){
    return db("automation").join("user","user.id","automation.user")
        .where("automation.product",entity.product)
        .andWhere("automation.offer",">=",entity.offer)
        .orderBy("automation.offer","desc")
        .limit(1)
  }


};

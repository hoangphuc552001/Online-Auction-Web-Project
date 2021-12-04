import db from '../utils/db.js'

export default {
    findCatById(catID) {
        return db('product').where('category', catID);
    },
    findTop5ProHighest() {
        return db('product').limit(5).offset(0).orderBy('current', 'DESC');
    },
    findAll() {
        return db('product');
    },
    findMobile() {
        return db('product').where('category', 1);
    },
    findLaptop() {
        return db('product').where('category', 2);
    },
    findSmartWatch() {
        return db('product').where('category', 4);
    },
    findTablet() {
        return db('product').where('category', 3);
    },
    findEreader() {
        return db('product').where('category', 5);
    },
    findTop5ProMostBids() {
        return db('product').limit(5).offset(0).orderBy('bids', 'DESC');
    },
    findTop5ProInstance() {
        return db('product').limit(5).offset(0).orderBy('end', 'ASC');
    },

    async find() {
        const ob = await db('product').where('id', 1);
        return ob;
    },
    detail(id) {
        const list = db('product').where('id', id);
        return list;
    },
    related(category) {
        return db('product').limit(5).where('category', category).offset(0).orderBy('start', 'DESC');

    },
    async product(product) {
        return db('image').where('product', product);
        const ob = await db('product').where('id', 1);
        return ob;
    },
    pageByCat(catID,limit,offset){
        return db.select('*').from('product')
            .where('category',catID)
            .limit(limit).offset(offset);
    },
    totalOfCat(catID){
        return db('product').count().where('category',catID);
    },
    pageAll(limit,offset){
        return db.select('*').from('product')
            .limit(limit).offset(offset);
    },
    totalAll(){
        return db('product').count();
    }

};
import db from '../utils/db.js'
export default{
    findCatById(catID) {
        return db('product').where('category',catID);
    },
    findTop5ProHighest(){
        return db('product').limit(5).offset(0).orderBy('current','DESC');
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
    findTop5ProMostBids(){
        return db('product').limit(5).offset(0).orderBy('bids','DESC');
    },
    findTop5ProInstance(){
        return db('product').limit(5).offset(0).orderBy('end','ASC');
    },
    async find(){
        const ob= await db('product').where('id',1);
        return ob;
    }
};
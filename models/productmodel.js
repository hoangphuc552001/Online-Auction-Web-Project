import db from '../utils/db.js'
export default{
    findCatById(catID) {
        return db('product').where('category',catID);
    },
    findTop5ProHighest(){
        return db('product').limit(5).offset(0).orderBy('current','DESC');
    },
    findTop5ProMostBids(){
        return db('product').limit(5).offset(0).orderBy('bids','DESC');
    }
    ,
    findTop5ProInstance(){
        return db('product').limit(5).offset(0).orderBy('cap','DESC');
    },
    async find(){
        const ob= await db('product').where('id',1);
        return ob;
    }
};
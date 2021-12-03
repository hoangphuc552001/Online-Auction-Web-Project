import db from '../utils/db.js'

export default {
    findCatById(catID) {
        return db('product').where('category', catID);
    },
    async countCatById(catID) {
        const list =await  db('product').where('category', catID).count({amount: 'id'});
        return list[0].amount;
    },
    findPageById(catID, limit, offset) {
        return db('product').where('category', catID).limit(limit).offset(offset);
    },
    findTop5ProHighest() {
        return db('product').limit(5).offset(0).orderBy('current', 'DESC');
    },
    findAll() {
        return db('product');
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
    }
};
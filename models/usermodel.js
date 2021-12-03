const db= require('../utils/db.js')
module.exports ={
    add(entity){
        return db('user').insert(entity);
    }
    ,
    async check(email){
        return db('user').where('email',email);
    },
    findCatById(catID) {
        return db('product').where('category',catID);
    }
}
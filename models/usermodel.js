import db from '../utils/db.js'

export default {
    add(entity){
        return db('user').insert(entity);
    },
    async check(email){
        return db('user').where('email',email);
    },
    findCatById(catID) {
        return db('product').where('category',catID);
    },
    async otp(entity) {
       return  db('otp').insert(entity)
    },
    async verify (email) {

        const sql = `select *
                     from otp
                     where email = '${email}'
                     order by otp.start desc limit 1`;
        const raw = await db.raw(sql);
        return raw[0];
    },
    id(id) {
        return  db('user').where('id',id);

    },
    async update(entity ) {

        const id = entity.id;
        delete entity.id;

        return db('user')
            .where('id', id)
            .update(entity);
    },
    async findBidder(){
        return db('user').where('privilege','bidder');
    },
    async findSeller(){
        return db('user').where('privilege','seller');
    },

    async findRequest(){
        return db('user').where('privilege','bidder').where('request','1');
    },
    changeType(entity){
        const id = entity.id;
        delete entity.id;
        return db('user').where('id',id).update(entity);
    },
    async delete(id){
        return db('user').where('id',id).del();
    }
}
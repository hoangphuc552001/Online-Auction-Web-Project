import db from '../utils/db.js'

export default {
    add(entity) {
        return db('user').insert(entity);
    },

    async check(email) {
        return db('user').where('email', email);
    },
    add_Product(entity) {
        return db('product').insert(entity);
    },
    findName(id){
      return   db('user').where("id", id);
    },
   add_image(img, catID) {
        return db('product').where("id", catID).update(img);
    },
    append_Des(des, catID) {
        return db('product').where("id", catID).update(des);
    },

    add_img_table(img){
        return db('image').insert(img);
    },
    async add_WL(entity) {
        return db('watchlist').insert(entity);
    },
    findCatById(catID) {
        return db('product').where('category', catID);
    },
    async otp(entity) {
        return db('otp').insert(entity)
    },
    async verify(email) {

        const sql = `select *
                     from otp
                     where email = '${email}'
                     order by otp.start desc limit 1`;
        const raw = await db.raw(sql);
        return raw[0];
    },
    id(id) {
        return db('user').where('id', id);

    },
    async update(entity, condition) {
        return db('user')
            .where('id', condition.id)
            .update(entity);
    },
    async updateNamevsAddressvsDob(entity, condition) {

        return db('user')
            .where('id', condition.where.id)
            .update({'name': entity.name, 'address': entity.address,
            'birthday':entity.birthday});
    },
    async updatePassword(entity, condition) {
        return db('user')
            .where('id', condition.where.id)
            .update({'password': entity.password});
    },
    singleByUserName: async username => {
        const rows =
            await db('user').where('name', username)
        if (rows.length > 0)
            return rows[0];

        return null;
    },
    singleByID: async ID => {
        const rows =
            await db('user').where('id', ID)
        if (rows.length > 0)
            return rows[0];

        return null;
    },
    findUser(id) {
        return db('user').where('id', id);
    },
    async checkPassword(id, password) {
        const rows =
            await db('user').where({'id': id}, {'password': password})
        if (rows.length > 0)
            return rows[0];

        return null;
    },
    async findById(id){
        const list= await db('user').where('id',id)
        if (list.length===0) return null;
        return list[0];
    },
    // bid: async (entity) => { await db.insert(entity, 'history')}
    async bid(entity){
        return db('history').insert(entity)
    },
    automated(entity){
        return db('automation').insert(entity)},
    async findBidder(){
        return db('user').where('privilege','bidder');
    },
    async findSeller(){
        return db('user').where('privilege','seller');
    },

    async findRequest(){
        return db('user').where('privilege','bidder').where('request','1');
    },
    updateRating(id,entity){
        return db('user').update(entity).where("user.id",id)},
    changeType(entity){
        const id = entity.id;
        delete entity.id;
        return db('user').where('id',id).update(entity);
    },
    async delete(id){
        return db('user').where('id',id).del();
    }
}
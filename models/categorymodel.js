import db from '../utils/db.js'

export default {
    async findAllWithDetails() {
        // const sql = `select c.*, count(p.ProID) as ProductCount
        //              from categories c
        //                       left join products p on c.CatID = p.CatID
        //              group by c.CatID, c.CatName`
        // const raw_data = await db.raw(sql)
        // return raw_data[0]
    }
}
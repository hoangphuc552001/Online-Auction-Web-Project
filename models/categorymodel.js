import db from '../utils/db.js'

export default {
    async findAllWithDetails() {
        const sql = `select c.*, count(p.id) as ProductCount
                     from category c
                              left join product p on c.id = p.category
                     group by c.id, c.name`
        const raw_data = await db.raw(sql)
        return raw_data[0]
    }
}
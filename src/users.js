import { Db } from 'mongodb'

const users = (db: Db) => {
  const api = {}

  api.get = async (req, res) => {
    try {
      const collection = 'users'
      const filter = req.query.filter
      const page = parseInt(req.query.page)
      let pagesize = parseInt(req.query.pageSize)
      if (!pagesize) pagesize = 10
      var docs = []

      const fields = ['person.lastName', 'person.firstName']
      const regex = new RegExp(filter, 'i')
      const match = filter
        ? {
            $or: fields.map(field => {
              return { [field]: regex }
            })
          }
        : {}

      var query = db.collection(collection).aggregate([
        {
          $lookup: {
            from: 'people',
            localField: '_id',
            foreignField: 'userid',
            as: 'person'
          }
        },
        {
          $match: match
        },
        {
          $project: {
            person: { $arrayElemAt: ['$person', 0] }
          }
        }
      ])

      var total = await db.collection(collection).count({})
      res.set('X-Paging-Total', total)

      if (page) {
        const old = (page - 1) * pagesize
        docs = await query
          .skip(old)
          .limit(pagesize)
          .toArray()
      } else {
        docs = await query.toArray()
      }
      res.json(docs)
    } catch (err) {
      res.status(500).json(err)
    }
  }

  return api
}

export default users

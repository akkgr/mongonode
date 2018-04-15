import { Db } from 'mongodb'

const users = (db: Db) => {
  const api = {}

  api.get = async (req, res) => {
    try {
      const collection = 'users'
      const page = parseInt(req.param('page'))
      let pagesize = parseInt(req.param('pageSize'))
      if (!pagesize) pagesize = 10
      var docs = []
      var total = '0'
      var query = db.collection(collection).aggregate([
        {
          $match: {}
        },
        {
          $lookup: {
            from: 'people',
            localField: '_id',
            foreignField: 'userid',
            as: 'person'
          }
        },
        {
          $project: {
            person: { $arrayElemAt: ['$person', 0] }
          }
        }
      ])
      if (page) {
        const old = (page - 1) * pagesize
        total = await db.collection(collection).count({})
        res.set('X-Paging-Total', total)
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

  api.post = async (req, res) => {
    const collection = 'users'
    const page = req.params.page
    var pagesize = req.params.pagesize
    if (!pagesize) pagesize = 10
    const filter = req.body.filter
    const order = req.body.order
    try {
      var docs = []
      if (page) {
        const old = (page - 1) * pagesize
        docs = await db
          .collection(collection)
          .find(filter)
          .project({ password: 0 })
          .sort(order)
          .skip(old)
          .limit(pagesize)
          .toArray()
      } else {
        docs = await db
          .collection(collection)
          .find(filter)
          .project({ password: 0 })
          .sort(order)
          .toArray()
      }
      res.json(docs)
    } catch (err) {
      res.status(500).json(err)
    }
  }

  return api
}

export default users

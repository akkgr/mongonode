import { Db } from 'mongodb'

const nodes = (db: Db) => {
  const api = {}

  api.get = async (req, res) => {
    try {
      const collection = 'nodes'
      var query = db.collection(collection).find()
      var docs = await query.toArray()
      res.json(docs)
    } catch (err) {
      res.status(500).json(err)
    }
  }

  return api
}

export default nodes

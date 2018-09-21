const data = db => {
  const api = {}

  api.get = async (req, res) => {
    const collection = req.params.collection
    const filter = req.query.filter
    let query = {}
    if (filter) {
      query = { $text: { $search: filter } }
    }
    const page = parseInt(req.query.page)
    let pagesize = parseInt(req.query.pageSize)
    if (!pagesize) pagesize = 10
    var docs = []

    try {
      var docs = []
      var total = await db.collection(collection).countDocuments(query)
      if (page) {
        const old = (page - 1) * pagesize
        docs = await db
          .collection(collection)
          .find(query)
          .skip(old)
          .limit(pagesize)
          .toArray()
      } else {
        docs = await db
          .collection(collection)
          .find(query)
          .toArray()
      }
      res.set('X-Paging-Total', total)
      res.json(docs)
    } catch (err) {
      res.status(500).send(err)
    }
  }

  return api
}

export default data

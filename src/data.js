const data = db => {
  const api = {}

  api.get = async (req, res) => {
    const collection = req.params.collection
    const page = req.params.page
    var pagesize = req.params.pagesize
    if (!pagesize) pagesize = 10
    try {
      var docs = []
      if (page) {
        const old = (page - 1) * pagesize
        docs = await db
          .collection(collection)
          .find({})
          .skip(old)
          .limit(pagesize)
          .toArray()
      } else {
        docs = await db
          .collection(collection)
          .find({})
          .toArray()
      }
      res.json(docs)
    } catch (err) {
      res.status(500).json(err)
    }
  }

  api.post = async (req, res) => {
    const collection = req.params.collection
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
          .sort(order)
          .skip(old)
          .limit(pagesize)
          .toArray()
      } else {
        docs = await db
          .collection(collection)
          .find(filter)
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

export default data
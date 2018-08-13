const data = db => {
  const api = {}

  api.get = async (req, res) => {
    const collection = req.params.collection
    const page = parseInt(req.query.page, 10)
    console.log('page: ' + page)
    const filter = req.query.filter
    let pagesize = parseInt(req.query.pagesize, 10)
    if (!pagesize) pagesize = 10

    const fields = ['lastName', 'firstName']
    const regex = new RegExp(filter, 'i')
    const query = filter
      ? {
          $or: fields.map(field => {
            return { [field]: regex }
          })
        }
      : {}

    try {
      var docs = []
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
      res.json(docs)
    } catch (err) {
      res.status(500).send(err)
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

import { Db } from 'mongodb'

function unflatten(arr) {
  var tree = [],
    mappedArr = {},
    arrElem,
    mappedElem

  // First map the nodes of the array to an object -> create a hash table.
  for (var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i]
    mappedArr[arrElem.Id] = arrElem
    mappedArr[arrElem.Id]['nodes'] = []
  }

  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id]
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.ParentId) {
        mappedArr[mappedElem['ParentId']]['nodes'].push(mappedElem)
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem)
      }
    }
  }
  return tree
}

const nodes = (db: Db) => {
  const api = {}

  api.get = async (req, res) => {
    try {
      const collection = 'nodes'
      var query = db.collection(collection).find()
      var docs = await query.toArray()
      res.json(unflatten(docs))
    } catch (err) {
      res.status(500).json(err)
    }
  }

  return api
}

export default nodes

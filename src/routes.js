import { Router } from 'express'
import eaa from 'express-async-await'

import auth from './auth'
import files from './files'
import data from './data'
import users from './users'
import nodes from './nodes'

const router = db => {
  const api = eaa(Router())

  api.post('/login', auth(db).login)
  api.post('/upload', files(db).upload)
  api.get('/users', users(db).get)
  api.get('/nodes', nodes(db).get)
  api.post('/users', users(db).post)
  api.get('/:collection', data(db).get)
  api.post('/:collection', data(db).post)

  return api
}

export default router

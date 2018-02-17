import { Router } from 'express'
import eaa from 'express-async-await'

import auth from './auth'
import files from './files'
import data from './data'

const router = db => {
  const api = eaa(Router())

  api.post('/login', auth(db).login)
  api.post('/upload', files(db).upload)
  api.get('/:collection/:page?/:pagesize?', data(db).get)
  api.post('/:collection/:page?/:pagesize?', data(db).post)

  return api
}

export default router

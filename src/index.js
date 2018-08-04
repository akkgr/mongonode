import http from 'http'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import compress from 'compression'
import helmet from 'helmet'
import router from './routes'
import { MongoClient } from 'mongodb'
import 'babel-polyfill'
import eaa from 'express-async-await'
import ws from 'socket.io'

const url = 'mongodb://admin:Adm.123@ds243085.mlab.com:43085/estiag'
const dbName = 'estiag'
const port = process.env.port || 3000
const app = eaa(express())
app.server = http.createServer(app)
app.use(morgan('dev'))
app.use(compress())
app.use(helmet())
app.use(
  cors({
    exposedHeaders: ['X-Paging-Total']
  })
)
app.use(
  bodyParser.json({
    limit: '10mb'
  })
)

const io = ws(app.server)

io.on('connection', function(socket) {
  console.log('a user connected')
  socket.on('disconnect', function() {
    console.log('user disconnected')
  })
})

const init = async () => {
  try {
    const client = await MongoClient.connect(url)
    const db = client.db(dbName)
    app.use('/', router(db))
    app.use((err, req, res, next) => {
      console.error(err)
      res.status(500)
      res.send('Something broke!!')
      next()
    })
    app.server.listen(port, () => {
      console.info(`server started on port ${port}`)
    })
  } catch (err) {
    console.error('Failed to make database connection!')
    console.error(err)
  }
}

init()

export default app

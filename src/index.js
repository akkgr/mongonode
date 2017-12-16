import http from 'http';
import express from 'express'
import morgan from 'morgan';
import bodyParser from 'body-parser'
import cors from 'cors'
import compress from 'compression'
import helmet from 'helmet';
import initializeDb from './db'
import router from './routes'

const port = process.env.port || 3000;
const app = express();
app.server = http.createServer(app);
app.use(morgan('dev'));
app.use(compress())
app.use(helmet())
app.use(cors());
app.use(bodyParser.json({
  limit: "10mb"
}));

initializeDb(db => {
  app.use('/', router(db))
  app.server.listen(port, () => {
    console.info(`server started on port ${port}`)
  })
})

export default app;
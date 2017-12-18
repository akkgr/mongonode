import http from 'http';
import express from 'express'
import morgan from 'morgan';
import bodyParser from 'body-parser'
import cors from 'cors'
import compress from 'compression'
import helmet from 'helmet';
import router from './routes'
import {
  MongoClient
} from 'mongodb'

const url = 'mongodb://admin:Adm.123@ds243085.mlab.com:43085/estiag';
const dbName = 'estiag'
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

const init = async() => {
  try {
    const client = await MongoClient.connect(url)
    const db = client.db(dbName)
    app.use('/', router(db))
    app.server.listen(port, () => {
      console.info(`server started on port ${port}`)
    })
  } catch (err) {
    console.error('Failed to make database connection!');
    console.error(err);
  }
}

init()

export default app;
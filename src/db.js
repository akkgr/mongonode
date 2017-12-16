import {
    MongoClient
} from 'mongodb'

const url = 'mongodb://admin:Adm.123@ds243085.mlab.com:43085/estiag';
const dbName = 'estiag'

export default cb => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            console.error('Failed to make database connection!');
            console.error(err);
            process.exit(1);
        }
        const db = client.db(dbName)
        cb(db)
    })
}
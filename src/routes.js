import {
    Router
} from 'express'

const api = db => {
    const api = Router();
    api.get('/', (req, res) => {
        db.collection('buildings').find({}).toArray(function (err, docs) {
            if (err) {
                console.log(err);
                res.error(err);
            } else {
                res.json(docs);
            }
        });
    });

    return api
}

export default api
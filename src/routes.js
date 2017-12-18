import {
    Router
} from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = db => {
    const api = Router();

    api.get('/:collection', (req, res) => {
        const collection = req.params.collection
        db.collection(collection).find({}).toArray(function (err, docs) {
            if (err) {
                console.log(err);
                res.error(err);
            } else {
                res.json(docs);
            }
        });
    });

    api.get('/login', (req, res) => {
        db.collection('users').findOne({
            username: req.body.username
        }).toArray(function (err, user) {
            if (err) {
                console.log(err);
                res.error(err);
            } else {
                if (!user) {
                    res.status(401).json({
                        message: 'Authentication failed. User not found.'
                    });
                } else if (user) {
                    if (!bcrypt.compareSync(req.body.password, user.password)) {
                        res.status(401).json({
                            message: 'Authentication failed. Wrong password.'
                        });
                    } else {
                        return res.json({
                            token: jwt.sign({
                                email: user.email,
                                fullName: user.fullName,
                                _id: user._id
                            }, 'RESTFULAPIs')
                        });
                    }
                }
            }
        });
    })

    return api
}

export default router
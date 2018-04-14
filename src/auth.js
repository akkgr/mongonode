import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const auth = db => {
  const api = {}

  api.login = async (req, res) => {
    try {
      const users = await db
        .collection('users')
        .find({
          username: req.body.username
        })
        .toArray()
      if (!users || users.length != 1) {
        res.status(401).json({
          message: 'Authentication failed. User not found.'
        })
        return
      }
      if (!bcrypt.compareSync(req.body.password, users[0].password)) {
        res.status(401).json({
          message: 'Authentication failed. Wrong password.'
        })
        return
      }
      const token = await jwt.sign(
        {
          _id: users[0]._id,
          email: users[0].email,
          username: users[0].username,
          roles: users[0].roles
        },
        'RESTFULAPIs',
        { expiresIn: '8h' }
      )
      res.json({
        token: token
      })
    } catch (err) {
      res.status(500).send('err')
    }
  }

  return api
}

export default auth

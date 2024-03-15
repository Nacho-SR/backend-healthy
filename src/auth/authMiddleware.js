const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']

  if (!token) {
    res.status(401).json({
      message: 'Unauthorized'
    })
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: 'Forbiden'
      })
    }
    req.user = user
    next()
  })
}

module.exports = authenticateToken

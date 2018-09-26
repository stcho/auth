const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const bcryptjs = require('bcryptjs')
const app = express()

app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let db
const dbURL = 'mongodb://127.0.0.1:27017/auth'
const port = process.env.PORT || 3001

MongoClient.connect(dbURL, (err, client) => {
  if (err) return console.log(err)
  db = client.db('auth')

  app.listen(port, () => {
    console.log(`Process ${process.pid} is listening to all incoming requests on ${port}`)
  })
})

function checkJwtToken(req, res, next) {
  jwt.verify(req.headers.authorization.replace('Bearer ', ''), 'test', (err, decoded) => {
    if (err) return res.status(401).send('Token error.')
    return next()
  })
}

app.post('/api/login', async (req, res) => {
  try {
    let { email } = req.body
    email = email.toLowerCase().trim()
    const user = await db.collection('users').findOne({ email })
    if (!user) return res.sendStatus(404)

    if (bcryptjs.compareSync(req.body.password, user.password)) {
      delete user.password
      const tokenObj = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      }
      user.userToken = jwt.sign(tokenObj, 'test')
      res.json(user)
    } else {
      res.sendStatus(401)
    }
  } catch(err) {
    console.log(err)
    res.sendStatus(500)
  }
})

app.post('/api/users', checkJwtToken, async(req, res) => {
  try {
    res.sendStatus(200)
  } catch(err) {
    res.sendStatus(500)
  }
})

// app.get('/api/posts', checkJwtToken, async(req, res) => {
//   try {
//     res.sendStatus(200)
//   } catch(err) {
//     res.sendStatus(500)
//   }
// })
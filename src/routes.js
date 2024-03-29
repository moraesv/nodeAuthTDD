const routes = require('express').Router()

const authMiddleWare = require('./app/middleware/auth')

const SessionController = require('./app/controllers/SessionController')

routes.post('/sessions', SessionController.store)

routes.use(authMiddleWare)

routes.get('/dashboard', (req, res) => {
  return res.status(200).send()
})

module.exports = routes

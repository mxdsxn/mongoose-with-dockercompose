import 'dotenv/config'

import express from 'express'
import routeControllers from './app/controllers/'

const app = express()

app.use(express.json())

app.get('/about', (a, b, n) => n(), (req, res) => {
 return res.json({
  about: 'api nodejs utilizando express e mongoose. mongoDb e api rodando com docker-compose',
  status: 'ok',
  environment: process.env.NODE_ENV
 })
})

app.use(routeControllers)

app.listen(process.env.SERVER_PORT, () => console.log('Server online'))
import express from 'express'

import authController from './auth'
import projectController from './project'

const routeControllers = express.Router()

routeControllers.use(
 authController,
 projectController,
)

export default routeControllers
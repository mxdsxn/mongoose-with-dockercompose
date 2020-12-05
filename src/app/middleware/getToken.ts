import {
 Response,
 NextFunction,
 Request
} from 'express'
import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth'

export default (req: Request, res: Response, next: NextFunction) => {
 const { authorization } = req.headers

 if (!authorization) {
  return res.status(401).json({ error: 'Token nao encontrado' })
 }

 const authParts = authorization.split(' ')

 if (!(authParts.length === 2)) {
  return res.status(401).json({ error: 'Token fora do padrao' })
 }

 const [
  scheme,
  token,
 ] = authParts

 if ('Bearer' !== scheme) {
  return res.status(401).json({ error: 'Token sem Bearer' })
 }

 jwt.verify(token, authConfig.secret, (err: any, decoded: any) => {
  if (err) {
   return res.status(401).json({ error: 'Token invalido', err })
  }

  if (decoded) {
   req.body.userId = decoded.id

   return next()
  }
 })
}
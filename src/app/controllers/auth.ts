import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import User from '../models/user'

import authConfig from '../../config/auth'
import getToken from '../middleware/getToken'

const setToken = (id: string) => {
 return jwt.sign({ id }, authConfig.secret, {
  expiresIn: 1000 * 60 * 60 * 24,
  algorithm: 'HS256',
 })
}
const router = express.Router()

router.post('/register', async (req, res) => {

 try {
  const { email } = req.body
  if (await User.exists({ email })) { return res.status(400).json({ error: 'email ja cadastrado' }) }

  const user = await User.create(req.body)
  user.set({ password: undefined })

  const token = setToken(user.get('id'))

  return res.send({ user, token })
 } catch (error) {
  return res.status(400).send({ error: 'Falha em /register' })
 }
})

router.post('/login', async (req, res) => {
 const { email, password } = req.body

 const user = await User.findOne({ email }).select('+password')

 if (!user) {
  return res.status(400).json({ error: 'Usuario nao encontrado' })
 }

 const isValid = await bcrypt.compare(password, user.get('password'))

 if (!isValid) {
  return res.status(400).json({ error: 'Senha invalida' })
 }

 const token = setToken(user.get('id'))

 return res.json({
  mensage: 'Usuario autenticado',
  token
 })
})

router.post('/forgot_password', async (req, res) => {
 const { email } = req.body

 try {
  const user = await User.findOne({ email })

  if (!user) {
   return res.status(400).json({ error: 'Usuario nao encontrado' })
  }

  const token = crypto.randomBytes(20).toString('hex')

  const now = new Date()
  now.setHours(now.getHours() + 1)

  await User.findByIdAndUpdate(user.get('id'), user.set({
   passwordResetExpires: now.getTime(),
   passwordResetToken: token,
  }))

  return res.status(200).json({ mensage: 'Token para reset de senha', token })

 } catch (error) {
  return res.status(400).json({ error: 'Erro em forgot_password' })
 }
})

router.post('/reset_password', async (req, res) => {
 const { email, resetToken, newPassword } = req.body

 try {
  const user = await User.findOne({ email }).select('+passwordResetExpires passwordResetToken')

  if (!user) {
   return res.status(400).json({ error: 'Usuario nao encontrado' })
  }

  const userResetToken = user.get('passwordResetToken')

  if (!(userResetToken === resetToken)) {
   return res.status(400).json({ error: 'ResetToken invalido' })
  }

  const userResetExpires = user.get('passwordResetExpires') as number

  const now = new Date().getTime()

  if (now > userResetExpires) {
   return res.status(400).json({ error: 'ResetToken expirado' })
  }

  user.set({ password: newPassword })

  await user.save()

  return res.status(200).json({ mensage: 'Senha trocada' })

 } catch (error) {
  return res.status(400).json({ error: 'Erro em forgot_password' })
 }
})

router.get('/check_login', getToken, async (req, res) => {
 res.json({ ok: 'Usuario logado' })
})

export default router
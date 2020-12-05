import { default as mongoConn } from '../../database/'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoConn.Schema({
 name: {
  type: String,
  required: true,
 },
 email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
 },
 password: {
  type: String,
  required: true,
  select: false,
 },
 passwordResetToken: {
  type: String,
  select: false,
 },
 passwordResetExpires: {
  type: String,
  select: false,
 },
 createdAt: {
  type: Date,
  default: Date.now,
 }
})


UserSchema.pre('save', async function (next) {
 const password = this.get('password')

 const hash = await bcrypt.hash(password, 11)

 this.set({ password: hash })

 next()
})

const User = mongoConn.model('User', UserSchema)

export default User
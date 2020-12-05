import path from 'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

import transportMailConfig from '../config/mail'

const transport = nodemailer.createTransport(transportMailConfig)

transport.use('compile', hbs({
 viewEngine: 'handlebas',
 viewPath: path.resolve(__dirname, './src/resources/mail'),
 extName: '.html',
}))
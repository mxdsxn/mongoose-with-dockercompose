import mongoose from 'mongoose'

const dbConnection = mongoose

const { DB_PORT, DB_HOST, DB_NAME } = process.env

dbConnection.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
 useUnifiedTopology: true,
 useNewUrlParser: true,
 useCreateIndex: true,
 useFindAndModify: false
})
dbConnection.Promise = global.Promise

dbConnection.connection.on('error', () => console.log('Connection error'))
dbConnection.connection.once('open', () => console.log('Database connected'))

export default dbConnection
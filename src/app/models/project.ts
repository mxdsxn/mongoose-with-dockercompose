import { default as mongoConn } from '../../database/'

const ProjectSchema = new mongoConn.Schema({
 title: {
  type: String,
  require: true,
 },
 description: {
  type: String,
  require: true,
 },
 user: {
  type: mongoConn.Schema.Types.ObjectId,
  ref: 'User',
  require: true,
 },
 tasks: [{
  type: mongoConn.Schema.Types.ObjectId,
  ref: 'Task',
 }],
 createdAt: {
  type: Date,
  default: Date.now
 }
})


const Project = mongoConn.model('Project', ProjectSchema)

export default Project
import { default as mongoConn } from '../../database/'

const TaskSchema = new mongoConn.Schema({
 title: {
  type: String,
  require: true,
 },
 project: {
  type: mongoConn.Schema.Types.ObjectId,
  ref: 'Project',
  require: true,
 },
 assignedTo: {
  type: mongoConn.Schema.Types.ObjectId,
  ref: 'User',
  require: true,
 },
 completed: {
  type: Boolean,
  required: true,
  default: false,
 },
 createdAt: {
  type: Date,
  default: Date.now
 }
})


const Task = mongoConn.model('Task', TaskSchema)

export default Task
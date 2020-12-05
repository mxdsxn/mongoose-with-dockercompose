import express from 'express'
import { Document } from 'mongoose'

import getToken from '../middleware/getToken'
import Project from '../models/project'
import Task from '../models/task'

const router = express.Router()
router.use(getToken)

const routerPrefix = express.Router()
routerPrefix.use('/projects', router)

router.get('/', async (req, res) => {
 try {
  const projects = await Project.find().populate(['user', 'tasks'])

  return res.status(200).json({ projects })
 } catch (error) {
  return res.status(400).json({ message: 'Erro na tentativa de listar o projeto', error })
 }
})

router.get('/:projectId', async (req, res) => {
 try {
  const { projectId } = req.params
  const project = await Project.findById(projectId).populate(['user', 'tasks'])

  return res.status(200).json({ project })
 } catch (error) {
  return res.status(400).json({ message: 'Erro na tentativa de listar os projetos', error })
 }
})

router.post('/', async (req, res) => {
 try {
  const { userId, title, description, tasks } = req.body

  const newProject = await Project.create({ title, description, user: userId })

  const newTasks = await Promise.all(tasks.map(async (task: any) => {
   const newProjectTask = new Task({ ...task, project: newProject._id, assignedTo: userId })

   return await newProjectTask.save()
  }))
  newProject.set({ tasks: newTasks }).save()

  return res.status(201).json({ newProject })
 } catch (error) {
  return res.status(400).json({ message: 'Erro na tentativa de criar o projeto', error })
 }

})

router.put('/:projectId', async (req, res) => {
 try {
  const { projectId } = req.params
  const { userId, title, description, tasks } = req.body

  const updatedProject = await Project.findByIdAndUpdate(projectId, {
   title,
   description,
  }, { new: true }) as Document

  updatedProject.set({ tasks: [] })
  await Task.deleteMany({ project: updatedProject._id })

  const newTasks = await Promise.all(tasks.map(async (task: any) => {
   const newProjectTask = new Task({ ...task, project: projectId, assignedTo: userId })

   return await newProjectTask.save()
  }))

  updatedProject.set({ tasks: newTasks }).save()

  return res.status(200).json({ updatedProject })
 } catch (error) {
  return res.status(400).json({ message: 'Erro na tentativa de atualizar o projeto', error })
 }
})

router.delete('/:projectId', async (req, res) => {
 try {
  const { projectId } = req.params
  const project = await Project.findByIdAndDelete(projectId).populate('user')

  return res.status(200).json({ message: 'Projeto deletado' })
 } catch (error) {
  return res.status(400).json({ message: 'Erro na tentativa de deletar o projeto', error })
 }
})

export default routerPrefix
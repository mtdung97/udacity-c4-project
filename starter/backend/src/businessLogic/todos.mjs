import { createLogger } from '../utils/logger.mjs'
import * as uuid from 'uuid'
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const logger = createLogger('TodoAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

// write get todos function
export async function getTodosForUser(userId) {
  logger.info('Get todos function called')
  return todosAccess.getAllTodos(userId)
}

// write create todo function
export async function createTodo(newTodo, userId) {
  logger.info('Create todo function called')

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const newItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: s3AttachmentUrl,
    ...newTodo
  }

  return await todosAccess.createTodoItem(newItem)
}

// write update todo function 
export async function updateTodo(userId, todoId, todoUpdate) {
  logger.info('Update todo function called')

  return todosAccess.updateTodoItem(userId, todoId, todoUpdate)
}

// write delete todo function 
export async function deleteTodo(todoId, userId) {
  logger.info('Delete todo function called')

  return todosAccess.deleteTodoItem(todoId, userId)
}

// write generate upload url function 
export async function createAttachmentPresignedUrl(todoId, userId) {
  logger.info('Create attachment function called by used', todoId, userId)

  return attachmentUtils.getUploadUrl(todoId)
}

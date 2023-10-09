import { createLogger } from '../utils/logger.mjs'
import * as uuid from 'uuid'
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const logger = createLogger('TodoAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

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
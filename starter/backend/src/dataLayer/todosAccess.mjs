import AWS from 'aws-sdk'
import AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger.mjs'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodoAccess')

export class TodosAccess {
  constructor() {
    this.docClient = new XAWS.DynamoDB.DocumentClient()
    this.todosTable = process.env.TODOS_TABLE
    this.todosIndex = process.env.TODOS_CREATED_AT_INDEX
  }

  async getAllTodos(userId) {
    logger.info('Get all todos function called')

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todosIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items
  }

  async createTodoItem(todoItem) {
    logger.info('Created todo item function called')

    const result = await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()

    logger.info('Todo item created', result)

    return todoItem
  }

  async updateTodoItem(userId, todoId, todoUpdate) {
    logger.info('Update todo item function called')

    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': todoUpdate.name,
          ':dueDate': todoUpdate.dueDate,
          ':done': todoUpdate.done
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return todoUpdate
  }

  async deleteTodoItem(todoId, userId) {
    logger.info('Delete todo item function called')

    const result = await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        }
      })
      .promise()

    logger.info('Todo item deleted', result)

    return result
  }

  async updateTodoAttachmentUrl(todoId, userId, attachmentUrl) {
    logger.info('Update todo attachment url function called')

    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
  }
}

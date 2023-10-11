import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createAttachmentPresignedUrl } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId = getUserId(event)
    const url = await createAttachmentPresignedUrl(todoId, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        upload: url
      })
    }
  })

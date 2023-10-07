import * as middy from 'middy'
import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs' 

export const handler = middy(async (event) => {
  const newTodo = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const userId = getUserId(event)
  const newItem = await createTodo(newTodo, userId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
})

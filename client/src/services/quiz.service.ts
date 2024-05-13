import { api } from './api'

const start = async (token: string) => {
  const response = await api.post('quizzes/start', token)

  return response.data
}

export const QuizService = {
  start
}

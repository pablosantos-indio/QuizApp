import { api } from './api'

const start = async (token) => {
  const response = await api.post('quizzes/start', { token })

  return response.data
}

const create = async (formData) => {
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}

const update = async (idQuiz, quantityQuestion, questionType) => {
  const updateData = {
    quantityQuestion: quantityQuestion,
    questionType: questionType
  };
  console.log(idQuiz,updateData)

  const response = await api.put(`/upload/${idQuiz}`, updateData);

  return response.data
}

export const QuizService = {
  start,
  create,
  update,
}

import axios from 'axios'

export const api = axios.create({
  //TODO change baseURL to env
  baseURL: 'http://localhost:3001/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

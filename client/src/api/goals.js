import api from './axios'

export const getGoals = (params) => api.get('/goals', { params })
export const getGoalById = (id) => api.get(`/goals/${id}`)
export const createGoal = (data) => api.post('/goals', data)
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data)
export const deleteGoal = (id) => api.delete(`/goals/${id}`)
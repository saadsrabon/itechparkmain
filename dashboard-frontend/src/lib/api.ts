import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.itechpark.co'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth endpoints
export const authApi = {
  login: (payload: { email: string; password: string }) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
}

// Hero endpoints
export const heroApi = {
  getActive: () => api.get('/sections/hero'),
  getAll: () => api.get('/sections/hero/all'),
  create: (payload: any) => api.post('/sections/hero', payload),
  update: (id: string, payload: any) => api.put(`/sections/hero/${id}`, payload),
  remove: (id: string) => api.delete(`/sections/hero/${id}`),
  activate: (id: string) => api.patch(`/sections/hero/${id}/activate`)
}

// Services endpoints
export const servicesApi = {
  getPublicGrouped: () => api.get('/sections/services'),
  getAll: (params?: { section?: string; page?: number; limit?: number }) => api.get('/sections/services/admin/all', { params }),
  getById: (id: string) => api.get(`/sections/services/${id}`),
  create: (formData: FormData) => api.post('/sections/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, formData: FormData) => api.put(`/sections/services/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id: string) => api.delete(`/sections/services/${id}`),
  removeImage: (id: string, imageIndex: number) => api.delete(`/sections/services/${id}/images/${imageIndex}`),
  updateOrder: (id: string, order: number) => api.patch(`/sections/services/${id}/order`, { order })
}

export type Hero = {
  _id: string
  title: string
  description: string
  primaryButton: { text: string; link: string; target: '_blank' | '_self' }
  secondaryButton: { text: string; link: string; target: '_blank' | '_self' }
  videoUrl: string
  isActive: boolean
  order: number
}

export type ServiceImage = { image: string; alt: string; order: number }

export type Service = {
  _id: string
  section: string
  title: string
  content: string
  images: ServiceImage[]
  isActive: boolean
  order: number
  slug?: string
}

// Team endpoints
export type TeamMember = {
  _id: string
  section: string
  name: string
  designation: string
  content?: string
  image: string
  isActive: boolean
  order: number
}

export const teamApi = {
  getAll: (params?: { section?: string; page?: number; limit?: number }) =>
    api.get('/sections/team-members/admin/all', { params }),
  getPublicGrouped: () => api.get('/sections/team-members'),
  getById: (id: string) => api.get(`/sections/team-members/${id}`),
  create: (formData: FormData) =>
    api.post('/sections/team-members', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, formData: FormData) =>
    api.put(`/sections/team-members/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id: string) => api.delete(`/sections/team-members/${id}`),
  updateOrder: (id: string, order: number) => api.patch(`/sections/team-members/${id}/order`, { order })
}

// Blog endpoints
export type Blog = {
  _id: string
  title: string
  content: string
  image: string
  isActive: boolean
  order: number
  slug?: string
}

export const blogApi = {
  getAll: (params?: { page?: number; limit?: number }) => api.get('/sections/blogs/admin/all', { params }),
  getPublic: () => api.get('/sections/blogs'),
  getById: (id: string) => api.get(`/sections/blogs/${id}`),
  create: (formData: FormData) => api.post('/sections/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, formData: FormData) => api.put(`/sections/blogs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id: string) => api.delete(`/sections/blogs/${id}`),
  updateOrder: (id: string, order: number) => api.patch(`/sections/blogs/${id}/order`, { order })
}

// Contact endpoints
export type ContactMessage = {
  _id: string
  name: string
  email: string
  message: string
  status: 'new' | 'read' | 'resolved'
  createdAt: string
}

export const contactApi = {
  submit: (payload: { name: string; email: string; message: string }) => api.post('/sections/contacts', payload),
  getAll: (params?: { page?: number; limit?: number; status?: 'new' | 'read' | 'resolved' }) => api.get('/sections/contacts/admin/all', { params }),
  getById: (id: string) => api.get(`/sections/contacts/${id}`),
  updateStatus: (id: string, status: 'new' | 'read' | 'resolved') => api.patch(`/sections/contacts/${id}/status`, { status }),
  remove: (id: string) => api.delete(`/sections/contacts/${id}`)
}

// Success endpoints
export type SuccessStory = {
  _id: string
  name: string
  designation: string
  description: string
  image: string
  isActive: boolean
  order: number
}

export const successApi = {
  getAll: (params?: { page?: number; limit?: number }) => api.get('/sections/success/admin/all', { params }),
  getPublic: () => api.get('/sections/success'),
  getById: (id: string) => api.get(`/sections/success/${id}`),
  create: (formData: FormData) => api.post('/sections/success', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, formData: FormData) => api.put(`/sections/success/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id: string) => api.delete(`/sections/success/${id}`),
  updateOrder: (id: string, order: number) => api.patch(`/sections/success/${id}/order`, { order })
}

// About endpoints
export type About = {
  _id: string
  title: string
  content: string
  image: string
  isActive: boolean
  order: number
}

export const aboutApi = {
  getAll: (params?: { page?: number; limit?: number }) => api.get('/sections/about/admin/all', { params }),
  getPublic: () => api.get('/sections/about'),
  getById: (id: string) => api.get(`/sections/about/${id}`),
  create: (formData: FormData) => api.post('/sections/about', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, formData: FormData) => api.put(`/sections/about/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id: string) => api.delete(`/sections/about/${id}`),
  updateOrder: (id: string, order: number) => api.patch(`/sections/about/${id}/order`, { order })
}



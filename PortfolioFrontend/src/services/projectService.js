import { apiRequest } from './api.js'

export function getProjects() {
	return apiRequest('/projects')
}

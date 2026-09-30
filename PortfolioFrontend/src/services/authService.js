import { apiRequest } from './api.js'

export function signIn(credentials) {
	return apiRequest('/auth/login', { method: 'POST', body: credentials })
}

export function signOut() {
	return apiRequest('/auth/logout', { method: 'POST' })
}

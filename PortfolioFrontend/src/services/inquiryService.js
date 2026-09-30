import { apiRequest } from './api.js'

export function createInquiry(inquiry) {
	return apiRequest('/inquiries', { method: 'POST', body: inquiry })
}

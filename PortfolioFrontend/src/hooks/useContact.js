import { useState } from 'react'

const initialValues = { name: '', email: '', phone: '', company: '', service: '', message: '' }

export function useContact() {
	const [values, setValues] = useState(initialValues)
	const [errors, setErrors] = useState({})
	const [status, setStatus] = useState('idle')
	const [isSubmitting, setIsSubmitting] = useState(false)

	function updateField(event) {
		const { name, value } = event.target
		setValues((current) => ({ ...current, [name]: value }))
		setErrors((current) => ({ ...current, [name]: '' }))
		setStatus('idle')
	}

	async function submitForm(event) {
		event.preventDefault()
		const nextErrors = {}
		if (!values.name.trim()) nextErrors.name = 'Please enter your name.'
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Enter a valid email address.'
		if (!values.message.trim()) nextErrors.message = 'Tell me a little about your project.'
		setErrors(nextErrors)
		if (Object.keys(nextErrors).length) {
			setStatus('error')
			return
		}

		setIsSubmitting(true)
		setStatus('loading')
		await new Promise((resolve) => requestAnimationFrame(resolve))
		setIsSubmitting(false)
		setStatus('success')
	}

	return { values, errors, status, isSubmitting, updateField, submitForm }
}

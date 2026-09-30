import { useState } from 'react'
import { AuthContext } from './auth-context.js'

export function AuthProvider({ children }) {
	const [auth] = useState({ status: 'unconfigured', user: null })

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

import 'express-session'

declare module 'express-session' {
	interface SessionData {
		isSwagger?: boolean
		isPlatform?: boolean
		user?: any
		tokenExpiry?: number
		_id: string
	}
}

export interface ConfigVariables {
	SESSION_SECRET: string
}

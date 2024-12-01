import 'express-session'

import {Injectable, NestMiddleware} from '@nestjs/common'
import {NextFunction, Request, Response} from 'express'

import {AuthService} from '../auth/auth.service'
import {setResponseHeaders} from '../common/utilities'

@Injectable()
export class SwaggerAuthMiddleware implements NestMiddleware {
	constructor(private readonly authService: AuthService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		try {
			if (res.headersSent) return

			if (req.session.isSwagger && req.session.tokenExpiry) {
				const currentTime = Math.floor(Date.now() / 1000)

				if (currentTime >= req.session.tokenExpiry) {
					const userId = req.session.user._id
					try {
						void this.authService.logout(req, res, userId, 'isSwagger')
					} catch (error) {
						console.error('Error during logout:', error)
						res.status(500).send({error: 'Internal Server Error'})
					}
					return
				}
				return next()
			}

			const authenticated = await this.authenticateRequest(req, res)
			if (!authenticated) return

			next()
		} catch (error) {
			console.error('Error during middleware processing:', error)
			if (!res.headersSent) {
				setResponseHeaders(res, 'Unauthorized')
			}
		}
	}
	private async authenticateRequest(req: Request, res: Response): Promise<boolean> {
		const authorization = req.headers.authorization
		if (!authorization || !authorization.startsWith('Basic ')) {
			setResponseHeaders(res, 'Unauthorized')
			return false
		}

		const base64Credentials = authorization.split(' ')[1]
		const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
		const [email, password] = credentials.split(':')
		const user = await this.authService.findUserByEmail(email)

		if (user && (await this.authService.validateUser(email, password))) {
			req.session.user = user
			req.session.isSwagger = true
			return true
		} else {
			setResponseHeaders(res, 'Unauthorized')
			return false
		}
	}
}

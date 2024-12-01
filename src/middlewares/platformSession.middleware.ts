import {Injectable, NestMiddleware} from '@nestjs/common'
import {NextFunction, Request, Response} from 'express'

import {AuthService} from '../auth/auth.service'

@Injectable()
export class PlatformSessionMiddleware implements NestMiddleware {
	constructor(private readonly authService: AuthService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		if (req.session.isPlatform && req.session.tokenExpiry) {
			const currentTime = Math.floor(Date.now() / 1000)

			if (currentTime >= req.session.tokenExpiry) {
				const userId = req.session.user._id
				try {
					void this.authService.logout(req, res, userId, 'isPlatform')
				} catch (error) {
					console.error('Error during logout:', error)
					res.status(500).send({error: 'Internal Server Error'})
				}
				return
			}
		}
		next()
	}
}

import {Injectable, NestMiddleware} from '@nestjs/common'
import {NextFunction, Request, Response} from 'express'

import {TokenService} from '../token/token.service'
import {UserService} from '../user/user.service'

@Injectable()
export class LastActivityMiddleware implements NestMiddleware {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization
		const token = authHeader?.split(' ')[1]

		if (token) {
			try {
				const userId = this.tokenService.verifyJwtToken(token)
				await this.userService.updateLastActivity(userId)
			} catch (error) {
				console.error('Failed to update last activity:', error)
			}
		}

		next()
	}
}

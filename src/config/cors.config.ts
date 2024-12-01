import * as cors from 'cors'
import {NextFunction, Request, Response} from 'express'

export function setupCors() {
	return (req: Request, res: Response, next: NextFunction) => {
		const origin = req.headers.origin as string
		const allowedAllMethodsOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']
		const allowedPostGetOnlyOrigins = ['http://localhost:3002']

		if (allowedAllMethodsOrigins.includes(origin)) {
			cors({
				origin: origin,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
				credentials: true,
			})(req, res, next)
		} else if (allowedPostGetOnlyOrigins.includes(origin)) {
			cors({
				origin: origin,
				methods: ['POST', 'GET'],
				credentials: true,
			})(req, res, next)
		} else {
			cors({
				origin: false,
			})(req, res, next)
		}
	}
}

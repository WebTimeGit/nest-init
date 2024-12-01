import {Response} from 'express'

export function setResponseHeaders(res: Response, message: string): void {
	res.set('WWW-Authenticate', 'Basic realm="Swagger API"')
	res.status(401).send(message)
}

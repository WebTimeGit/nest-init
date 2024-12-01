import {ConfigService} from '@nestjs/config'
import {NestFactory} from '@nestjs/core'
import {NestExpressApplication} from '@nestjs/platform-express'
import * as session from 'express-session'

import {AppModule} from './app.module'
import {AuthService} from './auth/auth.service'
import {setupCors} from './config/cors.config'
import {setupSwagger} from './config/swagger.config'
import {SwaggerAuthMiddleware} from './middlewares/swaggerAuth.middleware'
import {ConfigVariables} from './common/declare'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	const authService = app.get(AuthService)
	const swaggerAuthMiddleware = new SwaggerAuthMiddleware(authService)
	const configService = app.get<ConfigService<ConfigVariables>>(ConfigService)
	const sessionSecret = configService.get('SESSION_SECRET')

	app.setGlobalPrefix('api')
	app.use(
		session({
			secret: sessionSecret,
			resave: false,
			saveUninitialized: false,
			rolling: true,
			cookie: {
				secure: false,
				maxAge: 60 * 60 * 1000, // 1 hour
			},
		}),
	)

	app.use('/swagger', swaggerAuthMiddleware.use.bind(swaggerAuthMiddleware))
	app.use(setupCors())
	app.set('trust proxy', true)
	setupSwagger(app)

	await app.listen(3001)
}

void bootstrap()

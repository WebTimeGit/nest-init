import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {ServeStaticModule} from '@nestjs/serve-static'
import {join} from 'path'

import {AppController} from './app.controller'
import {AppService} from './app.service'
import {AuthModule} from './auth/auth.module'
import {DatabaseModule} from './database/database.module'
import {LastActivityMiddleware} from './middlewares/lastActivity.middleware'
import {PlatformSessionMiddleware} from './middlewares/platformSession.middleware'
import {TokenModule} from './token/token.module'
import {UserModule} from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({isGlobal: true}),
		AuthModule,
		DatabaseModule,
		TokenModule,
		UserModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'src/media'), // Путь к директории с файлами
			serveRoot: '/src/media', // Путь, по которому файлы будут доступны
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(PlatformSessionMiddleware, LastActivityMiddleware).forRoutes({path: '*', method: RequestMethod.ALL})
	}
}

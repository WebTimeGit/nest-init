import {ConfigModule, ConfigService} from '@nestjs/config'
import {MongooseModule} from '@nestjs/mongoose'

export const MongoDBProvider = MongooseModule.forRootAsync({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => ({
		uri: configService.get<string>('MONGODB_URI'),
	}),
})

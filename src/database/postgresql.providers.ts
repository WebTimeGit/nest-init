import {ConfigModule, ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'

export const PostgreSQLProvider = TypeOrmModule.forRootAsync({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => ({
		type: 'postgres',
		host: configService.get<string>('POSTGRESQL_HOST'),
		port: configService.get<number>('POSTGRESQL_PORT'),
		username: configService.get<string>('POSTGRESQL_USER'),
		password: configService.get<string>('POSTGRESQL_PASS'),
		database: configService.get<string>('POSTGRESQL_DB'),
		entities: [__dirname + '/../**/*.entity{.ts,.js}'],
		synchronize: true,
		logging: false,
	}),
})

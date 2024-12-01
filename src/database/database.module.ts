import {Module} from '@nestjs/common'

// import {MongoDBProvider} from './mongodb.providers'
import {PostgreSQLProvider} from './postgresql.providers'

@Module({
	// imports: [MongoDBProvider, PostgreSQLProvider],
	imports: [PostgreSQLProvider],
	// exports: [MongoDBProvider, PostgreSQLProvider],
	exports: [PostgreSQLProvider],
})
export class DatabaseModule {}

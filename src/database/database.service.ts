import {Injectable, OnModuleInit} from '@nestjs/common'
import {InjectDataSource} from '@nestjs/typeorm'
import {DataSource} from 'typeorm'

@Injectable()
export class DatabaseService implements OnModuleInit {
	constructor(@InjectDataSource() private dataSource: DataSource) {}

	async onModuleInit() {
		try {
			await this.dataSource.initialize()
			console.log('Connected to the database successfully!')
		} catch (err) {
			console.error('Error connecting to the database', err)
		}
	}
}

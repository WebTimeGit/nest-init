import {INestApplication} from '@nestjs/common'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'

export function setupSwagger(app: INestApplication) {
	const options = new DocumentBuilder()
		.setTitle('Simple Project API')
		.setDescription('API for Simple Project application')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('swagger', app, document)
}

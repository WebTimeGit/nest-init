import {ApiProperty} from '@nestjs/swagger'

export class LoginDto {
	@ApiProperty({
		description: 'Email of the user',
		example: 'user@example.com',
	})
	email: string

	@ApiProperty({
		description: 'Password of the user',
		example: 'strongPassword123',
	})
	password: string
}

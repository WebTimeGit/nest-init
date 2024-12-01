import {ApiProperty} from '@nestjs/swagger'
import {IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator'

export class RegisterDto {
	@IsEmail()
	@ApiProperty({
		description: 'Email of the user',
		example: 'user@example.com',
	})
	email: string

	@IsNotEmpty()
	@ApiProperty({
		description: 'Password of the user',
		example: 'strongPassword123',
	})
	password: string

	@IsNotEmpty()
	@ApiProperty({
		description: 'Name of the user',
		example: 'Joi',
	})
	username: string

	@IsOptional()
	@IsString()
	@ApiProperty({
		description: 'Secret key for 2FA, generated if 2FA is enabled',
		example: 'JBSWY3DPEHPK3PXP',
		required: false,
	})
	twoFactorSecret?: string

	@IsBoolean()
	@ApiProperty({
		description: 'Indicates if 2FA is enabled for the user',
		example: false,
		default: false,
	})
	twoFactorEnabled: boolean
}

import {ApiProperty} from '@nestjs/swagger'

export class VerifyOtpDto {
	@ApiProperty({
		description: 'Email of the user',
		example: 'user@example.com',
	})
	email: string

	@ApiProperty({
		description: 'One Time Password (OTP) for two-factor authentication',
		example: '123456',
	})
	otp: string
}

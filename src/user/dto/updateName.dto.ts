import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty, IsString} from 'class-validator'

export class UpdateNameDto {
	@ApiProperty({description: 'New username', example: 'newUsername123'})
	@IsNotEmpty({message: 'Username cannot be empty'})
	@IsString({message: 'Username must be a string'})
	newUsername: string
}

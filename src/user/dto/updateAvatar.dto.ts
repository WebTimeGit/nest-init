import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty, IsString} from 'class-validator'

export class UpdateAvatarDto {
	@ApiProperty({description: 'Avatar file path', example: '/media/avatar/file123.jpg'})
	@IsNotEmpty({message: 'Avatar path cannot be empty'})
	@IsString({message: 'Avatar path must be a string'})
	avatarPath: string
}

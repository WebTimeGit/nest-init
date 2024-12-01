import {
	Body,
	Controller,
	Get,
	HttpStatus,
	NotFoundException,
	Patch,
	Req,
	Res,
	UnauthorizedException,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import {FileInterceptor} from '@nestjs/platform-express'
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'
import {Express, Request, Response} from 'express'
import {diskStorage} from 'multer'
import * as path from 'path'

import {TokenService} from '../token/token.service'
import {UpdateNameDto} from './dto/updateName.dto'
import {UserService} from './user.service'

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
	) {}

	@Get()
	@ApiOperation({summary: 'Get user information from token'})
	@ApiResponse({status: 200, description: 'User information retrieved successfully'})
	@ApiResponse({status: 401, description: 'Unauthorized'})
	async getUserInfo(@Req() req: Request, @Res() res: Response) {
		const authHeader = req.headers.authorization
		const token = authHeader?.split(' ')[1]

		if (!token) {
			return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Unauthorized access'})
		}

		try {
			const user = await this.userService.getUserFromToken(token)
			return res.status(HttpStatus.OK).json({
				status: HttpStatus.OK,
				user,
				message: 'User information retrieved successfully',
			})
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				return res.status(HttpStatus.UNAUTHORIZED).json({
					status: HttpStatus.UNAUTHORIZED,
					message: 'Invalid token',
				})
			} else if (error instanceof NotFoundException) {
				return res.status(HttpStatus.NOT_FOUND).json({
					status: HttpStatus.NOT_FOUND,
					message: 'User not found',
				})
			} else {
				return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					message: 'Internal server error',
				})
			}
		}
	}

	@Patch('update-name')
	@ApiOperation({summary: 'Update user name'})
	@ApiResponse({status: 200, description: 'User name updated successfully'})
	@ApiResponse({status: 400, description: 'Invalid input data'})
	@ApiResponse({status: 404, description: 'User not found'})
	async updateUserName(@Body() updateNameDto: UpdateNameDto, @Req() req: Request, @Res() res: Response) {
		const authHeader = req.headers.authorization
		const token = authHeader?.split(' ')[1]

		if (!token) {
			return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Unauthorized access'})
		}

		const userId = this.tokenService.verifyJwtToken(token)

		const {newUsername} = updateNameDto

		if (!newUsername || newUsername.trim() === '') {
			return res.status(HttpStatus.BAD_REQUEST).json({message: 'Username cannot be empty'})
		}

		try {
			await this.userService.updateUserName(userId, newUsername.trim())
			return res.status(HttpStatus.OK).json({message: 'User name updated successfully'})
		} catch (error) {
			if (error instanceof NotFoundException) {
				return res.status(HttpStatus.NOT_FOUND).json({message: 'User not found'})
			}
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Failed to update user name'})
		}
	}

	@Patch('update-avatar')
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './src/media/avatar',
				filename: (req, file, callback) => {
					const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
					const ext = path.extname(file.originalname)
					const filename = `${file.fieldname}-${uniqueSuffix}${ext}`
					callback(null, filename)
				},
			}),
		}),
	)
	@ApiOperation({summary: 'Update user avatar'})
	@ApiResponse({status: 200, description: 'Avatar updated successfully'})
	async updateAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response) {
		const authHeader = req.headers.authorization
		const token = authHeader?.split(' ')[1]

		if (!file) {
			return res.status(HttpStatus.BAD_REQUEST).json({message: 'No file uploaded'})
		}
		if (!token) {
			throw new UnauthorizedException('No token provided')
		}

		const userId = this.tokenService.verifyJwtToken(token)

		try {
			const filePath = `/src/media/avatar/${file.filename}`
			await this.userService.updateProfileImage(userId, filePath)
			return res.status(HttpStatus.OK).json({message: 'Profile image updated successfully'})
		} catch (error) {
			if (error instanceof NotFoundException) {
				return res.status(HttpStatus.NOT_FOUND).json({message: error.message})
			}
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Internal server error'})
		}
	}
}

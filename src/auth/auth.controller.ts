import {Body, Controller, HttpStatus, Param, Post, Req, Res} from '@nestjs/common'
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger'
import {Request, Response} from 'express'
import * as qrcode from 'qrcode'
import {otpauthURL, totp} from 'speakeasy'

import {TokenService} from '../token/token.service'
import {AuthService} from './auth.service'
import {LoginDto} from './dto/login.dto'
import {RegisterDto} from './dto/register.dto'
import {VerifyOtpDto} from './dto/verifyOtp.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenService: TokenService,
	) {}

	@Post('register')
	@ApiOperation({summary: 'Register a new user'})
	@ApiResponse({status: 201, description: 'User successfully registered'})
	async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
		try {
			const user = await this.authService.register(registerDto)
			const token = this.tokenService.generateJwtToken(user.id)
			return res.status(HttpStatus.CREATED).json({
				status: HttpStatus.CREATED,
				token,
				message: 'User registered successfully',
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					role: user.role,
				},
			})
		} catch (error) {
			if (error.code === '23505') {
				// Ошибка уникальности для PostgreSQL
				return res.status(HttpStatus.BAD_REQUEST).json({
					status: HttpStatus.BAD_REQUEST,
					message: 'User with this email already exists',
				})
			} else {
				console.error('Error during registration:', error)
				return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					message: 'Internal server error',
				})
			}
		}
	}

	@Post('login')
	@ApiOperation({summary: 'Log in user and return 2FA setup if enabled'})
	async login(@Body() body: LoginDto, @Res() res: Response) {
		const {email, password} = body

		try {
			const user = await this.authService.findUserByEmail(email)
			if (user && (await this.authService.validateUser(email, password))) {
				if (user.twoFactorEnabled && user.twoFactorSecret) {
					const twoFactorSecret = this.tokenService.decryptTwoFactorSecret(user.twoFactorSecret)
					const otpauthUrl = otpauthURL({
						secret: Buffer.from(twoFactorSecret).toString('base64'),
						label: encodeURIComponent(email),
						issuer: 'duelStats',
						encoding: 'base64',
					})

					const qrCodeUrl = await qrcode.toDataURL(otpauthUrl)
					return res.json({
						twoFactorEnabled: user.twoFactorEnabled,
						qrCodeUrl,
						message: 'Please scan the QR code to setup 2FA.',
					})
				} else {
					const token = this.tokenService.generateJwtToken(user.id)
					res.cookie('token', token, {maxAge: 900000 * 1000, httpOnly: true})
					return res.json({
						status: HttpStatus.OK,
						token,
						message: 'Login successful',
						user: {
							id: user.id,
							username: user.username,
							email: user.email,
							role: user.role,
						},
					})
				}
			} else {
				return res.status(HttpStatus.UNAUTHORIZED).json({
					status: HttpStatus.UNAUTHORIZED,
					message: 'Incorrect email or password',
				})
			}
		} catch (error) {
			console.error('Error during login:', error)
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal server error',
			})
		}
	}

	@Post('verify-otp')
	@ApiOperation({summary: 'Verify the 2FA code for user authentication'})
	async verifyOtp(@Body() body: VerifyOtpDto, @Req() req: Request, @Res() res: Response) {
		const {email, otp} = body

		try {
			const user = await this.authService.findUserByEmail(email)
			if (!user) {
				return res.status(HttpStatus.NOT_FOUND).json({status: HttpStatus.NOT_FOUND, message: 'User not found'})
			}

			const twoFactorSecret = this.tokenService.decryptTwoFactorSecret(user.twoFactorSecret)
			const verified = totp.verify({
				secret: Buffer.from(twoFactorSecret).toString('base64'),
				encoding: 'base64',
				token: otp,
			})

			if (verified) {
				const token = this.tokenService.generateJwtToken(user.id)
				res.cookie('token', token, {maxAge: 900000 * 1000, httpOnly: true})
				return res.json({
					status: HttpStatus.OK,
					message: 'OTP verified successfully',
					token,
					user: {
						id: user.id,
						username: user.username,
						email: user.email,
						role: user.role,
					},
				})
			} else {
				return res.status(HttpStatus.BAD_REQUEST).json({status: HttpStatus.BAD_REQUEST, message: 'Invalid OTP'})
			}
		} catch (error) {
			console.error('Error during OTP verification:', error)
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal server error',
			})
		}
	}

	@Post(':userId/enable-2fa')
	@ApiOperation({summary: 'Enable two-factor authentication for a user'})
	@ApiResponse({status: 200, description: '2FA enabled successfully'})
	async enableTwoFactorAuth(@Param('userId') userId: string, @Res() res: Response) {
		try {
			const otpauthUrl = await this.authService.generateTwoFactorSecret(userId)
			const qrCodeUrl = await qrcode.toDataURL(otpauthUrl)

			return res.json({
				status: HttpStatus.OK,
				message: 'Scan the QR code to set up 2FA.',
				qrCodeUrl,
			})
		} catch (error) {
			console.error('Error enabling 2FA:', error)
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Failed to enable 2FA',
			})
		}
	}

	@Post('logout')
	@ApiOperation({summary: 'Log out the user and clear session data'})
	async logout(@Body('id') id: string, @Req() req: Request, @Res() res: Response) {
		try {
			await this.authService.logout(req, res, id, 'isPlatform')
			return res.status(HttpStatus.OK).json({message: 'Successfully logged out'})
		} catch (error) {
			console.error('Error during logout:', error)
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal server error',
			})
		}
	}
}

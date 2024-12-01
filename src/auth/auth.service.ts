import {ConflictException, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import {Request, Response} from 'express'
import * as speakeasy from 'speakeasy'
import {Repository} from 'typeorm'

import {User} from '../user/entities/user.entity'
import {RegisterDto} from './dto/register.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private adminRepository: Repository<User>,
	) {}

	async findUserByEmail(email: string): Promise<User | null> {
		return this.adminRepository.findOne({where: {email}})
	}

	async validateUser(email: string, password: string): Promise<boolean> {
		const user = await this.findUserByEmail(email)
		if (!user) return false
		return bcrypt.compareSync(password, user.password)
	}

	async register(registerDto: RegisterDto): Promise<User> {
		const {email, password, username} = registerDto

		const existingUser = await this.adminRepository.findOne({where: {email}})
		if (existingUser) {
			throw new ConflictException('User with this email already exists')
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const newUser = this.adminRepository.create({
			email,
			password: hashedPassword,
			username,
			twoFactorEnabled: false,
		})
		return this.adminRepository.save(newUser)
	}

	async generateTwoFactorSecret(userId: string): Promise<string> {
		const secret = speakeasy.generateSecret({
			name: `MyApp (${userId})`,
		})

		await this.adminRepository.update(userId, {twoFactorSecret: secret.base32, twoFactorEnabled: true})

		return secret.otpauth_url
	}

	async verifyTwoFactorCode(userId: number, code: string): Promise<boolean> {
		const user = await this.adminRepository.findOne({where: {id: userId}})
		if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) return false

		return speakeasy.totp.verify({
			secret: user.twoFactorSecret,
			encoding: 'base32',
			token: code,
		})
	}

	async logout(req: Request, res: Response, userId: string, typeSession: string) {
		res.clearCookie('token')

		if (typeSession === 'isSwagger') {
			req.session.destroy(() => {
				res.status(401).send({message: 'Session expired, please log in again'})
			})
		} else {
			req.session.destroy(() => {
				res.status(200).send({message: 'Successfully logged out', redirect: '/login'})
			})
		}
	}
}

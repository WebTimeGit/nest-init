import {Injectable, NotFoundException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

import {TokenService} from '../token/token.service'
import {User} from './entities/user.entity'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly tokenService: TokenService,
	) {}

	async getUserFromToken(token: string): Promise<Partial<User>> {
		const userId = this.tokenService.verifyJwtToken(token)
		const user = await this.userRepository.findOne({where: {id: userId}})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return {
			id: user.id,
			email: user.email,
			username: user.username,
			role: user.role,
			registrationTime: user.registrationTime,
			lastActivity: user.lastActivity,
			profileImageUrl: user.profileImageUrl,
		}
	}

	async updateUserName(userId: number, newUsername: string): Promise<void> {
		const user = await this.userRepository.findOne({where: {id: userId}})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		user.username = newUsername
		await this.userRepository.save(user)
	}

	async updateProfileImage(userId: number, profileImageUrl: string): Promise<void> {
		const user = await this.userRepository.findOne({where: {id: userId}})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		user.profileImageUrl = profileImageUrl
		await this.userRepository.save(user)
	}

	async updateLastActivity(userId: number): Promise<void> {
		await this.userRepository.update(userId, {lastActivity: new Date()})
	}
}

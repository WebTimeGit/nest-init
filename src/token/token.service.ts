import {Injectable, UnauthorizedException} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class TokenService {
	constructor(private readonly configService: ConfigService) {}

	generateJwtToken(userId: number): string {
		const jwtSecret = this.configService.get<string>('JWT_SECRET')
		const expiresIn = '30d'
		return jwt.sign({id: userId}, jwtSecret, {expiresIn})
	}

	decodeJwtToken(token: string): any {
		return jwt.decode(token)
	}

	// Оставляем этот метод публичным
	verifyJwtToken(token: string): number {
		const jwtSecret = this.configService.get<string>('JWT_SECRET')
		try {
			const payload = jwt.verify(token, jwtSecret) as {id: number}
			return payload.id // возвращаем userId из токена
		} catch (error) {
			throw new UnauthorizedException('Invalid or expired token')
		}
	}

	decryptTwoFactorSecret(encryptedSecret: string): string {
		const secretKey = this.configService.get<string>('ENCRYPTION_KEY')
		if (!encryptedSecret || !secretKey) {
			throw new Error('Invalid arguments provided to decryptTwoFactorSecret')
		}

		const [iv, encrypted] = encryptedSecret.split(':')

		if (!iv || !encrypted) {
			throw new Error('Invalid encryptedSecret format')
		}

		const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'))
		let decrypted = decipher.update(encrypted, 'hex', 'utf8')
		decrypted += decipher.final('utf8')
		return decrypted
	}
}

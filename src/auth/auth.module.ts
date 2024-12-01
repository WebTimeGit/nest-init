import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'

import {TokenModule} from '../token/token.module'
import {TokenService} from '../token/token.service'
import {User} from '../user/entities/user.entity'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'

@Module({
	imports: [TypeOrmModule.forFeature([User]), ConfigModule, TokenModule],
	controllers: [AuthController],
	providers: [AuthService, TokenService],
	exports: [AuthService],
})
export class AuthModule {}

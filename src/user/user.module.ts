import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import {TokenService} from '../token/token.service'
import {User} from './entities/user.entity'
import {UserController} from './user.controller'
import {UserService} from './user.service'

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UserController],
	providers: [UserService, TokenService],
	exports: [UserService],
})
export class UserModule {}

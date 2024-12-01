import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity('user')
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column({unique: true})
	username: string

	@Column({unique: true})
	email: string

	@Column()
	password: string

	@Column({default: 'user'})
	role: string

	@Column({nullable: true})
	twoFactorSecret?: string

	@Column({default: false})
	twoFactorEnabled: boolean

	@CreateDateColumn({type: 'timestamp'})
	registrationTime: Date

	@Column({type: 'timestamp', nullable: true})
	lastActivity: Date

	@Column({nullable: true})
	profileImageUrl?: string
}

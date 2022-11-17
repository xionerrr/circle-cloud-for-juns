import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'

import { UserCreateDto } from './dto'
import { T_User } from './models'

import { User } from 'src/entities/user.entity'
import { I_GetData } from 'src/models/app.model'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async getUsers(): Promise<I_GetData<{ users: T_User[]; count: number }>> {
    const usersCount = await this.repository.count()
    const users = await this.repository.find({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })

    return {
      message: 'Successfully retrieved all users',
      data: {
        users,
        count: usersCount,
      },
      timestamp: new Date(),
    }
  }

  async getUser(userId: number): Promise<I_GetData<{ user: T_User }>> {
    const user = await this.findOneBy(userId)

    if (!user) throw new NotFoundException(`User with id: ${userId} not found`)

    return {
      message: 'Successfully retrieved user',
      data: {
        user,
      },
      timestamp: new Date(),
    }
  }

  async createUser(body: UserCreateDto): Promise<I_GetData<{ user: T_User }>> {
    const user = await this.create(body)

    return {
      message: 'Successfully created user',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      timestamp: new Date(),
    }
  }

  async findOneBy(userId: number): Promise<T_User> {
    return await this.repository.findOneBy({
      id: userId,
    })
  }

  async create(body: UserCreateDto): Promise<User> {
    const { password, ...data } = body
    const hashedPassword = await argon2.hash(password)

    return await this.repository.save({ password: hashedPassword, ...data })
  }
}

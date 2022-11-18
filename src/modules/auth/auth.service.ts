import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'

import { SignInDto, SignUpDto } from './dto'
import { TokensService } from './tokens.service'
import { I_Auth } from './models'

import { User } from 'src/entities/user.entity'
import { E_ServerStatus, I_GetData } from 'src/models/app.model'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private readonly tokensService: TokensService,
  ) {}

  async signUp(body: SignUpDto): Promise<I_GetData<I_Auth>> {
    const user = await this.repository.findOneBy({
      email: body.email,
    })

    if (user)
      throw new ForbiddenException(
        `User with email ${body.email} already exists`,
      )

    const hashedPassword = await argon2.hash(body.password)

    try {
      const user = await this.repository.save({
        ...body,
        password: hashedPassword,
      })

      const tokens = await this.tokensService.getTokens(user.id, user.email)
      await this.tokensService.updateRefreshToken(user.id, tokens.refreshToken)

      return {
        message: 'Successfully signed up',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          active: user.active,
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.detail,
          status: E_ServerStatus.FORBIDDEN,
        },
      })
    }
  }

  async signIn(body: SignInDto): Promise<I_GetData<I_Auth>> {
    const user = await this.repository.findOneBy({
      email: body.email,
    })

    if (!user)
      throw new ForbiddenException(`User with email ${body.email} not found`)

    const passwordMatches = await argon2.verify(user.password, body.password)

    if (!passwordMatches) throw new ForbiddenException('Incorrect password')

    try {
      const tokens = await this.tokensService.getTokens(user.id, user.email)
      await this.tokensService.updateRefreshToken(user.id, tokens.refreshToken)

      return {
        message: 'Successfully signed in',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          active: user.active,
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.detail,
          status: E_ServerStatus.FORBIDDEN,
        },
      })
    }
  }
}

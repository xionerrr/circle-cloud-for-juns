import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'

import { RefreshDto, SignInDto, SignUpDto } from './dtos'
import { TokensService } from './tokens.service'
import { I_Auth, T_AuthRefresh } from './models'

import { I_GetData } from 'src/models'
import { User } from 'src/entities'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private readonly tokensService: TokensService,
  ) {}

  async signUp(body: SignUpDto): Promise<I_GetData<I_Auth>> {
    const user = await this.repository.findOne({
      where: {
        email: body.email,
      },
      relations: ['avatar'],
      select: {
        avatar: {
          url: true,
          fileName: true,
          mimetype: true,
        },
      },
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
          role: user.role,
          avatar: user.avatar,
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }

  async signIn(body: SignInDto): Promise<I_GetData<I_Auth>> {
    const user = await this.repository.findOne({
      where: {
        email: body.email,
      },
      relations: ['avatar'],
      select: {
        avatar: {
          url: true,
          fileName: true,
          mimetype: true,
        },
      },
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
          role: user.role,
          avatar: user.avatar,
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }

  async refreshTokens(
    userId: number,
    body: RefreshDto,
  ): Promise<I_GetData<T_AuthRefresh>> {
    const user = await this.repository.findOneBy({
      id: userId,
    })

    if (!user) throw new NotFoundException('Error')

    const tokenMatches = await argon2.verify(user.hashedRt, body.refreshToken)

    if (!tokenMatches) throw new ForbiddenException('Token does not match')

    try {
      const tokens = await this.tokensService.getTokens(user.id, user.email)
      await this.tokensService.updateRefreshToken(user.id, user.email)

      return {
        message: 'Tokens updated successfully',
        data: {
          ...tokens,
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }
}

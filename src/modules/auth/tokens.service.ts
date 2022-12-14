import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'

import { T_Tokens } from 'src/models'
import { User } from 'src/entities'

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getTokens(userId: number, email: string): Promise<T_Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
          expiresIn: 60 * 60 * 24 * 14,
        },
      ),
    ])

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hash = await argon2.hash(refreshToken)

    try {
      const prevData = await this.repository.findOneBy({
        id: userId,
      })

      await this.repository.save({
        ...prevData,
        hashedRt: hash,
      })
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

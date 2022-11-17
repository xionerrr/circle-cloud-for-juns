import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        host: configService.get<string>('SQLITE_HOST'),
        port: configService.get<string>('SQLITE_PORT'),
        username: configService.get<string>('SQLITE_USER'),
        password: configService.get<string>('SQLITE_PASSWORD'),
        database: configService.get<string>('DB'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

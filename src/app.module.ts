import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { AuthModule, DatabaseModule, TasksModule, UsersModule } from './modules'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
    AuthModule,
    DatabaseModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}

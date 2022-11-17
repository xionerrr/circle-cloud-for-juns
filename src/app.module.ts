import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { AuthModule, DatabaseModule, TasksModule } from './modules'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
    AuthModule,
    DatabaseModule,
    TasksModule,
  ],
})
export class AppModule {}

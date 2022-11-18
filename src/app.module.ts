import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule, DatabaseModule, TasksModule, UsersModule } from './modules'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatabaseModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}

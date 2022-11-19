import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AuthModule,
  DatabaseModule,
  InfoModule,
  TasksModule,
  UsersModule,
} from './modules'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatabaseModule,
    TasksModule,
    UsersModule,
    InfoModule,
  ],
})
export class AppModule {}

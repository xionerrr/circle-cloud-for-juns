import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AuthModule,
  DatabaseModule,
  InfoModule,
  TasksModule,
  UploadModule,
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
    UploadModule,
  ],
})
export class AppModule {}

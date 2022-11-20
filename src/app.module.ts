import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    AuthModule,
    DatabaseModule,
    TasksModule,
    UsersModule,
    InfoModule,
    UploadModule,
  ],
})
export class AppModule {}

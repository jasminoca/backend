/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LessonsModule } from './lessons/lessons.module';
import { VideosModule } from './videos/videos.module';
import { AdminModule } from './admin/admin.module';
import { ScoresModule } from './scores/scores.module'; // Import the ScoresModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '121202',
      database: process.env.DB_NAME || 'db_mathhew',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Automatically loads all entity files
      synchronize: process.env.NODE_ENV !== 'production', // Synchronize schema only in development
    }),
    UsersModule,
    AuthModule,
    LessonsModule,
    VideosModule,
    AdminModule,
    ScoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

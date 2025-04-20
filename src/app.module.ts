/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Custom Modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { LessonsModule } from './lessons/lessons.module';
import { ScoresModule } from './scores/scores.module';
import { VideosModule } from './videos/videos.module';

// JWT
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

// Firebase Admin
import * as admin from 'firebase-admin';
import * as serviceAccount from '../firebase-service-account.json'; //

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '7d' },
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    LessonsModule,
    ScoresModule,
    VideosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    // ✅ Initialize Firebase Admin SDK once
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    }
  }
}

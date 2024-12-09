/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables globally
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'defaultSecret'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '2h') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthGuard], // Add AuthGuard to providers
  controllers: [AuthController],
  exports: [AuthService, JwtModule], // Export AuthService and JwtModule
})
export class AuthModule {}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [UsersModule, JwtModule.register({})], 
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

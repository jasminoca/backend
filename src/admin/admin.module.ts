/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])], // Include AuthModule
  controllers: [AdminController],
  providers: [AdminService],

})
export class AdminModule {}

// admin.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule
import { AdminController } from './admin.controller';

@Module({
  imports: [AuthModule], // Include AuthModule
  controllers: [AdminController],
})
export class AdminModule {}

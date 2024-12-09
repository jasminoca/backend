/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  @Get('dashboard')
  @Roles('admin') // Only allow admin role
  getDashboard() {
    return {
      message: 'Welcome to the Admin Dashboard!',
      features: [
        'Manage Users',
        'Manage Quizzes',
        'Manage Lessons',
        'View Leaderboard',
      ],
    };
  }
}

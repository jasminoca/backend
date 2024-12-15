/* eslint-disable prettier/prettier */
import { Controller, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { AdminService } from './admin.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Admin Dashboard
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

  // Fetch all users
  @Get('users')
  @Roles('admin')
  getAllUsers() {
    return this.adminService.findAll();
  }

  // Update a user by ID
  @Put('users/:id')
  @Roles('admin')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.update(id, updateUserDto);
  }

  // Delete a user by ID
  @Delete('users/:id')
  @Roles('admin')
  deleteUser(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}

/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, Get, Patch, Query, NotFoundException, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  authService: any;
  constructor(private readonly usersService: UsersService) {}

  @Post('register') // Endpoint: /users/register
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @Get() // Endpoint: /users
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('check-existence')
  async checkExistence(
    @Query('username') username: string,
    @Query('email') email: string,
    @Query('school_id') school_id: string,
  ) {
    return this.usersService.checkUserExistence(username, email, school_id);
  }

  @Get('filter') // New Endpoint: /users/filter?role=student
  async getUsersByRole(@Query('role') role: string): Promise<User[]> {
    if (!role) {
      throw new NotFoundException('Role query parameter is required');
    }
    const users = await this.usersService.findUsersByRole(role);
    if (!users || users.length === 0) {
      throw new NotFoundException(`No users found with role: ${role}`);
    }
    return users;
  }

  @Get(':id') // Endpoint: /users/:id
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  @Patch(':id')
async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  const numericId = parseInt(id, 10); // Convert string to number
  if (isNaN(numericId)) {
    throw new BadRequestException("Invalid user ID format"); // Handle invalid ID
  }

  return this.usersService.updateUser(numericId, updateUserDto); // Pass number
}

}

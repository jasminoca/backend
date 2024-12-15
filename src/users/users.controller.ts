/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, Get, Patch, NotFoundException, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from './user.entity';

@Controller('users') // Handles user-related operations
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register') // Endpoint: /users/register
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @Get() // Endpoint: /users
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
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
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }
}
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from './user.entity';

@Controller('users') // Handles user-related operations
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register') // Endpoint: /users/register
  async registerUser(@Body() createUserDto: CreateUserDto) {
    console.log('Received DTO:', createUserDto); // Log the incoming data
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
}

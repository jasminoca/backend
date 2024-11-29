import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  // Get a single user by their ID
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }
}

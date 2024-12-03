/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, Get, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from './user.entity';
import { SignInDto } from '../dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    console.log('Received DTO:', createUserDto); // Log the incoming data
    return this.usersService.registerUser(createUserDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.findByEmail(email);
  
    if (!user || !(await this.usersService.validatePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const payload = { id: user.id, username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);
  
    return { user, token };
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

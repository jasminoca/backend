/* eslint-disable prettier/prettier */

import { Controller, Post, Body, BadRequestException, UnauthorizedException, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    const { email, school_id, password } = signInDto;

    if ((!email && !school_id) || !password) {
      throw new BadRequestException('Email or School ID and password are required');
    }

    const identifier = email ?? school_id;
    const user = await this.authService.validateUser(identifier ?? '', password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenResponse = await this.authService.login(user);

    return {
      user: {
        id: user.id,
        full_name: user.full_name, 
        email: user.email,
        role: user.role,
        school_id: user.school_id,
      },
      ...tokenResponse,
    };
  }
}

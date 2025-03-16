/* eslint-disable prettier/prettier */
import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // Endpoint: /auth/login
  async login(@Body() signInDto: SignInDto) {
    const { email, school_id, password } = signInDto;

    // Ensure either email or school ID is provided
    if ((!email && !school_id) || !password) {
      throw new BadRequestException('Email or School ID and password are required');
    }

    const identifier: string = email ?? school_id ?? ''; // Ensures identifier is always a string

    // Validate user with either email or school_id
    const user = await this.authService.validateUser(identifier, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email, school ID, or password');
    }

    // Generate token and return response
    const tokenResponse = await this.authService.login(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        school_id: user.school_id, // Ensure school_id is included
        role: user.role,
      },
      access_token: tokenResponse.access_token, // Explicitly return the token here
    };
  }
}

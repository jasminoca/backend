/* eslint-disable prettier/prettier */
import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/sign-in.dto';
import jwtDecode from "jwt-decode";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // Endpoint: /auth/login
  async login(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;

    // Check if both email and password are provided
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate token and include in response
    const tokenResponse = await this.authService.login(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      access_token: tokenResponse.access_token, // Explicitly return the token here
    };


  }
}

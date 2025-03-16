/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<any> {
    // Find user by email or school_id
    const user = await this.usersService.findByEmailOrSchoolId(identifier);

    if (!user) {
      console.warn(`Login failed: User not found for ${identifier}`);
      throw new UnauthorizedException('Invalid email, school ID, or password');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      console.warn(`Login failed: Incorrect password for ${identifier}`);
      throw new UnauthorizedException('Invalid email, school ID, or password');
    }

    const { password, ...userData } = user;
    return userData;
  }

  async login(user: any) {
    const payload = { id: user.id, username: user.username, role: user.role };
    console.log('JWT Payload:', payload); // Debug payload

    const token = this.jwtService.sign(payload);
    console.log('Generated Token:', token); // Debug token

    return {
      access_token: token, // Ensure the token is returned in this format
      user: { 
        id: user.id,
        username: user.username,
        email: user.email,
        school_id: user.school_id, // Include school_id in response
        role: user.role,
      },
    };
  }
}

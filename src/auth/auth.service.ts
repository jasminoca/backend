/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
  
    if (!user) {
      console.log('User not found for email:', email);
      return null;
    }
  
    console.log('Retrieved user:', user);
  
    const isPasswordValid = await this.usersService.validatePassword(password, user.password);
  
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return null;
    }
  
    return user;
  }
  
  
  async login(user: any) {
    const payload = { id: user.id, username: user.username, role: user.role };
    console.log('JWT Payload:', payload); // Debug payload
    const token = this.jwtService.sign(payload);
    console.log('Generated Token:', token); // Debug token
    return {
      access_token: token, // Ensure the token is returned in this format
      user: { // Include user details in the response
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
  
  
}

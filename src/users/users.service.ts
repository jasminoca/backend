// src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Renamed to registerUser
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    // Ensure password exists in DTO
    if (!createUserDto.password) {
      throw new Error('Password is required');
    }
  
    // Check if the email already exists
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
    // Create the user object using the DTO
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword, // Store the hashed password
    });
  
    // Save the user to the database and return the created user
    return this.userRepository.save(user);
  }
  
// Get all users
async getAllUsers(): Promise<User[]> {
  return this.userRepository.find();
}

// Get a user by their ID
async getUserById(id: number): Promise<User> {
  const user = await this.userRepository.findOne({ where: { user_id: id } });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

}

/* eslint-disable prettier/prettier */
import {Injectable,NotFoundException,UnauthorizedException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    // Ensure password exists in DTO
    if (!createUserDto.password) {
      throw new Error('Password is required');
    }

    // Check if the email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
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
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Find a user by their email
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user || undefined; // Explicitly return undefined if user is null
  }
  

  // Validate the user's password
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    if (!password || !hashedPassword) {
      throw new Error('Password or hashed password is missing');
    }
    return await bcrypt.compare(password, hashedPassword);
  }
  


  // Sign in user
  async signIn(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const isPasswordValid = await this.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const payload = { id: user.id, username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);
  
    return { user, token };
  }
}

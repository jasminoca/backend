/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Fetch all users
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Update user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: +id } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  // Delete user by ID
  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`User with ID ${id} not found`);
  }
}

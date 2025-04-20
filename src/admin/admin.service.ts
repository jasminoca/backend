/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.usersService.remove(id);
  }

}

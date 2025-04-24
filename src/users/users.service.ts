/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from './user.entity';
import { db } from '../firebase'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private usersCollection = db.collection('users');

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUserRef = this.usersCollection.doc();

    const hashedPassword = await bcrypt.hash(createUserDto.password || '', 10);

    const newUser: User = {
      ...createUserDto,
      password: hashedPassword,
      id: newUserRef.id,
    };

    await newUserRef.set(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.usersCollection.get();
    return snapshot.docs.map(doc => doc.data() as User);
  }

  async findOne(id: string): Promise<User> {
    const userDoc = await this.usersCollection.doc(id).get();
    if (!userDoc.exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return userDoc.data() as User;
  }

  async findByEmailUsernameOrSchoolId(identifier: string): Promise<User | null> {
    const queries = [
      this.usersCollection.where('email', '==', identifier).get(),
      this.usersCollection.where('username', '==', identifier).get(),
      this.usersCollection.where('school_id', '==', identifier).get(),
    ];

    const [emailSnap, usernameSnap, schoolSnap] = await Promise.all(queries);

    if (!emailSnap.empty) return emailSnap.docs[0].data() as User;
    if (!usernameSnap.empty) return usernameSnap.docs[0].data() as User;
    if (!schoolSnap.empty) return schoolSnap.docs[0].data() as User;

    return null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userRef = this.usersCollection.doc(id);
    await userRef.update({ ...updateUserDto });
    const updatedUser = await userRef.get();
    return updatedUser.data() as User;
  }

  async remove(id: string): Promise<void> {
    await this.usersCollection.doc(id).delete();
  }
}

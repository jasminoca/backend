// src/users/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id?: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true }) // Email must be unique
  email: string;

  @Column()
  user_type: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  role: string;

  @CreateDateColumn() // Automatically sets the creation date
  created_at?: Date;

  @UpdateDateColumn() // Automatically updates the date on each update
  updated_at?: Date;

  // If you don't want default values, this constructor can help with the initialization
  constructor(
    username: string,
    password: string,
    email: string,
    user_type: string,
    first_name: string,
    last_name: string,
    role: string
  ) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.user_type = user_type;
    this.first_name = first_name;
    this.last_name = last_name;
    this.role = role;
  }
}

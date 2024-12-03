/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string; // Ensures username is provided and not empty

  @IsString()
  @IsNotEmpty()
  password!: string; // Ensures password is provided and not empty

  @IsEmail()
  @IsNotEmpty()
  email!: string; // Ensures a valid email format is provided

  @IsString()
  @IsNotEmpty()
  user_type!: string; // Ensures user_type is provided (e.g., "student", "teacher")

  @IsString()
  @IsNotEmpty()
  first_name!: string; // Ensures first_name is provided and not empty

  @IsString()
  @IsNotEmpty()
  last_name!: string; // Ensures last_name is provided and not empty

  @IsString()
  @IsNotEmpty()
  role!: string; // Ensures role is provided (e.g., "admin", "student")
  
  @IsString()
  @IsNotEmpty()
  school_id!: string;
}

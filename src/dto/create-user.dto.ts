/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string; 
  @IsString()
  @IsNotEmpty()
  password!: string; 
  @IsEmail()
  @IsNotEmpty()
  email!: string; 

  @IsString()
  @IsNotEmpty()
  user_type!: string; 

  @IsString()
  @IsNotEmpty()
  first_name!: string; 

  @IsString()
  @IsNotEmpty()
  last_name!: string; 

  @IsString()
  @IsNotEmpty()
  role!: string; 
  
  @IsString()
  @IsNotEmpty()
  school_id!: string;
}

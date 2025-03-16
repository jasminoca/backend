/* eslint-disable prettier/prettier */
import { IsNotEmpty, ValidateIf, IsEmail } from 'class-validator';

export class SignInDto {
  @ValidateIf((o) => !o.school_id) // Only validate email if school_id is not provided
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ValidateIf((o) => !o.email) // Only validate school_id if email is not provided
  @IsNotEmpty({ message: 'School ID is required if email is not provided' })
  school_id?: string;

  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}

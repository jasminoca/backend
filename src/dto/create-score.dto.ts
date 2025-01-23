/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateScoreDto {
  @IsString()
  @IsNotEmpty()
  school_id!: string;

  @IsInt()
  @IsPositive()
  lesson_id!: number;

  @IsInt()
  @IsPositive()
  score!: number;
}

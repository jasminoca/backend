/* eslint-disable prettier/prettier */
import { IsString, IsArray, ArrayMinSize } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  question!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  choices!: string[];

  @IsString()
  correctAnswer!: string;
}

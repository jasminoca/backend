/* eslint-disable prettier/prettier */
import { IsString, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  video_url?: string;
}

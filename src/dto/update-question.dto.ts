/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto'; // 👈 make sure this file exists

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from './lesson.entity';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule
import { KeyPoint } from './keypoint.entity';
import { Question } from './question.entity';
import { ScoresModule } from '../scores/scores.module';
import { Score } from '../scores/scores.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, KeyPoint, Question, Score]),
    AuthModule, ScoresModule // Add AuthModule here
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}

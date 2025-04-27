/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { ScoresService } from '../scores/scores.service';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService, ScoresService],
  exports: [LessonsService],
})
export class LessonsModule {}

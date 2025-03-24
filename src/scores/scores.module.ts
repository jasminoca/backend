/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { Score } from './scores.entity';
import { Lesson } from '../lessons/lesson.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Score, Lesson])],
  controllers: [ScoresController],
  providers: [ScoresService],
  exports: [ScoresService],

})
export class ScoresModule {}

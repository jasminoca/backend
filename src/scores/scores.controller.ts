/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Query} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from '../dto/create-score.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  async addScore(@Body() createScoreDto: CreateScoreDto) {
    return this.scoresService.addScore(createScoreDto);
  }

  @Get('by-school')
  async getScoresBySchoolId(@Query('school_id') school_id: string) {
    return this.scoresService.getStudentScoresBySchoolId(school_id);
  }

  @Get('math-speedy-scores')
    async getMathSpeedyScores() {
  const lesson_id = 1; // Assume 1 is the ID for Math Speedy Quiz
  return this.scoresService.getScoresByLessonId(lesson_id);
}

}

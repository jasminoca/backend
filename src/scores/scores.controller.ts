/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Query, Param} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from '../dto/create-score.dto';
// import { SubmitGameScoreDto } from '../dto/submit-game-score.dto';

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

  @Get('/by-student/:school_id')
  getScoresByStudent(@Param('school_id') schoolId: string) {
    return this.scoresService.getScoresByStudent(schoolId);
  }
  
  @Get('/all-lessons')
  getAllLessonScores() {
    return this.scoresService.getAllLessonScores();
  }
  
  @Get('/all-games')
  getAllGameScores() {
    return this.scoresService.getAllGameScores();
  }
  
  @Post('/submit-game')
  submitGameScore(@Body() body: { score: number; school_id: string; game_name: string }) {
    return this.scoresService.submitGameScore(body);
  }
}

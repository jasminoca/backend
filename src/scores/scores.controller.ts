/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { UpdateQuestionAttemptDto } from '../dto/submit-answers.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  // Student submits LESSON score
  @Post(':lessonId')
  async submitLessonScore(
    @Param('lessonId') lessonId: string,
    @Body() body: UpdateQuestionAttemptDto,
  ) {
    const { school_id, answers } = body;
    return await this.scoresService.submitLessonScore(lessonId, school_id, answers);
  }

  // Student submits GAME score
  @Post('game')
  async submitGameScore(@Body() body: any) {
    return this.scoresService.submitGameScore(body);
  }
  
  // Student views their own LESSON scores
  @Get('lesson')
  async getStudentLessonScores(@Query('school_id') schoolId: string) {
    if (schoolId) {
      return await this.scoresService.getStudentLessonScores(schoolId);
    }
    return await this.scoresService.getAllLessonScores(); // Admin view
  }

  // Student views their own GAME scores
  @Get('game')
  async getStudentGameScores(@Query('school_id') schoolId: string) {
    if (schoolId) {
      return await this.scoresService.getStudentGameScores(schoolId);
    }
    return await this.scoresService.getAllGameScores(); // Admin view
  }

  // View leaderboard for games
  @Get('leaderboard/game')
  async getGameLeaderboard() {
    return await this.scoresService.getGameLeaderboard(10); // Top 10 students
  }

  @Get(':lessonId/:schoolId')
  async getScoreByLessonAndSchool(
    @Param('lessonId') lessonId: string,
    @Param('schoolId') schoolId: string
  ) {
    return await this.scoresService.getScoreByLessonAndSchool(lessonId, schoolId);
  }

}

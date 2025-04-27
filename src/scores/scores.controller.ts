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
  @Post('game/:schoolId')
  async submitGameScore(
    @Param('schoolId') schoolId: string,
    @Body() body: { game_name: string; score: number },
  ) {
    return await this.scoresService.submitGameScore(schoolId, body.game_name, body.score);
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

  // View old score for a lesson (reload answers on LessonsPage)
  @Get(':lessonId/:schoolId')
  async getStudentScore(
    @Param('lessonId') lessonId: string,
    @Param('schoolId') schoolId: string,
  ) {
    return await this.scoresService.getStudentScore(lessonId, schoolId);
  }

  // View leaderboard for games
  @Get('leaderboard/game')
  async getGameLeaderboard() {
    return await this.scoresService.getGameLeaderboard(10); // Top 10 students
  }
}

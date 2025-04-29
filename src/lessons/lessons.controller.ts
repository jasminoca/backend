/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { UpdateQuestionAttemptDto } from '../dto/submit-answers.dto';
import { ScoresService } from '../scores/scores.service'; // 🔥 Import this


@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly scoresService: ScoresService
  ) {}


  @Post()
  async create(@Body() createLessonDto: Lesson) {
    return await this.lessonsService.create(createLessonDto);
  }

  @Get()
  async findAll() {
    return await this.lessonsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.lessonsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLessonDto: Partial<Lesson>) {
    return await this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.lessonsService.remove(id);
  }

  // ===== KEYPOINT =====
  @Post(':lessonId/keypoints')
  async addKeypoint(@Param('lessonId') lessonId: string, @Body() body: { content: string }) {
    return await this.lessonsService.addKeypoint(lessonId, body.content);
  }

  @Put(':lessonId/keypoints/:keypointId')
  async updateKeypoint(
    @Param('lessonId') lessonId: string,
    @Param('keypointId') keypointId: string,
    @Body() body: { content: string },
  ) {
    return await this.lessonsService.editKeypoint(lessonId, keypointId, body.content);
  }

  @Delete(':lessonId/keypoints/:keypointId')
  async deleteKeypoint(@Param('lessonId') lessonId: string, @Param('keypointId') keypointId: string) {
    return await this.lessonsService.deleteKeypoint(lessonId, keypointId);
  }

  // ===== QUESTION =====
  @Post(':lessonId/questions')
  async addQuestion(@Param('lessonId') lessonId: string, @Body() body: CreateQuestionDto) {
    return await this.lessonsService.addQuestion(lessonId, body);
  }

  @Put(':lessonId/questions/:questionId')
  async updateQuestion(
    @Param('lessonId') lessonId: string,
    @Param('questionId') questionId: string,
    @Body() body: UpdateQuestionDto,
  ) {
    return await this.lessonsService.editQuestion(lessonId, questionId, body);
  }

  @Delete(':lessonId/questions/:questionId')
  async deleteQuestion(@Param('lessonId') lessonId: string, @Param('questionId') questionId: string) {
    return await this.lessonsService.deleteQuestion(lessonId, questionId);
  }

  // ===== SUBMIT SCORE (Student submitting answers) =====
  @Post(':lessonId/submit')
  async submitLessonScore(
    @Param('lessonId') lessonId: string,
    @Body() body: UpdateQuestionAttemptDto, // school_id and answers from student
  ) {
    return await this.scoresService.submitLessonScore(lessonId, body.school_id, body.answers);
  }

  // ===== LESSON ENABLE / DISABLE =====
  @Patch(':lessonId/enable')
  async updateLessonEnableStatus(@Param('lessonId') lessonId: string, @Body() body: { isEnabled: boolean }) {
    return await this.lessonsService.updateLessonEnableStatus(lessonId, body.isEnabled);
  }

  @Patch(':lessonId/difficulty')
  async updateLessonDifficulty(@Param('lessonId') lessonId: string, @Body() body: { difficulty: string }) {
    return await this.lessonsService.updateLessonDifficulty(lessonId, body.difficulty);
  }

  @Get(':lessonId/:schoolId')
async getScore(@Param('lessonId') lessonId: string, @Param('schoolId') schoolId: string) {
  return this.scoresService.getScoreByLessonAndSchool(lessonId, schoolId);
}

}

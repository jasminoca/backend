/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Delete, Put, Param, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ScoresService } from '../scores/scores.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { SubmitAnswersDto } from '../dto/submit-answers.dto';

@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly scoresService: ScoresService
  ) {}

  // Fetch all lessons
  @Get()
  @UseGuards(AuthGuard)
  async findAll(): Promise<Lesson[]> {
    return this.lessonsService.findAll();
  }

  // Create a new lesson
  @Post()
  @UseGuards(AuthGuard) // Protect with authentication
  async create(@Body() lesson: CreateLessonDto): Promise<Lesson> {
    console.log("Lesson received:", lesson); // Log incoming data
    return this.lessonsService.create(lesson);
  }

  // Update a lesson by ID
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() updateLessonDto: Partial<Lesson>) {
    const updatedLesson = await this.lessonsService.update(id, updateLessonDto);
   return { message: 'Lesson updated successfully', data: updatedLesson };
}

  @Post(':id/submit')
  submitAnswers(
    @Param('id') lessonId: number,
    @Body() submitDto: SubmitAnswersDto,
  ) {
    return this.scoresService.submitScore(lessonId, submitDto);
  }

  // Delete a lesson by ID
  @Delete(':id')
  @UseGuards(AuthGuard)
    async delete(@Param('id') id: number): Promise<void> {
      return this.lessonsService.delete(id);
  }

  @Get(':id')
    async getLessonById(@Param('id') id: number) {
      return this.lessonsService.findOne(id);
  }
  
  @Post(':id/keypoints')
    async addKeyPoint(@Param('id') id: string, @Body('content') content: string) {
      const lessonId = Number(id);
      console.log('Add Keypoint for lesson ID:', lessonId);
      if (isNaN(lessonId)) {
        throw new BadRequestException('Invalid lesson ID');
      }
      return this.lessonsService.addKeyPoint(lessonId, content);
  }

  @Post(':lessonId/questions')
    async addQuestion(
      @Param('lessonId') lessonId: number,
      @Body() dto: CreateQuestionDto
    ) {
      return this.lessonsService.addQuestion(lessonId, dto);
 }

  // DELETE Lesson
  @Delete(':id')
  deleteLesson(@Param('id') id: number) {
    return this.lessonsService.deleteLesson(+id);
  }

  // DELETE KeyPoint
  @Delete(':lessonId/keypoints/:id')
  deleteKeypoint(@Param('id') id: number) {
    return this.lessonsService.deleteKeypoint(+id);
  }

  // DELETE Question
  @Delete(':lessonId/questions/:id')
  deleteQuestion(@Param('id') id: number) {
    return this.lessonsService.deleteQuestion(+id);
  }

  @Put(':lessonId/keypoints/:id')
  async updateKeypoint(
    @Param('id') id: number,
    @Body('content') content: string
    ){
    return this.lessonsService.updateKeypoint(+id, content);
  }

  @Put(':lessonId/questions/:id')
  async updateQuestion(
    @Param('lessonId') lessonId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateQuestionDto
  ) {
    return this.lessonsService.updateQuestion(+lessonId, +id, updateDto);
  }

  @Get(':id')
    async getLessonWithUserAttempt(
      @Param('id') id: number,
      @Query('school_id') school_id?: string
    ) {
      return this.lessonsService.getLessonById(+id, school_id);
  }


}

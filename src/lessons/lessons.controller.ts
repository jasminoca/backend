/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Patch, } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body() lessonData: Lesson) {
    return this.lessonsService.create(lessonData);
  }

  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() lessonData: Partial<Lesson>) {
    return this.lessonsService.update(id, lessonData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }

  // keypoints
  @Post(':id/keypoints')
  addKeypoint(@Param('id') id: string, @Body('content') content: string) {
    return this.lessonsService.addKeypoint(id, content);
  }

  @Patch(':id/keypoints/:kpId')
  updateKeypoint(
    @Param('id') id: string,
    @Param('kpId') kpId: string,
    @Body('content') content: string,
  ) {
    return this.lessonsService.updateKeypoint(id, kpId, content);
  }

  @Delete(':id/keypoints/:kpId')
  deleteKeypoint(
    @Param('id') id: string,
    @Param('kpId') kpId: string,
  ) {
    return this.lessonsService.deleteKeypoint(id, kpId);
  }

  // questions
  @Post(':id/questions')
  addQuestion(
    @Param('id') id: string,
    @Body() body: { question: string; choices: string[]; correctAnswer: string },
  ) {
    return this.lessonsService.addQuestion(id, body);
  }

  @Patch(':id/questions/:qId')
  updateQuestion(
  @Param('id') id: string,
  @Param('qId') qId: string,
  @Body() body: { question: string; choices: string[]; correctAnswer: string },
  ) {
    return this.lessonsService.updateQuestion(id, qId, body);
  }

  @Delete(':id/questions/:qId')
  deleteQuestion(
    @Param('id') id: string,
    @Param('qId') qId: string,
  ) {
    return this.lessonsService.deleteQuestion(id, qId);
  }
}

/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Delete, Put, Param, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

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


  // Delete a lesson by ID
  @Delete(':id')
  @UseGuards(AuthGuard) // Protect with authentication
  async delete(@Param('id') id: number): Promise<void> {
    return this.lessonsService.delete(id);
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';

@Injectable()
export class LessonsService {
    async update(id: number, updateLessonDto: Partial<Lesson>): Promise<Lesson> {
        const lesson = await this.lessonRepository.findOne({ where: { id } });
        if (!lesson) {
          throw new Error('Lesson not found');
        }
        Object.assign(lesson, updateLessonDto);
        return this.lessonRepository.save(lesson);
      }
    constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async findAll(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  async create(lesson: Partial<Lesson>): Promise<Lesson> {
    const newLesson = this.lessonRepository.create(lesson);
    return this.lessonRepository.save(newLesson);
  }

  async delete(id: number): Promise<void> {
    await this.lessonRepository.delete(id);
  }
}

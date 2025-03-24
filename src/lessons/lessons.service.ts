/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { KeyPoint } from './keypoint.entity';
import { Question } from './question.entity';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { SubmitAnswersDto } from '../dto/submit-answers.dto';
import { Score } from '../scores/scores.entity';
import { User } from '../users/user.entity';


@Injectable()
export class LessonsService {
  deleteLesson: any;
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,

    @InjectRepository(KeyPoint)
    private readonly keypointRepository: Repository<KeyPoint>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Score)
    private scoreRepository: Repository<Score>  ) {}

  async findAll(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  async findOne(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['keypoints', 'questions'],
    });
  
    if (!lesson) {
      throw new Error(`Lesson with ID ${id} not found`);
    }
  
    return lesson;
  }

  async create(lesson: Partial<Lesson>): Promise<Lesson> {
    const newLesson = this.lessonRepository.create(lesson);
    return this.lessonRepository.save(newLesson);
  }

  async update(id: number, updateLessonDto: Partial<Lesson>): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    Object.assign(lesson, updateLessonDto);
    return this.lessonRepository.save(lesson);
  }

  async delete(id: number): Promise<void> {
    await this.lessonRepository.delete(id);
  }

  async addKeyPoint(lessonId: number, content: string) {
    console.log('Add Keypoint for lesson ID:', lessonId);
    const lesson = await this.lessonRepository.findOneBy({ id: lessonId });
  
    if (!lesson) {
      console.error('❌ Lesson not found with ID:', lessonId);
      throw new Error('Lesson not found');
    }
  
    const keypoint = this.keypointRepository.create({ content, lesson });
    const saved = await this.keypointRepository.save(keypoint);
    console.log('✅ Keypoint saved:', saved);
    return saved;
  }
  
  async updateKeypoint(id: number, content: string): Promise<KeyPoint> {
    const keypoint = await this.keypointRepository.findOne({ where: { id } });
    if (!keypoint) throw new Error('Keypoint not found');
    keypoint.content = content;
    return this.keypointRepository.save(keypoint);
  }

  async deleteKeypoint(id: number) {
    return this.keypointRepository.delete(id);
  }

  async addQuestion(lessonId: number, dto: CreateQuestionDto) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['questions'],
    });
  
    if (!lesson) {
      throw new Error(`Lesson with ID ${lessonId} not found`);
    }
    
    const question = this.questionRepository.create({
      question: dto.question,
      choices: dto.choices,
      correctAnswer: dto.correctAnswer,
      lesson, // now guaranteed to be not null
    });
    
    return await this.questionRepository.save(question);
  }

  async deleteQuestion(id: number) {
    return this.questionRepository.delete(id);
  }

  async updateQuestion(lessonId: number, questionId: number, dto: UpdateQuestionDto) {
    const question = await this.questionRepository.findOneOrFail({
      where: { id: questionId, lesson: { id: lessonId } },
    });
  
    if (dto.question !== undefined) {
      question.question = dto.question;
    }
  
    if (dto.choices !== undefined) {
      question.choices = dto.choices;
    }
  
    if (dto.correctAnswer !== undefined) {
      question.correctAnswer = dto.correctAnswer;
    }
  
    return await this.questionRepository.save(question);
  }
  
  async evaluateAndStoreScore(lessonId: number, dto: SubmitAnswersDto) {
    const { answers, school_id } = dto;
  
    const questions = await this.questionRepository.find({
      where: { lesson: { id: lessonId } }, // nested relation filter
    });    
  
    let score = 0;
  
    questions.forEach((q) => {
      const submittedAnswer = answers[q.id];
      if (submittedAnswer && submittedAnswer.trim() === q.correctAnswer.trim()) {
        score++;
      }
    });
  
    // Save to scores table
    const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    const scoreEntity = this.scoreRepository.create({
      lesson,
      score,
      school_id,
      created_at: new Date(),
    });

    await this.scoreRepository.save(scoreEntity);
  
    return { score };
  }

  async getLessonById(lessonId: number, schoolId?: string): Promise<any> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['keypoints', 'questions'],
    });
  
    // Get last score/answers by school_id
    let lastAttempt = null;
    if (schoolId) {
      lastAttempt = await this.scoreRepository.findOne({
        where: {
          lesson: { id: lessonId },
          school_id: schoolId,
        },
        relations: ['lesson'],
        order: { created_at: 'DESC' },
      });      
    }
  
    return {
      ...lesson,
      lastAttempt,
    };
  }

  
}

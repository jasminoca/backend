/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Score } from '../scores/scores.entity';
import { CreateScoreDto } from '../dto/create-score.dto';
import { Lesson } from '../lessons/lesson.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoresRepository: Repository<Score>,

    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async getStudentScoresBySchoolId(school_id: string): Promise<Score[]> {
    return this.scoresRepository.find({
      where: { school_id },
      order: { created_at: 'DESC' },
      relations: ['lesson'],
    });
  }

  async addScore(createScoreDto: CreateScoreDto): Promise<Score> {
    const { school_id, lesson_id, score } = createScoreDto;

    if (!school_id || !lesson_id || score === undefined) {
      throw new BadRequestException('Missing required fields: school_id, lesson_id, or score.');
    }

    const lesson = await this.lessonRepository.findOne({ where: { id: lesson_id } });
    if (!lesson) throw new NotFoundException(`Lesson ${lesson_id} not found`);

    const newScore = this.scoresRepository.create({
      school_id,
      score,
      lesson,
      created_at: new Date(),
    });

    return this.scoresRepository.save(newScore);
  }

  async getScoresByLessonId(lesson_id: number) {
    return await this.scoresRepository
      .createQueryBuilder('score')
      .innerJoin('users', 'user', 'user.school_id = score.school_id')
      .where('score.lesson_id = :lesson_id', { lesson_id })
      .select([
        'score.id AS id',
        'score.score AS score',
        'score.created_at AS created_at',
        'user.school_id AS school_id',
        'user.first_name AS first_name',
        'user.last_name AS last_name',
      ])
      .orderBy('score.score', 'DESC')
      .addOrderBy('score.created_at', 'ASC')
      .getRawMany();
  }

  async saveScore(school_id: string, lesson_id: number, score: number): Promise<Score> {
    const lesson = await this.lessonRepository.findOne({ where: { id: lesson_id } });
    if (!lesson) throw new NotFoundException(`Lesson ${lesson_id} not found`);

    const newScore = this.scoresRepository.create({ school_id, lesson, score });
    return this.scoresRepository.save(newScore);
  }

  async submitScore(lessonId: number, dto: { answers: Record<number, string>, school_id: string }) {
    const { answers, school_id } = dto;

    if (!school_id) throw new BadRequestException('school_id is required');
    if (!answers || typeof answers !== 'object') {
      throw new BadRequestException('Invalid answers object');
    }

    const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException(`Lesson ${lessonId} not found`);

    let score = 0;
    const hasSelectedAnswers = Object.keys(answers).length > 0;

    if (!hasSelectedAnswers) {
      throw new BadRequestException('No answers submitted.');
    }

    // ✅ Calculate score from answers
    for (const key in answers) {
      if (answers[key]?.trim()) {
        score++;
      }
    }
    
    const existing = await this.scoresRepository.findOne({
      where: { school_id, lesson: { id: lessonId } },
      relations: ['lesson'],
    });

    if (!existing) {
      const newScore = this.scoresRepository.create({
        lesson,
        score,
        school_id,
        attempts: 1,
        created_at: new Date(),
        answers,
      });
      return this.scoresRepository.save(newScore);
    }

    if (existing.attempts >= 3) return existing;

    existing.attempts += 1;
    existing.score = score;
    existing.created_at = new Date();
    existing.answers = answers;

    return this.scoresRepository.save(existing);
  }

  async findOneScore(lesson_id: number, school_id: string): Promise<Score | null> {
    const score = await this.scoresRepository.findOne({
      where: {
        school_id,
        lesson: { id: lesson_id },
      },
      relations: ['lesson'],
    });

    // ✅ FIX: Parse answers from string to object
    if (score && typeof score.answers === 'string') {
      try {
        score.answers = JSON.parse(score.answers);
      } catch (e) {
        score.answers = {};
      }
    }
    return score;
  } 

  async getScoresByStudent(school_id: string) {
    return await this.scoresRepository.find({
      where: { school_id },
      order: { created_at: 'DESC' },
      relations: ['lesson'],
    });
  }

  async getAllLessonScores() {
    return await this.scoresRepository.find({
      where: { lesson: Not(IsNull()) },
      order: { created_at: 'DESC' },
      relations: ['lesson'],
    });
  }

  async getAllGameScores() {
    return await this.scoresRepository.find({
      where: { game_name: Not(IsNull()) },
      order: { created_at: 'DESC' },
    });
  }

  async submitGameScore(data: { score: number; school_id: string; game_name: string }) {
    const newScore = this.scoresRepository.create({
      score: data.score,
      school_id: data.school_id,
      game_name: data.game_name,
      created_at: new Date(),
    });
    return await this.scoresRepository.save(newScore);
  }
}

/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../scores/scores.entity';
import { CreateScoreDto } from '../dto/create-score.dto';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoresRepository: Repository<Score>,
  ) {}

  // Method to fetch scores by school_id
  async getStudentScoresBySchoolId(school_id: string): Promise<Score[]> {
    return this.scoresRepository.find({
      where: { school_id },
      order: { created_at: 'DESC' },
    });
  }

  // Method to add a new score
  async addScore(createScoreDto: CreateScoreDto): Promise<Score> {
    const { school_id, lesson_id, score } = createScoreDto;
  
    if (!school_id || !lesson_id || score === undefined) {
      throw new BadRequestException('Missing required fields: school_id, lesson_id, or score.');
    }
  
    const newScore = this.scoresRepository.create({
      school_id,
      lesson_id,
      score,
      created_at: new Date(),
    });
  
    return await this.scoresRepository.save(newScore);
  }

  async getScoresByLessonId(lesson_id: number) {
    return await this.scoresRepository
      .createQueryBuilder('score')
      .innerJoin('users', 'user', 'user.school_id = score.school_id') // Join users table
      .where('score.lesson_id = :lesson_id', { lesson_id }) // Filter by lesson_id
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
  
}


/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity()
export class KeyPoint {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' }) // instead of 'varchar'
  content!: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.keypoints, { onDelete: 'CASCADE' })
  lesson!: Lesson;

}
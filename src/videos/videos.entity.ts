/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Lesson } from '../lessons/lesson.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  url!: string;

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Lesson, (lesson) => lesson.videos, {
    nullable: true,
    onDelete: 'CASCADE', // Automatically delete associated videos when lesson is deleted
  })
  lesson!: Lesson;
  
}

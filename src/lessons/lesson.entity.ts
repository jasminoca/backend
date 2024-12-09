/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany  } from 'typeorm';
import { Video } from '../videos/videos.entity';


@Entity('lessons') // Name of the table
export class Lesson {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ nullable: true })
  video_url!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Video, (video) => video.lesson)
  videos!: Video[];



}
